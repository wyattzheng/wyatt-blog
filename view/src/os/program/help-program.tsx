import { CLIProgram } from "./cli-program";
import { IProgramContainer, Program } from "./program";

export class HelpProgram extends Program{
    
    static program_name = "help";
    static description = "获取命令帮助";
    static usage = "help [command]";
    private container?: IProgramContainer;

    handleInput(data: string): void {
        
    }
    protected async execute(cli:CLIProgram,command?:string): Promise<void> {
        this.container = cli.getProgramContainer();
        
        if(command)
            this.printCommandHelp(command)
        else
            this.printAllHelp();
    }
    private printCommandHelp(cmd:string){
        const program = this.container!.getProgramImpl(cmd);
        this.printLn("");
        this.printLn(program.description);
        this.printLn("");
        this.printLn(program.usage);
        this.printLn("");
        
    }
    private printAllHelp(){
        const programs = this.container!.getAllImpls();

        this.printLn("");
        for(const program of programs){
            this.printLn(`${program.program_name} : ${program.description}`);
        }
        this.printLn("");
        this.printLn("使用 help <command> 查看命令的具体用法");
        this.printLn("");
    }

}