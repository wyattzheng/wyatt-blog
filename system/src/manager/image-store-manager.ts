import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Crypto from "crypto";
import * as Path from "path";
import * as FileSystem from "fs/promises"

@Injectable()
export class ImageStoreManager {
    private dir : string;
    constructor(
        private configService : ConfigService,

    ){ 
        this.dir = this.configService.get("IMAGESTORE.DIR");
        
    }
    private getFilePath(path:string){
        return Path.resolve(this.dir,path);
    }
    async createImageFile(file_name:string,image_buffer:Buffer){
        const hex = Crypto.createHash("md5").update(image_buffer).digest("hex");

        const new_file_name = `${hex}${Path.extname(file_name)}`.toLowerCase();
        await FileSystem.writeFile(this.getFilePath(new_file_name),image_buffer);

        return {hex,file_name,new_file_name,size:image_buffer.length};
    }
    async getImageDataURL(file_name:string){
        const path = this.getFilePath(file_name);
        const buffer = await FileSystem.readFile(path);
        return {dataurl:`data:image/png;base64,${buffer.toString("base64")}`};
    }

}