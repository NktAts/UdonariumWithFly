import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Card } from '@udonarium/card';
import { CardStack } from '@udonarium/card-stack';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { GameObject } from '@udonarium/core/synchronize-object/game-object';
import { EventSystem } from '@udonarium/core/system';
import { DiceSymbol } from '@udonarium/dice-symbol';
import { GameCharacter } from '@udonarium/game-character';
import { FilterType, GameTable, GridType } from '@udonarium/game-table';
import { GameTableMask } from '@udonarium/game-table-mask';
import { PeerCursor } from '@udonarium/peer-cursor';
import { TableSelecter } from '@udonarium/table-selecter';
import { Terrain } from '@udonarium/terrain';
import { TextNote } from '@udonarium/text-note';

import { GameTableSettingComponent } from 'component/game-table-setting/game-table-setting.component';
import { InputHandler } from 'directive/input-handler';
import { ContextMenuAction, ContextMenuSeparator, ContextMenuService } from 'service/context-menu.service';
import { ModalService } from 'service/modal.service';
import { PointerDeviceService } from 'service/pointer-device.service';
import { TabletopService } from 'service/tabletop.service';

import { GridLineRender } from './grid-line-render';
import { TableTouchGesture, TableTouchGestureEvent } from './table-touch-gesture';

