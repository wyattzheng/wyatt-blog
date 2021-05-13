
import * as visit from "unist-util-visit"
import * as Unified from "unified";

const h = require("hastscript");

export function RemarkDirectiveImage() : Unified.Transformer{
    const data = this.data();

    function handle_image_node(node : any){
        if(node.name != "image")
            return;

        if(!node.data)
            node.data = {};

        if(!node.data.hProperties)
            node.data.hProperties = {};

        if(!node.attributes)
            node.attributes = {};

        const title = node.children[0]?.value || "";
        const astAttrs : any = {
            width:node.attributes.width,
            height:node.attributes.height,
            alt:node.attributes.alt,
            title
        }
        if(node.attributes.url)
            astAttrs.src = node.attributes.url;

        const hastNode = h("img",astAttrs);

        node.data.hName = "p";
        node.data.hChildren = [ hastNode ]
    }

    return async function transformer(tree : any){
        visit(tree,'leafDirective',handle_image_node);
    };
}
