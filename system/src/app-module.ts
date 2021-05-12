import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app-controller';
import { SessionManager } from './manager/session-manager';
import { UserManager } from './manager/user-manager';
import { UserService } from './service/user-service';
import { DatabaseModule , RepositoryModule } from "./config/database"
import { SessionMiddleware } from './filter/session-middleware';
import { ArticleService } from './service/article-service';
import { ArticleManager } from './manager/article-manager';
import { CategoryManager } from './manager/category-manager';
import { CategoryService } from './service/category-service';
import { ImageStoreManager } from './manager/image-store-manager';
import { AppConfigModule } from "./config/app-config"

@Module({
  imports: [ DatabaseModule, RepositoryModule, AppConfigModule ],
  controllers: [AppController],
  providers: [
    UserService,
    ArticleService,
    CategoryService,
    CategoryManager,
    ArticleManager,
    UserManager,
    SessionManager,
    ImageStoreManager
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
