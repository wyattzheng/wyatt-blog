import { Program } from "../program";
import { RiCalendar2Line,RiAccountBoxLine } from "react-icons/ri"
import dayjs from "dayjs";
import { WContainer } from "../../../components/container";

import "../../../style/markdown.css";
import "./viewer.css";
import "highlight.js/styles/vs2015.css"

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
            <WContainer className="articleviewer_middlearea">
                <div className="articleviewer">
                    <a className="articleviewer_golist" href={`#/wyattos/cli/show/${props.viewpage}`}>
                        返回文章列表
                    </a>
                    <div className="articleviewer_header">
                        <div className="articleviewer_title">
                            {props.title}
                        </div>
                        <div className="articleviewer_metainfo">
                            
                            <div className="articleviewer_metainfo_item">
                                <RiAccountBoxLine/>
                                {props.author}
                                
                            </div>
                            <div className="articleviewer_metainfo_item">
                                <RiCalendar2Line/>
                                {dayjs(props.createdTime).format("YYYY年MM月DD日")}
                            </div>
                            

                        </div>
                    </div>
                    <div className="articleviewer_split" />
                    
                    <div className="articleviewer_content markdown-body">
                        <div dangerouslySetInnerHTML={{__html:props.content}} />
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
        this.printLn(`加载文章...`)


        const { data:article } = await this.network().get("/v1/article",{params:{article_id:articleId,render:"true"}});
        const { data:userinfo } = await this.network().get("/v1/user",{params:{userid:article.userId}});

        this.printLn(`加载完毕: ${article.title}`)

        const viewpage = parseInt(this.system.env.get("CURRENT_VIEW_PAGE") || "0");

        await this.resetDisplay();
        this.monitor.setDisplay(<ArticleViewer createdTime={article.createdAt} viewpage={viewpage} author={userinfo.nickname} title={article.title} content={article.rendered_content} />);

        this.terminal.setVisible(false);
    }
    
}