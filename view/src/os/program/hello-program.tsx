import { wait } from "../../utils";
import { Program } from "./program";

const Motd =[
'',
'██╗    ██╗██╗   ██╗ █████╗ ████████╗████████╗    ██████╗ ██╗      ██████╗  ██████╗ ',
'██║    ██║╚██╗ ██╔╝██╔══██╗╚══██╔══╝╚══██╔══╝    ██╔══██╗██║     ██╔═══██╗██╔════╝ ',
'██║ █╗ ██║ ╚████╔╝ ███████║   ██║      ██║       ██████╔╝██║     ██║   ██║██║  ███╗',
'██║███╗██║  ╚██╔╝  ██╔══██║   ██║      ██║       ██╔══██╗██║     ██║   ██║██║   ██║',
'╚███╔███╔╝   ██║   ██║  ██║   ██║      ██║       ██████╔╝███████╗╚██████╔╝╚██████╔╝',
' ╚══╝╚══╝    ╚═╝   ╚═╝  ╚═╝   ╚═╝      ╚═╝       ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝ ',
''
];

export class HelloProgram extends Program{
    static program_name = "hello";
    
    handleInput(data:string): void {
         
    }
    protected async execute(): Promise<void> {

        this.printLn(`\r\nBootstrapping....\r\n`);
        await wait(2000);

        for(const line of Motd){
            this.printLn(line);
            await wait(100);
        }

    }
    
}