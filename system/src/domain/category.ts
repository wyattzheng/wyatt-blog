import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * 文章的类别
 */
@Entity()
export class Category{
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type:"varchar",length:64})
    name: string;

    @Column("text")
    description:string

    @CreateDateColumn({type:"timestamp"})
    createdAt : Date;

    @DeleteDateColumn({type:"timestamp"})
    deletedAt : Date;
}