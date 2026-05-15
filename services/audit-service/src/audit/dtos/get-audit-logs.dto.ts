import { IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAuditLogsDto {
  @IsOptional()
  @IsString()
  userEmail?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  eventType?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  metadataOnly?: boolean;
}
