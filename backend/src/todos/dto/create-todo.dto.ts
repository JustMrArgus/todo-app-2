import { IsNotEmpty, IsInt, Min, MaxLength, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateTodoDto {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @MaxLength(100, { message: 'Name is too long (max 100 characters)' })
  name: string;

  @IsInt({ message: 'Category ID must be an integer' })
  @Min(1, { message: 'Category ID must be greater than 0' })
  categoryId: number;

  @IsEnum(Status, { message: 'Invalid status value' })
  status: Status;
}
