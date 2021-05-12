
import * as visit from "unist-util-visit"
import * as Unified from "unified";
import * as Remark from "remark";
import { isWhatwgURL } from ".";



export interface RemarkImagerURLPluginOptions {
    url_transformer : (url:string)=>string | void;
}

export function RemarkImageURLPlugin(options: RemarkImagerURLPluginOptions) : Unified.Transformer{

    function visitor(node : any){
        if(isWhatwgURL(node.url))
            return;
        const processed = options.url_transformer(node.url);
        if(!processed)
            return;
        node.url = processed;
    }

    return function transformer(tree : any){
        visit(tree,"image",visitor);
    };
}

export async function remarkAllImageURL(markdown_text:string,transformer:(url:string)=>Promise<string>){

    const all_img_urls:string[] = [];
    const parsed_image_url:string[] = [];

    Remark().use(RemarkImageURLPlugin,{url_transformer(img_url:string){
        all_img_urls.push(img_url);
    }}).processSync(markdown_text);

    for(let img_url of all_img_urls){
        let transformed = "";
        try{
            transformed = await transformer(img_url);       
        }catch(err){

        }
        parsed_image_url.push(transformed);
    }
    
    return Remark().use(RemarkImageURLPlugin,{url_transformer(){
        
        return parsed_image_url.shift();
    }}).processSync(markdown_text).contents;


}