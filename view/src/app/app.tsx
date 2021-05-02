import './app.css';

import { WTerminal } from "../components/terminal";
import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { SystemContext, useSystem } from '../os/system';
import { useMonitor } from '../os/monitor';
import { HelloProgram } from '../os/program/hello-program';
import { useInput, useOutput } from '../os/stdio';


export function App() {
  const terminal = useRef<Terminal>(null);

  const monitor = useMonitor();
  const system = useSystem();

  const [input,inputEmitter] = useInput();
  const output = useOutput(terminal);

  useEffect(()=>{
    const program = new HelloProgram(input.current!,output.current!,system.current!,monitor);
    program.run();
  },[])

  return (
    <SystemContext.Provider value={{ system, monitor }}>
      <div className="app">
        <div className="container">
          <div className="display">
            { monitor.display }
          </div>
          <div className="terminal-area">
            <WTerminal className="wterm" cols={70} rows={10} ref={terminal} onKey={(data)=>{inputEmitter.current!.emit("data",data)}}></WTerminal>
          </div>
          
        </div>
      </div>
    </SystemContext.Provider>
  );
}