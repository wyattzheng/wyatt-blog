import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../domain/category';
import { CategoryManager } from "../manager/category-manager";

@Injectable()
export class CategoryService {
    constructor(
        private categoryManager : CategoryManager,
        @InjectRepository(Category) private categoryList : Repository<Category>
    
    ){ }
    getAllCategories(){
        return this.categoryManager.getAllCategories();
    }
    createCategory(name:string,description:string){
        return this.categoryManager.createCategory(name,description);
    }
    async modifyCategory(categoryId:number,name:string,description:string){
        return await this.categoryManager.modifyCategory(categoryId,name,description);

    }
    async removeCategory(categoryId:number){
        return this.categoryManager.removeCategory(categoryId);
    }

}