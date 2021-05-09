import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../domain/article';
import { Category } from '../domain/category';


@Injectable()
export class ArticleManager {
    constructor(
        @InjectRepository(Article) private articleList : Repository<Article>
    ){ }

    getLatestList(start:number,length:number){
        return this.articleList.findAndCount({
            skip:start,
            take:length,
            order:{createdAt:"DESC"}
        });
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