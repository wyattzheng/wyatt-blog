import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RoleType, User, UserInfo } from '../domain/user';
import { SessionManager } from '../manager/session-manager';
import { UserManager } from '../manager/user-manager';
import { HexSha1 } from '../utils';

@Injectable()
export class UserService {
    constructor(
        private sessionManager : SessionManager,
        private userManager : UserManager,
        
    ){ }

    async login(username:string,password:string){
        const user = await this.userManager.getUserFromUsernameOrFail(username);
        const password_correct = await this.userManager.isPasswordCorrect(user,password);
        if(password_correct == false)
            throw new ForbiddenException(`提供的登录密码错误`);

        const session = await this.sessionManager.createSession(user);
        return session;
    }

    /**
     * 管理员账户只能创建一次
     * 
     * 第二次发生的创建会被拒绝
     */
    async createAdminUser(username:string,password:string){
        const admin = await this.userManager.getAdminUser();
        if(admin)
            throw new ConflictException(`管理员用户已存在, 无法重复创建`);

        const user = new User();
        user.nickname = "管理员";
        user.username = username;
        user.password = HexSha1(password);        
        user.role = RoleType.ADMIN;

        return this.userManager.createUser(user);
    }

    async getUserInfoByUsername(username:string) : Promise<UserInfo>{
        const user = await this.userManager.getUserFromUsernameOrFail(username);
        return {
            id:user.id,
            username:user.username,
            nickname:user.nickname,
            role:user.role
        }
    }
    async getUserInfoByUserId(userid:number) : Promise<UserInfo>{
        const user = await this.userManager.getUserOrFail(userid);
        return {
            id:user.id,
            username:user.username,
            nickname:user.nickname,
            role:user.role
        }
    }
}