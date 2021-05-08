import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppConfigModule } from "./app-config";
import { EntityList } from "../domain";
import { DefaultNamingStrategy } from "typeorm";

/**
 * 这是一个自定义的数据库字段名起名策略
 * 
 * 将字段名聚合成最普通的形式, 以兼容未来可能的拓展
 */
export class SimpleNamingStrategy extends DefaultNamingStrategy{
    columnName(propName){
        return propName;
    }
}

export const DatabaseModule = TypeOrmModule.forRootAsync({
    imports:[ AppConfigModule ],
    useFactory:( configService : ConfigService, ) => ({
        type:"mysql",
        host:configService.get("database.host"),
        port:+configService.get("database.port"),
        username:configService.get("database.username"),
        password:configService.get("database.password"),
        database:configService.get("database.dbname"),
        entities:EntityList,
        synchronize:true,
        namingStrategy:new SimpleNamingStrategy()
    }),
    inject: [ConfigService]
});

export const RepositoryModule = TypeOrmModule.forFeature(EntityList);