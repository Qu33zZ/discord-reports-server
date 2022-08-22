import {Controller, HttpCode, HttpStatus, Param, Post, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AccessToken} from "./decorators/access.token.decorator";
import {DiscordAuthGuard} from "./guards/auth.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {};
  
  @Post("/login/:code")
  @HttpCode(HttpStatus.OK)
  async authorizeUser(@Param("code") code:string){
    return await this.authService.authorize(code);
  }

  @Post("/refresh/:refreshToken")
  @HttpCode(HttpStatus.OK)
  async refresh(@Param("refreshToken") refreshToken:string){
    return await this.authService.refresh(refreshToken);
  }

  @Post("/logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(DiscordAuthGuard)
  async logout(@AccessToken() accessToken:string){
    return await this.authService.logout(accessToken);
  }
}
