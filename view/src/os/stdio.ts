import { StdInput, StdOutput } from "./program/program";
import { MutableRefObject, RefObject, useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { Readable, Writable } from "stream";

function getMappedKeyName(ctrl_char:string){
    if(ctrl_char === "\u007F"){
        return "backspace";
    }else if(ctrl_char === "\u001b\u005b\u0044"){
        return 'left';
    }else if(ctrl_char === "\u001b\u005b\u0043"){
        return 'right';
    }else if(ctrl_char === "\u001b\u005b\u0041"){
        return 'up';
    }else if(ctrl_char === "\u001b\u005b\u0042"){
        return 'down';
    }else if(ctrl_char === "\u001b\u005b\u0033\u007e"){
        return 'delete';
    }else if(ctrl_char === "\u000d"){
        return 'enter';
    }else if(ctrl_char === "\u0009"){
        return 'tab';
    }else if(ctrl_char === "\u001b\u005b\u0046"){
        return 'home';
    }else if(ctrl_char === "\u001b\u005b\u0035\u007e"){
        return 'end';
    }
    
    return ctrl_char;
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
            const name = getMappedKeyName(char);

            this.emit("keypress",name,{
                sequence:name,
                name,
                ctrl:false,
                shift:false
            });

        });
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
    clear(){
        this.terminal.clear();
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