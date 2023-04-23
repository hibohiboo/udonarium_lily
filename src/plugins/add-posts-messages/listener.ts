
import { EventSystem, Network } from "@udonarium/core/system";
import { Message, PostMessageChat, ReceiveMessage } from "./types"
import { postMessage } from "./post";
import { PeerCursor } from "@udonarium/peer-cursor";
import { PeerContext } from "@udonarium/core/system/network/peer-context";
import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";

const isChatMessage = (data: any): data is PostMessageChat =>
  ['chat', 'dice'].includes(data.type);

const origin = 'http://localhost:3000'

export const listenMessage = ()=>{
  window.addEventListener(
    'message',
    (event: MessageEvent<ReceiveMessage>) => {
      if (event.origin !== origin) return
      // event.data.type webpackOKのメッセージなども来る。

      // ニックネーム修正
      if(event.data.type === 'change-player-name') PeerCursor.myCursor.name = event.data.payload

      // プライベート接続
      if(event.data.type === 'connect-by-target-user-id') {
        let targetUserId = event.data.payload;
        if (targetUserId.length < 1) return;
        let context = PeerContext.create(targetUserId);
        if (context.isRoom) return;
        ObjectStore.instance.clearDeleteHistory();
        Network.connect(context.peerId);
      }
    },
    false,
  );
  EventSystem.register({})
    .on('OPEN_NETWORK', event => {
      // console.log('POST OPEN_NETWORK', event.data.peerId);
      postMessage(Network.peerContext.userId, 'open-connect')
    })
    // .on('ALARM_TIMEUP_ORIGIN', event => {})
    // .on('ALARM_POP', event => {})
    // .on('START_VOTE', event => {})
    // .on('FINISH_VOTE', event => {})
    // .on('START_CUT_IN', event => {})
    // .on('STOP_CUT_IN', event => {})
    // .on('UPDATE_GAME_OBJECT', event => {  })
    // .on('DELETE_GAME_OBJECT', event => {  })
    // .on('SYNCHRONIZE_AUDIO_LIST', event => {  })
    // .on('SYNCHRONIZE_FILE_LIST', event => {  })
    // .on<AppConfig>('LOAD_CONFIG', event => {})
    // .on<File>('FILE_LOADED', event => {})
    // .on('NETWORK_ERROR', event => {})
    .on('CONNECT_PEER', event => {
      postMessage(true, 'connect-peer')
    })
    // .on('DISCONNECT_PEER', event => {})
  ;
}
