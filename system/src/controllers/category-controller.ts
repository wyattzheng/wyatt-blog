import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { IsNumber, IsString } from "class-validator";
import { MustAdminGuard } from "../filter/admin-guard";
import { CategoryService } from "../service/category-service";

export class CreateCategoryDTO {
    @IsString()
    name: string;

    @IsString()
    description: string;
}

export class ModifyCategoryDTO {
    @IsString()
    name: string;

    @IsString()
    description: string;
}

@Controller()
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
    ) { }


    @Get("/v1/categories")
    getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @UseGuards(MustAdminGuard)
    @Post("/v1/categories")
    createCategory(@Body() create_info: CreateCategoryDTO) {
        return this.categoryService.createCategory(create_info.name, create_info.description);
    }

    @UseGuards(MustAdminGuard)
    @Delete("/v1/categories/:id")
    removeCategory(@Param("id") id: string) {
        return this.categoryService.removeCategory(parseInt(id));
    }

    @UseGuards(MustAdminGuard)
    @Put("/v1/categories/:id")
    modifyCategory(@Param("id") id: string,@Body() modify_info: ModifyCategoryDTO) {
        return this.categoryService.modifyCategory(parseInt(id), modify_info.name, modify_info.description);
    }


}