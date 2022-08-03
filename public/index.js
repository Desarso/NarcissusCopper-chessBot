let chessSquares = document.querySelectorAll(".chessBoard div");


let whiteFirst = true;
let chessBoard = [  'r','n','b','q','k','b','n','r',
                    'p','p','p','p','p','p','p','p',
                    '-','-','-','-','-','-','-','-',
                    '-','-','-','-','-','-','-','-',
                    '-','-','-','-','-','-','-','-',
                    '-','-','-','-','-','-','-','-',
                    'P','P','P','P','P','P','P','P',
                    'R','N','B','Q','K','B','N','R',
                    'b'
];

setInitialBoard(chessBoard, chessSquares);


//color board;
for(let i=0;i<chessSquares.length;i++){

    if (i%8==0 && i!= 0) whiteFirst = !whiteFirst;

    if (whiteFirst && i%2==0)
        chessSquares[i].style.backgroundColor = "rgb(236 218 196)";
    else if (!whiteFirst && i%2==1)
        chessSquares[i].style.backgroundColor = "rgb(236 218 196)";
}  

window.addEventListener('DOMContentLoaded', () => {
  
});




//add drag listeners
const pieces = document.querySelectorAll(".piece");
const boardSpaces = document.querySelectorAll(".boardSpace");
for(const boardSpace of boardSpaces){
    boardSpace.addEventListener("dragover", dragOver);
    boardSpace.addEventListener("dragenter", dragEnter);
    boardSpace.addEventListener("dragleave", dragLeave);
    boardSpace.addEventListener("drop", dragDrop);
}
for(let i=0;i<pieces.length;i++){
    pieces[i].addEventListener("dragstart", dragStart);
    pieces[i].addEventListener("dragend", dragEnd)
}

//drag events;
function dragStart(e) {
    e.preventDefault();
    let currentPiece = e.srcElement;
    console.log(e);
    console.log("start");
    
    // console.log(ev);
    e.dataTransfer.setDragImage(currentPiece,50,50);
    this.previousClass = this.className;
    setTimeout(() => this.className ='invisible', 0);
}

function dragEnd(ev) {
    this.className = this.previousClass;
}


function dragEnter(ev) {
    ev.preventDefault();
    this.className += ' hovered';
    console.log("enter");
}

function dragLeave() {
    console.log("leave");
    this.className = 'boardspace';
}

function dragDrop() {
    this.className= 'boardspace';
    console.log("drop");
}

function dragOver(e) {
    this.className = 'boardspace hovered'
    e.preventDefault();
    console.log("over");
}


async function setInitialBoard(chessBoard, chessSquares){
    let blackRook;
    let blackBishop;
    let blackKnight;
    let blackKing;
    let blackQueen;
    let blackPawn;
    
    for(let i=0;i<chessSquares.length;i++){
        //black pieces
        if(chessBoard[i] === 'r' || chessBoard[i]  ==='t'){
            blackRook = document.createElement('article');
            blackRook.className = 'piece rook';
            chessSquares[i].appendChild(blackRook);
        }
       if(chessBoard[i] === 'n'){
            blackKnight = document.createElement('article');
            blackKnight.className = 'piece knight';
            chessSquares[i].appendChild(blackKnight);
       }
       if(chessBoard[i] === 'b'){
            blackBishop = document.createElement('article');
            blackBishop.className = 'piece bishop';
            chessSquares[i].appendChild(blackBishop);
        }
        if(chessBoard[i] === 'k'){
            blackKing = document.createElement('article');
            blackKing.className = 'piece king';
            chessSquares[i].appendChild(blackKing);
        }
        if(chessBoard[i] === 'q'){
            blackQueen = document.createElement('article');
            blackQueen.className = 'piece queen';
            chessSquares[i].appendChild(blackQueen);
        }
        if(chessBoard[i] === 'p'){
            blackPawn = document.createElement('article');
            blackPawn.className = 'piece pawn';
            chessSquares[i].appendChild(blackPawn);
        }

        //white pieces
        if(chessBoard[i] === 'R' || chessBoard[i]  ==='T'){
            blackRook = document.createElement('article');
            blackRook.className = 'piece rook white';
            chessSquares[i].appendChild(blackRook);
        }
       if(chessBoard[i] === 'N'){
            blackKnight = document.createElement('article');
            blackKnight.className = 'piece knight white';
            chessSquares[i].appendChild(blackKnight);
       }
       if(chessBoard[i] === 'B'){
            blackBishop = document.createElement('article');
            blackBishop.className = 'piece bishop white';
            chessSquares[i].appendChild(blackBishop);
        }
        if(chessBoard[i] === 'K'){
            blackKing = document.createElement('article');
            blackKing.className = 'piece king white';
            chessSquares[i].appendChild(blackKing);
        }
        if(chessBoard[i] === 'Q'){
            blackQueen = document.createElement('article');
            blackQueen.className = 'piece queen white';
            chessSquares[i].appendChild(blackQueen);
        }
        if(chessBoard[i] === 'P'){
            blackPawn = document.createElement('article');
            blackPawn.className = 'piece pawn white';
            chessSquares[i].appendChild(blackPawn);
        }

    

    }
}

// async function ()