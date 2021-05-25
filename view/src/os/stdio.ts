import { StdInput, StdOutput } from "./program/program";
import { MutableRefObject, RefObject, useEffect, useRef } from "react";
import { Terminal } from "xterm";


import getStringWidth from "string-width";
import { Readable, Writable } from "stream";

function getMappedKeyName(rawName:string){
    if(rawName === "Backspace"){
        return "backspace";
    }else if(rawName === "ArrowLeft"){
        return 'left';
    }else if(rawName === "ArrowRight"){
        return 'right';
    }else if(rawName === "ArrowUp"){
        return 'up';
    }else if(rawName === "ArrowDown"){
        return 'down';
    }else if(rawName === "Delete"){
        return 'delete';
    }else if(rawName === "Enter"){
        return 'enter';
    }else if(rawName === "Tab"){
        return 'tab';
    }else if(rawName === "Home"){
        return 'home';
    }else if(rawName === "End"){
        return 'end';
    }else if(rawName === "Return"){
        return 'return';
    }
    return rawName;
}

export class MutableStandardInputFacade extends Readable implements StdInput{
    private muted : boolean = false;
    constructor(private std_input:StdInput){
        super();
        
        this.std_input.on("keypress",(char,key)=>{
            if(this.muted)return;
            this.emit("keypress",char,key);
        });
    }
    mute(){
        this.muted = true;
    }
    unmute(){
        this.muted = false;
    }
    pushKey(key:any){
        if(this.muted)return;

        this.std_input.pushKey(key);
    }
    _read(read_number : number){

    }
}

export class EventStandardInput extends Readable implements StdInput{
    constructor(private terminal:Terminal){ 
        super();

        this.terminal.onData((char)=>{
            if(getStringWidth(char)>=2){
                this.emit("keypress",char,{
                    sequence:char,
                    name:undefined,
                    ctrl:false,
                    meta:false,
                    shift:false,
                })
            }
        });
        this.terminal.onKey(({key,domEvent})=>{

            const name = getMappedKeyName(domEvent.key);
            const ctrl = domEvent.ctrlKey;
            const shift = domEvent.shiftKey;

            this.emit("keypress",key,{
                sequence:name,
                name,
                ctrl,
                shift
            });
        })
    }
    _read(read_number : number){

    }
    pushKey(key:any){
            this.emit("keypress",key.sequence,key);
    }

}

export class TerminalStandardOutput extends Writable implements StdOutput{
    writable: boolean = true;
    rawListeners: any = [];
    isTTY: boolean = true;

    get columns(){
        return this.terminal.cols;
    }
    constructor(private terminal:Terminal){
        super();

        this.terminal.onResize((size)=>{
            this.emit("resize",size);
        })
    }
    end(): void {

    }
    write(data: string): boolean {

        this.terminal.write(data);
        return true;
    }
    

}

export function useInput(terminal : RefObject<Terminal>) : MutableRefObject<StdInput | undefined>{
    const input = useRef<StdInput>();
  
    useEffect(()=>{
      input.current = new EventStandardInput(terminal.current!);
    },[input,terminal]);


    return input;
}

  export function useOutput(terminal : RefObject<Terminal>) : MutableRefObject<StdOutput | undefined>{
    const output = useRef<StdOutput>();

    useEffect(()=>{
        output.current = new TerminalStandardOutput(terminal.current!);
    },[output,terminal]);
  
    return output;
}