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
void findPossibleMoves(vector<int> &moves, vector<char> chessBoard, int &index, int* castlingRigths);
int firstOfRowFunc(int &index);
void findRockMoves(vector<char> chessBoard, int &index, vector<int> &moves);
void findBishopMoves(vector<char> chessBoard, int &index, vector<int> &moves);
void findHorseMoves(vector<char> chessBoard, int &index, vector<int> &moves);
void findQueenMoves(vector<char> chessBoard, int &index, vector<int> &moves);
void findKingMoves(vector<char> chessBoard, int &index, vector<int> &moves);
void move(vector<int> &moves, vector<char> chessBoard);
void findPawnMoves(vector<char> chessBoard, int &index, vector<int> &moves);

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
    vector<char> chessBoard = { '-','-','-','-','-','-','-','-',
                                '-','-','-','-','-','-','-','-',
                                '-','-','-','-','-','-','-','-',
                                '-','-','-','-','-','-','-','-',
                                '-','-','-','-','-','-','-','-',
                                '-','-','-','-','-','-','-','-',
                                '-','-','-','-','-','-','-','-',
                                '-','-','-','-','-','-','-','-',
                                'b'
                            };
                            
    int castlingRigths [4] = {1,1,1,1};

    //how to find all possible moves;
    //for a rock, we must check the spacest adjecent to it, and add it to possible moves
    //a rock can move its it's row in the array, and also in steps of 8
    //so it rock is at position two, we check 0,1,2,3,4,5,6,7, and 2+8=10; 10+8=18; 18+8=26; 26+8=34; 34+8=42; 42+8=50; 50+8=58; 
    //so the pattern is, we stat at it's position, then we left, right, up, down, and figure out where the nearest pieces are in each direction;

    vector<int> moves ={};
    for(int i=0;i<64;i++){
        if(chessBoard[i] != emptySpace){
              findPossibleMoves(moves, chessBoard, i, castlingRigths);
        }
    }

    move(moves, chessBoard);


    cout << "\n";
    if(moves.size()>0){
        for(int i=0; i<moves.size()-1; i=i+2){
            cout << "("<<moves[i]<<"," << moves[i+1]<<")";
        }
        cout<<".";
    }

    // cout << "\n\nNumber of moves: " << moves.size()/2;

    auto stop = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(stop - start);
    double microseconds = duration.count();
    double milliseconds = microseconds/1000;
    cout << "\nTime taken: " << microseconds << " microseconds";
}

//currently pieces don't know they can eat enemy pieces, need to add this behavior.


void findPossibleMoves(vector<int> &moves, vector<char> chessBoard, int &index, int* castlingRigths){
    //calculate possible moves for black
    if(chessBoard[64] == 'b'){
        //rook moves
        if(chessBoard[index] == blackRook){
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
            findKingMoves(chessBoard, index, moves);
        }
        if(chessBoard[index] == blackPawn || chessBoard[index] == whitePawn){
            findPawnMoves(chessBoard, index, moves);
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
        //left and right moves
        for(int i=1;i<ROWZISE;i++){
            int firstOfRow = firstOfRowFunc(index);
            if(index-i >= firstOfRow && chessBoard[index-i] == emptySpace){
                moves.push_back(index);
                moves.push_back(-i);
            }else{
                break;
            }
        }
        for(int i=1;i<ROWZISE;i++){
            int firstOfRow = firstOfRowFunc(index);
            if(index+i < firstOfRow+8 && chessBoard[index+i] == emptySpace){
                moves.push_back(index);
                moves.push_back(i);
            }else{
                break;
            }
        }
        //find up and down moves
        for(int i=ROWZISE;i<57;i=i+ROWZISE){
            if(index+i <= 63 && chessBoard[index+i] == emptySpace){
                moves.push_back(index);
                moves.push_back(i);
            }else{
                break;
            }
        }
        for(int i=ROWZISE;i<57;i=i+ROWZISE){
        //add or subtract 8 to go up or down
            if(index-i >= 0 && chessBoard[index-i] == emptySpace){
                moves.push_back(index);
                moves.push_back(-i);
            }else{
                break;
            }
        }
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
            cout<<"made it";
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

//pawns know to eat- need to leart em-peassant or whatever
void findPawnMoves(vector<char> chessBoard, int &index, vector<int> &moves){
    //pawsns know everything except how to do en-paissant.

    if(chessBoard[index] == blackPawn && index < ONEROWFROMBOTTOM){
        if(chessBoard[index+spaceDown] == emptySpace){
            moves.push_back(index);
            moves.push_back(spaceDown);
        }
    
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


void move(vector<int> &moves, vector<char> chessBoard){
    vector<char> newBoard;
    char pieceToMove;
    // for(int i=0;i<moves.size(); i=i+2){
    //     newBoard = chessBoard;
    //     pieceToMove = newBoard[moves[i]];
    //     // cout << "Piece to move: " << pieceToMove << "\n\n";
    //     // cout << "Number to add: " << moves[i+1] << "\n\n";
    //     newBoard[moves[i]] = emptySpace;
    //     newBoard[(moves[i]+moves[i+1])]= pieceToMove;
    //     for(int i=0;i<newBoard.size()-1; i=i+8){
    //         cout << newBoard[i]  << "," << newBoard[i+1] << "," << newBoard[i+2] << "," << newBoard[i+3] << ","
    //             <<newBoard[i+4] << "," << newBoard[i+5] << "," << newBoard[i+6] << "," << newBoard[i+7] << ",\n";
    //     }
    //     cout << "\n\n";
    // }
    for(int i=0;i<moves.size(); i=i+2){
        pieceToMove = chessBoard[moves[i]];
        chessBoard[moves[i]+moves[i+1]] = pieceToMove;
    }
    for(int i=0;i<chessBoard.size()-1; i=i+8){
        cout << chessBoard[i]  << "," << chessBoard[i+1] << "," << chessBoard[i+2] << "," << chessBoard[i+3] << ","
        <<chessBoard[i+4] << "," << chessBoard[i+5] << "," << chessBoard[i+6] << "," << chessBoard[i+7] << ",\n";
    }
}