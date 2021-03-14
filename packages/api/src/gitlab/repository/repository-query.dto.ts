import { IsOptional } from 'class-validator';
import { QueryDto } from '../../common/query-dto';

export class RepositoryQueryDto extends QueryDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  sortKey?: string;

  @IsOptional()
  order?: 'ASC' | 'DESC';
}
