import { wait } from "../../utils";
import { Program } from "./program";

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
/**
 * 从外部导入系统内的环境变量键名
 */
export const ImportEnvs = ["SERVER_URL"]

export class BootProgram extends Program{
    static program_name = "bootstrap";
    
    handleInput(data:string): void {
         
    }
    private setEnv(key:string,value?:string){
        if(!value)return;
        this.system.env.set(key,value);
    }
    protected async execute(): Promise<void> {

        this.monitor.setDisplay(<div>
            欢迎来到 Wyatt 的博客系统
        </div>)

        this.printLn(`\r\nBootstrapping....\r\n`);
        
        this.setEnv("SERVER_URL",process.env["SERVER_URL"]);
        
        
        await wait(500);
        await this.printMotd();
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