import { wait, Chalk } from "../../utils";
import { IProgramContainer, Program, StdOutput } from "./program";
import * as Readline from "readline-browser";
import { MutableStandardInputFacade } from "../stdio";


export interface IParsedCommand{
    cmd:string,
    args:string[]
}

export function parseCommandText(cmd_text:string) : IParsedCommand{
    const array = cmd_text.split(" ");
    return {
        cmd:array[0],
        args:array.slice(1,array.length)
    };
}

export class CLIProgram extends Program{
    static program_name = "cli";
    static description = "终端程序";
    static usage = "cli";

    private prefix = "";

    private running : boolean = false;
    private prompting = false;

    private isFirstRun = true;
    private initCommands:string[] = [];
    private defaultCommands:string[] = [];

    private input? : MutableStandardInputFacade;
    private output? : StdOutput;

    private linesBuffer : [string,number][] = [];

    private intf? : Readline.Interface;

    private exited = false;
    private container? : IProgramContainer;

    handleInput(input:string): void {

    }

    public isLoaded(){
        return this.isFirstRun === false;
    }
    public async inputCommandText(cmd_text:string,typing_ms:number = 0){
        this.terminal.setVisible(true)
        this.linesBuffer.push([cmd_text,typing_ms]);
        await this.consumeLine();
    }
    private async consumeLine(){
        if(!this.prompting)return;

        const buf = this.linesBuffer.shift();
        if(!buf)return;

        const [cmd_text,typing_ms] = buf;

        for(const char of cmd_text){
            this.stdin.pushKey({sequence:char,name:char});
    
            if(typing_ms > 0)
                await wait(typing_ms);
        }

        this.stdin!.pushKey({
            ctrl: false,
            name: "enter",
            sequence: "enter",
            shift: false
        });
    }
    public getProgramContainer(){
        if(!this.container)
            throw new Error(`获取程序容器失败`);
        return this.container;
    }
    /**
     * CLI Program 是一个 forever loop
     * 常驻执行的程序
     */
    protected async execute(container : IProgramContainer,initCommands:string[] = [],defaultCommands:string[] = []): Promise<void> {

        this.input = new MutableStandardInputFacade(this.stdin);
        this.output = this.stdout;

        this.intf = Readline.createInterface(this.input,this.output);

        this.container = container;
        this.initCommands = initCommands;
        this.defaultCommands = defaultCommands;
    
        while(!this.exited){
        
            this.updatePrefix();
            await this.tryToInit();
            
            const readline = this.readLine();
            
            await this.consumeLine();

            const line = await readline;
            const parsed = parseCommandText(line);
     
            try{
                await this.runCommand(parsed.cmd,parsed.args);  
            }catch(err){
                this.printLn(err.message);
            }

        }
    }
    private async tryToInit(){
        if(this.isFirstRun === false)
            return;

        await this.runInitCommands();
        await this.runDefaultCommands();

        this.isFirstRun = false;
    }
    async runInitCommands(){
        for(const cmd of this.initCommands){
            await this.inputCommandText(cmd);
        }
    }
    async runDefaultCommands(){
        for(const cmd of this.defaultCommands){
            await this.inputCommandText(cmd);
        }
    }
    private async runCommand(cmd :string,args:string[]){
        if(cmd === "exit"){
            this.printLn("CLI 程序已退出");
            this.exited = true;
        }else if(cmd === "clear"){

        }else if(cmd === ""){
        }else{
            await this.runProgram(cmd,args);
        }
    }
    private async runProgram(name:string,args:string[]){
        const container = this.getProgramContainer();

        if(container.hasProgramImpl(name) === false){
            this.printLn(`程序 ${name} 不存在!`);
            return;
        }

        this.input!.mute();
        this.running = true;
        try{
            const program = container.getNewProgram(name);
            return await program.run(this,...args);
        }catch(err){
            throw err;
        }finally{
            this.running = false;
            this.input!.unmute();
 
        }
    }

    private async readLine(){
        this.prompting = true;
        const promise  : Promise<string> = new Promise((resolve)=>this.intf!.question(this.prefix,{},resolve));
        const line = await promise;
        this.prompting = false;
        return line;
    }
    private updatePrefix(){
        const loginChar = this.isLogined() ? "#" : "$";

        this.prefix = `${Chalk.bold.blue`Wyatt Blog OS`} ${Chalk.bold.red(loginChar)} `;
    }
}
