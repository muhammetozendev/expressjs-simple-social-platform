import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  content: string;

  @IsNumber()
  @Expose()
  postId: number;
}
