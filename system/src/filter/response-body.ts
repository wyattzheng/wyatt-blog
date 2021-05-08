import { CallHandler, ExecutionContext, HttpStatus, NestInterceptor, Provider } from "@nestjs/common";

import { map } from "rxjs/operators";

export interface RestResponseBody{
    code : number,
    message : string,
    status : string,
    reason : any,
    data : any
}

export class ResponseBodyInterceptor implements NestInterceptor{
    async intercept(context: ExecutionContext, next: CallHandler<any>) {            

        const response = context.switchToHttp().getResponse();


        return next.handle().pipe(map((data)=>{
            const body : RestResponseBody = {
                code : response.statusCode,
                message : "API invoked successfully.",
                status: HttpStatus[response.statusCode],
                reason: null,
                data
            };
    
            return body;
        }));
    }

}