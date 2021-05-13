import * as visit from "unist-util-visit";
const h = require("hastscript");

export function RehypeTitleFigure() {
    function buildFigure(el:any) {
        const title = `${el.properties?.title || ''}`;
        if (!title)
            return el;
        
        const figure = h('figure',[
            h('img',{ ...el.properties }),
            h('figcaption',title),
        ])
        return figure;
    }
    function transformer(tree:any) {
        if (!Array.isArray(tree.children))
            return tree;
        
        const isImgElement = (el:any) => 'tagName' in el && el.tagName === 'img';
        visit(tree, { tagName: 'p' }, (el:any, index:number | null) => {
            if (!Array.isArray(tree?.children))
                return;
                
            const images = el.children.filter(isImgElement).map(buildFigure);
            if (images.length === 0)
                return;
            tree.children[index!] = images;
            
        });
        tree.children = tree.children.flat();
        return tree;
    }
    return transformer;
}