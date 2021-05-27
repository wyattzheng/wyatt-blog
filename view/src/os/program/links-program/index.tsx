import { WContainer } from "../../../components/container";
import { Chalk } from "../../../utils";
import { CLIProgram } from "../cli-program";
import { Program } from "../program";

import "./links.css";

export class LinksProgram extends Program{
    
    static program_name = "links";
    static description = "查看本站的友情链接";
    static usage = [
        "links : 查看所有友情链接",
        "links add <name> <url> <avatar> <description> [color] : 增加一条友情链接, 主题色参数是可选的, 如果不填写会自动从头像中获取",
        "links remove <id> : 删除友情链接"
    ].join("\r\n");

    handleInput(data: string): void {
        
    }
    protected async execute(
        cli : CLIProgram,
        action?:"add" | "remove",
        arg1?:string,
        arg2?:string,
        arg3?:string,
        arg4?:string,
        arg5?:string
    ): Promise<void> {
        if(action === "add"){
            await this.addLink(arg1!,arg2!,arg3!,arg4!,arg5);
        }else if(action === "remove"){
            await this.removeLink(parseInt(arg1!));
        }else{
            await this.showAllLinks();
        }
    }
    private async addLink(name:string,url:string,avatar:string,description:string,color?:string){
        await this.network(true).post("/v1/links",{name,url,avatar,description,color});
        this.printLn("已添加该友链");
    }
    private async removeLink(id:number){
        await this.network(true).delete(`/v1/links/${id}`);
        this.printLn("已删除该友链");
    }
    private async showAllLinks(){
        const { data : links } = await this.network().get("/v1/links");
        this.printAllLinks(links);
        this.renderLinks(links);
    }
    private renderLinks( links: any[] ){


        const links_nodes = [];

        for(const [key,link] of links.entries()){
            links_nodes.push(
                <a className="links_link" target="_blank" rel="noreferrer" href={link.url} key={key}>
                    <div className="links_link_avatar_container">
                        <img className="links_link_avatar" src={link.avatar} alt={link.name} />
                    </div>

                    <div className="links_link_body">
                        <div style={{color:link.color}} className="links_link_name">
                            {link.name}
                        </div>
                        <div className="links_link_description">
                            {link.description}
                        </div>
                    </div>    
                </a>
            );
        }
        if(links_nodes.length % 2 !== 0){
            links_nodes.push(<div className="links_link links_link_hidden" key={links_nodes.length} />)
        }

        this.monitor.setDisplay(
            <div className="links_container">
                <WContainer className="links_middlearea">
                    <a className="links_gohome" href="#/wyattos/cli/show">返回文章列表</a>

                    <div className="links">
                        {links_nodes}
                    </div>
                </WContainer>
            </div>
        );
    }
    private printAllLinks( links: any ){
        this.printLn("我的朋友们：\r\n")
        for(const link of links){
            this.printLn(`${Chalk.green(`#${link.id}`)} ${Chalk.bold.blue(`[${link.name}]`)} : ${ Chalk.yellow(link.description)} \r\n ${Chalk.underline(link.url)}`);
        }

        this.printLn("");

    }
}