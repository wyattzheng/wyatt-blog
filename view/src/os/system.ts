import React, {useRef , useEffect} from "react";
import { MockFileSystem } from "./filesystem/MockFileSystem";

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
}



export function useSystem(){

    const fs = useRef<IFileSystem>();
    const system = useRef<ISystem>();
  
    useEffect(()=>{
      fs.current = new MockFileSystem();
      system.current = {
        fs:fs.current
      }
    },[fs,system]);
  
    return system;
  }