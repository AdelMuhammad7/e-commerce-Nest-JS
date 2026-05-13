import { Reflector } from '@nestjs/core';
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export const Roles = Reflector.createDecorator<UserRole[]>();
