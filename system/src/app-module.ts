import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule , RepositoryModule } from "./config/database"
import { AppConfigModule } from "./config/app-config"
import { SessionMiddleware } from './filter/session-middleware';

import { Controllers } from './controllers';
import { Managers } from './manager';
import { Services } from './service';


@Module({
  imports: [ DatabaseModule, RepositoryModule, AppConfigModule ],
  controllers: Controllers,
  providers: [
    ...Services,
    ...Managers
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
