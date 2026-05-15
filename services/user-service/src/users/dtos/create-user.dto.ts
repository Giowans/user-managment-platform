import { IsString, IsEmail, IsArray, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles?: string[];
}