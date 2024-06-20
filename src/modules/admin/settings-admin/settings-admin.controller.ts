import { Controller, Post, Body, Get, Param, Query, Patch, ParseIntPipe } from '@nestjs/common';
import { SettingsAdminService } from './settings-admin.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateAdminDto } from './dto/CreateAdminDto';
import { CreateAdminResponseDto } from './dto/CreateAdminResponseDto';
import { CreateAdminAloneDto } from './dto/CreateAdminAloneDto';
import { QueryAdminDto } from './dto/QueryAdminDto';
import { ResponseFindAllAdminDto } from './dto/ResponseFindAllAdminDto';
import { UpdateAdminDto } from './dto/UpdateAdminDto';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { PermissionResponseDto } from './dto/PermissionResponseDto';
import { AdminPermission, User } from '@prisma/client';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import handleAccessControl from '@utils/HandleAccessControl';

@ApiTags('Configurações - Portal Gerencial')
@Controller('settings-admin')
export class SettingsAdminController {
  constructor(private readonly settingsAdminService: SettingsAdminService) {}

  @Post()
  @ApiOperation({
    summary: 'Rota para criar admins no portal gerencial.',
    security: [{ bearerAuth: [] }],
  })
  @ApiBody({ type: CreateAdminDto })
  @ApiCreatedResponse({ type: CreateAdminResponseDto })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiUnauthorizedResponse({ description: 'Token inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async create(@CurrentUser() user: User, @Body() payload: CreateAdminDto) {
    handleAccessControl.verifyAdminRole(user);

    await handleAccessControl.verifyPermission(user, 'Configuracoes');

    return this.settingsAdminService.create(payload);
  }

  @IsPublic()
  @Get('all-permissions')
  @ApiOperation({ summary: 'Rota que recupera todas as permissões.' })
  @ApiOkResponse({ type: [PermissionResponseDto] })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async findAllPermissions(): Promise<AdminPermission[]> {
    return this.settingsAdminService.findAllPermissions();
  }

  @Get()
  @ApiOperation({
    summary: 'Rota que lista todos os admins cadastrados.',
    security: [{ bearerAuth: [] }],
  })
  @ApiOkResponse({ type: ResponseFindAllAdminDto })
  @ApiUnauthorizedResponse({ description: 'Token inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async findAll(@CurrentUser() user: User, @Query() query: QueryAdminDto) {
    handleAccessControl.verifyAdminRole(user);

    await handleAccessControl.verifyPermission(user, 'Configuracoes');

    return this.settingsAdminService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Rota para recuperar um admin pelo seu id.',
    security: [{ bearerAuth: [] }],
  })
  @ApiOkResponse({ type: CreateAdminAloneDto })
  @ApiUnauthorizedResponse({ description: 'Acesso não autorizado.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async findById(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    handleAccessControl.verifyAdminRole(user);

    await handleAccessControl.verifyPermission(user, 'Configuracoes');

    return this.settingsAdminService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rota para editar admin pelo id.', security: [{ bearerAuth: [] }] })
  @ApiOkResponse({ type: CreateAdminAloneDto })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiUnauthorizedResponse({ description: 'Token inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateAdminDto) {
    return this.settingsAdminService.update(id, body);
  }
}
