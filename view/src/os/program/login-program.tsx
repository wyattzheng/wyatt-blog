import { Program } from "./program";

export class LoginProgram extends Program{
    static program_name = "login";
    static description = "登录用户账户";
    static usage = "login <username> <password>";

    handleInput(data:string): void {
         
    }
    protected async execute(cli:any,username?:string,password?:string): Promise<void> {
        if(!username)
            throw new Error(`请提供账号名`);
        if(!password)
            throw new Error(`请提供密码`);

        const { data: session } = await this.network().post("/v1/session",{username,password});

        const { data: userinfo } = await this.network().get("/v1/user",{params:{ username }});

        this.system.env.set("AUTH_TOKEN",session.token);

        this.printLn("");
        this.printLn(`登录成功, 欢迎你 : ${userinfo.nickname}`);
        this.printLn(`会话信息: ${JSON.stringify(session)}`);
        this.printLn("");

    }
    
}