import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ObjectStore } from '@udonarium/core/synchronize-object/object-store';
import { PeerContext } from '@udonarium/core/system/network/peer-context';
import { EventSystem, Network } from '@udonarium/core/system';
import { PeerCursor } from '@udonarium/peer-cursor';

import { FileSelecterComponent } from 'component/file-selecter/file-selecter.component';
import { LobbyComponent } from 'component/lobby/lobby.component';
import { AppConfigService } from 'service/app-config.service';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'peer-menu',
  templateUrl: './peer-menu.component.html',
  styleUrls: ['./peer-menu.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition('false => true', [
        animate('50ms ease-in-out', style({ opacity: 1.0 })),
        animate('900ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class PeerMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('idInput') idInput: ElementRef;
  @ViewChild('idSpacer') idSpacer: ElementRef;

  targetPeerId: string = '';
  networkService = Network
  gameRoomService = ObjectStore.instance;
  help: string = '';
  isCopied = false;

  private _timeOutId;

  get myPeer(): PeerCursor { return PeerCursor.myCursor; }

  get myPeerName(): string {
    if (!PeerCursor.myCursor) return null;
    return PeerCursor.myCursor.name;
  }
  set myPeerName(name: string) {
    if (window.localStorage) {
      localStorage.setItem(PeerCursor.CHAT_MY_NAME_LOCAL_STORAGE_KEY, name);
    }
    if (PeerCursor.myCursor) PeerCursor.myCursor.name = name;
  }

  get myPeerColor(): string {
    if (!PeerCursor.myCursor) return PeerCursor.CHAT_DEFAULT_COLOR;
    return PeerCursor.myCursor.color;
  }
  set myPeerColor(color: string) {
    if (PeerCursor.myCursor) {
      PeerCursor.myCursor.color = (color == PeerCursor.CHAT_TRANSPARENT_COLOR) ? PeerCursor.CHAT_DEFAULT_COLOR : color;
    }
    if (window.localStorage) {
      localStorage.setItem(PeerCursor.CHAT_MY_COLOR_LOCAL_STORAGE_KEY, PeerCursor.myCursor.color);
    }
  }

  constructor(
    private ngZone: NgZone,
    private modalService: ModalService,
    private panelService: PanelService,
    public appConfigService: AppConfigService
  ) { }

  ngOnInit() {
    Promise.resolve().then(() => { this.panelService.title = '接続情報'; this.panelService.isAbleFullScreenButton = false });
  }

  ngAfterViewInit() {
    EventSystem.register(this)
      .on('OPEN_NETWORK', event => {
        this.ngZone.run(() => { });
        this.idInput.nativeElement.style.width = this.idSpacer.nativeElement.getBoundingClientRect().width + 'px'
      });
  }

  ngOnDestroy() {
    clearTimeout(this._timeOutId);
    EventSystem.unregister(this);
  }

  changeIcon() {
    this.modalService.open<string>(FileSelecterComponent).then(value => {
      if (!this.myPeer || !value) return;
      this.myPeer.imageIdentifier = value;
    });
  }

  private resetPeerIfNeeded() {
    if (Network.peerContexts.length < 1) {
      Network.open();
      PeerCursor.myCursor.peerId = Network.peerId;
    }
  }

  connectPeer() {
    this.help = '';
    let context = PeerContext.create(this.targetPeerId);
    if (!context.isRoom) {
      ObjectStore.instance.clearDeleteHistory();
      Network.connect(this.targetPeerId);
    } else {
      if (Network.peerContexts.length) {
        this.help = '入力されたIDはルーム用のIDのようですが、ルーム用IDと通常のIDを混在させることはできません。プライベート接続を切ってください。（※ページリロードで切断ができます）';
        return;
      }

      Network.open(Network.peerContext.id, context.room, context.roomName, context.password);
      PeerCursor.myCursor.peerId = Network.peerId;

      let dummy = {};
      EventSystem.register(dummy)
        .on('OPEN_NETWORK', event => {
          ObjectStore.instance.clearDeleteHistory();
          Network.connect(this.targetPeerId);
          EventSystem.unregister(dummy);
          EventSystem.register(dummy)
            .on('CONNECT_PEER', event => {
              console.log('接続成功！', event.data.peer);
              this.resetPeerIfNeeded();
              EventSystem.unregister(dummy);
            })
            .on('DISCONNECT_PEER', event => {
              console.warn('接続失敗', event.data.peer);
              this.resetPeerIfNeeded();
              EventSystem.unregister(dummy);
            });
        });
    }
  }

  async connectPeerHistory() {
    this.help = '';
    let conectPeers: PeerContext[] = [];
    let room: string = '';

    for (let peer of this.appConfigService.peerHistory) {
      let context = PeerContext.create(peer);
      if (context.isRoom) {
        if (room !== context.room) conectPeers = [];
        room = context.room;
        conectPeers.push(context);
      } else {
        if (room !== context.room) conectPeers = [];
        conectPeers.push(context);
      }
    }

    if (room.length) {
      console.warn('connectPeerRoom <' + room + '>');
      let conectPeers = [];
      let peerIds = await Network.listAllPeers();
      for (let id of peerIds) {
        console.log(id);
        let context = new PeerContext(id);
        if (context.room === room) {
          conectPeers.push(context);
        }
      }
      if (conectPeers.length < 1) {
        this.help = '前回接続していたルームが見つかりませんでした。既に解散しているかもしれません。';
        console.warn('Room is already closed...');
        return;
      }
      Network.open(PeerContext.generateId(), conectPeers[0].room, conectPeers[0].roomName, conectPeers[0].password);
    } else {
      console.warn('connectPeers ' + conectPeers.length);
      Network.open();
    }

    PeerCursor.myCursor.peerId = Network.peerId;

    let listener = EventSystem.register(this);
    listener.on('OPEN_NETWORK', event => {
      console.log('OPEN_NETWORK', event.data.peer);
      EventSystem.unregisterListener(listener);
      ObjectStore.instance.clearDeleteHistory();
      for (let context of conectPeers) {
        Network.connect(context.fullstring);
      }
    });
  }

  showLobby() {
    this.modalService.open(LobbyComponent, { width: 700, height: 400, left: 0, top: 400 });
  }

  findPeerName(peerId: string) {
    const peerCursor = PeerCursor.find(peerId);
    return peerCursor ? peerCursor.name : '';
  }

  findPeerColor(peerId: string) {
    const peerCursor = PeerCursor.find(peerId);
    return peerCursor ? peerCursor.color : '';
  }

  copyPeerId() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.networkService.peerContext.id);
      this.isCopied = true;
      clearTimeout(this._timeOutId);
      this._timeOutId = setTimeout(() => {
        this.isCopied = false;
      }, 1000);
    }
  }

  isAbleClipboardCopy(): boolean {
    return navigator.clipboard ? true : false;
  }
}
