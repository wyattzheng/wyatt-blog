import { wait } from "../../utils";
import { Program } from "./model";


export class HelloProgram extends Program{
    handleInput(data:string): void {
        console.log("hello",data)
    }
    protected async execute(): Promise<void> {
        await wait(1000);
        this.monitor.setDisplay(<div>你好，我是hello world程序</div>);     
        await wait(1000);
        this.monitor.setDisplay(<div>即将开始运行</div>);     
        await wait(1000);
        this.monitor.setDisplay(<div>运行中</div>);   
        for(let i=0;i<5;i++){
            this.stdout.writeData(`${i+1}\r\n`);
            await wait(1000);
        } 
        
        this.monitor.setDisplay(<div>hello world</div>);
        this.stdout.writeData("hello world!\r\n");
        console.log("done")
        
    }
    
}