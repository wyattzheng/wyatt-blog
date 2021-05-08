import * as FileSystem from "fs"
import { ConfigModule } from "@nestjs/config"

export function GetConfig(){
    const path = process.env["APP_CONFIG"];

    if(!path)
        throw new Error(`please provide config file at env : APP_CONFIG`);

    if(!FileSystem.existsSync(path))
        throw new Error(`ensure the config file: ${path} exists.`);

    const str = FileSystem.readFileSync(path).toString();
    try{
        return JSON.parse(str);
    }catch(err){
        throw new Error(`ensure the config file is JSON format : ${path}`)
    }
}

export const AppConfigModule = ConfigModule.forRoot({
    load: [ GetConfig ]
});