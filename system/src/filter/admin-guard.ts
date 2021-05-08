import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoleType } from '../domain/user';

@Injectable()
export class MustAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return req.session.isLogined && req.session.session.role == RoleType.ADMIN;
  }
}