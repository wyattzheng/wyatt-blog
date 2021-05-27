import { Injectable } from '@nestjs/common';
import { LinksManager } from '../manager';
import { GetPictureColor } from '../utils/color';

@Injectable()
export class LinksService {
    constructor(
        private linksManager : LinksManager,
    
    ){ }

    async getAllLinks(){
        return this.linksManager.getAllLinks();
    }
    async addLink(name:string,avatar:string,url:string,description:string,theme_color?:string){

        if(!theme_color){
            const color = await GetPictureColor(avatar);
            theme_color = color.hex();
        }

        await this.linksManager.createLink(name,avatar,url,description,theme_color);
    }
    async removeLink(id:number){
        await this.linksManager.removeLink(id);
    }


}