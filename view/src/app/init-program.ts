import { CLIProgram } from '../os/program/cli-program';
import { EditBlogProgram } from '../os/program/edit-blog-program/index';
import { BootProgram } from '../os/program/boot-program/index';
import { LoginProgram } from '../os/program/login-program';
import { IProgramContainer } from '../os/program/program';
import { ViewBlogProgram } from '../os/program/view-blog-program/index';
import { EnvProgram } from '../os/program/env-program';
import { ListBlogProgram } from '../os/program/list-blog-program/index';
import { HelpProgram } from '../os/program/help-program';
import { ShowListProgram } from '../os/program/show-list-program';


export function initProgramContainer(container : IProgramContainer){
    container.addProgramImpl(CLIProgram);
    container.addProgramImpl(BootProgram);
    container.addProgramImpl(ViewBlogProgram);
    container.addProgramImpl(EditBlogProgram);
    container.addProgramImpl(ListBlogProgram);
    container.addProgramImpl(LoginProgram);
    container.addProgramImpl(EnvProgram);
    container.addProgramImpl(HelpProgram);
    container.addProgramImpl(ShowListProgram);

}