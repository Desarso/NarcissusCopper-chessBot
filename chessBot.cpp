#include <iostream>
#include <chrono>
#include <map>
#include <vector>
#include <string>


using std::cout;
using std::vector;
using std::string;

//program needs to convert into fen strings
//it should be as simple as possible
//need a minimax function that returns the next move
//this minimax function will be different from previous
//I also need to include a lot of trimming and beam search, etc

const char emptySpace = '-';
const char whiteRook = 'R';
const char whiteKnight = 'N';
const char whiteBishop = 'B';
const char whiteQueen = 'Q';
const char whiteKing = 'K';
const char whitePawn = 'P';
const char blackRook = 'r';
const char blackKnight = 'n';
const char blackBishop = 'b';
const char blackQueen = 'q';
const char blackKing = 'k';
const char blackPawn = 'p';
const int spaceUp = -8;
const int spaceDown = 8;
const int left = -1;
const int right = 1;
const int leftUp = -9;
const int rightUp = -7;
const int leftDown = 7;
const int rightDown = 9;
const int COLORDELIMITER = 91;

//horse constants;
const int KUPLEFT = -17;
const int KUPRIGHT = -15;
const int KDOWNLEFT = 15;
const int KDOWNRIGHT = 17;
const int KLEFTUP = -10;
const int KLEFTDOWN = 6;
const int KRIGHTUP = -6;
const int KIRGHTDOWN = 10;

const int ROWZISE = 8;
const int LEFTCOLUMN = 0;
const int ONEFROMLEFT = 1;
const int RIGHTCOLUMN = 7;
const int ONEFROMRIGHT = 6;
const int TWOROWSFROMTOP = 16;
const int ONEROWFROMTOP = 8;
const int ONEROWFROMBOTTOM = 56;
const int TWOROWFROMBOTTOM = 48;
const int MAXBOARDINDEX = 63;
const int CHAR = 0;

bool whiteKingHasMoved = false;
bool blackKingHasMoved = false;


void findPossibleMoves(vector<int> &moves, vector<char> chessBoard, int &index, int* previousMove);
int firstOfRowFunc(int &index);
void findRockMoves(vector<char> chessBoard, int &index, vector<int> &moves);
void findBishopMoves(vector<char> chessBoard, int &index, vector<int> &moves);
void findHorseMoves(vector<char> chessBoard, int &index, vector<int> &moves);
void findQueenMoves(vector<char> chessBoard, int &index, vector<int> &moves);
void findKingMoves(vector<char> chessBoard, int &index, vector<int> &moves);
void movements(vector<int> &moves, vector<char> chessBoard);
void findPawnMoves(vector<char> chessBoard, int &index, vector<int> &moves, int* previousMove);
int fact(float& num);
void singleMove(vector<int> &moves, vector<char> chessBoard);


int main(){
     auto start = std::chrono::high_resolution_clock::now();
    

    // vector<char> chessBoard = { 'r','n','b','q','k','b','n','r',
    //                             'p','p','p','p','p','p','p','p',
    //                             '-','-','-','-','-','-','-','-',
    //                             '-','-','-','-','-','-','-','-',
    //                             '-','-','-','-','-','-','-','-',
    //                             '-','-','-','-','-','-','-','-',
    //                             'P','P','P','P','P','P','P','P',
    //                             'R','N','B','Q','K','B','N','R',
    //                             'b'
    //                         };
    
    vector<char> chessBoard = { 't','-','-','-','k','-','-','t',
                                '-','-','-','-','-','-','-','-',
                                '-','-','-','-','-','-','-','-',
                                '-','-','-','-','-','-','-','-',
                                '-','-','-','-','-','-','-','-',
                                '-','-','-','-','-','-','-','-',
                                '-','-','-','-','-','-','-','-',
                                'T','-','-','-','K','-','-','T',
                                'b'
                            };
                            

    int previousMove [2] = {8,16};
    vector<int> moves ={};
    for(int i=0;i<64;i++){
        if(chessBoard[i] != emptySpace){
              findPossibleMoves(moves, chessBoard, i, previousMove);
        }
    }



//     movements(moves, chessBoard);


    cout << "\n";
    if(moves.size()>0){
        for(int i=0; i<moves.size()-1; i=i+2){
            cout << "("<<moves[i]<<"," << moves[i+1]<<")";
        }
        cout<<".";
    }

    vector<int> oneMove = {96,96};

    singleMove(oneMove, chessBoard);



//     // cout << "\n\nNumber of moves: " << moves.size()/2;

    auto stop = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(stop - start);
    double microseconds = duration.count();
    double milliseconds = microseconds/1000;
    cout << "\nTime taken: " << microseconds << " microseconds";
}

//currently pieces don't know they can eat enemy pieces, need to add this behavior.

void findPossibleMoves(vector<int> &moves, vector<char> chessBoard, int &index, int* previousMove){
    //calculate possible moves for black
    if(chessBoard[64] == 'b'){
        //rook moves
        if(chessBoard[index] == blackRook || chessBoard[index] == whiteRook || chessBoard[index] == 'T' || chessBoard[index] == 't'){
            findRockMoves(chessBoard, index, moves);    
        }
        //biship moves
        if(chessBoard[index] == blackBishop || chessBoard[index] == whiteBishop){
            findBishopMoves(chessBoard, index, moves);
        }
        //knight moves
        if(chessBoard[index] == blackKnight || chessBoard[index] == whiteKnight){
            findHorseMoves(chessBoard, index, moves);
        }
        //queen moves
        if(chessBoard[index] == blackQueen || chessBoard[index] == whiteQueen){
            findQueenMoves(chessBoard, index, moves);
        }
        //king moves
        if(chessBoard[index] == blackKing || chessBoard[index] == whiteKing){
            findKingMoves(chessBoard, index, moves );
        }
        if(chessBoard[index] == blackPawn || chessBoard[index] == whitePawn){
            findPawnMoves(chessBoard, index, moves, previousMove);
        }
    }

  

}

