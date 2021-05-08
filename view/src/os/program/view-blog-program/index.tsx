import { Program } from "../program";
import { RiTimeLine,RiAccountBoxLine } from "react-icons/ri"
import ReactMarkdown from "react-markdown";
import Moment from "moment";

import "./viewer.css";
import "highlight.js/styles/vs2015.css"

const javascript = require("highlight.js/lib/languages/javascript");
const typescript = require("highlight.js/lib/languages/typescript");

const highlight = require("rehype-highlight/light");


export interface ArticleViewerProps{
    author:string,
    title : string,
    content : string
}
export function ArticleViewer(props: ArticleViewerProps){

    
    return (
        <div className="articleviewer">
            <div className="articleviewer_title">
                {props.title}
            </div>
            <div className="articleviewer_metainfo">
                
                <div className="artcleviewer_metainfo_item">
                    <RiAccountBoxLine/>
                    {props.author}
                    
                </div>
                <div className="artcleviewer_metainfo_item">
                    <RiTimeLine/>
                    {Moment().format("YYYY-MM-DD HH:mm:ss")}
                </div>

                

            </div>

            <div className="articleviewer_split" />
            
            <div className="articleviewer_content">
                <ReactMarkdown rehypePlugins={[[highlight,{languages:{javascript,typescript}}]]}>{props.content}</ReactMarkdown>
            </div>
        </div>
    )
}

export class ViewBlogProgram extends Program{
    static program_name = "view";
    
    handleInput(data:string): void {
         
    }
    protected async execute(cli:any,articleId:string): Promise<void> {

        const { data:article } = await this.network().get("/v1/article",{params:{articleid:articleId}});
        const { data:userinfo } = await this.network().get("/v1/user",{params:{userid:article.userId}});

        this.monitor.setDisplay(<ArticleViewer author={userinfo.nickname} title={article.title} content={article.content} />);
    }
    
}