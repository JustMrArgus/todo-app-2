import { IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateTodoDto {
  @IsEnum(Status, { message: 'Invalid status value' })
  status: Status;
}
