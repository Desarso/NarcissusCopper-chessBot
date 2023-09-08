import { create } from "domain";
import { VirtualMouseEvent, Position, User } from "./Types";
import { Accessor } from "solid-js";





export class VirtualMouse {
    ws : Accessor<WebSocket>;
    initialized: boolean = false;
    virtualCursor : HTMLElement;
    self: User;
    opponent: User;
  constructor (ws: Accessor<WebSocket>, self: User, opponent: User){
    this.ws = ws;
    this.virtualCursor = this.createVirtualCursor();
    this.self = self;
    this.opponent = opponent;

  }

  //public methods
  public init(){
    this.initialized = true;
    this.catchWedSocketEvents();
    this.sendMouseEvents();
  }
  catchWedSocketEvents(){
    this.ws().addEventListener("message", (event) => {
      let data = JSON.parse(event.data);
      if(data.type != "virtualMouseEvent") return;
      let virtualMouseEvent : VirtualMouseEvent = JSON.parse(event.data);
      this.triggerVirtualMouseEvent(virtualMouseEvent);
      console.log("virtual mouse event", virtualMouseEvent)
      
  
      });
    
      this.ws().addEventListener("close", async() => {
        await this.sleep (1000);
        this.catchWedSocketEvents();
      });
  }
  private triggerVirtualMouseEvent(virtualMouseEvent: VirtualMouseEvent){
    let virtualEvent;
    let newPosition;
    let elements;
    let element
    switch(virtualMouseEvent.eventType){
      
      case "pointermove":
          newPosition = this.setVirtualPosition(virtualMouseEvent);
          virtualEvent = new Event("virtualpointermove");
          virtualEvent.clientX = newPosition.x;
          virtualEvent.clientY = newPosition.y;
          document.dispatchEvent(virtualEvent);


        break;
      case "pointerdown":
          newPosition = this.setVirtualPosition(virtualMouseEvent);
          elements = document.elementsFromPoint(newPosition.x, newPosition.y);
          element  = elements[1];
          // console.log("element", element)
          if(element.classList.contains("canDrag")) return;
          // console.log("pointerdown element", element);
          virtualEvent = new Event("virtualpointerdown");
          virtualEvent.clientX = newPosition.x;
          virtualEvent.clientY = newPosition.y;
          element.dispatchEvent(virtualEvent);
          document.dispatchEvent(virtualEvent);
          this.virtualCursor.style.backgroundColor= "rgba(255, 0, 0, 0.541)"
        break;
      case "pointerup":
          virtualEvent = new Event("virtualpointerup");
          // console.log("virtual pointerup element");
          document.dispatchEvent(virtualEvent);
          this.virtualCursor.style.backgroundColor= "rgba(255, 0, 0, 0)"
        break;
          
    }

  }

  private sendMouseEvents(){
    let index = 0;
    let chessBoard = document.querySelector(".chessBoard");
    document.addEventListener("pointermove", (event) => {
      if(!this.initialized) return;
      if (index % 5 != 0) {
        if (index == 100) {
          index = 0;
        }
        index++;
        return;
      }
      let chessBoardWidth = chessBoard?.offsetWidth;
      let position = new Position(event.clientX, event.clientY);
      let virtualMouseEvent = new VirtualMouseEvent(
        this.self,
        this.opponent,
        position,
        chessBoardWidth,
        "pointermove"
      );
      this.ws().send(JSON.stringify(virtualMouseEvent));
    });
    document.addEventListener("pointerdown", (event) => {
      
      let chessBoardWidth = chessBoard?.offsetWidth;
      let position = new Position(event.clientX, event.clientY);
      let virtualMouseEvent = new VirtualMouseEvent(
        this.self,
        this.opponent,
        position,
        chessBoardWidth,
        "pointerdown"
      );
      this.ws().send(JSON.stringify(virtualMouseEvent));
    });
    document.addEventListener("pointerup", (event) => {
      
      let chessBoardWidth = chessBoard?.offsetWidth;
      let position = new Position(event.clientX, event.clientY);
      let virtualMouseEvent = new VirtualMouseEvent(
        this.self,
        this.opponent,
        position,
        chessBoardWidth,
        "pointerup"
      );
      this.ws().send(JSON.stringify(virtualMouseEvent));
    });
  }


  private setVirtualPosition(data: any) {
    let oponentsCursor = document.querySelector(".oponentsCursor");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let x = data.position.x;
    let y = data.position.y;
    let sourceChessBoardCenterX = data.screen.x/2;
    let sourceChessBoardCenterY = data.screen.y/2;
    let xOffSet = x - sourceChessBoardCenterX;
    let yOffSet = y - sourceChessBoardCenterY;
    let destinationChessBoardCenterX = windowWidth / 2;
    let destinationChessBoardCenterY = windowHeight / 2;
    let destinationChessboardWidth = document.querySelector(".chessBoard").offsetWidth;
    let destinationChessboardHeight = destinationChessboardWidth;
    let scaleFactorX  = destinationChessboardWidth / data.chessBoardWidth;
    let scaleFactorY  = destinationChessboardHeight / data.chessBoardWidth;
    let scaledXOffset = xOffSet * scaleFactorX;
    let scaledYOffset = yOffSet * scaleFactorY;
    destinationChessBoardCenterX = window.innerWidth / 2;
    destinationChessBoardCenterY = window.innerHeight / 2;
    let alignedCursorX = destinationChessBoardCenterX + scaledXOffset;
    let alignedCursorY = destinationChessBoardCenterY + scaledYOffset;
    let invertedCursorX = destinationChessBoardCenterX - scaledXOffset;
    let invertedCursorY = destinationChessBoardCenterY - scaledYOffset;
    // console.log("xOffSet", xOffSet, "yOffSet", yOffSet);
    oponentsCursor.style.transform = `translate(${invertedCursorX-(this.cursorWidth/2)}px, ${invertedCursorY-this.cursorWidth/2}px)`;
    return {x: invertedCursorX, y: invertedCursorY};
  }

  private createVirtualCursor() : HTMLElement{
    let virtualCursor = document.createElement("div");
    virtualCursor.classList.add("oponentsCursor");
    document.body.appendChild(virtualCursor);
    this.cursorWidth = virtualCursor.offsetHeight;
    return virtualCursor;
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }




}