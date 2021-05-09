import { WContainer } from "../../../components/container";
import { wait } from "../../../utils";
import { Program } from "../program";

import "./welcome.css";

const MOTD =[
'',
'██╗    ██╗██╗   ██╗ █████╗ ████████╗████████╗    ██████╗ ██╗      ██████╗  ██████╗ ',
'██║    ██║╚██╗ ██╔╝██╔══██╗╚══██╔══╝╚══██╔══╝    ██╔══██╗██║     ██╔═══██╗██╔════╝ ',
'██║ █╗ ██║ ╚████╔╝ ███████║   ██║      ██║       ██████╔╝██║     ██║   ██║██║  ███╗',
'██║███╗██║  ╚██╔╝  ██╔══██║   ██║      ██║       ██╔══██╗██║     ██║   ██║██║   ██║',
'╚███╔███╔╝   ██║   ██║  ██║   ██║      ██║       ██████╔╝███████╗╚██████╔╝╚██████╔╝',
' ╚══╝╚══╝    ╚═╝   ╚═╝  ╚═╝   ╚═╝      ╚═╝       ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝ ',
''
];

const MOTD_MIN =[
    '',
    '███████╗██╗  ██╗██╗   ██╗',
    '╚══███╔╝██║  ██║╚██╗ ██╔╝',
    '  ███╔╝ ███████║ ╚████╔╝ ',
    ' ███╔╝  ██╔══██║  ╚██╔╝  ',
    '███████╗██║  ██║   ██║   ',
    '╚══════╝╚═╝  ╚═╝   ╚═╝   ',
    ''
    ];

export function WelcomePage(){
    return (<WContainer className="profile_container">        
        <div className="profile">
            <div className="profile_avatar">
                <img className="profile_avatar_img" src="/avatar.jpg" alt="wyatt" />
            </div>
            <div className="profile_hello"> Hi, I'm Wyatt </div>
            <div className="profile_welcome"> Welcome to my blog 🧡 </div>
        </div>
    </WContainer>);
}
export class BootProgram extends Program{
    static program_name = "bootstrap";
    static description = "初始化系统并设置环境变量";
    static usage = "bootstrap";

    handleInput(data:string): void {
         
    }
    private setEnv(key:string,value?:string){
        if(!value)return;
        this.system.env.set(key,value);
    }
    protected async execute(): Promise<void> {

        this.monitor.setDisplay(<WelcomePage/>)

        this.printLn(`\r\nBootstrapping....\r\n`);
        
        this.setEnv("SERVER_URL",process.env["SERVER_URL"]);

        
        await wait(500);
        await this.printMotd();

        this.printLn("输入命令 help 获取命令菜单");
    }
    private async printMotd(){
        const screen_mode = this.system.env.get("SCREEN_MODE");
        const motd = screen_mode === "MINIMAL" ? MOTD_MIN : MOTD;

        for(const line of motd){
            this.printLn(line);
            await wait(100);
        }

    }
    
}