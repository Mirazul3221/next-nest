import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    allowedHeaders: '*',
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
////////////////////////////Socket server init/////////////////////////////////
@WebSocketGateway({
  cors: {
    allowedHeaders: '*',
    origin: '*', // Adjust this to match your needs
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}
  @WebSocketServer() server: Server;
  afterInit(server: Server) {
    console.log('Socket server initialized');
  }

  ///////////////////////////////////////////////Collect All Online Users Data///////////////////////////////////////
  private onlineUsers = [];
  connectedUsesrs = async (socketId, userId) => {
    const isExist = await this.onlineUsers.some((u) => u.userId === userId);
    if (!isExist) {
      await this.onlineUsers.push({ socketId, userId });
    }
    if (isExist) {
      const changeId = await this.onlineUsers.find((U) => U.userId === userId);
      changeId.socketId = socketId;
    } //
  };
  ////////////////////////////////////////Method For Connetted Users//////////////////////////////////////////
  async handleConnection(client: Socket) {
    client.on('myUserInfo', async ({ id }) => {
      if (id) {
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        await this.connectedUsesrs(client.id, id);
        console.log(`User connected: ${id} and sid:${client.id}`);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        client.on('checkSenderOnlineStatus',async (data) => {
          const isOnline =await this.onlineUsers.some((U) => (U.userId === data));
          client.emit('getSenderOnlineStatus', isOnline);
          console.log(data)
        });
        client.on('send-message-to-my-friend', async (data) => {
          const myCurrentFriend = await this.onlineUsers.filter(
            (U) => U.userId === data?.receiverId,
          );
          console.log(myCurrentFriend);
          if (myCurrentFriend[0]?.socketId !== undefined) {
            await client
              .to(myCurrentFriend[0]?.socketId)
              .emit('get-message-from-my-friend', data);
            await client
              .to(myCurrentFriend[0]?.socketId)
              .emit('hoga', 'Hoga mara shara');
          }
        });

        client.on('typingMsg', async (data) => {
          const myCurrentFriend = await this.onlineUsers.filter(
            (U) => U.userId === data?.receiverId,
          );
          await client
            .to(myCurrentFriend[0]?.socketId)
            .emit('getTypingMsg', data);
        });

        client.on('openMessageWindow', async (data) => {
          console.log(data);
          const myCurrentFriend = await this.onlineUsers.filter(
            (U) => U.userId === data?.receiverId,
          );
          await client
            .to(myCurrentFriend[0]?.socketId)
            .emit('getOpenMessageWindow', data.status);
        });
        let ids = [];
        await this.onlineUsers?.map((user) => {
          ids.push(user?.userId);
        });
        await client.emit('onlineFriends', ids);
      }
    });

    client.on('goa', (g) => {
      console.log(g);
    });
    // setTimeout(async() => {
    //   if (userId !== undefined) {
    //     await this.reader.updateUserOnlineStatus(userId,false)
    //     console.log('off')
    //   }
    // }, 60 * 1000 * 10);
  }
  //
  //////////////////////////////Remove All Offline Users///////////////////////////////////////
  removeOfflineUsers = async (socketId) => {
    this.onlineUsers = await this.onlineUsers.filter(
      (u) => u.socketId !== socketId,
    );
  };
  ////////////////////////////////////////Methin For disConnetted Users////////////////////////////////////////////
  async handleDisconnect(client: Socket) {
    await this.removeOfflineUsers(client.id);
    console.log(this.onlineUsers);
    client.on('friendsId', (data) => {});
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////
} 
