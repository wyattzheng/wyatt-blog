import { RehypeImageURL } from './remark-image-url';
import { RehypeTitleFigure } from './rehype-image-title';
import { RehypeHighlight } from './rehype-highlight';
import { RemarkDirectiveImage } from "./remark-directive-image";

import * as RemarkParse from "remark-parse";
import * as RemarkGfm from "remark-gfm";
import * as Remark2Rehype from "remark-rehype";
import * as RemarkJoinCJKLines from "remark-join-cjk-lines";
import * as Unified from "unified";
import * as RehypeStringify from "rehype-stringify";
import * as RemarkDirective from "remark-directive"

/**
 * 编译Markdown至JSX
 */
export function WCompileMarkdown(markdown_text:string,url_transformer:(img_url:string)=>Promise<string>){
    return Unified()
        .use(RemarkParse)
        .use(RemarkJoinCJKLines)
        .use(RemarkGfm)
        .use(RemarkDirective)
        .use(RemarkDirectiveImage)
        .use(Remark2Rehype)
        .use(RehypeImageURL,{url_transformer})
        .use(RehypeTitleFigure)
        .use(RehypeHighlight)
        .use(RehypeStringify)
        .process(markdown_text)
        .then((result)=>{
            return result.toString();
        })

}