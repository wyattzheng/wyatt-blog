import { CLIProgram } from '../os/program/cli-program';
import { HelloProgram } from '../os/program/hello-program';
import { IProgramContainer } from '../os/program/program';


export function initProgramContainer(container : IProgramContainer){
    container.addProgramImpl(CLIProgram);
    container.addProgramImpl(HelloProgram);

}