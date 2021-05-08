import { EventEmitter2 } from "eventemitter2";
import { wait } from "../../utils";
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

    private running : boolean = false;
    private eventBus = new EventEmitter2();
    private nextLine = false;
    private isFirstRun = false;

    private keyinputBuffer : string[] = [];
    private lineBuf = "";
    private history = new LineHistory();

    private exited = false;

    handleInput(input: { key: string, domEvent: KeyboardEvent }): void {
        if(this.running === false){
            this.keyinputBuffer.push(input.key);
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
                
                this.stdout.writeData("\b \b");
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

    private inputClearLine(){
        for(let i=0;i<this.lineBuf.length;i++){
            this.stdout.writeData("\b \b");
        }

        this.lineBuf = "";
    }
    public inputCommandText(cmd_text:string,nextLine:boolean = true){
        this.keyinputBuffer.push(...cmd_text.split(""));
        if(nextLine === true){
            this.keyinputBuffer.push("\r");
            this.consumeLine();
        }
    }

    /**
     * CLI Program 是一个 forever loop
     * 常驻执行的程序
     */
    protected async execute(container : IProgramContainer,initCommands:string[] = []): Promise<void> {

        while(!this.exited){

            this.nextLine = false;

            this.printPrefix();
            this.tryToInit(container,initCommands);
            this.consumeLine();

            const line = await this.waitForLine();
            const parsed = parseCommandText(line);
            
            this.history.addLineHistory(line);

            try{
                await this.runCommand(container,parsed.cmd,parsed.args);  
            }catch(err){
                this.printLn(err.message);
            }


        }
    }
    private async tryToInit(container : IProgramContainer, initCommands:string[]){
        if(this.isFirstRun === true)
            return;

        for(const cmd of initCommands){
            this.inputCommandText(cmd);
        }

        this.isFirstRun = true;


    }
    private async runCommand(container:IProgramContainer,cmd :string,args:string[]){
        if(cmd === "exit"){
            this.printLn("CLI 程序已退出");
            this.exited = true;
            this.eventBus.emit("EnterCalled");
        }else if(cmd === "clear"){
            this.stdout.clear();
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
        this.stdout.writeData("Wyatt Blog OS $ ");
    }
}
