import {Controller, Get, HttpCode, HttpStatus, Req, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import {Request} from "express";
import {DiscordAuthGuard} from "../auth/guards/auth.guard";
import {AccessToken} from "./decorators/access.token.decorator";
import {User} from "./decorators/user.decorator";
import {IUser} from "../discord-api/interfaces/IUser";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/@me")
  @HttpCode(HttpStatus.OK)
  @UseGuards(DiscordAuthGuard)
  async getMe(@AccessToken() accessToken:string){
    return await this.userService.getMe(accessToken);
  }

  @Get("/@me/guilds")
  @HttpCode(HttpStatus.OK)
  @UseGuards(DiscordAuthGuard)
  async getMyGuilds(@AccessToken() accessToken:string, @User() user:IUser){
    return await this.userService.getMyGuilds(user.id, accessToken);
  }
}
