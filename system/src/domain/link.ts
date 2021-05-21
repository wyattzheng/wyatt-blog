import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * 友情链接
 */
@Entity()
export class Link{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"varchar",length:64})
    name: string;

    @Column("text")
    description:string

    @Column("text")
    url: string;

    @Column("text")
    avatar: string;

    @Column({type:"varchar",length:64})
    color:string;

    @CreateDateColumn({type:"timestamp"})
    createdAt : Date;

    @DeleteDateColumn({type:"timestamp"})
    deletedAt : Date;
}