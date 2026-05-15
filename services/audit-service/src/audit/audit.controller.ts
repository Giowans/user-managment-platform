import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { GetAuditLogsDto } from './dtos/get-audit-logs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'auditor', 'monitor')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(@Query() filters: GetAuditLogsDto) {
    return this.auditService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }
}
