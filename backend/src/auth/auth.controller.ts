import { Body, Controller, Get, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly prisma: PrismaService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe())
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  // 👇 AGREGÁ ESTE ENDPOINT TEMPORAL 👇
  @Get('setup-admin')
  async setupAdmin() {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // OJO: Revisá si tu modelo se llama userAdmin, adminUser o UserAdmin en tu schema.prisma
    await this.prisma.adminUser.upsert({
      where: { email: 'admin@admin.com' },
      update: {},
      create: {
        email: 'admin@admin.com',
        password: hashedPassword,
      },
    });

    return { 
      mensaje: '✅ Administrador creado con éxito. Ya podés ir al panel de Next.js',
      email: 'admin@admin.com',
      password: '123456'
    };
  }

}