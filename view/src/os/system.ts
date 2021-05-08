import React, {useRef , useEffect} from "react";
import { MockFileSystem } from "./filesystem/MockFileSystem";
import Axios, { AxiosInstance } from "axios";

export const SystemContext = React.createContext<any>({});


/**
 * 文件系统模型
 */
export interface IFileSystem{
    list(path:string) : Promise<string[]>;
    read(path:string) : Promise<Uint8Array>;
    write(path:string,data:Uint8Array) : Promise<void>;
}

/**
 * 系统模型
 */
export interface ISystem{
    fs : IFileSystem;
    env : IEnvHolder,
    network : AxiosInstance
}

/**
 * 环境变量模型
 */
export interface IEnvHolder{
  getAll():{key:string,value:string}[];
  get(key:string):string | undefined;
  has(key:string):boolean;
  set(key:string,value:string):void;
}

export class EnvHolder implements IEnvHolder{
  private envMap = new Map<string,string>();
  getAll(){
    const list = [];
    for(let [key,value] of this.envMap.entries()){
      list.push({key,value});
    }
    return list;
  }
  get(key:string) : string | undefined{
    return this.envMap.get(key);
  }
  has(key:string){
    return this.envMap.has(key);
  }
  set(key:string,value:string){
    this.envMap.set(key,value);
  }

}


export function useSystem(){

    const fs = useRef<IFileSystem>();
    const system = useRef<ISystem>();
    const envHolder = useRef<IEnvHolder>();
    const network = useRef<AxiosInstance>();


    useEffect(()=>{
      fs.current = new MockFileSystem();
      envHolder.current = new EnvHolder();
      network.current = Axios.create();
  
      system.current = {
        fs:fs.current,
        env:envHolder.current,
        network:network.current
      }
    },[fs,system]);
  
    return system;
  }