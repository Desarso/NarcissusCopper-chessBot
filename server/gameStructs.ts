export interface Notification{
    gameId: string;
    requesterId: string;
    requesterColor: string;
    receiverId: string;
}




export interface User{
    id: string;
    username: string;
    last_seen: string;
    cat_url: string;
    notification: Notification[];
}

export interface Move{
    from: string;
    to: string;
    endFen: string;
}


export interface game{
    id: string;
    requesterId: string;
    requesterColor: string;
    receiverId: string;
    users: User[];
    moves: Move[];
    turn: string;
    fen: string;
    started: boolean;
}