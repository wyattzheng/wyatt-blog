import { Program } from "./program";

export class EnvProgram extends Program{
    static program_name = "env";
    static description = "设置/获取系统环境变量";
    static usage = "env <set|get> <key> <value>";

    handleInput(data:string): void {
         
    }
    private getAllEnvs(){
        const envs = this.system.env.getAll();
        const built_string = [];
        for(let {key,value} of envs){
            built_string.push(`${key}=${value}`);
        }
        return built_string.join("\r\n");
    }
    protected async execute(cli:any,action?:string,key?:string,value?:string): Promise<void> {
        if(action === "get"){
            if(this.system.env.has(key!) === false)
                throw new Error(`环境变量 ${key} 不存在`);
            
            this.printLn(this.system.env.get(key!)!);
        }else if(action === "set"){
            if(!key || !value)
                throw new Error(`请提供环境变量的 key 与 value`);
        
            this.system.env.set(key,value);
        }else{
            this.printLn(this.getAllEnvs());
        }
    }
    
}