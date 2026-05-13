import { JwtService } from '@nestjs/jwt';

async function generate() {
  const jwtService = new JwtService({
    secret: process.env.JWT_SECRET,
  });

  const token = await jwtService.signAsync({
    sub: '123456',
    email: 'test@gmail.com',
    role: 'admin',
  });

  console.log(token);
}

generate();
