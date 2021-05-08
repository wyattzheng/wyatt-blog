import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum RoleType{
    SIMPLE_USER = "SIMPLE_USER",
    ADMIN = "ADMIN",
}

export interface UserInfo{
    id:number,
    username:string,
    role:RoleType,
    nickname:string
}

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type:"varchar",length:32})
    username : string;

    @Column({type:"varchar",length:32})
    role : RoleType;

    /**
     * SHA1摘要
     */
    @Column({type:"varchar",length:64})
    password : string;

    @Column({type:"varchar",length:64})
    nickname : string;

    @CreateDateColumn()
    createdAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;

}