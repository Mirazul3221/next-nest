import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Types } from 'mongoose';

export type FriendRequestDocument = FriendRequest & Document;

@Schema({ timestamps: true })
export class FriendRequest {
  @Prop({ type: Types.ObjectId, required: true })
  requester:  mongoose.Schema.Types.ObjectId;

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:'Reader',requiredPaths:true})
  recipient: mongoose.Schema.Types.ObjectId;

  @Prop({ enum: ['pending', 'accepted'], default: 'pending' })
  status: string;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
