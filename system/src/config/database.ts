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
        host:configService.get("DATABASE.HOST"),
        port:+configService.get("DATABASE.PORT"),
        username:configService.get("DATABASE.USERNAME"),
        password:configService.get("DATABASE.PASSWORD"),
        database:configService.get("DATABASE.DBNAME"),
        entities:EntityList,
        synchronize:true,
        namingStrategy:new SimpleNamingStrategy()
    }),
    inject: [ConfigService]
});

export const RepositoryModule = TypeOrmModule.forFeature(EntityList);