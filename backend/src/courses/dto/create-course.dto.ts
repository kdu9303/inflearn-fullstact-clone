import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: '코스 제목' })
  @IsString()
  title!: string;

  @ApiProperty({ description: '코스 슬러그(URL에 사용됨)' })
  @IsString()
  slug!: string;

  @ApiPropertyOptional({ description: '코스 1~2줄 짧은 설명' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional({ description: '코스 상세페이지 설명' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '썸네일 이미지 URL' })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ description: '코스 가격', default: 0 })
  @IsInt()
  price!: number;

  @ApiPropertyOptional({ description: '코스 할인 가격' })
  @IsInt()
  @IsOptional()
  discountPrice?: number;

  @ApiPropertyOptional({ description: '코스 난이도', default: 'BEGINEER' })
  @IsString()
  @IsOptional()
  level?: string;

  @ApiPropertyOptional({ description: '코스 상태', default: 'DRAFT' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: '코스 카테고리 ID 목록' })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  categoryIds?: string[];
}
