import moment from "moment";
import ReactMarkdown from "react-markdown";
import { Program } from "../program";
import { highlightPlugin } from "../../../utils/highlight"
import { WContainer } from "../../../components/container";
import "github-markdown-css/github-markdown.css";
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
            createdTime:string
        }[]
    };
}

export function BlogListPage(props : BlogListPageProps){

    const list_content = [];
    const page_selectors = []

    
    for(const [key,article] of props.list.list.entries())
        list_content.push(
            <div key={key} className="articlelist_item">
                
                <div className="articlelist_item_header">
                    <div className="articlelist_item_id">
                        #
                        {
                            article.articleId
                        }
                    </div>
                    <a className="articlelist_item_title" href={`#/wyattos/cli/view/${article.articleId}`}>
                        {
                            article.title
                        }
                    </a>
                </div>
                <div className="articlelist_item_metadata">
                    <div className="articlelist_item_category">
                        [
                        {
                            article.categoryName
                        }
                        ]
                    </div>
                    <div className="articlelist_item_createdTime">
                        {
                            moment(article.createdTime).format("YYYY年MM月DD日 HH时mm分")
                        }
                    </div>
                </div>

                <ReactMarkdown className="articlelist_item_shortbody markdown-body" rehypePlugins={[highlightPlugin]} >
                    {
                        article.shortbody
                    }
                </ReactMarkdown>
                
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
        <WContainer>
            
            <div className="articlelist">{ list_content }</div>
            <div className="pageselector">{ page_selectors }</div>

        </WContainer>
    );
}


export class ShowListProgram extends Program{
    static program_name = "show";
    static description = "显示博客文章的图形列表";
    static usage = "show [page]";

    handleInput(data:string): void { }

    protected async execute(cli:any,page:number = 0): Promise<void> {
        const { data: res } = await this.network().get("/v1/article/list",{params:{page,count:10}});

        this.system.env.set("CURRENT_VIEW_PAGE",page.toString());
        this.monitor.setDisplay(<BlogListPage list={res} />);
    }
    
}