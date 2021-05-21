import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { IsString } from "class-validator";
import { LinksService } from "../service/links-service";


class CreateLinkDTO{

    @IsString()
    name : string;

    @IsString()
    avatar : string;

    @IsString()
    url : string;

    @IsString()
    description : string;
    
}

@Controller()
export class LinksController {
    constructor(
        private linksService: LinksService
    ) { }

    @Get("/v1/links")
    getAllLinks(){
        return this.linksService.getAllLinks();
    }

    @Post("/v1/links")
    addLink(@Body() create_info : CreateLinkDTO){
        return this.linksService.addLink(create_info.name,create_info.avatar,create_info.url,create_info.description);
    }
    @Delete("/v1/links/:id")
    removeLink(@Param("id") id:string){
        return this.linksService.removeLink(parseInt(id));
    }

}