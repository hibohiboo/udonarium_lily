import { Message, PostMessageEventType } from "./types"

const origin = 'http://localhost:3000';

export const postMessage = (payload: any, type: PostMessageEventType) =>{
  if (window === window.parent) {
    return
  }
  const message:Message = {
    type,
    payload
  }
  window.parent.postMessage(message, origin)
}
