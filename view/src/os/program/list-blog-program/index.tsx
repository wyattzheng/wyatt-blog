import { Program } from "../program";

export class ListBlogProgram extends Program{
    static program_name = "ls";
    static description = "获取博客文章列表";
    static usage = "ls [page]";

    handleInput(data:string): void {
         
    }

    protected async execute(cli:any,username?:string,password?:string): Promise<void> {

        
        const { data: res } = await this.network().get("/v1/article/list",{params:{page:0,count:10}});
        
        this.printLn("文章列表: ");
        this.printLn("#################\r\n");
        
        for(const article of res.list){
            this.printLn(`编号:#${article.articleId} 作者:${article.nickname} 标题: ${article.title}`);
        }

        this.printLn("\r\n#################\r\n");
        this.printLn("使用命令: view [编号] 查看文章\r\n")
    }
    
}