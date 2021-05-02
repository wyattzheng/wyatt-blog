import { IMonitor } from "../monitor";
import { ISystem } from "../system";

/**
 * 标准输入模型
 */
export interface StdInput{
    onData : (listener:(data:string) => any) => void;
    removeDataListener(listener:(data:string) => any) : void;
}
/**
 * 标准输出模型
 */
export interface StdOutput{
    writeData(data : string) : void;
}

/**
 * 内置的可执行程序模型
 */
export interface IProgram{
    /**
     * 程序异常退出, 以在执行该方法的时候抛出异常的方式实现
     */
    run() : Promise<void>;

}

export abstract class Program implements IProgram{
    private inputListener = this.handleInput.bind(this);

    constructor(
            protected stdin : StdInput,
            protected stdout : StdOutput,
            protected system : ISystem,
            protected monitor : IMonitor
        ){
    }
    private start(){
        this.stdin.onData(this.inputListener);
    }
    private stop(){
        this.stdin.removeDataListener(this.inputListener);
    }
    async run(){
        this.start();
        await this.execute();
        this.stop();
    }
    abstract handleInput(data:string) : void;
    protected abstract execute() : Promise<void>;
}
