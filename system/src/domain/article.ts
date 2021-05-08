import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export interface SimpifiedArticle{
    articleId:number,
    title:string,
    shortbody:string,
    nickname:string,
    createdTime:Date
}


@Entity()
export class Article{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    userId : number;

    @Column("text")
    title : string;

    @Column("text")
    shortbody : string;

    @Column("text")
    content : string;

    @CreateDateColumn()
    createdAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;

    @UpdateDateColumn()
    updateAt : Date;
}