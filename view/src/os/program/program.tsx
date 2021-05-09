import Axios from "axios";
import { MutableRefObject, useEffect, useRef } from "react";
import { WContainer } from "../../components/container";
import { IMonitor } from "../monitor";
import { ISystem } from "../system";
import { ITerminal } from "../terminal";


export interface ProgramImpl{
    program_name:string;
    description:string;
    usage:string;
    
    new (...args:any[]): IProgram;
}
export interface IProgramContainer{
    addProgramImpl(impl : ProgramImpl) : void;
    hasProgramImpl(name:string):boolean;
    getProgramImpl(name:string):ProgramImpl;
    getNewProgram(name:string,...args:any[]): IProgram;
    getAllImpls():ProgramImpl[];
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
            protected monitor : IMonitor,
            protected terminal : ITerminal
        ){
    }
    private start(){
        this.stdin.onData(this.inputListener);
    }
    private stop(){
        this.stdin.removeDataListener(this.inputListener);
    }
    protected setDefaultDisplay(){
        this.monitor.setDisplay(<WContainer>当前未运行程序, 请在终端界面输入 help 获取帮助.</WContainer>)
    }
    protected isLogined(){
        const authToken = this.system.env.get("AUTH_TOKEN");
        return authToken ? true : false;
    }
    protected network(forceLogin : boolean = false){
        const baseURL = this.system.env.get("SERVER_URL");
        const authToken = this.system.env.get("AUTH_TOKEN");
        if(!baseURL)
            throw new Error(`系统未设置 SERVER_URL 环境变量`);
        if(!this.isLogined() && forceLogin)
            throw new Error(`该请求需要登录, 但系统未设置 AUTH_TOKEN 环境变量`);
    

        const axios =  Axios.create({
            baseURL,
            headers:{
                "auth-token":authToken || ""
            }
        })
        axios.interceptors.response.use((res)=>{
            res.data = res.data.data;
            return res;
        },(error)=>{
            error.message = error.response.data.message;
            return Promise.reject(error);
        })
        return axios;
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
        private monitor : IMonitor,
        private terminal : ITerminal
    ){ }
    getProgramImpl(name: string): ProgramImpl {
        if(!this.hasProgramImpl(name))
            throw new Error(`该程序 ${name} 不存在`);
        return this.implMap.get(name)!;
    }
    getAllImpls(): ProgramImpl[] {
        return Array.from(this.implMap.values());
    }
    addProgramImpl(impl: ProgramImpl): void {
        this.implMap.set(impl.program_name,impl);
    }
    getNewProgram(name:string,...args: any[]): IProgram {
        const Impl = this.implMap.get(name)!;
        
        return new Impl(this.stdin,this.stdout,this.system,this.monitor,this.terminal);
    }
    hasProgramImpl(name:string){
        return this.implMap.has(name);
    }
    
}

export function useProgramContainer(
        stdin : MutableRefObject<StdInput | undefined>,
        stdout : MutableRefObject<StdOutput | undefined>,
        system : MutableRefObject<ISystem | undefined>,
        monitor : IMonitor,
        terminal : ITerminal
    ) : MutableRefObject<IProgramContainer | undefined>{
    const container = useRef<IProgramContainer>();
  
    useEffect(()=>{
      container.current = new ProgramContainer(stdin.current!,stdout.current!,system.current!,monitor,terminal);
    },[container,stdin,stdout,system,monitor,terminal]);
  
    return container;
}