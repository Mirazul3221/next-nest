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
  private socketUsers = {}
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
    const userId =await client.handshake.query.myId as string;
    if (!this.socketUsers[userId]) {
      this.socketUsers[userId] = []
    }
    this.socketUsers[userId].push(client.id)
      if (userId) {
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        console.log('//////////////////////////////////////////////////////')
        console.log(`User connected: ${userId} and sid:${client.id}`);
        console.log(this.socketUsers)
        console.log('//////////////////////////////////////////////////////')
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        client.on('checkSenderOnlineStatus',async (data) => {
          let isOnline = Object.keys(this.socketUsers)?.some(u =>u === data)
          client.emit('getSenderOnlineStatus', isOnline);
          console.log(data)
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        client.on('send-message-to-my-friend', async (data) => {
          if (this.socketUsers[data?.receiverId]?.length > 0) {
            this.socketUsers[data?.receiverId]?.map(async id=>{
             await client
              .to(id)
              .emit('get-message-from-my-friend', data); 
            })
           }

        });
////////////////////////////////////////////////////////////////////////////////////////
        client.on('typingMsg', async (data) => {
         if (this.socketUsers[data?.receiverId]?.length > 0) {
          this.socketUsers[data?.receiverId]?.map(async id=>{
            await client
            .to(id)
            .emit('getTypingMsg', data); 
          })
         }

        });
/////////////////////////////////////////////////////////////////////////////////////////
        client.on('openMessageWindow', async (data) => {
            if (this.socketUsers[data?.receiverId]?.length > 0) {
              this.socketUsers[data?.receiverId]?.map(async id=>{
               await client
                .to(id)
                .emit('getOpenMessageWindow',  data.status); 
              })
             }
        });

//////////////////////////Here is the logic for active users/////////////////////////////////        
        const userIds = Object.keys(this.socketUsers)
        await client.emit('onlineFriends', userIds);


////////////////////////////////////Logic for video and audio call system////////////////////////////////////////////
      await client.on('signal-call',(data)=>{
        if (this.socketUsers[data?.receiverId]?.length > 0) {
          console.log(this.socketUsers[data?.receiverId])
          this.socketUsers[data?.receiverId]?.map(async id=>{
           await client
            .to(id)
            .emit('signal-call',  data); 
          })
         }
      })

      }
  }//
  //
  ////////////////////////////////////////Methin For disConnetted Users////////////////////////////////////////////
  async handleDisconnect(client: Socket) {
    const userId =await client.handshake.query.myId as string;
    console.log('//////////////////////////////////////////////////////')
    console.log(`user disconnect ${client.id}`)
    console.log(this.socketUsers)///
    console.log('//////////////////////////////////////////////////////')

    this. socketUsers[userId] = this. socketUsers[userId].filter(socketId => socketId !== client.id)//
    // client.on('friendsId', (data) => {});
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////
} 


  // //////////////////////////////Remove All Offline Users///////////////////////////////////////
  // removeOfflineUsers = async (socketId) => {
  //   this.onlineUsers = await this.onlineUsers.filter(
  //     (u) => u.socketId !== socketId,
  //   );
  // };
