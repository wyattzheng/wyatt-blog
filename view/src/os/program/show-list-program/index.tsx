import dayjs from "dayjs";
import { Program } from "../program";
import { WContainer } from "../../../components/container";
import { Navigator } from "../../../components/navigator";

import { RiBookmark2Line,RiTimerLine,RiCalendar2Line } from "react-icons/ri";


import "highlight.js/styles/vs2015.css"
import "./showlist.css";

export interface BlogListPageProps{
    list:{
        count:number,
        cur_page:number,
        pages:number,
        list:{
            articleId:number,
            categoryName:string,
            title:string,
            nickname:string,
            shortbody:string,
            createdTime:string,
            mins_read:number
        }[]
    };
}

export function BlogListPage(props : BlogListPageProps){

    const list_content = [];
    const page_selectors = []
    
    for(const [key,article] of props.list.list.entries())
        list_content.push(
            <div key={key} className="articlelist_item">
                

                <div className="articlelist_item_top">
                    <div className="articlelist_item_header">
                        <div className="articlelist_item_id">
                            #{article.articleId}
                        </div>
                        <a className="articlelist_item_title" href={`#/wyattos/cli/view/${article.articleId}`}>
                            {article.title}
                        </a>
                    </div>
                    <div className="articlelist_item_metadata">
                        <div className="articlelist_item_category articlelist_item_icon_holder">
                            <RiBookmark2Line className="articlelist_item_icon" />
                            {article.categoryName}
                        </div>

                        <div className="articlelist_item_createdTime articlelist_item_icon_holder">
                            <RiCalendar2Line className="articlelist_item_icon" />
                            {dayjs(article.createdTime).format("YYYY年MM月DD日")}
                        </div>
                        <div className="articlelist_item_timecost articlelist_item_icon_holder">
                            <RiTimerLine className="articlelist_item_icon" />
                            阅读: {Math.max(1,article.mins_read).toFixed(0)}分钟
                        </div>
                    </div>
                </div>
                

                <div className="articlelist_item_shortbody markdown-body markdown-short-body"  dangerouslySetInnerHTML={{__html:article.shortbody}} />
                        
            </div>
        );

    for(let i=0;i<props.list.pages;i++){
        const is_current_page = i === props.list.cur_page;
        const page_classname = is_current_page ? "pageselector_item_hover":"";
        const href = is_current_page ?  `#` : `#/wyattos/cli/show/${i}`;

        page_selectors.push(
            <a key={i} className={
                `pageselector_item ${page_classname}`
            } href={href} >
                {i+1}
            </a>
        );
    }
    return (
        <div className="articlelist_container">
            <Navigator list={[
                {title:"友链",url:"#/wyattos/cli/links"},
                {title:"帮助",url:"#/wyattos/cli/help"},
            ]}></Navigator>
            <WContainer className="articlelist_middlearea">
                
                <div className="articlelist">{ list_content }</div>
                <div className="pageselector">{ page_selectors }</div>

            </WContainer>
        </div>
    );
}


export class ShowListProgram extends Program{
    static program_name = "show";
    static description = "显示博客文章的图形列表";
    static usage = "show [page]";

    handleInput(data:string): void { }

    protected async execute(cli:any,page?:number): Promise<void> {
        if(!page)
            page = parseInt(this.system.env.get("CURRENT_VIEW_PAGE") || "0");

        const { data: res } = await this.network().get("/v1/articles",{params:{page,count:10}});

        this.system.env.set("CURRENT_VIEW_PAGE",page.toString());
        this.monitor.setDisplay(<BlogListPage list={res} />);

        this.system.env.has("NOT_FIRST_VISIT") && this.terminal.setVisible(false);

    }
    
}