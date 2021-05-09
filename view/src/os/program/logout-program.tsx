import { Program } from "./program";

export class LogoutProgram extends Program{
    static program_name = "logout";
    static description = "退出用户账户的登录";
    static usage = "logout";

    handleInput(data:string): void {
         
    }
    protected async execute(cli:any,username?:string,password?:string): Promise<void> {
        if(!this.isLogined())
            throw new Error(`你当前并未登录, 无法退出登录`);
        
        this.system.env.remove("AUTH_TOKEN");

    }
    
}