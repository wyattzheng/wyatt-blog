import { BadRequestException, Body, Controller, Get, Optional, Post, Put, Query, Session, UseGuards } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsNumberString, IsString } from 'class-validator';
import { MustAdminGuard } from './filter/admin-guard';
import { ArticleService } from './service/article-service';
import { UserService } from './service/user-service';

export class UserPassDTO{
  @IsNotEmpty()
  username:string;

  @IsNotEmpty()
  password:string;
}

export class CreateArticleDTO{

  @IsNotEmpty()
  @IsString()
  title:string;

  @IsNotEmpty()
  @IsString()
  content:string;

}

export class GetArticleListDTO{
  @IsNotEmpty()
  @IsNumberString()
  page : string;

  @IsNotEmpty()
  @IsNumberString()
  count : string;
}

export class ModifyArticleDTO{
  
  @IsNotEmpty()
  @IsString()
  title:string;

  @IsNotEmpty()
  @IsString()
  content:string;

  @IsNotEmpty()
  @IsNumber()
  articleId : number;

}

export class GetArticleDTO{
  @IsNotEmpty()
  @IsNumberString()
  articleid:string;
}

export class GetUserInfoDTO{
  @Optional()
  username:string;

  @Optional()
  userid:string
}

@Controller()
export class AppController {
  constructor(
      private userService : UserService,
      private articleService : ArticleService,
      
    ) {}

  @Post("/v1/session")
  createLoginSession(@Body() userpass : UserPassDTO) {
    return this.userService.login(userpass.username,userpass.password);
  }

  @Post("/v1/user/admin")
  createAdminUser(@Body() userpass : UserPassDTO){
    return this.userService.createAdminUser(userpass.username,userpass.password);
  }
  @Get("/v1/user")
  getUserInfo(@Query() get_user_info : GetUserInfoDTO){
    if(get_user_info.userid)
      return this.userService.getUserInfoByUserId(parseInt(get_user_info.userid));
    else if(get_user_info.username)
      return this.userService.getUserInfoByUsername(get_user_info.username);
    else
      throw new BadRequestException();

  }

  @UseGuards(MustAdminGuard)
  @Put("/v1/article")
  modifyArticle(@Body() modify_info : ModifyArticleDTO){
    return this.articleService.modifyArticle(modify_info.articleId,modify_info.title,modify_info.content);
  }

  @UseGuards(MustAdminGuard)
  @Post("/v1/article")
  createArticle(@Body() create_info : CreateArticleDTO,@Session() { session }){
    return this.articleService.createArticle(session.userId,create_info.title,create_info.content);
  }
  @Get("/v1/article")
  getArticle(@Query() get_info: GetArticleDTO){    
    return this.articleService.getArticleOrFail(parseInt(get_info.articleid));
  }

  @Get("/v1/article/list")
  getArticleLatestList(@Query() query:GetArticleListDTO){

    return this.articleService.getLatestList(parseInt(query.page),parseInt(query.count));
  }

}
