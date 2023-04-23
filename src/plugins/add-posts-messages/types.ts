import { ChatMessageContext } from "@udonarium/chat-message"

export interface PostMessageData<T> {
  payload: T
  type: 'chat' | 'dice'
}
export type PostMessageChat = PostMessageData<{
  message: ChatMessageContext
  tab: string
}>
export type PostMessageEventType = 'open-connect' | 'login-sunncess'
export type Message = {
  type: PostMessageEventType;
  payload: any;
}
type ReceiveMessageEventType = 'change-player-name';
export type ReceiveMessage = {
  type: ReceiveMessageEventType;
  payload: any;
}

