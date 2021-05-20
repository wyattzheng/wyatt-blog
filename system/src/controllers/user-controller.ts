import { BadRequestException, Body, Controller, Get, Optional, Param, Post, Query } from "@nestjs/common";
import { IsIn, IsString } from "class-validator";
import { UserService } from "../service/user-service";

export class AuthInfoDTO {
    @IsString()
    username: string;

    @IsString()
    password: string;
}

export class GetUserInfoDTO {
    @IsIn(["userid","username"])
    type: string;
}

@Controller()
export class UserController {
    constructor(
        private userService: UserService,
    ) { }

    @Post("/v1/sessions")
    createLoginSession(@Body() auth_info: AuthInfoDTO) {
        return this.userService.login(auth_info.username, auth_info.password);
    }

    @Post("/v1/user/admin")
    createAdminUser(@Body() auth_info: AuthInfoDTO) {
        return this.userService.createAdminUser(auth_info.username, auth_info.password);
    }

    @Get("/v1/users/:unique")
    getUserInfo(@Param("unique") unique:string,@Query() get_user_info: GetUserInfoDTO) {
        if(get_user_info.type == "userid"){
            return this.userService.getUserInfoByUserId(parseInt(unique));
        }else if(get_user_info.type == "username"){
            return this.userService.getUserInfoByUsername(unique);
        }else
            throw new BadRequestException();
    }

}