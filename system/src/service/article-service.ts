import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article,SimpifiedArticle } from '../domain/article';
import { Category } from '../domain/category';
import { ArticleManager } from '../manager/article-manager';
import { CategoryManager } from '../manager/category-manager';
import { UserManager } from '../manager/user-manager';
import { getPageCount } from '../utils';

@Injectable()
export class ArticleService {
    constructor(
        private articleManager : ArticleManager,
        private userManager : UserManager,
        private categoryManager:CategoryManager
    
    ){ }
    private async getSimpifiedArticle(article:Article):Promise<SimpifiedArticle>{
        const user = await this.userManager.getUserOrFail(article.userId,true);
        const categoryName = await this.categoryManager.getDisplayName(article.categoryId);
        return {
            articleId:article.id,
            title:article.title,
            categoryName,
            shortbody:article.shortbody,
            nickname:user.nickname,
            createdTime:article.createdAt
        }
    }

    async getLatestList(page:number = 0,page_count:number = 10){
        const [articles,count] = await this.articleManager.getLatestList(page * page_count,page_count);

        const pages = getPageCount(count,page_count);

        const list = [];
        for(const article of articles){
            list.push(await this.getSimpifiedArticle(article));
        }

        return {
            count,
            cur_page:page,
            pages,
            list
        };

    }
    async createArticle(userId:number,title:string,shortbody:string,content:string,categoryId:number){
        const article = new Article();
        article.userId = userId;
        article.title = title;
        article.shortbody = shortbody;
        article.content = content;
        article.categoryId = categoryId;

        return this.articleManager.saveArticle(article);
    }
    async modifyArticle(articleId:number,title:string,shortbody:string,content:string,categoryId:number){
        const article = await this.articleManager.getArticleOrFail(articleId);
        article.title = title;
        article.shortbody = shortbody;
        article.content = content;
        article.categoryId = categoryId;

        return this.articleManager.saveArticle(article);
    }

    async removeArticle(articleId:number){
        const article = await this.articleManager.getArticleOrFail(articleId);
        return this.articleManager.removeArticle(article);
    }

    async getArticleOrFail(articleId:number){
        return this.articleManager.getArticleOrFail(articleId);
    }

}