import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { IsNull } from 'typeorm';

export class PaginationDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Max(200)
  @Expose()
  limit: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Expose()
  page: number;
}
