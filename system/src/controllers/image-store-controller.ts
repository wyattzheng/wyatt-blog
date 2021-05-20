import { BadRequestException, Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { IsIn, IsString } from "class-validator";
import { MustAdminGuard } from "../filter/admin-guard";
import { ImageStoreManager } from "../manager/image-store-manager";


export class GetImageDataURLDTO {

  @IsIn(["dataurl"])
  format : string;
}

export class CreateImageDTO {
  @IsString()
  raw_file_name: string;
}


@Controller()
export class ImageStoreController {
  constructor(
    private imageStoreManager: ImageStoreManager
  ) { }


  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(MustAdminGuard)
  @Post("/v1/images")
  createImage(@Body() create_info: CreateImageDTO, @UploadedFile() file: Express.Multer.File) {
    return this.imageStoreManager.createImageFile(create_info.raw_file_name, file.buffer);

  }

  @Get("/v1/images/:filename")
  getImageDataURL(@Param("filename") file_name:string ,@Query() get_info: GetImageDataURLDTO) {
    if(get_info.format == "dataurl")
      return this.imageStoreManager.getImageDataURL(file_name);
    else
      throw new BadRequestException(`不支持该格式 ${get_info.format}`);

  }

}