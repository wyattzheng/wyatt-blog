import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../domain/session';
import { Repository } from 'typeorm';
import { generateUuidToken } from '../utils';
import { User } from '../domain/user';

@Injectable()
export class SessionManager {
    constructor(
        @InjectRepository(Session) private sessionList : Repository<Session>
    ){ }

    async createSession(user:User){
        const session = await this.getSessionFromUser(user.id);
        if(session)
            await this.closeSession(session.id);
        
        const newSession = new Session();
        newSession.token = generateUuidToken();
        newSession.userId = user.id;
        newSession.role = user.role;

        return this.sessionList.save(newSession);
    }
    async closeSession(sessionId:number){
        const session = await this.getSessionOrFail(sessionId);
        return this.sessionList.softRemove(session);
    }
    async getSessionOrFail(sessionId : number){
        return this.sessionList.findOneOrFail(sessionId);
    }
    getSessionFromUser(userId : number){
        return this.sessionList.findOne({ userId });
    }
    getSessionFromToken(token:string){
        return this.sessionList.findOne({ token });
    }

}