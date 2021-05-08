import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessionManager } from '../manager/session-manager';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
    constructor(private sessionManager : SessionManager){

    }
    async use(req: Request, res: Response, next: NextFunction) {

        const token = req.headers["auth-token"] as string;        
        const session = await this.sessionManager.getSessionFromToken(token);

        const isLogined = (token && session) ? true : false;
        (req as any).session = {isLogined,session};

        next();
    }
}