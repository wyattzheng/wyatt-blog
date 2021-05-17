import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Article{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    userId : number;

    @Column()
    categoryId:number;

    @Column("text")
    title : string;

    @Column("text")
    shortbody : string;

    @Column("text")
    content : string;

    @CreateDateColumn({type:"timestamp"})
    createdAt : Date;

    @DeleteDateColumn({type:"timestamp"})
    deletedAt : Date;

    @UpdateDateColumn({type:"timestamp"})
    updateAt : Date;
}