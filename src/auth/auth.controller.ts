import {Controller, Param, Post} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {};
  
  @Post("/login/:code")
  async authorizeUser(@Param("code") code:string){
    return await this.authService.authorize(code);
  }
  
  
  @Post("/refresh/:refreshToken")
  async refresh(@Param("refreshToken") refreshToken:string){
    return await this.authService.refresh(refreshToken);
  }




}
