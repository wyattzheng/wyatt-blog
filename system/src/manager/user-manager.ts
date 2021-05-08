import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleType, User } from '../domain/user';
import { HexSha1 } from '../utils';


@Injectable()
export class UserManager {
    constructor(
        @InjectRepository(User) private userList : Repository<User>
    ){ }

    async isPasswordCorrect(user: User, password: string){
        const isCorrect = HexSha1(password) == user.password;
        return isCorrect;
    }
    createUser(user : User){
        return this.userList.save(user);
    }
    getAdminUser(){
        return this.userList.findOne({ role : RoleType.ADMIN });
    }
    getUserFromUsernameOrFail(username:string){
        return this.userList.findOneOrFail({ username });
    }
    getUserOrFail(userId : number,withDeleted : boolean = false){
        return this.userList.findOneOrFail(userId,{withDeleted});
    }
}