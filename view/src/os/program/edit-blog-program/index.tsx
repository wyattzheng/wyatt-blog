import { EventEmitter2 } from "eventemitter2";
import { CLIProgram } from "../cli-program";
import { Program } from "../program";
import { WInput } from "../../../components/input";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-markdown"
import "ace-builds/src-noconflict/theme-kuroir"

import "./editor.css";
import { ChangeEvent } from "react";

export class EditBlogProgram extends Program{
    static program_name = "edit";
    private eventBus = new EventEmitter2();
    private exited = false;
    private hasChanges = false;
    private articleId : number | undefined;
    private title_text:string = "";
    private content_text:string = "";

    handleInput(data:{key:string}): void {
        if(data.key === "q"){
            this.eventBus.emit("CommandEvent","quit");
        }else if(data.key === "s"){
            this.eventBus.emit("CommandEvent","save");
        }
    }
    private handleEditorText(text:string){
        this.content_text = text;
        this.hasChanges = true;

    }
    private handleTitleInput(event:ChangeEvent<HTMLInputElement>){
        this.title_text = event.currentTarget.value;
        this.hasChanges = true;
    }
    private async loadArticle(articleId : number){

        const { data : article } = await this.network().get("/v1/article",{ params:{ articleid:articleId } });
        this.title_text = article.title;
        this.content_text = article.content;

        this.monitor.setDisplay(
            <div className="blogeditor">
                <div className="blogeditor_title_prefix">标题: </div>
            
                <WInput onChange={this.handleTitleInput.bind(this)} defaultValue={article.title}></WInput>

                <div className="blogeditor_content_prefix">正文：</div>
                  
                <AceEditor mode="markdown" theme="kuroir" fontSize={16} value={article.content} height="100%" width="100%" className="blogeditor" onChange={this.handleEditorText.bind(this)} />
            </div>
        );
    }
    protected async execute(cli : CLIProgram, param_articleId:string): Promise<void> {
        if(!param_articleId)
            throw new Error(`请提供要编辑的文章的ID`);            
        if(!this.isLogined())
            this.printLn("\r\n当前您未登陆, 将无法进行保存操作.\r\n");
        
    
        const articleId = parseInt(param_articleId);
        this.articleId = articleId;

        await this.loadArticle(articleId);

        this.printLn("博客编辑程序已启动\r\n");
        this.printLn("[q]: 退出, [s]: 保存\r\n");

        while(true){
            const [cmd] = await this.eventBus.waitFor("CommandEvent");

            try{
                await this.handleCommand(cmd);
            }catch(err){
                this.printLn(err.message);
                break;
            }
 

            if(this.shouldExited())
                break;
        }

        this.setDefaultDisplay();
        this.printLn("编辑程序已退出");
    }
    private shouldExited() : boolean{
        return this.exited;
    }
    private quit(){
        if(this.hasChanges){
            this.printLn("文档已经被改变, 请先保存后再退出");
            return;
        }
        
        this.exited = true;
    }
    private async save(){

        this.printLn("开始保存...");
        
        await this.network(true).put("/v1/article",{ articleId:this.articleId,title:this.title_text,content:this.content_text })

        this.printLn("保存完毕");
        this.hasChanges = false;
    }
    private async handleCommand(cmd:string){
        if(cmd === "quit"){
            this.quit();
        }else if(cmd === "save"){
            await this.save();
        }
    }
    
}