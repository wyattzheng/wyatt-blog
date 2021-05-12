
import * as visit from "unist-util-visit"
import * as Unified from "unified";
import { isWhatwgURL } from "../utils";



export interface RehypeImagerURLPluginOptions {
    url_transformer : (url:string)=>Promise<string>;
}

export function RehypeImageURL(options: RehypeImagerURLPluginOptions) : Unified.Transformer{

    const all_img_urls:string[] = [];
    const parsed_image_urls:Array<string | null> = [];


    function add_url_visitor(node : any){
        all_img_urls.push(node.properties.src);
    }

    async function remark_all(){
        for(let img_url of all_img_urls){
            if(isWhatwgURL(img_url)){
                parsed_image_urls.push(null);
                continue;
            }

            let transformed = "";
            try{
                transformed = await options.url_transformer(img_url);       
            }catch(err){ }
            parsed_image_urls.push(transformed);
        }
    }
    function parse_url_visitor(node:any){
        for(const [,parsed_image_url] of parsed_image_urls.entries()){
            if(parsed_image_url == null)
                continue;

            node.properties.src = parsed_image_url;
        }
    }

    function visit_image_node(tree:any,fn:(node:any)=>void){
        visit(tree,"element",(node : any)=>{
            if(node.tagName !== "img")
                return;
            fn(node);
        });
    }
    return async function transformer(tree : any){
        visit_image_node(tree,add_url_visitor)
        await remark_all();
        visit_image_node(tree,parse_url_visitor);
    };
}
