import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  content: string;
}
