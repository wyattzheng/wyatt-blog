import { MutableRefObject, useEffect, useRef } from "react";
import { IMonitor } from "../monitor";
import { ISystem } from "../system";


export interface ProgramImpl{
    program_name:string;
    new (...args:any[]): IProgram;
}
export interface IProgramContainer{
    addProgramImpl(impl : ProgramImpl) : void;
    hasProgramImpl(name:string):boolean;
    getNewProgram(name:string,...args:any[]): IProgram;
}

/**
 * 标准输入模型
 */
export interface StdInput{
    onData : (listener:(data:any) => any) => void;
    removeDataListener(listener:(data:string) => any) : void;
}
/**
 * 标准输出模型
 */
export interface StdOutput{
    writeData(data : string) : void;
    /**
     * 清空标准输出
     */
    clear() : void;
}

/**
 * 内置的可执行程序模型
 */
export interface IProgram{
    /**
     * 运行该程序
     * 程序异常退出, 以在执行该方法的时候抛出异常的方式实现
     */
    run(...args:any[]) : Promise<void>;

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
    async run(...args:any[]){
        this.start();
        await this.execute(...args);
        this.stop();
    }
    protected printLn(line:string){
        this.stdout.writeData(`${line}\r\n`);
    }
    abstract handleInput(data:any) : void;
    protected abstract execute(...args:any[]) : Promise<void>;
}


export class ProgramContainer implements IProgramContainer{
    private implMap = new Map<string,ProgramImpl>();
    constructor(
        private stdin : StdInput,
        private stdout : StdOutput,
        private system : ISystem,
        private monitor : IMonitor
    ){ }
    addProgramImpl(impl: ProgramImpl): void {
        this.implMap.set(impl.program_name,impl);
    }
    getNewProgram(name:string,...args: any[]): IProgram {
        const Impl = this.implMap.get(name)!;
        
        return new Impl(this.stdin,this.stdout,this.system,this.monitor);
    }
    hasProgramImpl(name:string){
        return this.implMap.has(name);
    }
    
}

export function useProgramContainer(
        stdin : MutableRefObject<StdInput | undefined>,
        stdout : MutableRefObject<StdOutput | undefined>,
        system : MutableRefObject<ISystem | undefined>,
        monitor : IMonitor
    ) : MutableRefObject<IProgramContainer | undefined>{
    const container = useRef<IProgramContainer>();
  
    useEffect(()=>{
      container.current = new ProgramContainer(stdin.current!,stdout.current!,system.current!,monitor);
    },[container,stdin,stdout,system,monitor]);
  
    return container;
}