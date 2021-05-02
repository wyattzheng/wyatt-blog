import { StdInput, StdOutput } from "./program/model";
import { EventEmitter2 } from "eventemitter2"
import { MutableRefObject, RefObject, useEffect, useRef } from "react";
import { Terminal } from "xterm";

export class EventStandardInput implements StdInput{
    constructor(private dataEventEmitter:EventEmitter2){ }
    onData (listener: (data: string) => any) : void{
        console.log("listen")
        this.dataEventEmitter.on("data",listener);
    }
    removeDataListener(listener: (data: string) => any): void {
        this.dataEventEmitter.removeListener("data",listener);
    }
}

export class TerminalStandardOutput implements StdOutput{
    constructor(private terminal:Terminal){ }
    writeData(data: string): void {
        this.terminal.write(data);
    }
}

export function useInput() : [MutableRefObject<StdInput | undefined>,MutableRefObject<EventEmitter2 | undefined>]{
    const input = useRef<StdInput>();
    const inputEmitter = useRef<EventEmitter2>();
  
    useEffect(()=>{
      inputEmitter.current = new EventEmitter2();
      input.current = new EventStandardInput(inputEmitter.current);
    },[input,inputEmitter]);
  
    return [input,inputEmitter];
}

  export function useOutput(terminal : RefObject<Terminal>) : MutableRefObject<StdOutput | undefined>{
    const output = useRef<StdOutput>();

    useEffect(()=>{
        output.current = new TerminalStandardOutput(terminal.current!);
    },[output,terminal]);
  
    return output;
}