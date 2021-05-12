import { Injectable } from '@nestjs/common';
import { Article,SimpifiedArticle } from '../domain/article';
import { ArticleManager } from '../manager/article-manager';
import { CategoryManager } from '../manager/category-manager';
import { ImageStoreManager } from '../manager/image-store-manager';
import { UserManager } from '../manager/user-manager';
import { getPageCount } from '../utils';
import { WCompileMarkdown } from "../markdown/index"

@Injectable()
export class ArticleService {
    constructor(
        private articleManager : ArticleManager,
        private userManager : UserManager,
        private categoryManager:CategoryManager,
        private imageStoreManager : ImageStoreManager
    
    ){ }
    private async getSimpifiedArticle(article:Article):Promise<SimpifiedArticle>{
        const user = await this.userManager.getUserOrFail(article.userId,true);
        const categoryName = await this.categoryManager.getDisplayName(article.categoryId);
        const rendered_shortbody = await this.getRenderedArticleContent(article.shortbody);
        return {
            articleId:article.id,
            title:article.title,
            categoryName,
            shortbody:rendered_shortbody.toString(),
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
    async getArticle(articleId:number,render:boolean){
        const article = await this.articleManager.getArticleOrFail(articleId);
        const processed_content =
            render ?
                (await this.getRenderedArticleContent(article.content)).toString() :
                article.content;

        return {
            id:article.id,
            title:article.title,
            userId:article.userId,
            categoryId : article.categoryId,
            content : processed_content,
            createdAt : article.createdAt,
            updatedAt : article.updateAt,
            shortbody: article.shortbody
        }

    }
    private async getRenderedArticleContent(article_content:string){
        return WCompileMarkdown(article_content,(img_url:string)=>{
            return this.imageStoreManager.getImageDataURL(img_url);
        });
    }

}