import { PartialType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  // @ApiProperty({ description: '코스 슬러그(URL에 사용됨)' })
  // @IsString()
  // slug!: string;

  @ApiPropertyOptional({ description: '코스 1~2줄 짧은 설명', required: false })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional({ description: '코스 상세페이지 설명', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '썸네일 이미지 URL', required: false })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({ description: '코스 가격', default: 0, required: false })
  @IsInt()
  price!: number;

  @ApiPropertyOptional({ description: '코스 할인 가격', required: false })
  @IsInt()
  @IsOptional()
  discountPrice?: number;

  @ApiPropertyOptional({
    description: '코스 난이도',
    default: 'BEGINEER',
    required: false,
  })
  @IsString()
  @IsOptional()
  level?: string;

  @ApiPropertyOptional({
    description: '코스 상태',
    default: 'DRAFT',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: '코스 카테고리 ID 목록',
    required: false,
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  categoryIds?: string[];
}
