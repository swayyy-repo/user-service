import { Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { UniqueConstraintError } from 'sequelize';

@Catch(UniqueConstraintError)
export class UniqueConstraintExceptionFilter extends BaseExceptionFilter {
  catch(exception: UniqueConstraintError, host: ArgumentsHost) {
    const message = this.extractUniqueConstraintErrorMessage(exception);

    // Create a custom BadRequestException with the extracted message.
    const errorResponse = new BadRequestException(message);

    super.catch(errorResponse, host);
  }

  private extractUniqueConstraintErrorMessage(
    exception: UniqueConstraintError,
  ): string {
    return `A record with a similar ${Object.keys(exception.fields).join(
      ',',
    )} value already exists.`;
  }
}
