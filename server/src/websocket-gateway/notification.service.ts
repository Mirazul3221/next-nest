import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notification.gateway';


@Injectable()
export class NotifService {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  notifyUser(userId: string, message: string) {
    this.notificationsGateway.sendNotification(userId, message);
  }
}
