import { Body, Controller, Delete, Get, Param, Post, Put, Query, Session, UseGuards } from "@nestjs/common";
import { IsBoolean, IsBooleanString, IsNumber, IsNumberString, IsString } from "class-validator";
import { RoleType } from "../domain/user";
import { MustAdminGuard } from "../filter/admin-guard";
import { ArticleService } from "../service/article-service";

export class CreateArticleDTO {

    @IsString()
    title: string;

    @IsNumber()
    category_id: number;

    @IsString()
    shortbody: string;

    @IsString()
    content: string;

    @IsBoolean()
    privacy: boolean;

}

export class GetArticleListDTO {
    @IsNumberString()
    page: string;

    @IsNumberString()
    count: string;
}

export class ModifyArticleDTO {

    @IsString()
    title: string;

    @IsNumber()
    category_id: number;

    @IsString()
    shortbody: string;

    @IsString()
    content: string;

    @IsBoolean()
    privacy: boolean;

}

export class GetArticleDTO {
    @IsBooleanString()
    render: string;
}


@Controller()
export class ArticleController {
    constructor(
        private articleService: ArticleService,
    ) { }


    @UseGuards(MustAdminGuard)
    @Put("/v1/articles/:id")
    modifyArticle(@Param("id") id:string, @Body() modify_info: ModifyArticleDTO) {
        return this.articleService.modifyArticle(parseInt(id), modify_info.title, modify_info.shortbody, modify_info.content, modify_info.category_id, modify_info.privacy);
    }

    @UseGuards(MustAdminGuard)
    @Post("/v1/articles")
    createArticle(@Body() create_info: CreateArticleDTO, @Session() { session }) {
        return this.articleService.createArticle(session.userId, create_info.title, create_info.shortbody, create_info.content, create_info.category_id, create_info.privacy);
    }

    @Get("/v1/articles/:id")
    getArticle(@Param("id") id:string, @Query() get_info: GetArticleDTO) {
        const render = get_info.render == "true";
        return this.articleService.getArticle(parseInt(id), render);
    }

    @UseGuards(MustAdminGuard)
    @Delete("/v1/articles/:id")
    removeArticle(@Param("id") id:string) {
        return this.articleService.removeArticle(parseInt(id));
    }

    @Get("/v1/articles")
    getArticleLatestList(@Query() query: GetArticleListDTO, @Session() session) {
        const show_privacy = session.isLogined && session.session.role == RoleType.ADMIN;

        return this.articleService.getLatestList(parseInt(query.page), parseInt(query.count), show_privacy);
    }
}
