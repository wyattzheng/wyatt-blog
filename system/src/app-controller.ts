import { BadRequestException, Body, Controller, Delete, Get, Optional, Post, Put, Query, Session, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { IsBooleanString, IsNumber, IsNumberString, IsString } from 'class-validator';
import { MustAdminGuard } from './filter/admin-guard';
import { ArticleService } from './service/article-service';
import { CategoryService } from './service/category-service';
import { UserService } from './service/user-service';
import { FileInterceptor } from "@nestjs/platform-express"
import { ImageStoreManager } from './manager/image-store-manager';

export class UserPassDTO{
  @IsString()
  username:string;

  @IsString()
  password:string;
}

export class CreateArticleDTO{

  @IsString()
  title:string;

  @IsNumber()
  category_id:number;

  @IsString()
  shortbody:string;

  @IsString()
  content:string;

}

export class GetArticleListDTO{
  @IsNumberString()
  page : string;

  @IsNumberString()
  count : string;
}

export class ModifyArticleDTO{
  
  @IsString()
  title:string;

  @IsNumber()
  category_id:number;

  @IsString()
  shortbody:string;

  @IsString()
  content:string;

  @IsNumber()
  article_id : number;

}

export class GetArticleDTO{

  @IsNumberString()
  article_id:string;

  @IsBooleanString()
  render:string;
}

export class GetUserInfoDTO{
  @Optional()
  username:string;

  @Optional()
  userid:string
}

export class CreateCategoryDTO{
  @IsString()
  name:string;  

  @IsString()
  description:string;
}
export class RemoveCategoryDTO{
  @IsNumber()
  category_id:number;

}

export class ModifyCategoryDTO{
  @IsNumber()
  category_id:number;

  @IsString()
  name:string;  

  @IsString()
  description:string;
}

export class RemoveArticleDTO{
  @IsNumber()
  article_id:number;
}

export class GetImageDataURLDTO{
  @IsString()
  file_name:string;
}

export class CreateImageDTO{
  @IsString()
  raw_file_name:string;
}

@Controller()
export class AppController {
  constructor(
      private userService : UserService,
      private articleService : ArticleService,
      private categoryService : CategoryService,
      private imageStoreManager : ImageStoreManager
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
    return this.articleService.modifyArticle(modify_info.article_id,modify_info.title,modify_info.shortbody,modify_info.content,modify_info.category_id);
  }

  @UseGuards(MustAdminGuard)
  @Post("/v1/article")
  createArticle(@Body() create_info : CreateArticleDTO,@Session() { session }){
    return this.articleService.createArticle(session.userId,create_info.title,create_info.shortbody,create_info.content,create_info.category_id);
  }
  @Get("/v1/article")
  getArticle(@Query() get_info: GetArticleDTO){    
    const render = get_info.render == "true";
    return this.articleService.getArticle(parseInt(get_info.article_id),render);
  }

  @UseGuards(MustAdminGuard)
  @Delete("/v1/article")
  removeArticle(@Body() remove_info: RemoveArticleDTO){    
    return this.articleService.removeArticle(remove_info.article_id);
  }

  @Get("/v1/article/list")
  getArticleLatestList(@Query() query:GetArticleListDTO){

    return this.articleService.getLatestList(parseInt(query.page),parseInt(query.count));
  }

  @Get("/v1/category/list")
  getAllCategories(){
    return this.categoryService.getAllCategories();
  }

  @UseGuards(MustAdminGuard)
  @Post("/v1/category")
  createCategory(@Body() create_info : CreateCategoryDTO){
    return this.categoryService.createCategory(create_info.name,create_info.description);
  }

  @UseGuards(MustAdminGuard)
  @Delete("/v1/category")
  removeCategory(@Body() remove_info : RemoveCategoryDTO){
    return this.categoryService.removeCategory(remove_info.category_id);
  }

  @UseGuards(MustAdminGuard)
  @Put("/v1/category")
  modifyCategory(@Body() modify_info : ModifyCategoryDTO){
    return this.categoryService.modifyCategory(modify_info.category_id,modify_info.name,modify_info.description);
  }


  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(MustAdminGuard)
  @Post("/v1/image")
  createImage(@Body() create_info : CreateImageDTO,@UploadedFile() file:Express.Multer.File){
    
    return this.imageStoreManager.createImageFile(create_info.raw_file_name,file.buffer);

  }

  @Get("/v1/image/dataurl")
  getImageDataURL(@Query() get_info:GetImageDataURLDTO){
    return this.imageStoreManager.getImageDataURL(get_info.file_name);
  }


}
