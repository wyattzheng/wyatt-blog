import { EventEmitter2 } from "eventemitter2";
import { CLIProgram } from "../cli-program";
import { Program } from "../program";
import { WInput } from "../../../components/input";
import { WSelector } from "../../../components/selector";
import { WContainer } from "../../../components/container";
import { WButton } from "../../../components/button";

import React, { ChangeEvent, Suspense } from "react";
import "./editor.css";

const AceEditor = React.lazy(()=>import("react-ace"));


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
    private privacy:boolean = false;
    private category_id:number = -1;

    private category_list:{key:string,value:string}[] = [];

    private image_selector_ref = React.createRef<HTMLInputElement>();

    handleInput(char:string): void {
        if(char === "q"){
            this.eventBus.emit("CommandEvent","quit");
        }else if(char === "s"){
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

        const { data : article } = await this.network().get(`/v1/articles/${articleId}`,{ params:{ render:"false" } });
        this.title_text = article.title;
        this.content_text = article.content;
        this.shortbody_text = article.shortbody;
        this.category_id = article.categoryId;
        this.privacy  = article.privacy;
    }
    private async loadCategories(){
        const { data : list } = await this.network().get("/v1/categories");
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
    private async handleFileChange(event:ChangeEvent<HTMLInputElement>){
        const files = event.currentTarget.files!;
        if(files.length <= 0 ){
            this.printLn("你选择的文件为空, 无法上传");
            return;
        }
        const file = files[0];

        const form = new FormData();
        form.append("file",file);
        form.append("raw_file_name",file.name);

        this.printLn(`开始上传... 文件名: ${file.name} 图片文件大小:${file.size}`);
        const {data: upload_result} = await this.network(true).post("/v1/images",form,{headers:{"content-type":"multipart/form-data"}});
        this.printLn("上传完毕,复制链接标记:");
        
        const mark = `![](${upload_result.new_file_name})`;
        this.printLn(mark);
        this.printLn("");

        this.appendContent(mark);

    }
    private appendContent(text:string,newline:boolean = true){
        this.content_text += text;
        if(newline)
            this.content_text += "\r\n";

        this.renderEditor();
    }
    private handlePrivacyChange(event:ChangeEvent<HTMLInputElement>){
        this.privacy = event.currentTarget.value === "true";

    }
    private renderEditor(){
        
        this.monitor.setDisplay(

        <div className="blogeditor_container">
            <WContainer className="blogeditor_middlearea">
                <div className="blogeditor">
                    <input type="file" ref={this.image_selector_ref} onChange={this.handleFileChange.bind(this)} className="blogeditor_image_file_selector"></input>

                    <div className="blogeditor_prefix">标题</div>
                
                    <WInput className="blogeditor_input" placeholder="请输入文章标题" onChange={this.handleTitleInput.bind(this)} defaultValue={this.title_text}></WInput>

                    <div className="blogeditor_prefix">分类</div>
                    
                    <WSelector defaultValue={this.category_id.toString()} className="blogeditor_input" list={this.category_list} onChange={this.handleCategoryChange.bind(this)}></WSelector>

                    <div className="blogeditor_prefix">可见</div>

                    <WSelector defaultValue={this.privacy ? 'true' : 'false'} className="blogeditor_input" list={[{key:"false",value:"公开文章"},{key:"true",value:"设为私有"}]} onChange={this.handlePrivacyChange.bind(this)}></WSelector>

                    <div className="blogeditor_prefix">简介</div>
                    
                    <Suspense fallback={<div>加载编辑器中...</div>}>
                        <AceEditor minLines={10} maxLines={10} mode="markdown" theme="chrome" fontSize={16} value={this.shortbody_text} height="100%" width="100%" className="blogeditor_shortbody_ace" onChange={this.handleShortbodyInput.bind(this)} />
                    </Suspense>

                    <div className="blogeditor_prefix">正文</div>
                    

                    <WButton onClick={()=>{this.image_selector_ref.current!.click()}} title="添加图片" className="blogeditor_img_upload_button" />
                    <Suspense fallback={<div>加载编辑器中...</div>}>
                        <AceEditor minLines={60} maxLines={60} mode="markdown" theme="chrome" fontSize={16} value={this.content_text} height="100%" width="100%" className="blogeditor_content_ace" onChange={this.handleEditorText.bind(this)} />
                    </Suspense>


                </div>
            </WContainer>
        </div>
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

        this.printLn("[q]: 退出, [s]: 保存 \r\n");


    }
    protected async execute(cli : CLIProgram, param_articleId?:string): Promise<void> {
 
        await this.initProgram(param_articleId);

        this.renderEditor();

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
            const {data : newArticle } = await this.network(true).post(`/v1/articles`,{ category_id:this.category_id,title:this.title_text,shortbody:this.shortbody_text,content:this.content_text,privacy: this.privacy})
            this.articleId = newArticle.id;
            this.mode = "edit";
            this.printLn(`新文章已创建 #${newArticle.id}`);
        }else{
            await this.network(true).put(`/v1/articles/${this.articleId}`,{ category_id:this.category_id,title:this.title_text,shortbody:this.shortbody_text,content:this.content_text,privacy: this.privacy })
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