int firstOfRowFunc(int &index){
    if(index>=56) return 56;
    if(index>=48) return 48;
    if(index>=32) return 32;
    if(index>=24) return 24;
    if(index>=16) return 16;
    if(index>=8) return 8;
    return 0;
}

void findRockMoves(vector<char> chessBoard, int &index, vector<int> &moves){
    int firstOfRow = firstOfRowFunc(index);
    if(chessBoard[index] = 't'){
        chessBoard[index] = 'r';
    }
    if(chessBoard[index] = 'T'){
        chessBoard[index] = 'R';
    }


    if(chessBoard[index] == blackRook){
            for(int i=1;i<8;i++){
                if(index-i >= firstOfRow && (chessBoard[index-i]-0 < COLORDELIMITER || chessBoard[index-i] == emptySpace)){
                    moves.push_back(index);
                    moves.push_back(-i);
                    if(chessBoard[index-i] != emptySpace){
                        break;
                    }
                }else{
                    break;
                }
            }
            for(int i=1;i<8;i++){
                if(index+i < firstOfRow+8 && (chessBoard[index+i]-0 < 91 || chessBoard[index+i] == emptySpace)){
                    moves.push_back(index);
                    moves.push_back(i);
                    if(chessBoard[index+i] != emptySpace){
                        break;
                    }
                }else{
                    break;
                }
            }
            for(int i=8;i<57;i=i+8){
                if(index+i <= 63 && (chessBoard[index+i]-0 < 91 || chessBoard[index+i] == emptySpace)){
                    moves.push_back(index);
                    moves.push_back(i);
                    if(chessBoard[index+i] != emptySpace){
                        break;
                    }
                }else{
                    break;
                }
            }
            for(int i=8;i<57;i=i+8){
            //add or subtract 8 to go up or down
                if(index-i >= 0 && (chessBoard[index-i]-0 < COLORDELIMITER || chessBoard[index-i] == emptySpace)){
                    moves.push_back(index);
                    moves.push_back(-i);
                    if(chessBoard[index-i] != emptySpace){
                        break;
                    }
                }else{
                    break;
                }
            }  
    }
    if(chessBoard[index] == whiteRook){
                //left and right moves
        for(int i=1;i<8;i++){
            if(index-i >= firstOfRow && (chessBoard[index-i]-0 > COLORDELIMITER || chessBoard[index-i] == emptySpace)){
                moves.push_back(index);
                moves.push_back(-i);
                if(chessBoard[index-i] != emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
        for(int i=1;i<8;i++){
            if(index+i < firstOfRow+8 && (chessBoard[index+i]-0 > 91 || chessBoard[index+i] == emptySpace)){
                moves.push_back(index);
                moves.push_back(i);
                if(chessBoard[index+i] != emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
        for(int i=8;i<57;i=i+8){
            if(index+i <= 63 && (chessBoard[index+i]-0 > 91 || chessBoard[index+i] == emptySpace)){
                moves.push_back(index);
                moves.push_back(i);
                if(chessBoard[index+i] != emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
        for(int i=8;i<57;i=i+8){
        //add or subtract 8 to go up or down
            if(index-i >= 0 && (chessBoard[index-i]-0 > 91 || chessBoard[index-i] == emptySpace)){
                moves.push_back(index);
                moves.push_back(-i);
                if(chessBoard[index-i] != emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
    }
    //here we check for moves that remove castling rights, that is the first move.
    //the thing is that castling rights need to be kept track of with the board state, so they should be calculated at the time the move is made,
    //since that is when the new board state is created, all castling rights should therefore be created at the move function where the new board state is created. 
    //so for minimax the move function should take in a board, castlingRigths, and a single move, but the problem is that, the function only return one thing.
    //maybe the board should be an object but that would likely slow things down, or maybe we should combine castling rights, maybe the rocks can be a different, letter
    //when they can castle that seems like the easiest choice, that would not take up any more data, and would allow for the castlingrights to be stored in the
    //board array, so rook right now is represented by R and r, but maybe when they can castle they can be T and t for tower. So, at the begging state,
    //they start out as T, and t but when they move they turn to R and r and also the king will turn it when moving. 

}
//bishops can move and eat now
void findBishopMoves(vector<char> chessBoard, int &index, vector<int> &moves){

    if(chessBoard[index] == blackBishop){
            //moves down and to the right
        for(int i=9;i<=MAXBOARDINDEX;i=i+9){
            if(index%8 == 7 || index >= 56){ break;}
            if(index+i <= 63 && (chessBoard[index+i]-0 < 91)){
                // cout << "moved";
                moves.push_back(index);
                moves.push_back(i);
                if((index+i)%8 == 7 || index+i>=56 || chessBoard[index+i] != emptySpace){
                    // cout << "Broke at index: " << index+i << "\n\n";
                    break;
                }
            }
            if(chessBoard[index+i] != emptySpace){
                break;
            }

        }
        //moves up and to the the left.
        for(int i=9;i<=MAXBOARDINDEX;i=i+9){
            if(index%8 == 0 || index <= 7){ break;}
            if(index-i <= 63 && (chessBoard[index-i]-0 < 91)){
                // cout << "moved";
                moves.push_back(index);
                moves.push_back(-i);
                if((index-i)%8 == 0 || index-i <= 7 || chessBoard[index-i] != emptySpace){
                    break;
                }
            }
            cout << "chessBoard[index+i]: " << chessBoard[index+i] << "\n\n";
            if(chessBoard[index-i] != emptySpace){
                break;
            }
        }
        //moves down and to the left
        for(int i=7;i<=MAXBOARDINDEX;i=i+7){
            //down and to the right needs to exit when on the left or down
            if(index%8 == 0 || index >= 56){ break;}
            if(index+i <= 63 && (chessBoard[index+i]-0 < 91)){
                // cout << "moved";
                moves.push_back(index);
                moves.push_back(i);
                if((index+i)%8 == 0 || index+i>=56 || chessBoard[index+i] != emptySpace){
                    break;
                }
            }
            if(chessBoard[index+i] != emptySpace){
                break;
            }
        }
        // move up and to the right;
        for(int i=7;i<=MAXBOARDINDEX;i=i+7){
            if(index%8 == 7 || index <= 7){ break;}
            if(index-i <= 63 && (chessBoard[index-i]-0 < 91)){
                moves.push_back(index);
                moves.push_back(-i);
                if((index-i)%8 == 7 || index+i <= 7 || chessBoard[index-i] != emptySpace){
                    break;
                }
            }
            if(chessBoard[index-i] != emptySpace){
                break;
            }
        } 
    }

    if(chessBoard[index] == whiteBishop){
        //moves down and to the right
        for(int i=9;i<=63;i=i+9){
            if(index%8 == 7 || index >= 56){ break;}
            if(index+i <= 63 && (chessBoard[index+i]-0 > 91)){
                // cout << "moved";
                moves.push_back(index);
                moves.push_back(i);
                if((index+i)%8 == 7 || index+i>=56 || chessBoard[index+i] != emptySpace){
                    // cout << "Broke at index: " << index+i << "\n\n";
                    break;
                }
            }
            if(chessBoard[index+i] != emptySpace){
                break;
            }
        }
        //moves up and to the the left.
        for(int i=9;i<=63;i=i+9){
            if(index%8 == 0 || index <= 7){ break;}
            if(index-i <= 63 && (chessBoard[index-i]-0 > 91)){
                // cout << "moved";
                moves.push_back(index);
                moves.push_back(-i);
                if((index-i)%8 == 0 || index-i <= 7 || chessBoard[index-i] != emptySpace){
                    break;
                }
            }
            if(chessBoard[index-i] != emptySpace){
                break;
            }
        }
        //moves down and to the left
        for(int i=7;i<=63;i=i+7){
            //down and to the right needs to exit when on the left or down
            if(index%8 == 0 || index >= 56){ break;}
            if(index+i <= 63 && (chessBoard[index+i]-0 > 91)){
                // cout << "moved";
                moves.push_back(index);
                moves.push_back(i);
                if((index+i)%8 == 0 || index+i>=56 || chessBoard[index+i] != emptySpace){
                    break;
                }
            }
            if(chessBoard[index+i] != emptySpace){
                break;
            }
        }
        // move up and to the right;
        for(int i=7;i<=63;i=i+7){
            if(index%8 == 7 || index <= 7){ break;}
            if(index-i <= 63 && (chessBoard[index-i]-0 > 91)){
                moves.push_back(index);
                moves.push_back(-i);
                if((index-i)%8 == 7 || index+i <= 7 || chessBoard[index-i] != emptySpace){
                    break;
                }
            }
            if(chessBoard[index-i] != emptySpace){
                break;
            }
        } 
    }
    
}

//horse can move and eat now
void findHorseMoves(vector<char> chessBoard, int &index, vector<int> &moves){

    if(chessBoard[index] == blackKnight){
         //UP AND LEFT
            // cout << "index: " << index << "\n\n";
            // cout << "chessboard[index]: " << chessBoard[index] << "\n\n";
        if(index >= TWOROWSFROMTOP && index%ROWZISE != LEFTCOLUMN &&(chessBoard[index+KUPLEFT] == emptySpace || chessBoard[index+KUPLEFT]-0 < COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KUPLEFT);
        }
        //UP AND RIGHT
        if(index >= TWOROWSFROMTOP && index%ROWZISE != RIGHTCOLUMN &&(chessBoard[index+KUPRIGHT] == emptySpace || chessBoard[index+KUPRIGHT]-0 < COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KUPRIGHT);
        }
        //DOWN AND LEFT
        if(index < TWOROWFROMBOTTOM && index%ROWZISE != LEFTCOLUMN &&(chessBoard[index+KDOWNLEFT] == emptySpace || chessBoard[index+KDOWNLEFT]-0 < COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KDOWNLEFT);
        }
        //DOWN AND RIGHT
        if(index < TWOROWFROMBOTTOM && index%ROWZISE != RIGHTCOLUMN &&(chessBoard[index+KDOWNRIGHT] == emptySpace || chessBoard[index+KDOWNRIGHT]-0 < COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KDOWNRIGHT);
        }
        
        //LEFT AND UP
        if(index >= ONEROWFROMTOP && (index%ROWZISE !=LEFTCOLUMN && index%ROWZISE != ONEFROMLEFT) &&(chessBoard[index+KLEFTUP] == emptySpace || chessBoard[index+KLEFTUP]-0 < COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KLEFTUP);
        }
        //LEFT AND DOWN
        if(index < ONEROWFROMBOTTOM && (index%ROWZISE !=LEFTCOLUMN && index%ROWZISE != ONEFROMLEFT) &&(chessBoard[index+KLEFTDOWN] == emptySpace || chessBoard[index+KLEFTDOWN]-0 < COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KLEFTDOWN);
        }
        //RIGHT AND UP
        if(index >= ONEROWFROMTOP && index%ROWZISE !=RIGHTCOLUMN && index%ROWZISE != ONEFROMRIGHT &&(chessBoard[index+KRIGHTUP] == emptySpace || chessBoard[index+KRIGHTUP]-0 < COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KRIGHTUP);
        }
        //RIGHT AND DOWN
        if(index < ONEROWFROMBOTTOM && index%ROWZISE !=RIGHTCOLUMN && index%ROWZISE != ONEFROMRIGHT &&(chessBoard[index+KIRGHTDOWN] == emptySpace || chessBoard[index+KIRGHTDOWN]-0 < COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KIRGHTDOWN);
        }
    }
    if(chessBoard[index] == whiteKnight){
                //UP AND LEFT
            // cout << "index: " << index << "\n\n";
            // cout << "chessboard[index]: " << chessBoard[index] << "\n\n";
        if(index >= TWOROWSFROMTOP && index%ROWZISE != LEFTCOLUMN &&(chessBoard[index+KUPLEFT] == emptySpace || chessBoard[index+KUPLEFT]-0 > COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KUPLEFT);
        }
        //UP AND RIGHT
        if(index >= TWOROWSFROMTOP && index%ROWZISE != RIGHTCOLUMN &&(chessBoard[index+KUPRIGHT] == emptySpace || chessBoard[index+KUPRIGHT]-0 > COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KUPRIGHT);
        }
        //DOWN AND LEFT
        if(index < TWOROWFROMBOTTOM && index%ROWZISE != LEFTCOLUMN &&(chessBoard[index+KDOWNLEFT] == emptySpace || chessBoard[index+KDOWNLEFT]-0 > COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KDOWNLEFT);
        }
        //DOWN AND RIGHT
        if(index < TWOROWFROMBOTTOM && index%ROWZISE != RIGHTCOLUMN &&(chessBoard[index+KDOWNRIGHT] == emptySpace || chessBoard[index+KDOWNRIGHT]-0 > COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KDOWNRIGHT);
        }
        
        //LEFT AND UP
        if(index >= ONEROWFROMTOP && (index%ROWZISE !=LEFTCOLUMN && index%ROWZISE != ONEFROMLEFT) &&(chessBoard[index+KLEFTUP] == emptySpace || chessBoard[index+KLEFTUP]-0 > COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KLEFTUP);
        }
        //LEFT AND DOWN
        if(index < ONEROWFROMBOTTOM && (index%ROWZISE !=LEFTCOLUMN && index%ROWZISE != ONEFROMLEFT) &&(chessBoard[index+KLEFTDOWN] == emptySpace || chessBoard[index+KLEFTDOWN]-0 > COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KLEFTDOWN);
        }
        //RIGHT AND UP
        if(index >= ONEROWFROMTOP && index%ROWZISE !=RIGHTCOLUMN && index%ROWZISE != ONEFROMRIGHT &&(chessBoard[index+KRIGHTUP] == emptySpace || chessBoard[index+KRIGHTUP]-0 > COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KRIGHTUP);
        }
        //RIGHT AND DOWN
        if(index < ONEROWFROMBOTTOM && index%ROWZISE !=RIGHTCOLUMN && index%ROWZISE != ONEFROMRIGHT &&(chessBoard[index+KIRGHTDOWN] == emptySpace || chessBoard[index+KIRGHTDOWN]-0 > COLORDELIMITER )){
            moves.push_back(index);
            moves.push_back(KIRGHTDOWN);
        } 
    }

}

//queen knows to eat
void findQueenMoves(vector<char> chessBoard, int &index, vector<int> &moves){
    int firstOfRow = firstOfRowFunc(index);
    if(chessBoard[index] == blackQueen){
         //left and right moves
        for(int i=1;i<8;i++){
            if(index-i >= firstOfRow && (chessBoard[index-i]-0 < COLORDELIMITER || chessBoard[index-i] == emptySpace)){
                moves.push_back(index);
                moves.push_back(-i);
                if(chessBoard[index-i] != emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
        for(int i=1;i<8;i++){
            if(index+i < firstOfRow+8 && (chessBoard[index+i]-0 < 91 || chessBoard[index+i] == emptySpace)){
                moves.push_back(index);
                moves.push_back(i);
                if(chessBoard[index+i] != emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
        for(int i=8;i<57;i=i+8){
            if(index+i <= 63 && (chessBoard[index+i]-0 < 91 || chessBoard[index+i] == emptySpace)){
                moves.push_back(index);
                moves.push_back(i);
                if(chessBoard[index+i] != emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
        for(int i=8;i<57;i=i+8){
        //add or subtract 8 to go up or down
            if(index-i >= 0 && (chessBoard[index-i]-0 < COLORDELIMITER || chessBoard[index-i] == emptySpace)){
                moves.push_back(index);
                moves.push_back(-i);
                if(chessBoard[index-i] != emptySpace){
                    break;
                }
            }else{
                break;
            }
        }

          //moves down and to the right
        for(int i=9;i<=MAXBOARDINDEX;i=i+9){
            if(index%8 == 7 || index >= 56){ break;}
            if(index+i <= 63 && (chessBoard[index+i]-0 < 91)){
                // cout << "moved";
                moves.push_back(index);
                moves.push_back(i);
                if((index+i)%8 == 7 || index+i>=56 || chessBoard[index+i] != emptySpace){
                    // cout << "Broke at index: " << index+i << "\n\n";
                    break;
                }
            }
            if(chessBoard[index+i] != emptySpace){
                break;
            }

        }
        //moves up and to the the left.
        for(int i=9;i<=MAXBOARDINDEX;i=i+9){
            if(index%8 == 0 || index <= 7){ break;}
            if(index-i <= 63 && (chessBoard[index-i]-0 < 91)){
                // cout << "moved";
                moves.push_back(index);
                moves.push_back(-i);
                if((index-i)%8 == 0 || index-i <= 7 || chessBoard[index-i] != emptySpace){
                    break;
                }
            }
            if(chessBoard[index-i] != emptySpace){
                break;
            }
        }
        //moves down and to the left
        for(int i=7;i<=MAXBOARDINDEX;i=i+7){
            //down and to the right needs to exit when on the left or down
            if(index%8 == 0 || index >= 56){ break;}
            if(index+i <= 63 && (chessBoard[index+i]-0 < 91)){
                // cout << "moved";
                moves.push_back(index);
                moves.push_back(i);
                if((index+i)%8 == 0 || index+i>=56 || chessBoard[index+i] != emptySpace){
                    break;
                }
            }
            if(chessBoard[index+i] != emptySpace){
                break;
            }
        }
        // move up and to the right;
        for(int i=7;i<=MAXBOARDINDEX;i=i+7){
            if(index%8 == 7 || index <= 7){ break;}
            if(index-i <= 63 && (chessBoard[index-i]-0 < 91)){
                moves.push_back(index);
                moves.push_back(-i);
                if((index-i)%8 == 7 || index+i <= 7 || chessBoard[index-i] != emptySpace){
                    break;
                }
            }
            if(chessBoard[index-i] != emptySpace){
                break;
            }
        } 
    }
    if(chessBoard[index] == whiteQueen){
         //left and right moves
        for(int i=1;i<8;i++){
            if(index-i >= firstOfRow && (chessBoard[index-i]-0 > COLORDELIMITER || chessBoard[index-i] == emptySpace)){
                moves.push_back(index);
                moves.push_back(-i);
                if(chessBoard[index-i] != emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
        for(int i=1;i<8;i++){
            if(index+i < firstOfRow+8 && (chessBoard[index+i]-0 > 91 || chessBoard[index+i] == emptySpace)){
                moves.push_back(index);
                moves.push_back(i);
                if(chessBoard[index+i] != emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
        for(int i=8;i<57;i=i+8){
            if(index+i <= 63 && (chessBoard[index+i]-0 > 91 || chessBoard[index+i] == emptySpace)){
                moves.push_back(index);
                moves.push_back(i);
                if(chessBoard[index+i] != emptySpace){
                    break;
                }
            }else{
                break;
            }
        }
        for(int i=8;i<57;i=i+8){
        //add or subtract 8 to go up or down
            if(index-i >= 0 && (chessBoard[index-i]-0 > 91 || chessBoard[index-i] == emptySpace)){
                moves.push_back(index);
                moves.push_back(-i);
                if(chessBoard[index-i] != emptySpace){
                    break;
                }
            }else{
                break;
            }
        }

       //moves down and to the right
        for(int i=9;i<=63;i=i+9){
            if(index%8 == 7 || index >= 56){ break;}
            if(index+i <= 63 && (chessBoard[index+i]-0 > 91)){
                // cout << "moved";
                moves.push_back(index);
                moves.push_back(i);
                if((index+i)%8 == 7 || index+i>=56 || chessBoard[index+i] != emptySpace){
                    // cout << "Broke at index: " << index+i << "\n\n";
                    break;
                }
            }
            if(chessBoard[index+i] != emptySpace){
                break;
            }
        }
        //moves up and to the the left.
        for(int i=9;i<=63;i=i+9){
            if(index%8 == 0 || index <= 7){ break;}
            if(index-i <= 63 && (chessBoard[index-i]-0 > 91)){
                // cout << "moved";
                moves.push_back(index);
                moves.push_back(-i);
                if((index-i)%8 == 0 || index-i <= 7 || chessBoard[index-i] != emptySpace){
                    break;
                }
            }
            if(chessBoard[index-i] != emptySpace){
                break;
            }
        }
        //moves down and to the left
        for(int i=7;i<=63;i=i+7){
            //down and to the right needs to exit when on the left or down
            if(index%8 == 0 || index >= 56){ break;}
            if(index+i <= 63 && (chessBoard[index+i]-0 > 91)){
                // cout << "moved";
                moves.push_back(index);
                moves.push_back(i);
                if((index+i)%8 == 0 || index+i>=56 || chessBoard[index+i] != emptySpace){
                    break;
                }
            }
            if(chessBoard[index+i] != emptySpace){
                break;
            }
        }
        // move up and to the right;
        for(int i=7;i<=63;i=i+7){
            if(index%8 == 7 || index <= 7){ break;}
            if(index-i <= 63 && (chessBoard[index-i]-0 > 91)){
                moves.push_back(index);
                moves.push_back(-i);
                if((index-i)%8 == 7 || index+i <= 7 || chessBoard[index-i] != emptySpace){
                    break;
                }
            }
            if(chessBoard[index-i] != emptySpace){
                break;
            }
        } 
      
}
}
//king knows to eat - needs to learn castling
void findKingMoves(vector<char> chessBoard, int &index, vector<int> &moves){
    
    int firstOfRow = firstOfRowFunc(index);

//first we check if castling is possible.
    if(chessBoard[index] == blackKing){
        //the blackKing begins at index position 4;
        //it must check that position 1,2,3 are clear.
        //for queen side castling.
        //and for 5,6 to be clear for king side, as well
        //ass check that the rook is a t
        if(chessBoard[0] == 't' && chessBoard[1] == emptySpace && chessBoard[2] == emptySpace && chessBoard[3] ==  emptySpace){
           moves.push_back(99);
           moves.push_back(99);
        }
        
        if(chessBoard[7] == 't' && chessBoard[5] == emptySpace && chessBoard[6] == emptySpace){
            moves.push_back(98);
            moves.push_back(98);
        }
        blackKingHasMoved = true;
      
      //the index for the other rooks are 56 and 63;
        
    }

    if(chessBoard[index] == whiteKing){
        //for white king the index position is 60
        //for queen side it must check 59,58,57
        //for king side it must check 61,62

        if(chessBoard[56] == 'T' && chessBoard[59] == emptySpace && chessBoard[58] == emptySpace && chessBoard[57] == emptySpace){
              moves.push_back(97);
              moves.push_back(97);
        }
        if(chessBoard[63] == 'T' && chessBoard[61] == emptySpace && chessBoard[62] == emptySpace){
            moves.push_back(96);
            moves.push_back(96);
        }

    }
 
if(chessBoard[index] == blackKing){
    // cout << "made it";
    // cout << chessBoard[index+7]-0;
    if((index+left >= firstOfRow )&& (chessBoard[index+left]-CHAR < COLORDELIMITER || chessBoard[index+left] == emptySpace)){
                moves.push_back(index);
                moves.push_back(left);
    }
    if((index+right < firstOfRow+ROWZISE )&& (chessBoard[index+right]-CHAR < COLORDELIMITER || chessBoard[index+right] == emptySpace)){
                moves.push_back(index);
                moves.push_back(right);
    }
    if((index+spaceDown <= MAXBOARDINDEX )&& (chessBoard[index+spaceDown]-CHAR < COLORDELIMITER || chessBoard[index+spaceDown] == emptySpace)){
                moves.push_back(index);
                moves.push_back(spaceDown);
    }
    if((index+spaceUp >= 0 ) && (chessBoard[index+spaceUp]-CHAR < COLORDELIMITER || chessBoard[index+spaceUp] == emptySpace)){
                moves.push_back(index);
                moves.push_back(spaceUp);
    }
    

    if((index+rightDown <= MAXBOARDINDEX  && (index%ROWZISE != RIGHTCOLUMN && index < MAXBOARDINDEX ))&&(chessBoard[index+rightDown]-CHAR < COLORDELIMITER || chessBoard[index+rightDown] == emptySpace)){
        moves.push_back(index);
        moves.push_back(rightDown);
    }
    if((index+leftUp <= MAXBOARDINDEX && (index%ROWZISE != LEFTCOLUMN && index >= ONEROWFROMTOP  ))&&(chessBoard[index+leftUp]-CHAR < COLORDELIMITER || chessBoard[index+leftUp] == emptySpace)){
        moves.push_back(index);
        moves.push_back(leftUp);
    }
    if((index+leftDown <= MAXBOARDINDEX  && (index%ROWZISE != LEFTCOLUMN && index < MAXBOARDINDEX )) && (chessBoard[index+leftDown]-CHAR < COLORDELIMITER || chessBoard[index+leftDown] == emptySpace)){
        moves.push_back(index);
        moves.push_back(leftDown);
    }
    if((index+rightUp <= MAXBOARDINDEX &&  (index%ROWZISE != RIGHTCOLUMN && index >= ONEROWFROMTOP  )) && (chessBoard[index+rightUp]-CHAR < COLORDELIMITER || chessBoard[index+rightUp] == emptySpace)){
        moves.push_back(index);
        moves.push_back(rightUp);
    }
    
}
if(chessBoard[index] == whiteKing){
    // cout << "made it";
    // cout << chessBoard[index+7]-0;
    if((index+left >= firstOfRow )&& (chessBoard[index+left]-CHAR > COLORDELIMITER || chessBoard[index+left] == emptySpace)){
                moves.push_back(index);
                moves.push_back(left);
    }
    if((index+right < firstOfRow+ROWZISE )&& (chessBoard[index+right]-CHAR > COLORDELIMITER || chessBoard[index+right] == emptySpace)){
                moves.push_back(index);
                moves.push_back(right);
    }
    if((index+spaceDown <= MAXBOARDINDEX )&& (chessBoard[index+spaceDown]-CHAR > COLORDELIMITER || chessBoard[index+spaceDown] == emptySpace)){
                moves.push_back(index);
                moves.push_back(spaceDown);
    }
    if((index+spaceUp >= 0 ) && (chessBoard[index+spaceUp]-CHAR > COLORDELIMITER || chessBoard[index+spaceUp] == emptySpace)){
                moves.push_back(index);
                moves.push_back(spaceUp);
    }
    
    if((index+rightDown <= MAXBOARDINDEX  && (index%ROWZISE != RIGHTCOLUMN && index < MAXBOARDINDEX ))&&(chessBoard[index+rightDown]-CHAR > COLORDELIMITER || chessBoard[index+rightDown] == emptySpace)){
        moves.push_back(index);
        moves.push_back(rightDown);
    }
    if((index+leftUp <= MAXBOARDINDEX && (index%ROWZISE != LEFTCOLUMN && index > ONEROWFROMTOP  ))&&(chessBoard[index+leftUp]-CHAR > COLORDELIMITER || chessBoard[index+leftUp] == emptySpace)){
        moves.push_back(index);
        moves.push_back(leftUp);
    }
    if((index+leftDown <= MAXBOARDINDEX  && (index%ROWZISE != LEFTCOLUMN && index < MAXBOARDINDEX )) && (chessBoard[index+leftDown]-CHAR > COLORDELIMITER || chessBoard[index+leftDown] == emptySpace)){
        moves.push_back(index);
        moves.push_back(leftDown);
    }
    if((index+rightUp <= MAXBOARDINDEX &&  (index%ROWZISE != RIGHTCOLUMN && index > ONEROWFROMTOP  )) && (chessBoard[index+rightUp]-CHAR > COLORDELIMITER || chessBoard[index+rightUp] == emptySpace)){
        moves.push_back(index);
        moves.push_back(rightUp);
    }
    
}
      
}

//pawns are officially done
void findPawnMoves(vector<char> chessBoard, int &index, vector<int> &moves, int* previousMove ){
    //pawsns know everything except how to do en-paissant.
    //pawns can only do on-passent when directly adjacent
    //pawns can only do en paessant if, they a pawn jumps directly next to them
    //by doing a double pawn move, this seems difficult to track. 
    //In order to be able to keep track of em-passent, I need to pay attention to pawsn that are on the 5th
    //then we keep track of previous move, and check if the there is pawns from the opposite team next to it.
    //then if the previous move was that exact double pawn move, then we add on-passant is possible.` `

    //for black pawns we need to check if the pawn is between the numbers 
    //chessBoard[index] >= 32 && <= 39;
    //and then check if index plus or minus one has a pawn,
    //and then check if the previous move is from one of the pawns,
    //and the also check if the pawn moved either -16, or 16 in the previous move.
    //if all of these are true then we use on-passant, which is a diagonal movement, but we eat the pawn,
    //that is next to us.  

    if(chessBoard[index] == blackPawn && index < ONEROWFROMBOTTOM){
        //can move forward
        if(chessBoard[index+spaceDown] == emptySpace){
            moves.push_back(index);
            moves.push_back(spaceDown);
        }
        //this part of the code deals with en-peassant
        if(index >=32 && index <= 39){
            if(chessBoard[index+right] == whitePawn){
                if(previousMove[0]+previousMove[1] == index+1 && previousMove[1] == -16){
                    moves.push_back(index);
                    moves.push_back(rightDown);
                }
            }
            if(chessBoard[index+left] == whitePawn){
                if(previousMove[0]+previousMove[1] == index+1 && previousMove[1] == -16){
                    moves.push_back(index);
                    moves.push_back(leftDown);
                }
            }
        }
    
        //the reast deals with eating and double forward
        if(chessBoard[index+rightDown] != emptySpace && chessBoard[index+rightDown]-0 < COLORDELIMITER){
            moves.push_back(index);
            moves.push_back(rightDown);
        }
        if(chessBoard[index+leftDown] != emptySpace && chessBoard[index+leftDown]-0 < COLORDELIMITER){
            moves.push_back(index);
            moves.push_back(leftDown);
        }
        if(index <= 15 && index >= 8 && chessBoard[index+(spaceDown*2)] == emptySpace){
            moves.push_back(index);
            moves.push_back(spaceDown*2);
        }
    }

    if(chessBoard[index] == whitePawn && index >= ONEROWFROMTOP){
        if(chessBoard[index+spaceUp] == emptySpace){
            moves.push_back(index);
            moves.push_back(spaceUp);
        }
        //for the white pawns it is different numbers
       

         if(index >=24 && index <= 31){
                 cout << "made it  "<< index << " " << index+left << "\n\n";
            if(chessBoard[index+right] == blackPawn){
                if(previousMove[0]+previousMove[1] == index+right && previousMove[1] == -16){
                    moves.push_back(index);
                    moves.push_back(rightUp);
                }
            }
            if(chessBoard[index+left] == blackPawn){
                if(previousMove[0]+previousMove[1] == index+left && previousMove[1] == 16){
                    moves.push_back(index);
                    moves.push_back(leftUp);
                }
            }
        }
    
        if(chessBoard[index+rightUp] != emptySpace && chessBoard[index+rightUp]-0 > COLORDELIMITER){
            moves.push_back(index);
            moves.push_back(rightUp);
        }
        if(chessBoard[index+leftUp] != emptySpace && chessBoard[index+leftUp]-0 > COLORDELIMITER){
            moves.push_back(index);
            moves.push_back(leftUp);
        }
        if(index <= 55 && index >= 48 && chessBoard[index+(spaceUp*2)] == emptySpace){
            moves.push_back(index);
            moves.push_back(spaceUp*2);
        }
    }
}

void movements(vector<int> &moves, vector<char> chessBoard){
    vector<char> newBoard;
    char pieceToMove;

    for(int i=0;i<moves.size(); i=i+2){
        pieceToMove = chessBoard[moves[i]];

        if(moves[i] == 99 && moves[i+1] == 99){
            
        }
         if(moves[i] == 98 && moves[i+1] == 98){
            
        }
         if(moves[i] == 97 && moves[i+1] == 97){
            
        }
         if(moves[i] == 96 && moves[i+1] == 96){
            
        }

        //if any rook os moves we turn it to a non-castalable rook
        if(pieceToMove == 'T'){
            pieceToMove = 'R';
        }
        if(pieceToMove == 't'){
            pieceToMove = 'r';
        }

       //checks if move is un-peasant to remove piece from board.
        if(pieceToMove == blackPawn){
            if(moves[i+1] == leftDown && (chessBoard[moves[i]+moves[i+1]]) == emptySpace){
                chessBoard[moves[i]+left] = emptySpace;
            }
            if(moves[i+1] == rightDown && (chessBoard[moves[i]+moves[i+1]]) == emptySpace){
                chessBoard[moves[i]+right] = emptySpace;
            }
        }
        if(pieceToMove == whitePawn){
            // cout<< chessBoard[moves[i]+moves[i+1]] << " leftUp: " << left << "moves[i]: " << moves[i] << "\n\n";
            if(moves[i+1] == leftUp && (chessBoard[moves[i]+moves[i+1]]) == emptySpace){
                // cout << "set: " << moves[i]+left << " to empty" << "\n\n";
                chessBoard[moves[i]+left] = emptySpace;
            }
            if(moves[i+1] == rightUp && (chessBoard[moves[i]+moves[i+1]]) == emptySpace){
                chessBoard[moves[i]+right] = emptySpace;
            }
        }
        chessBoard[moves[i]+moves[i+1]] = pieceToMove;
    }

    //log out chessboard with overlapping moves
    for(int i=0;i<chessBoard.size()-1; i=i+8){
        cout << chessBoard[i]  << "," << chessBoard[i+1] << "," << chessBoard[i+2] << "," << chessBoard[i+3] << ","
        <<chessBoard[i+4] << "," << chessBoard[i+5] << "," << chessBoard[i+6] << "," << chessBoard[i+7] << ",\n";
    }
}

void singleMove(vector<int> &moves, vector<char> chessBoard){

     char pieceToMove;
     int i =0;
     pieceToMove = chessBoard[moves[0]];
        if(moves[i] == 99 && moves[i+1] == 99){
            chessBoard[4] = '-'; 
            chessBoard[0] = '-';
            chessBoard[1] = 'k';
            chessBoard[2] = 'r';
        }
         if(moves[i] == 98 && moves[i+1] == 98){
            chessBoard[4] = '-'; 
            chessBoard[7] = '-';
            chessBoard[5] = 'k';
            chessBoard[4] = 'r';
        }
         if(moves[i] == 97 && moves[i+1] == 97){
            chessBoard[60] = '-';
            chessBoard[56] = '-';
            chessBoard[58] = 'K';
            chessBoard[59] = 'R';
        }
         if(moves[i] == 96 && moves[i+1] == 96){
            chessBoard[60] = '-';
            chessBoard[63] = '-';
            chessBoard[62] = 'K';
            chessBoard[61] = 'R';
        }
     //this thing is doing en-passeant somehow`
        if(pieceToMove == blackPawn){
            if(moves[1] == leftDown && (chessBoard[moves[0]+moves[1]]) == emptySpace){
                chessBoard[moves[0]+left] = emptySpace;
            }
            if(moves[1] == rightDown && (chessBoard[moves[0]+moves[1]]) == emptySpace){
                chessBoard[moves[0]+right] = emptySpace;
            }
        }
        if(pieceToMove == whitePawn){
            // cout<< chessBoard[moves[i]+moves[i+1]] << " leftUp: " << left << "moves[i]: " << moves[i] << "\n\n";
            if(moves[1] == leftUp && (chessBoard[moves[0]+moves[1]]) == emptySpace){
                // cout << "set: " << moves[i]+left << " to empty" << "\n\n";
                chessBoard[moves[0]+left] = emptySpace;
            }
            if(moves[1] == rightUp && (chessBoard[moves[0]+moves[1]]) == emptySpace){
                chessBoard[moves[0]+right] = emptySpace;
            }
        }
        chessBoard[moves[0]] = emptySpace;
        chessBoard[moves[0]+moves[1]] = pieceToMove;

        cout << "\n";
         for(int i=0;i<chessBoard.size()-1; i=i+8){
        cout << chessBoard[i]  << "," << chessBoard[i+1] << "," << chessBoard[i+2] << "," << chessBoard[i+3] << ","
        <<chessBoard[i+4] << "," << chessBoard[i+5] << "," << chessBoard[i+6] << "," << chessBoard[i+7] << ",\n";
    }
}



