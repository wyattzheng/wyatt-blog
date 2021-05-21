import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '../domain/link';


@Injectable()
export class LinksManager {
    constructor(
        @InjectRepository(Link) private linkList : Repository<Link>
    ){ }
    
    async getAllLinks(){
        return this.linkList.find();
    }
    async createLink(name:string,avatar:string,url:string,description:string,color:string){
        const link = new Link();
        link.name = name;
        link.url = url;
        link.description = description;
        link.avatar = avatar;
        link.color = color;

        await this.linkList.save(link);
    }
    async removeLink(id:number){
        const link = await this.linkList.findOneOrFail(id);
        await this.linkList.softRemove(link);
    }

}