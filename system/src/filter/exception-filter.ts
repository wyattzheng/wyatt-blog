  
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus
} from '@nestjs/common';

import { RestResponseBody } from "./response-body";
import { Logger } from '@nestjs/common';

@Catch()
export class RestExceptionsFilter implements ExceptionFilter{
    private logger = new Logger(RestExceptionsFilter.name);
    
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        
        if(!(exception instanceof HttpException)){
            const error : Error = exception;
            exception = new HttpException({message : error.message},HttpStatus.INTERNAL_SERVER_ERROR);
        }

        
        const reason = exception.getResponse().reason || null;

        const body : RestResponseBody = {
            code : exception.getStatus(),
            status : HttpStatus[exception.getStatus()],
            message : exception.message,
            reason : reason,
            data: null
        };
 
        
        this.logger.log(`请求发生错误, 请求地址:${request.url}, 请求方式:${request.method}, 请求内容:${JSON.stringify(request.body)} 响应正文: ${JSON.stringify(body)}`);
        
        response.status(exception.getStatus()).json(body);

    }

}