
import * as visit from "unist-util-visit"
import * as Unified from "unified";

const h = require("hastscript");

export function RemarkDirectiveImage() : Unified.Transformer{
    const data = this.data();

    function handle_image_node(node : any){
        if(node.name != "img")
            return;

        if(!node.data)
            node.data = {};

        const content = node.children[0].value;
        const hastNode = h("img",node.attributes);

        node.data.hName = hastNode.tagName;
        node.data.hProperties = hastNode.properties;
        
        node.children = [];
    }

    return async function transformer(tree : any){
        visit(tree,'leafDirective',handle_image_node);
    };
}
