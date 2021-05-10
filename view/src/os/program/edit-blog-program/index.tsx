import { EventEmitter2 } from "eventemitter2";
import { CLIProgram } from "../cli-program";
import { Program } from "../program";
import { WInput } from "../../../components/input";

import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/mode-markdown"
import "ace-builds/src-min-noconflict/theme-chrome"

import "./editor.css";
import { ChangeEvent } from "react";
import { WSelector } from "../../../components/selector";
import { WContainer } from "../../../components/container";

export class EditBlogProgram extends Program{
    static program_name = "edit";
    static description = "编辑或创建一篇博客文章";
    static usage = [
        "创建文章: edit",
        "编辑文章: edit <articleId>",
    ].join("\r\n");

    private mode : "edit" | "new" = "edit";

    private eventBus = new EventEmitter2();
    private exited = false;
    private hasChanges = false;
    private articleId : number | undefined;

    private title_text:string = "";
    private shortbody_text:string = "";
    private content_text:string = "";
    private category_id:number = -1;

    private category_list:{key:string,value:string}[] = [];

    handleInput(data:string): void {
        if(data === "q"){
            this.eventBus.emit("CommandEvent","quit");
        }else if(data === "s"){
            this.eventBus.emit("CommandEvent","save");
        }
    }
    private handleEditorText(text:string){
        this.content_text = text;
        this.hasChanges = true;

    }
    private handleShortbodyInput(text:string){
        this.shortbody_text = text;
        this.hasChanges = true;
    }
    private handleTitleInput(event:ChangeEvent<HTMLInputElement>){
        this.title_text = event.currentTarget.value;
        this.hasChanges = true;
    }
    private async loadArticle(articleId : number){

        const { data : article } = await this.network().get("/v1/article",{ params:{ article_id:articleId } });
        this.title_text = article.title;
        this.content_text = article.content;
        this.shortbody_text = article.shortbody;
    }
    private async loadCategories(){
        const { data : list } = await this.network().get("/v1/category/list");
        const category_list = [];
        for(const item of list){
            category_list.push({key:item.id,value:item.name});
        }
        this.category_list = category_list;
        this.setDefaultCategoryId();
    }
    private setDefaultCategoryId(){
        if(this.category_list.length <= 0){
            this.category_id = -1;
            return;
        }

        this.category_id = parseInt(this.category_list[0].key);

    }
    private handleCategoryChange(event:any){
        this.category_id = parseInt(event.currentTarget.value);
    }
    private openEditor(){
        
        this.monitor.setDisplay(
            <WContainer>
                <div className="blogeditor">
                    <div className="blogeditor_title_prefix">标题</div>
                
                    <WInput className="blogeditor_title" placeholder="请输入文章标题" onChange={this.handleTitleInput.bind(this)} defaultValue={this.title_text}></WInput>

                    <div className="blogeditor_category_prefix">分类</div>
                    
                    <WSelector defaultValue={this.category_id.toString()} className="blogeditor_category" list={this.category_list} onChange={this.handleCategoryChange.bind(this)}></WSelector>

                    <div className="blogeditor_shortbody_prefix">简介</div>
                    
                    <AceEditor minLines={10} maxLines={10} mode="markdown" theme="chrome" fontSize={16} value={this.shortbody_text} height="100%" width="100%" className="blogeditor" onChange={this.handleShortbodyInput.bind(this)} />
                    
                    <div className="blogeditor_content_prefix">正文</div>
                    
                    <AceEditor minLines={60} maxLines={60} mode="markdown" theme="chrome" fontSize={16} value={this.content_text} height="100%" width="100%" className="blogeditor" onChange={this.handleEditorText.bind(this)} />

                    
                </div>
            </WContainer>
        );
    }
    private async initProgram(param_articleId?:string){

        if(!param_articleId){
            this.mode = "new";
        }else{
            this.mode = "edit";
        }

        await this.loadCategories();

        if(this.mode === "edit"){
            this.articleId = parseInt(param_articleId!);
            await this.loadArticle(this.articleId);
        }

        if(!this.isLogined())
        this.printLn("\r\n当前您未登陆, 将无法进行保存操作.\r\n");
    
        if(this.mode === "new"){
            this.printLn("文章创建模式\r\n");
        }else{
            this.printLn("文章编辑模式\r\n");
        }

        this.printLn("[q]: 退出, [s]: 保存\r\n");


    }
    protected async execute(cli : CLIProgram, param_articleId?:string): Promise<void> {
 
        await this.initProgram(param_articleId);

        this.openEditor();

        while(true){
            const [cmd] = await this.eventBus.waitFor("CommandEvent");

            try{
                await this.handleCommand(cmd);
            }catch(err){
                this.printLn(err.message);
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
        
        if(this.mode === "new"){
            await this.network(true).post("/v1/article",{ article_id:this.articleId,category_id:this.category_id,title:this.title_text,    shortbody:this.shortbody_text,content:this.content_text })
        }else{
            await this.network(true).put("/v1/article",{ article_id:this.articleId,category_id:this.category_id,title:this.title_text,shortbody:this.shortbody_text,content:this.content_text })
        }

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