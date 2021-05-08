import { Terminal } from "xterm";
import React, { useEffect, useRef } from "react";
import "xterm/css/xterm.css";
import "./term.css"

export interface WTerminalProps{
    rows: number;
    cols: number;
    className? : string;
    style:any,
    onData? : (arg:string) => any;
    onKey? : (arg:{key:string,domEvent:KeyboardEvent}) => any;
}

export const WTerminal = React.forwardRef(function (props : WTerminalProps ,ref : any ){

    const terminal = useRef<Terminal>();
  
    const xtermRef = useRef<HTMLDivElement>(null);

    
    useEffect(()=>{
        const term = terminal.current = new Terminal({
            rows:props.rows,
            cols:props.cols,
            cursorBlink:true
        });

        term.open(xtermRef.current!);

        /**
         * 注册 Ref
         */
        ref.current = term;

        /**
         * 注册事件监听器
         */
        props.onData && term.onData(props.onData);
        props.onKey && term.onKey(props.onKey);

        return ()=>term.dispose();
    
        // eslint-disable-next-line
    },[]);

    return (
        <div ref={ xtermRef } style={props.style} className={props.className}></div>
    )
})