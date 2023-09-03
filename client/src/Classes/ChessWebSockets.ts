import { User } from "./Types";
import { Accessor } from "solid-js"



export class ChessWebSocket{
    ws: WebSocket = this.createWS("wss://localhost:8080/chessSub");
    pingsSinceResponse: number = 0;

    constructor(){
        this.createListeners();
    }

    unloadWebSockets(){
        window.onbeforeunload = () => {
            this.ws.close();
        };
    }

    public createWS(url:string) {
        const socket = new WebSocket(url);
        return socket;
    }

    public pingWebSocket(user : User) {
        //check if websocket is open
        if (this.ws.readyState != 3) {
            // console.log("pinging ws");
           if (this.ws.readyState === 1) {
                // console.log("pinging ws", this.ws);
                // console.log(JSON.stringify(user))
                this.ws.send(JSON.stringify(user));
            }
        }
    }

    public beginPinging(user : Accessor<User>) {
        setInterval(() => {
            // this.pingsSinceResponse++;
            // if(this.pingsSinceResponse < -5) this.pingsSinceResponse = 0;
            // if(this.pingsSinceResponse > 3){
            //     this.close();
            // }
            this.pingWebSocket(user());
        }, 3000);
    }

    public reconnectWebSocket() {
        //check if websocket is open
        this.ws = this.createWS("ws://localhost:8080/chessSub");
        this.createListeners();
    }

    public createListeners() {
        
        this.ws.addEventListener("open", () => {
            console.log("ws open");
        });
        this.ws.addEventListener("close", () => {
            console.log("ws closed");
            this.ws.close();
            this.reconnectWebSocket();
        });
        this.ws.addEventListener("message", (e) => {
            let data = JSON.parse(e.data);
            //process users
            if(data.users){
                this.pingsSinceResponse--;
                //we need to create event usersUpdated
                let event = new CustomEvent("usersUpdated");
                event.data = data.users;
                document.dispatchEvent(event);
            }
            //process notification
            if(data.type === "promptForGame" || data.type == "createGame" ){
                let event = new CustomEvent("notification");
                event.data = data;
                document.dispatchEvent(event);
            }
        });
    }

    public sendNotification(notification: Notification){
        console.log("sending notification", notification);
        this.ws.send(JSON.stringify(notification));
    }


   

    close(){
        this.ws.close();
    }



    
}