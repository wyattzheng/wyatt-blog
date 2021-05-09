import { Program } from "./program";

export class RemoveArticleProgram extends Program{
    static program_name = "remove";
    static description = "删除文章";
    static usage = "remove <article_id>";

    handleInput(data:string): void {
         
    }
    protected async execute(cli:any,articleId:string): Promise<void> {
    
            await this.network(true).delete("/v1/article",{data:{article_id:parseInt(articleId)}});
        
    }
    
    
}