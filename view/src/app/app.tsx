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
import { CLIProgram } from '../os/program/cli-program';
import { parseHashCommand } from '../utils';
import { useTerminal } from '../os/terminal';

export function useAutoTerminalWidth(
    terminal:RefObject<Terminal>,
    setTerminalWidth:React.Dispatch<React.SetStateAction<number>>,
    system:React.MutableRefObject<ISystem | undefined>
  ){
  useEffect(()=>{
    const updateTerminalWidth = ()=>{
      
      const screenWidth = document.body.offsetWidth;
      if(screenWidth > 800){
        terminal.current!.resize(85,15);
        setTerminalWidth(800);
        system.current!.env.set("SCREEN_MODE","MIDDLE");
      }else{
        terminal.current!.resize(30,15);
        setTerminalWidth(300);

        system.current!.env.set("SCREEN_MODE","MINIMAL");
      }  
    };
    updateTerminalWidth();
    window.addEventListener("resize",updateTerminalWidth);
    return ()=>window.removeEventListener("resize",updateTerminalWidth);
  },[setTerminalWidth, system, terminal]);
}

function getCurrentHashCommand(){
  const hash = window.location.hash;
  if(hash === "")
    return;
  return parseHashCommand(hash);
}

function useHashTerminalInput(cli_program : React.MutableRefObject<CLIProgram | undefined>){
  
  useEffect(()=>{
    const popstatelistener = async ()=>{

      const cli = cli_program.current;
      const command = getCurrentHashCommand();

      if(!command){
        cli!.runDefaultCommands();
        return;
      }
      if(cli && cli.isLoaded()){
        await cli.inputCommandText(command,20);
      }
    };
    window.addEventListener("popstate",popstatelistener);

    return ()=>window.removeEventListener("popstate",popstatelistener);
  },[cli_program])
//  cli.inputCommandText();

}
export function App() {
  const terminal = useRef<Terminal>(null);
  const cli_program = useRef<CLIProgram>();
  
  
  const [terminalWidth,setTerminalWidth] = useState(800);

  const os_monitor = useMonitor();
  const os_terminal = useTerminal();

  const system = useSystem();

  const input = useInput(terminal);
  const output = useOutput(terminal);
  const container = useProgramContainer(input,output,system,os_monitor,os_terminal);

  useAutoTerminalWidth(terminal,setTerminalWidth,system);
  useHashTerminalInput(cli_program);


  function onTermToggleClicked(){
    os_terminal.setVisible(true);
  }
  function onMonitorFocus(){
    os_terminal.setVisible(false);
  }


  useEffect(()=>{

    initProgramContainer(container.current!);

    const default_hash_command = getCurrentHashCommand();
    
    const init_commands = [];
    const default_commands = [];

    if(default_hash_command){
      default_commands.push(default_hash_command);
    }else{
      init_commands.push("bootstrap");
      default_commands.push("show");
    }

    cli_program.current = container.current!.getNewProgram("cli") as CLIProgram;
    cli_program.current.run(container.current!,init_commands,default_commands);

  },[container]);
  

  return (
    <SystemContext.Provider value={{ system, monitor:os_monitor,terminal:os_terminal }}>
      <div className="app">
          <div onFocus={onMonitorFocus} onMouseUp={onMonitorFocus} className="display-box">
            <div className="display">
              { os_monitor.display }
            </div>
          </div>
          <div className="terminal-toggle-button" onClick={onTermToggleClicked} style={{display: os_terminal.visible? "none" : undefined}}>
            <RiComputerLine />
          </div>
          <div className="terminal-area" style={{ display: os_terminal.visible? undefined : "none"}}>
            
            <WTerminal className="wterm" style={{ width:`${terminalWidth}px` }} cols={85} rows={15} ref={terminal}></WTerminal>
              
          
          </div>
          
      </div>
    </SystemContext.Provider>
  );
}