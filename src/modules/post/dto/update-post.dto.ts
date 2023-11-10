import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose()
  content?: string;
}
