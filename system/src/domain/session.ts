import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoleType } from "./user";

@Entity()
export class Session{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    userId : number;

    @Column()
    role : RoleType;

    @Column({type:"varchar",length:64})
    token : string;

    @CreateDateColumn()
    createdAt : Date;

    @DeleteDateColumn()
    deletedAt : Date;
}