
import { EventSystem, Network } from "@udonarium/core/system";
import { Message, PostMessageChat, ReceiveMessage } from "./types"
import { postMessage } from "./post";
import { PeerCursor } from "@udonarium/peer-cursor";
import { PeerContext } from "@udonarium/core/system/network/peer-context";
import { ObjectStore } from "@udonarium/core/synchronize-object/object-store";
import { parentOrigin } from "./const";
import { ChatTab } from "@udonarium/chat-tab";
import { ChatMessage } from "@udonarium/chat-message";

const isChatMessage = (data: any): data is PostMessageChat =>
  ['chat', 'dice'].includes(data.type);

let loadedRooms = [];

export const listenMessage = ()=>{
  window.addEventListener(
    'message',
    (event: MessageEvent<ReceiveMessage>) => {
      if (event.origin !== parentOrigin) return
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
      // ルーム接続
      if(event.data.type === 'connect-by-room-alias'){
        const {alias, pass} = event.data.payload;
        const room = loadedRooms.find(room=>room.alias === alias)
        if(!room) return;
        connectRoom(room.peerContexts, pass);
      }



      // チャット受信
      if (event.data.type === 'send-chat-message'){
        const tab = 'MainTab'
        ObjectStore.instance.get<ChatTab>(tab).addMessage(event.data.payload)
      }


    },
    false,
  );
  EventSystem.register({})
    .on('OPEN_NETWORK', event => {
      postMessage(Network.peerContext.userId, 'open-connect')
      window.setTimeout(async() => {
        const rooms = await loadRooms();
        postMessage(rooms, 'load-rooms');
        loadedRooms = rooms;
      }, 1000);
    })
    // .on('ALARM_TIMEUP_ORIGIN', event => {})
    // .on('ALARM_POP', event => {})
    // .on('START_VOTE', event => {})
    // .on('FINISH_VOTE', event => {})
    // .on('START_CUT_IN', event => {})
    // .on('STOP_CUT_IN', event => {})
    .on('UPDATE_GAME_OBJECT', event => {
      let message = ObjectStore.instance.get(event.data.identifier);
      if (message && message instanceof ChatMessage) {
        postMessage(message, 'update-chat-message')
      }
    })
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
const loadRooms = async()=>{
  const rooms = [];
  let peersOfroom: { [room: string]: PeerContext[] } = {};
  let peerIds = await Network.listAllPeers();
  for (let peerId of peerIds) {
    let context = PeerContext.parse(peerId);
    if (context.isRoom) {
      let alias = context.roomId + context.roomName;
      if (!(alias in peersOfroom)) {
        peersOfroom[alias] = [];
      }
      peersOfroom[alias].push(context);
    }
  }
  for (let alias in peersOfroom) {
    rooms.push({ alias: alias, roomName: peersOfroom[alias][0].roomName, peerContexts: peersOfroom[alias] });
  }
  rooms.sort((a, b) => {
    if (a.alias < b.alias) return -1;
    if (a.alias > b.alias) return 1;
    return 0;
  });
  return rooms;
}

const connectRoom = (peerContexts: PeerContext[], password: string) => {
  const context = peerContexts[0];

  if (context.hasPassword) {
    PeerCursor.myCursor.reConnectPass = password;
  }

  if (!context.verifyPassword(password)) return;

  const userId = Network.peerContext ? Network.peerContext.userId : PeerContext.generateId();
  Network.open(userId, context.roomId, context.roomName, password);
  PeerCursor.myCursor.peerId = Network.peerId;

  let triedPeer: string[] = [];
  EventSystem.register(triedPeer)
    .on('OPEN_NETWORK', event => {
      console.log('LobbyComponent OPEN_PEER', event.data.peerId);
      EventSystem.unregister(triedPeer);
      ObjectStore.instance.clearDeleteHistory();
      for (let context of peerContexts) {
        Network.connect(context.peerId);
      }
      EventSystem.register(triedPeer)
        .on('CONNECT_PEER', event => {
          console.log('接続成功！', event.data.peerId);
          triedPeer.push(event.data.peerId);
          console.log('接続成功 ' + triedPeer.length + '/' + peerContexts.length);
          if (peerContexts.length <= triedPeer.length) {
            resetNetwork();
            EventSystem.unregister(triedPeer);
          }
        })
        .on('DISCONNECT_PEER', event => {
          console.warn('接続失敗', event.data.peerId);
          triedPeer.push(event.data.peerId);
          console.warn('接続失敗 ' + triedPeer.length + '/' + peerContexts.length);
          if (peerContexts.length <= triedPeer.length) {
            resetNetwork();
            EventSystem.unregister(triedPeer);
          }
        });
    });
}
const resetNetwork = ()=> {
  if (Network.peerContexts.length < 1) {
    Network.open();
    PeerCursor.myCursor.peerId = Network.peerId;
  }
}
