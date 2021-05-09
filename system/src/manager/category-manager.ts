import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../domain/category';

@Injectable()
export class CategoryManager {
    constructor(
        @InjectRepository(Category) private categoryList : Repository<Category>
    ){ }

    async getDisplayName(categoryId:number){
        try{
            const category = await this.categoryList.findOneOrFail(categoryId,{withDeleted:true});
            return category.name;
        }catch(err){
            return "未分类";
        }
    }
    getAllCategories(){
        return this.categoryList.find({});
    }
    createCategory(name:string,description:string){
        const category = new Category();
        category.name = name;
        category.description = description;

        return this.categoryList.save(category);
    }
    async modifyCategory(categoryId:number,name:string,description:string){
        const category = await this.categoryList.findOneOrFail(categoryId);

        category.name = name;
        category.description = description;

        return this.categoryList.save(category);
    }
    async removeCategory(categoryId:number){
        const category = await this.categoryList.findOneOrFail(categoryId);
        return this.categoryList.softRemove(category);
    }
    

}