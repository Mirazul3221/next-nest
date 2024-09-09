import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { FriendRequestService } from 'src/friend-request/friend-request.service';
import { NotificationService } from 'src/notification/notification.service';

////////////////////////////Socket server init/////////////////////////////////
@WebSocketGateway({
  cors: {
    allowedHeaders:"*",
    origin: "*", // Adjust this to match your needs
    methods: ['GET','POST','PATCH','DELETE','PUT'],
    credentials:true
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private reader:AuthService ,private notification:NotificationService,private friendRequest:FriendRequestService){}
  @WebSocketServer() server: Server;
  private users: Record<string, string> = {}; // Store userId to socketId mappings
  afterInit(server: Server) {
    console.log('Socket server initialized');
  }


///////////////////////////////////////////////Collect All Online Users Data///////////////////////////////////////////
  private onlineUsers = []
   connectedUsesrs =async (socketId,userId) =>{
       const isExist = await this.onlineUsers.some((u)=>u.userId === userId);
       if (!isExist) {
          await this.onlineUsers.push({socketId,userId})
       } 
      //  if (isExist && this.onlineUsers.length > 0) {
      //   const changeId = await this.onlineUsers.find(U=> U.userId === userId);
      //   changeId.socketId = socketId
      //  }//
  }
////////////////////////////////////////Methin For Connetted Users//////////////////////////////////////////
  async handleConnection(client: Socket) {
    const userId =await client.handshake.query.userId;
    console.log(`User connected: ${userId} and sid:${client.id}`);
    if (userId !== undefined) {
      await this.reader.updateUserOnlineStatus(userId,true)
     
     await this.connectedUsesrs(client.id,userId)
      client.on("send-message-to-my-friend",(async (data)=>{
       const myCurrentFriend = await this.onlineUsers.filter(U=>U.userId === data?.receiverId)
       await client.to(myCurrentFriend[0]?.socketId).emit("get-message-from-my-friend",data)
       console.log(this.onlineUsers)
       console.log(myCurrentFriend[0]?.socketId)
       console.log(data)
      }))
    }
   
    // setTimeout(async() => {
    //   if (userId !== undefined) {
    //     await this.reader.updateUserOnlineStatus(userId,false)
    //     console.log('off')
    //   }
    // }, 60 * 1000 * 10);
  }

  
//////////////////////////////Remove All Offline Users///////////////////////////////////////
removeOfflineUsers = async (socketId) => {
  this.onlineUsers = await this.onlineUsers.filter(u=>u.socketId !== socketId);
}
  ////////////////////////////////////////Methin For disConnetted Users////////////////////////////////////////////
  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId !== undefined) {
      await this.reader.updateUserOnlineStatus(userId,false)//
      console.log(this.onlineUsers)
     await this.removeOfflineUsers(client.id)
    }
  }




  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 async sendNotification(userId: string, message: string) {
    const socketId = this.users[userId];
    if (socketId) {
      this.server.to(socketId).emit('notification', message);
    } else {
      console.log(`User with ID ${userId} is not connected`);
    }
  }
      // @SubscribeMessage("Hello-test")
      // newNotific(@MessageBody() body:any){
      //       console.log(body)
      //       // this.server.emit("return",body)
      // }
}
