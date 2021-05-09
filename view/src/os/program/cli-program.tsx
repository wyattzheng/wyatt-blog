
import { EventEmitter2 } from "eventemitter2";
import { wait, Chalk, getWordWidth } from "../../utils";
import { IProgramContainer, Program } from "./program";


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


export class LineHistory{
    static MAX_HISTORY_RECORD = 16;

    private lineHistory : string[] = [];
    private historyOffset : number = 0;

    moveAndGetHistory(offset : number){    
        const location = this.historyOffset + offset;        
        if(location < 0 || location >= this.lineHistory.length)
            return;
    
        this.historyOffset += offset;

        return this.lineHistory[this.historyOffset];
    }

    addLineHistory(line:string){
        if(line.length <= 0)
            return;

        if(this.lineHistory.length > LineHistory.MAX_HISTORY_RECORD){
            this.lineHistory.shift()
            this.historyOffset -= 1;
        }

        this.lineHistory[this.historyOffset] = line;
        this.lineHistory.splice(this.historyOffset + 1,this.lineHistory.length);
        this.historyOffset += 1;

    }
    

}

export class CLIProgram extends Program{
    static program_name = "cli";
    static description = "终端程序";
    static usage = "cli";

    private running : boolean = false;
    private eventBus = new EventEmitter2();
    private nextLine = false;
    private isFirstRun = true;

    private keyinputBuffer : string[] = [];
    private lineBuf = "";
    private history = new LineHistory();

    private exited = false;
    private container? : IProgramContainer;

    handleInput(input:string): void {
        if(this.running === false){
            this.keyinputBuffer.push(input);
            this.consumeLine();
        }
    }
    private consumeLine(){
        if(this.nextLine === true)
            return;

        while(this.keyinputBuffer.length > 0){
            const inputKey = this.keyinputBuffer.shift()!;

            if(inputKey === "\r"){

                this.nextLine = true;
                this.eventBus.emit("NextLineEvent");
                this.stdout.writeData("\r\n");
                return;
            }else if(inputKey === "\u007F") //Backspace        
            {
                if(this.lineBuf.length <= 0)
                    return;

                for(let i=0;i<getWordWidth(this.getLastWord());i++){
                    this.stdout.writeData("\b \b");
                }

                this.lineBuf = this.lineBuf.substr(0,this.lineBuf.length-1);
            }
            else if(inputKey === "\u001b\u005b\u0043"){//→
            }
            else if(inputKey === "\u001b\u005b\u0044"){//←
            }
            else if(inputKey === "\u001b\u005b\u0041"){//↑
                this.showHistory(-1);
            }
            else if(inputKey === "\u001b\u005b\u0042"){//↓
                this.showHistory(+1);
            }
            else{
                this.lineBuf += inputKey;
                this.stdout.writeData(inputKey); 
            }
        }
    
    }
    private showHistory(offset:number){
        const historyText = this.history.moveAndGetHistory(offset);
        if(!historyText) return;

        this.inputClearLine();
        this.inputCommandText(historyText,false);
    }
private getLastWord(){
    if(this.lineBuf.length < 1)
    return ""

    return this.lineBuf.substr(-1,1)
}
    private inputClearLine(){
        for(let i=0;i<this.lineBuf.length;i++){
            this.stdout.writeData("\b \b");
        }

        this.lineBuf = "";
    }
    public isLoaded(){
        return this.isFirstRun === false;
    }
    public inputCommandText(cmd_text:string,nextLine:boolean = true){
        this.terminal.setVisible(true);

        this.keyinputBuffer.push(...cmd_text.split(""));
        if(nextLine === true){
            this.keyinputBuffer.push("\r");
            this.consumeLine();
        }
    }
    public async slowInputCommandText(cmd_text:string,typing_ms:number = 20){
        this.terminal.setVisible(true);

        for(const char of cmd_text){
            this.keyinputBuffer.push(char);
            this.consumeLine();
            await wait(typing_ms);
        }
        this.keyinputBuffer.push("\r");
        this.consumeLine();
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
    protected async execute(container : IProgramContainer,initCommands:string[] = []): Promise<void> {
        this.container = container;
            
        while(!this.exited){
            
            this.nextLine = false;

            this.printPrefix();
            this.tryToInit(initCommands);
            this.consumeLine();

            const line = await this.waitForLine();
            const parsed = parseCommandText(line);
            
            this.history.addLineHistory(line);

            try{
                await this.runCommand(parsed.cmd,parsed.args);  
            }catch(err){
                this.printLn(err.message);
            }


        }
    }
    
    private async tryToInit(initCommands:string[]){
        if(this.isFirstRun === false)
            return;

        for(const cmd of initCommands){
            this.inputCommandText(cmd);
        }

        this.isFirstRun = false;

    }
    private async runCommand(cmd :string,args:string[]){
        if(cmd === "exit"){
            this.printLn("CLI 程序已退出");
            this.exited = true;
            this.eventBus.emit("EnterCalled");
        }else if(cmd === "clear"){
            this.stdout.clear();
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

        this.running = true;
        try{
            const program = container.getNewProgram(name);
            return await program.run(this,...args);
        }catch(err){
            throw err;
        }finally{
            this.running = false;
        }
    }
    /**
     * 等待NextLine事件
     */
    private async waitForLine(){
        if(!this.nextLine)
            await this.eventBus.waitFor("NextLineEvent");

        const line = this.lineBuf;
        this.lineBuf = "";
        await wait(0); // 让终端可以刷新 buffer

        return line;
        
    }
    private printPrefix(){
        const loginChar = this.isLogined() ? "#" : "$";

        this.stdout.writeData(`${Chalk.bold.blue`Wyatt Blog OS`} ${Chalk.bold.red(loginChar)} `);
    }
}
