import {Controller, HttpCode, HttpStatus, Param, Post} from '@nestjs/common';
import { AuthService } from './auth.service';

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
}
