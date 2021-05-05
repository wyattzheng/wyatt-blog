import './app.css';

import { WTerminal } from "../components/terminal";
import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { SystemContext, useSystem } from '../os/system';
import { useMonitor } from '../os/monitor';
import { useInput, useOutput } from '../os/stdio';
import { useProgramContainer } from '../os/program/program';
import { initProgramContainer } from './init-program';


export function App() {
  const terminal = useRef<Terminal>(null);

  const monitor = useMonitor();
  const system = useSystem();

  const [input,inputEmitter] = useInput();
  const output = useOutput(terminal);
  const container = useProgramContainer(input,output,system,monitor);

  useEffect(()=>{

    initProgramContainer(container.current!);

    const cli_program = container.current!.getNewProgram("cli");
    cli_program.run(container.current!,["hello"]);

  },[container]);

  return (
    <SystemContext.Provider value={{ system, monitor }}>
      <div className="app">
        <div className="container">
          <div className="display">
            { monitor.display }
          </div>
          <div className="terminal-area">
            <WTerminal className="wterm" cols={85} rows={10} ref={terminal} onKey={(data)=>{inputEmitter.current!.emit("data",data)}}></WTerminal>
          </div>
          
        </div>
      </div>
    </SystemContext.Provider>
  );
}