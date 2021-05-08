import './app.css';

import { WTerminal } from "../components/terminal";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { ISystem, SystemContext, useSystem } from '../os/system';
import { useMonitor } from '../os/monitor';
import { useInput, useOutput } from '../os/stdio';
import { useProgramContainer } from '../os/program/program';
import { initProgramContainer } from './init-program';
import { RiComputerLine } from "react-icons/ri"

export function useAutoTerminalWidth(terminal:RefObject<Terminal>,setTerminalWidth:React.Dispatch<React.SetStateAction<number>>,system:React.MutableRefObject<ISystem | undefined>){
  useEffect(()=>{
    const updateTerminalWidth = ()=>{
      
      const screenWidth = document.body.offsetWidth;
      if(screenWidth > 800){
        terminal.current!.resize(85,10);
        setTerminalWidth(800);
        system.current!.env.set("SCREEN_MODE","MIDDLE");
      }else{
        terminal.current!.resize(40,10);
        setTerminalWidth(400);

        system.current!.env.set("SCREEN_MODE","MINIMAL");
      }  
    };
    updateTerminalWidth();
    window.addEventListener("resize",updateTerminalWidth);
    return ()=>window.removeEventListener("resize",updateTerminalWidth);
  },[]);
}
export function App() {
  const terminal = useRef<Terminal>(null);
  const [terminalWidth,setTerminalWidth] = useState(800);

  const monitor = useMonitor();
  const system = useSystem();
  const [termVisible,setTermVisible] = useState(true);

  const [input,inputEmitter] = useInput();
  const output = useOutput(terminal);
  const container = useProgramContainer(input,output,system,monitor);

  useAutoTerminalWidth(terminal,setTerminalWidth,system);


  function onTermToggleClicked(){
    setTermVisible(true);
  }
  function onMonitorFocus(){
    setTermVisible(false);
  }


  useEffect(()=>{

    initProgramContainer(container.current!);

    const cli_program = container.current!.getNewProgram("cli");
    cli_program.run(container.current!,["bootstrap"]);

  },[container]);

  return (
    <SystemContext.Provider value={{ system, monitor }}>
      <div className="app">
          <div onFocus={onMonitorFocus} onMouseUp={onMonitorFocus} className="display-box">
            <div className="display">
              { monitor.display }
            </div>
          </div>
          <div className="terminal-toggle-button" onClick={onTermToggleClicked} style={{display: termVisible? "none" : undefined}}>
            <RiComputerLine />
          </div>
          <div className="terminal-area" style={{ display: termVisible? undefined : "none"}}>
            
            <WTerminal className="wterm" style={{ width:`${terminalWidth}px` }} cols={85} rows={10} ref={terminal} onKey={(data)=>{inputEmitter.current!.emit("data",data)}}></WTerminal>
              
          </div>
          
      </div>
    </SystemContext.Provider>
  );
}