@Component({
  selector: 'game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.css'],
  providers: [
    TabletopService,
  ],
})
export class GameTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('root', { static: true }) rootElementRef: ElementRef<HTMLElement>;
  @ViewChild('gameTable', { static: true }) gameTable: ElementRef<HTMLElement>;
  @ViewChild('gameObjects', { static: true }) gameObjects: ElementRef<HTMLElement>;
  @ViewChild('gridCanvas', { static: true }) gridCanvas: ElementRef<HTMLCanvasElement>;

  get tableSelecter(): TableSelecter { return this.tabletopService.tableSelecter; }
  get currentTable(): GameTable { return this.tabletopService.currentTable; }
  get gridHeight(): number { return this.tabletopService.currentTable.gridHeight; }

  get tableImage(): ImageFile {
    let file: ImageFile = ImageStorage.instance.get(this.currentTable.imageIdentifier);
    return file ? file : ImageFile.Empty;
  }

  get backgroundImage(): ImageFile {
    let file: ImageFile = ImageStorage.instance.get(this.currentTable.backgroundImageIdentifier);
    return file ? file : ImageFile.Empty;
  }

  get backgroundFilterType(): FilterType {
    return this.currentTable.backgroundFilterType
  }

  private isTransformMode: boolean = false;

  private currentPositionX: number = 0;
  private currentPositionY: number = 0;

  get isPointerDragging(): boolean { return this.pointerDeviceService.isDragging; }

  private viewPotisonX: number = 100;
  private viewPotisonY: number = 0;
  private viewPotisonZ: number = 0;

  private viewRotateX: number = 50;
  private viewRotateY: number = 0;
  private viewRotateZ: number = 10;

  private buttonCode: number = 0;
  private input: InputHandler = null;
  private gesture: TableTouchGesture = null;

  get characters(): GameCharacter[] { return this.tabletopService.characters; }
  get tableMasks(): GameTableMask[] { return this.tabletopService.tableMasks; }
  get cards(): Card[] { return this.tabletopService.cards; }
  get cardStacks(): CardStack[] { return this.tabletopService.cardStacks; }
  get terrains(): Terrain[] { return this.tabletopService.terrains; }
  get textNotes(): TextNote[] { return this.tabletopService.textNotes; }
  get diceSymbols(): DiceSymbol[] { return this.tabletopService.diceSymbols; }
  get peerCursors(): PeerCursor[] { return this.tabletopService.peerCursors; }

  constructor(
    private ngZone: NgZone,
    private contextMenuService: ContextMenuService,
    private elementRef: ElementRef,
    private pointerDeviceService: PointerDeviceService,
    private tabletopService: TabletopService,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
    EventSystem.register(this)
      .on('UPDATE_GAME_OBJECT', -1000, event => {
        this.gameTable.nativeElement.style.transition = null;
        if (event.data.identifier !== this.currentTable.identifier && event.data.identifier !== this.tableSelecter.identifier) return;
        console.log('UPDATE_GAME_OBJECT GameTableComponent ' + this.currentTable.identifier);

        this.setGameTableGrid(this.currentTable.width, this.currentTable.height, this.currentTable.gridSize, this.currentTable.gridType, this.currentTable.gridColor);
      })
      .on('DRAG_LOCKED_OBJECT', event => {
        this.gameTable.nativeElement.style.transition = null;
        this.isTransformMode = true;
        this.pointerDeviceService.isDragging = false;
        let opacity: number = this.tableSelecter.gridShow ? 1.0 : 0.0;
        this.gridCanvas.nativeElement.style.opacity = opacity + '';
      })
      .on('RESET_POINT_OF_VIEW', event => {
        this.isTransformMode = false;
        this.pointerDeviceService.isDragging = false;

        this.setTransform(this.viewPotisonX, this.viewPotisonY, this.viewPotisonZ, this._rightRotate(this.viewRotateX), this._rightRotate(this.viewRotateY, true), this._rightRotate(this.viewRotateZ), true);
        setTimeout(() => {
          this.gridCanvas.nativeElement.style.opacity = '0.0';
          this.gameTable.nativeElement.style.transition = '0.1s ease-out';
          setTimeout(() => {
            this.gameTable.nativeElement.style.transition = null;
          }, 100);
          if (event && event.data == 'top') {
            this.setTransform(0, 0, 0, 0, 0, 0, true);
          } else {
            this.setTransform(100, 0, 0, 50, 0, 10, true);
          }
        }, 50);
        this.removeFocus();
      });
    this.tabletopService.makeDefaultTable();
    this.tabletopService.makeDefaultTabletopObjects();
  }

  private _rightRotate(rotate: number, just: boolean=false): number {
    let tmp = rotate % 360;
    if (!just) {
      if (tmp > 180) {
        tmp = tmp - 360;
      } else if (tmp < -180) {
        tmp = tmp + 360;
      }
    }
    return tmp;
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.input = new InputHandler(this.elementRef.nativeElement, { capture: true });
      this.initializeTableTouchGesture();
    });
    this.input.onStart = this.onInputStart.bind(this);
    this.input.onMove = this.onInputMove.bind(this);
    this.input.onEnd = this.onInputEnd.bind(this);

    this.setGameTableGrid(this.currentTable.width, this.currentTable.height, this.currentTable.gridSize, this.currentTable.gridType, this.currentTable.gridColor);
    this.setTransform(0, 0, 0, 0, 0, 0);
    this.tabletopService.dragAreaElement = this.gameObjects.nativeElement;
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
    this.input.destroy();
    this.gesture.destroy();
  }

  initializeTableTouchGesture() {
    this.gesture = new TableTouchGesture(this.rootElementRef.nativeElement, this.ngZone);
    this.gesture.ongesture = this.onTableTouchGesture.bind(this);
    this.gesture.ontransform = this.onTableTouchTransform.bind(this);
  }

  onTableTouchGesture() {
    this.cancelInput();
  }

  onTableTouchTransform(transformX: number, transformY: number, transformZ: number, rotateX: number, rotateY: number, rotateZ: number, event: string, srcEvent: TouchEvent | MouseEvent | PointerEvent) {
    if (event === TableTouchGestureEvent.PAN && (!this.isTransformMode || this.input.isGrabbing)) return;

    if (!this.pointerDeviceService.isAllowedToOpenContextMenu && this.contextMenuService.isShow) {
      this.ngZone.run(() => this.contextMenuService.close());
    }

    if (srcEvent.cancelable) srcEvent.preventDefault();

    //
    let scale = (1000 + Math.abs(this.viewPotisonZ)) / 1000;
    transformX *= scale;
    transformY *= scale;
    if (80 < rotateX + this.viewRotateX) rotateX += 80 - (rotateX + this.viewRotateX);
    if (rotateX + this.viewRotateX < 0) rotateX += 0 - (rotateX + this.viewRotateX);
    if (750 < transformZ + this.viewPotisonZ) transformZ += 750 - (transformZ + this.viewPotisonZ);

    this.setTransform(transformX, transformY, transformZ, rotateX, rotateY, rotateZ);
  }

  onInputStart(e: any) {
    this.currentPositionX = this.input.pointer.x;
    this.currentPositionY = this.input.pointer.y;

    if (e.target.contains(this.gameObjects.nativeElement) || e.button === 1 || e.button === 2) {
      this.isTransformMode = true;
    } else {
      this.isTransformMode = false;
      this.pointerDeviceService.isDragging = true;
      this.gridCanvas.nativeElement.style.opacity = 1.0 + '';
    }

    this.buttonCode = e.button;

    if (!document.activeElement.contains(e.target)) {
      this.removeSelectionRanges();
      this.removeFocus();
    }
  }

  onInputEnd(e: any) {
    this.cancelInput();
  }

  onInputMove(e: any) {
    if (!this.isTransformMode) return;

    let x = this.input.pointer.x;
    let y = this.input.pointer.y;
    let deltaX = x - this.currentPositionX;
    let deltaY = y - this.currentPositionY;

    let transformX = 0;
    let transformY = 0;
    let transformZ = 0;

    let rotateX = 0;
    let rotateY = 0;
    let rotateZ = 0;

    if (this.buttonCode === 2) {
      rotateZ = -deltaX / 5;
      rotateX = -deltaY / 5;
    } else {
      let scale = (1000 + Math.abs(this.viewPotisonZ)) / 1000;
      transformX = deltaX * scale;
      transformY = deltaY * scale;
    }

    if (!this.pointerDeviceService.isAllowedToOpenContextMenu && this.contextMenuService.isShow) {
      this.ngZone.run(() => { this.contextMenuService.close(); });
    }

    this.currentPositionX = x;
    this.currentPositionY = y;

    if (e.cancelable) e.preventDefault();
    this.setTransform(transformX, transformY, transformZ, rotateX, rotateY, rotateZ);
  }

  cancelInput() {
    this.input.cancel();
    this.isTransformMode = true;
    this.pointerDeviceService.isDragging = false;
    let opacity: number = this.tableSelecter.gridShow ? 1.0 : 0.0;
    this.gridCanvas.nativeElement.style.opacity = opacity + '';
  }

  @HostListener('wheel', ['$event'])
  onWheel(e: WheelEvent) {
    if (!this.isTransformMode) return;

    let pixelDeltaY = 0;
    switch (e.deltaMode) {
      case WheelEvent.DOM_DELTA_LINE:
        pixelDeltaY = e.deltaY * 16;
        break;
      case WheelEvent.DOM_DELTA_PAGE:
        pixelDeltaY = e.deltaY * window.innerHeight;
        break;
      default:
        pixelDeltaY = e.deltaY;
        break;
    }

    let transformX = 0;
    let transformY = 0;
    let transformZ = 0;

    let rotateX = 0;
    let rotateY = 0;
    let rotateZ = 0;

    transformZ = pixelDeltaY * -1.5;
    if (300 ** 2 < transformZ ** 2) transformZ = Math.min(Math.max(transformZ, -300), 300);

    this.setTransform(transformX, transformY, transformZ, rotateX, rotateY, rotateZ);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (!this.isTransformMode || document.body !== document.activeElement) return;
    let transformX = 0;
    let transformY = 0;
    let transformZ = 0;

    let rotateX = 0;
    let rotateY = 0;
    let rotateZ = 0;

    if (e.keyCode === 37) {//←
      if (e.shiftKey) {
        rotateZ = -2;
      } else {
        transformX = 10;
      }
    }
    if (e.keyCode === 38) {//↑
      if (e.shiftKey) {
        rotateX = -2;
      } else if (e.ctrlKey) {
        transformZ = 150;
      } else {
        transformY = 10;
      }
    }
    if (e.keyCode === 39) {//→
      if (e.shiftKey) {
        rotateZ = 2;
      } else {
        transformX = -10;
      }
    }
    if (e.keyCode === 40) {//↓
      if (e.shiftKey) {
        rotateX = 2;
      } else if (e.ctrlKey) {
        transformZ = -150;
      } else {
        transformY = -10;
      }
    }
    this.setTransform(transformX, transformY, transformZ, rotateX, rotateY, rotateZ);
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(e: any) {
    if (!document.activeElement.contains(this.gameObjects.nativeElement)) return;
    e.preventDefault();

    if (!this.pointerDeviceService.isAllowedToOpenContextMenu) return;

    let menuPosition = this.pointerDeviceService.pointers[0];
    let objectPosition = this.tabletopService.calcTabletopLocalCoordinate();
    let menuActions: ContextMenuAction[] = [];

    Array.prototype.push.apply(menuActions, this.tabletopService.getContextMenuActionsForCreateObject(objectPosition));
    menuActions.push(ContextMenuSeparator);
    menuActions.push({
      name: 'テーブル設定', action: () => {
        this.modalService.open(GameTableSettingComponent);
      }
    });
    this.contextMenuService.open(menuPosition, menuActions, this.currentTable.name);
  }

  private setTransform(transformX: number, transformY: number, transformZ: number, rotateX: number, rotateY: number, rotateZ: number, isAbsolute: boolean=false) {
    if (isAbsolute) {
      this.viewRotateX = rotateX;
      this.viewRotateY = rotateY;
      this.viewRotateZ = rotateZ;

      this.viewPotisonX = transformX;
      this.viewPotisonY = transformY;
      this.viewPotisonZ = transformZ;
    } else {
      this.viewRotateX += rotateX;
      this.viewRotateY += rotateY;
      this.viewRotateZ += rotateZ;

      this.viewPotisonX += transformX;
      this.viewPotisonY += transformY;
      this.viewPotisonZ += transformZ;
    }

    if (isAbsolute || rotateX != 0 || rotateY != 0 || rotateX != 0) {
      EventSystem.trigger<object>('TABLE_VIEW_ROTATE', {
        x: this.viewRotateX,
        y: this.viewRotateY,
        z: this.viewRotateZ
      });
    }

    this.gameTable.nativeElement.style.transform = 'translateZ(' + this.viewPotisonZ + 'px) translateY(' + this.viewPotisonY + 'px) translateX(' + this.viewPotisonX + 'px) rotateY(' + this.viewRotateY + 'deg) rotateX(' + this.viewRotateX + 'deg) rotateZ(' + this.viewRotateZ + 'deg) ';
  }

  private setGameTableGrid(width: number, height: number, gridSize: number = 50, gridType: GridType = GridType.SQUARE, gridColor: string = '#000000e6') {
    this.gameTable.nativeElement.style.width = width * gridSize + 'px';
    this.gameTable.nativeElement.style.height = height * gridSize + 'px';

    let render = new GridLineRender(this.gridCanvas.nativeElement);
    render.render(width, height, gridSize, gridType, gridColor);

    let opacity: number = this.tableSelecter.gridShow ? 1.0 : 0.0;
    this.gridCanvas.nativeElement.style.opacity = opacity + '';
  }

  private removeSelectionRanges() {
    let selection = window.getSelection();
    if (!selection.isCollapsed) {
      selection.removeAllRanges();
    }
  }

  private removeFocus() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  trackByGameObject(index: number, gameObject: GameObject) {
    return gameObject.identifier;
  }
}
