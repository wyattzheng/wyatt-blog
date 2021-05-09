import { Program } from "./program";

export class CategoryProgram extends Program{
    static program_name = "category";
    static description = "查看/修改/删除文章分类";
    static usage = [
        "新增分类: category create <name> <description>",
        "删除分类: category remove <category_id>",
        "修改分类: category modify <category_id> <name> <description>",
        "查看所有分类: category"
    ].join("\r\n");

    handleInput(data:string): void {
         
    }
    protected async execute(cli:any,action?:string,arg1?:string,arg2?:string,arg3?:string): Promise<void> {
        if(action === "create"){
            await this.network(true).post("/v1/category",{name:arg1,description:arg2});
        }else if(action === "modify"){
            await this.network(true).put("/v1/category",{category_id:parseInt(arg1!),name:arg2,description:arg3});        
        }else if(action === "remove"){
            await this.network(true).delete("/v1/category",{data:{category_id:parseInt(arg1!)}});
        }else{
            await this.printAllCategories();
        }
    }
    private async printAllCategories(){
        const {data : categories} = await this.network().get("/v1/category/list");
        this.printLn("文章分类列表: \r\n");
        for(const category of categories){
            this.printLn(`编号: #${category.id} 分类名: ${category.name} 描述:${category.description}`);
        }
        this.printLn("");
    }
    
}