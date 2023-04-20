export interface Notifications{
    gameId: string;
    requesterID: string;
    requesterColor: string;
    receiverID: string;
}



export interface User{
    id: string;
    username: string;
    ip: string;
}

export interface Move{
    from: string;
    to: string;
    endFen: string;
}


export interface game{
    id: string;
    users: User[];
    moves: Move[];
    turn: string;
    fen: string;
}