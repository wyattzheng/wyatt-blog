import { EventEmitter2 } from "eventemitter2";
import { IProgramContainer, Program } from "./program";

export class CLIProgram extends Program{
    static program_name = "cli";

    private running : boolean = false;
    private eventBus = new EventEmitter2();
    private strBuf = "";

    private exited = false;

    handleInput(input: { key: string, domEvent: KeyboardEvent }): void {
        if(this.running)
            return;

        if(input.key === "\r")
            this.enter();
        else if(input.key === "\u007F") //Backspace        
            this.backspace();
        else{
            this.keyin(input.key);
        }

    }
    private enterCommandText(cmd_text:string){
        for(let key of cmd_text.split(''))
            this.keyin(key);
        this.enter();
    }
    private keyin(key:string){
        this.strBuf += key;
        this.stdout.writeData(key); 
    }
    private backspace(){
        if(this.strBuf.length <= 0)
        return;
        
        this.stdout.writeData("\b \b");
        this.strBuf = this.strBuf.substr(0,this.strBuf.length-1);
    }
    private enter(){
        this.eventBus.emit("EnterCalled",this.strBuf);
        this.strBuf = "";
        this.stdout.writeData("\r\n");
    }
    /**
     * CLI Program 是一个 forever loop
     * 常驻执行的程序
     */
    protected async execute(container : IProgramContainer,initCommands:string[] = []): Promise<void> {
        this.runInitCommands(container,initCommands);

        while(!this.exited){
            this.printPrefix();

            const line = await this.waitForLine();

            try{
                await this.runCommand(container,line,[]);  
            }catch(err){
                this.printLn(err.message);
            }
        }
    }
    private async runInitCommands(container : IProgramContainer, initCommands:string[]){

        setTimeout(()=>{
            for(const cmd of initCommands){
                this.enterCommandText(cmd);
            }    
        },100);
    }
    private async runCommand(container:IProgramContainer,cmd :string,args:string[]){
        if(cmd === "exit"){
            this.printLn("CLI 程序已退出");
            this.exited = true;
            this.eventBus.emit("EnterCalled");
        }else if(cmd === ""){
        }else{
            await this.runProgram(container,cmd,args);
        }
    }
    private async runProgram(container : IProgramContainer, name:string,args:string[]){
        if(container.hasProgramImpl(name) === false){
            this.printLn(`程序 ${name} 不存在!`);
            return;
        }

        this.running = true;
        try{
            const program = container.getNewProgram(name);
            return await program.run(...args);
        }catch(err){
            throw err;
        }finally{
            this.running = false;
        }
    }
    /**
     * 在CLI输入时 等待回车
     */
    private async waitForLine(){
        const [line] = await this.eventBus.waitFor("EnterCalled");
        return line;
    }
    private printPrefix(){
        this.stdout.writeData("Wyatt Blog OS $ ");
    }
    
}