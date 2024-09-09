import { Module } from "@nestjs/common";
import { NotificationsGateway } from "./notification.gateway";
import { AuthModule } from "src/auth/auth.module";
import { NotificationModule } from "src/notification/notification.module";
import { FriendRequestModule } from "src/friend-request/friend-request.module";

@Module({
    imports:[AuthModule,NotificationModule,FriendRequestModule],
    providers:[
        NotificationsGateway
    ]
})
export class GatewayModule{}