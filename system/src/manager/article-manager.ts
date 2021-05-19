import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Article } from '../domain/article';


@Injectable()
export class ArticleManager {
    constructor(
        @InjectRepository(Article) private articleList : Repository<Article>
    ){ }

    getLatestList(start:number,length:number,privacy:boolean = false){
        
        const condition : FindManyOptions<Article> = {
            skip:start,
            take:length,
            order:{createdAt:"DESC"}
        };

        if(privacy == true){
            condition.where = { };
        }else{
            condition.where = { privacy : false };
        }
        return this.articleList.findAndCount(condition);
    }
    getArticleOrFail(articleId : number){
        return this.articleList.findOneOrFail(articleId);
    }
    saveArticle(article:Article){
        return this.articleList.save(article);
    }
    
    async removeArticle(article : Article){
        return this.articleList.softRemove(article);
    }

}