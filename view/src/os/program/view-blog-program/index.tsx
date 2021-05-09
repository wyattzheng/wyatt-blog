import { Program } from "../program";
import { RiTimeLine,RiAccountBoxLine } from "react-icons/ri"
import ReactMarkdown from "react-markdown";
import Moment from "moment";
import {highlightPlugin} from "../../../utils/highlight"
import { WContainer } from "../../../components/container";

import "./viewer.css";
import "github-markdown-css/github-markdown.css";

export interface ArticleViewerProps{
    author:string,
    title : string,
    content : string,
    createdTime : string,
    viewpage : number
}
export function ArticleViewer(props: ArticleViewerProps){
    
    return (
        <div className="articleviewer_container">
            <WContainer>
                <div className="articleviewer">
                    <a className="articleviewer_golist" href={`#/wyattos/cli/show/${props.viewpage}`}>
                        返回文章列表
                    </a>
                    
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
                            {Moment(props.createdTime).format("YYYY-MM-DD HH:mm")}
                        </div>
                        

                    </div>

                    <div className="articleviewer_split" />
                    
                    <div className="articleviewer_content markdown-body">
                        <ReactMarkdown rehypePlugins={[highlightPlugin]}>{props.content}</ReactMarkdown>
                    </div>
                </div>
            </WContainer>
        </div>
    )
}

export class ViewBlogProgram extends Program{
    static program_name = "view";
    static description = "查看博客文章内容";
    static usage = "view <articleId>";

    handleInput(data:string): void {
         
    }
    protected async execute(cli:any,articleId:string): Promise<void> {

        const { data:article } = await this.network().get("/v1/article",{params:{article_id:articleId}});
        const { data:userinfo } = await this.network().get("/v1/user",{params:{userid:article.userId}});

        const viewpage = parseInt(this.system.env.get("CURRENT_VIEW_PAGE") || "0");
        this.monitor.setDisplay(<ArticleViewer createdTime={article.createdAt} viewpage={viewpage} author={userinfo.nickname} title={article.title} content={article.content} />);

        this.terminal.setVisible(false);
    }
    
}