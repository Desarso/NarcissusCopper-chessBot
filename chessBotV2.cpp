#include <iostream>
#include <cstdlib>
#include <chrono>
#include <map>
#include <vector>
#include <string>
#include <chrono>
#define show(x) std::cout << (#x);

using std::cout;
using std::string;
using std::vector;

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
const char WHITE = 'W';
const char BLACK = 'B';

int getIndexFromPosition(int x, int y);
std::chrono::high_resolution_clock::time_point timerStart();
void timerEnd(std::chrono::high_resolution_clock::time_point start);

class Timer
{
public:
    std::chrono::high_resolution_clock::time_point start;
    Timer()
    {
        start = std::chrono::high_resolution_clock::now();
    }
    void end()
    {
        auto end = std::chrono::high_resolution_clock::now();
        cout << "\nTime taken: " << std::chrono::duration_cast<std::chrono::microseconds>(end - this->start).count() << "us\n";
    }
};

class vector2D
{
public:
    int x = 0;
    int y = 0;

public:
    vector2D(int x, int y)
    {
        this->x = x;
        this->y = y;
    };

    void display()
    {
        cout << "(" << this->x << ", " << this->y << ")";
    };
};

class Move
{

public:
    vector<vector2D> instructions;

    Move(vector2D final, vector2D initial)
    {
        // this is a move but has no reference to the piece
        int initialIndex = getIndexFromPosition(initial.x, initial.y);
        int finalIndex = getIndexFromPosition(final.x, final.y);
        this->instructions.push_back(vector2D(initialIndex, finalIndex));
    }

    Move(vector2D firstMove, vector2D firstStar, vector2D secondMove, vector2D secondStar)
    {
        int firstMoveIndex = getIndexFromPosition(firstMove.x, firstMove.y);
        int firstStartIndex = getIndexFromPosition(firstStar.x, firstStar.y);
        int secondMoveIndex = getIndexFromPosition(secondMove.x, secondMove.y);
        int secondStartIndex = getIndexFromPosition(secondStar.x, secondStar.y);
        this->instructions.push_back(vector2D(firstStartIndex, firstMoveIndex));
        this->instructions.push_back(vector2D(secondStartIndex, secondMoveIndex));
    }

    void display()
    {
        cout << "[";
        for (int i = 0; i < this->instructions.size(); i++)
        {
            cout << "(" << this->instructions[i].y % 8 << ", " << this->instructions[i].y / 8 << ")";
        }
        cout << "]";
    }
};

class Piece
{

public:
    vector2D position = vector2D(0, 0);
    vector<Move> possibleMoves;
    char type;
    char color;
    bool hasMoved = false;
    bool canCastle = false;

    void display()
    {
        cout << "type: " << this->type << " color: " << this->color << " position: " << this->position.x << ", " << this->position.y << "\n";
    }

    Piece(char type, int x, int y)
    {
        this->type = type;
        this->position = vector2D(x, y);
        if (this->type == emptySpace)
        {
            this->color = 'e';
        }
        else if (this->type > 94)
        {
            this->color = WHITE;
        }
        else
        {
            this->color = BLACK;
        }
        if (this->type == whiteKing || this->type == blackKing)
        {
            this->canCastle = true;
        }
    };

    void displayPosition()
    {
        cout << "\nPiece type: " << this->type << " Position: ";
        position.display();
    };

    void findMoves(vector<Piece> board)     
    {
        vector<Move> rookMoves;
        switch (this->type)
        {
        case whiteRook:
            rookMoves = findRookMoves(board);
            this->possibleMoves.insert(this->possibleMoves.end(), rookMoves.begin(), rookMoves.end());
            break;
        case whiteKnight:
            findKnightMoves(board);
            break;
        case whiteBishop:
            findBishopMoves(board);
            break;
        case whiteQueen:
            findQueenMoves(board);
            break;
        case whiteKing:
            findKingMoves(board);
            break;
        case whitePawn:
            findPawnMoves(board);
            break;
        case blackRook:
            rookMoves = findRookMoves(board);
            this->possibleMoves.insert(this->possibleMoves.end(), rookMoves.begin(), rookMoves.end());
            break;
        case blackKnight:
            findKnightMoves(board);
            break;
        case blackBishop:
            findBishopMoves(board);
            break;
        case blackQueen:
            findQueenMoves(board);
            break;
        case blackKing:
            findKingMoves(board);
            break;
        case blackPawn:
            findPawnMoves(board);
            break;
        default:
            break;
        };
    };

    void displayMoves()
    {
        if (this->possibleMoves.size() == 0)
        {
            cout << "\nNo moves available";
        }
        cout << "\n";
        for (int j = 0; j < this->possibleMoves.size(); j++)
        {
            this->possibleMoves[j].display();
            cout << ",";
        }
    }

    vector<Move> findRookMoves(vector<Piece> board)
    {
        vector<Move> moves;
        int x = this->position.x;
        int y = this->position.y;

        for (int i = x + 1; i < 8; i++)
        {
            if (board[getIndexFromPosition(i, y)].color == this->color)
                break;
            if ((i != x) && (board[getIndexFromPosition(i, y)].type == emptySpace || board[getIndexFromPosition(i, y)].color != this->color))
            {
                moves.push_back(Move(vector2D(i, y), this->position));
                if (board[i].color != this->color && board[i].color != 'e')
                {
                    break;
                }
            }
        }
        for (int i = x - 1; i >= 0; i--)
        {
            if (board[getIndexFromPosition(i, y)].color == this->color)
                break;
            if ((i != x) && (board[getIndexFromPosition(i, y)].type == emptySpace || board[getIndexFromPosition(i, y)].color != this->color))
            {
                moves.push_back(Move(vector2D(i, y), this->position));
                if (board[i].color != this->color && board[i].color != 'e')
                {
                    break;
                }
            }
        }
        for (int i = y + 1; i < 8; i++)
        {
            if (board[getIndexFromPosition(i, y)].color == this->color)
                break;
            if (board[getIndexFromPosition(x, i)].type != emptySpace)
                break;
            if ((i != y) && (board[getIndexFromPosition(x, i)].type == emptySpace || board[getIndexFromPosition(x, i)].color != this->color))
            {
                moves.push_back(Move(vector2D(x, i), this->position));
                if (board[i].color != this->color && board[i].color != 'e')
                {
                    break;
                }
            }
        }
        for (int i = y - 1; i >= 0; i--)
        {
            if (board[getIndexFromPosition(i, y)].color == this->color)
                break;
            if (board[getIndexFromPosition(x, i)].type != emptySpace)
                break;
            if ((i != y) && (board[getIndexFromPosition(x, i)].type == emptySpace || board[getIndexFromPosition(x, i)].color != this->color))
            {
                moves.push_back(Move(vector2D(x, i), this->position));
                if (board[i].color != this->color && board[i].color != 'e')
                {
                    break;
                }
            }
        }
        return moves;
    }

    vector<Move> findKnightMoves(vector<Piece> board)
    {
        vector<Move> moves;
        int x = this->position.x;
        int y = this->position.y;

        if (x + 2 < 8 && y + 1 < 8 && (board[getIndexFromPosition(x + 2, y + 1)].color != this->color || board[getIndexFromPosition(x + 2, y + 1)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x + 2, y + 1)].color != this->color)
            {
                moves.push_back(Move(vector2D(x + 2, y + 1), this->position));
            }
        }
        if (x + 2 < 8 && y - 1 >= 0 && (board[getIndexFromPosition(x + 2, y - 1)].color != this->color || board[getIndexFromPosition(x + 2, y - 1)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x + 2, y - 1)].color != this->color)
            {
                moves.push_back(Move(vector2D(x + 2, y - 1), this->position));
            }
        }
        if (x - 2 >= 0 && y + 1 < 8 && (board[getIndexFromPosition(x - 2, y + 1)].color != this->color || board[getIndexFromPosition(x - 2, y + 1)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x - 2, y + 1)].color != this->color)
            {
                moves.push_back(Move(vector2D(x - 2, y + 1), this->position));
            }
        }
        if (x - 2 >= 0 && y - 1 >= 0 && (board[getIndexFromPosition(x - 2, y - 1)].color != this->color || board[getIndexFromPosition(x - 2, y - 1)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x - 2, y - 1)].color != this->color)
            {
                moves.push_back(Move(vector2D(x - 2, y - 1), this->position));
            }
        }
        if (x + 1 < 8 && y + 2 < 8 && (board[getIndexFromPosition(x + 1, y + 2)].color != this->color || board[getIndexFromPosition(x + 1, y + 2)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x + 1, y + 2)].color != this->color)
            {
                moves.push_back(Move(vector2D(x + 1, y + 2), this->position));
            }
        }
        if (x + 1 < 8 && y - 2 >= 0 && (board[getIndexFromPosition(x + 1, y - 2)].color != this->color || board[getIndexFromPosition(x + 1, y - 2)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x + 1, y - 2)].color != this->color)
            {
                moves.push_back(Move(vector2D(x + 1, y - 2), this->position));
            }
        }
        if (x - 1 >= 0 && y + 2 < 8 && (board[getIndexFromPosition(x - 1, y + 2)].color != this->color || board[getIndexFromPosition(x - 1, y + 2)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x - 1, y + 2)].color != this->color)
            {
                moves.push_back(Move(vector2D(x - 1, y + 2), this->position));
            }
        }
        if (x - 1 >= 0 && y - 2 >= 0 && (board[getIndexFromPosition(x - 1, y - 2)].color != this->color || board[getIndexFromPosition(x - 1, y - 2)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x - 1, y - 2)].color != this->color)
            {
                moves.push_back(Move(vector2D(x - 1, y - 2), this->position));
            }
        }
        return moves;
    }

    vector<Move> findBishopMoves(vector<Piece> board)
    {
        vector<Move> moves;
        int x = this->position.x;
        int y = this->position.y;

        for (int i = x + 1; i < 8; i++)
        {
            if (board[getIndexFromPosition(i, y + (i - x))].color == this->color)
                break;
            if (board[getIndexFromPosition(i, y + (i - x))].type == emptySpace || board[getIndexFromPosition(i, y + (i - x))].color != this->color)
            {
                moves.push_back(Move(vector2D(i, y + (i - x)), this->position));
            }
        }
        for (int i = x - 1; i >= 0; i--)
        {
            if (board[getIndexFromPosition(i, y + (i - x))].color == this->color)
                break;
            if (board[getIndexFromPosition(i, y + (i - x))].type == emptySpace || board[getIndexFromPosition(i, y + (i - x))].color != this->color)
            {
                moves.push_back(Move(vector2D(i, y + (i - x)), this->position));
            }
        }
        for (int i = x + 1; i < 8; i++)
        {
            if (board[getIndexFromPosition(i, y - (i - x))].color == this->color)
                break;
            if (board[getIndexFromPosition(i, y - (i - x))].type == emptySpace || board[getIndexFromPosition(i, y - (i - x))].color != this->color)
            {
                moves.push_back(Move(vector2D(i, y - (i - x)), this->position));
            }
        }
        for (int i = x - 1; i >= 0; i--)
        {
            if (board[getIndexFromPosition(i, y - (i - x))].color == this->color)
                break;
            if (board[getIndexFromPosition(i, y - (i - x))].type == emptySpace || board[getIndexFromPosition(i, y - (i - x))].color != this->color)
            {
                moves.push_back(Move(vector2D(i, y - (i - x)), this->position));
            }
        }
        return moves;
    }

    vector<Move> findKingMoves(vector<Piece> board)
    {
        vector<Move> moves;
        int x = this->position.x;
        int y = this->position.y;

        if (x + 1 < 8 && (board[getIndexFromPosition(x + 1, y)].color != this->color || board[getIndexFromPosition(x + 1, y)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x + 1, y)].color != this->color)
            {
                moves.push_back(Move(vector2D(x + 1, y), this->position));
            }
        }
        if (x - 1 >= 0 && (board[getIndexFromPosition(x - 1, y)].color != this->color || board[getIndexFromPosition(x - 1, y)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x - 1, y)].color != this->color)
            {
                moves.push_back(Move(vector2D(x - 1, y), this->position));
            }
        }
        if (y + 1 < 8 && (board[getIndexFromPosition(x, y + 1)].color != this->color || board[getIndexFromPosition(x, y + 1)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x, y + 1)].color != this->color)
            {
                moves.push_back(Move(vector2D(x, y + 1), this->position));
            }
        }
        if (y - 1 >= 0 && (board[getIndexFromPosition(x, y - 1)].color != this->color || board[getIndexFromPosition(x, y - 1)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x, y - 1)].color != this->color)
            {
                moves.push_back(Move(vector2D(x, y - 1), this->position));
            }
        }
        if (x + 1 < 8 && y + 1 < 8 && (board[getIndexFromPosition(x + 1, y + 1)].color != this->color || board[getIndexFromPosition(x + 1, y + 1)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x + 1, y + 1)].color != this->color)
            {
                moves.push_back(Move(vector2D(x + 1, y + 1), this->position));
            }
        }
        if (x + 1 < 8 && y - 1 >= 0 && (board[getIndexFromPosition(x + 1, y - 1)].color != this->color || board[getIndexFromPosition(x + 1, y - 1)].type == emptySpace))
        {
            if (board[getIndexFromPosition(x + 1, y - 1)].color != this->color)
            {
                moves.push_back(Move(vector2D(x + 1, y - 1), this->position));
            }
            if (x - 1 >= 0 && y + 1 < 8 && (board[getIndexFromPosition(x - 1, y + 1)].color != this->color || board[getIndexFromPosition(x - 1, y + 1)].type == emptySpace))
            {
                if (board[getIndexFromPosition(x - 1, y + 1)].color != this->color)
                {
                    moves.push_back(Move(vector2D(x - 1, y + 1), this->position));
                }
            }
            if (x - 1 >= 0 && y - 1 >= 0 && (board[getIndexFromPosition(x - 1, y - 1)].color != this->color || board[getIndexFromPosition(x - 1, y - 1)].type == emptySpace))
            {
                if (board[getIndexFromPosition(x - 1, y - 1)].color != this->color)
                {
                    moves.push_back(Move(vector2D(x - 1, y - 1), this->position));
                }
            }
        }
        return moves;
    };

    vector<Move> findQueenMoves(vector<Piece> board)
    {
        vector<Move> moves;
        vector<Move> rookMoves = findRookMoves(board);
        vector<Move> bishopMoves = findBishopMoves(board);
        moves.insert(moves.end(), rookMoves.begin(), rookMoves.end());
        moves.insert(moves.end(), bishopMoves.begin(), bishopMoves.end());
        return moves;
    };

    vector<Move> findPawnMoves(vector<Piece> board)
    {
        vector<Move> moves;
        int x = this->position.x;
        int y = this->position.y;
        if (this->type == blackPawn && this->position.y > 1)
        {
            this->hasMoved = true;
        }
        if (this->type == whitePawn && this->position.y < 6)
        {
            this->hasMoved = true;
        }

        if (this->color == WHITE)
        {
            if (y + 1 < 8 && board[getIndexFromPosition(x, y + 1)].type == emptySpace)
            {
                moves.push_back(Move(vector2D(x, y + 1), this->position));
            }
            if (y + 2 < 8 && board[getIndexFromPosition(x, y + 2)].type == emptySpace && board[getIndexFromPosition(x, y + 1)].type == emptySpace && this->hasMoved == false)
                moves.push_back(Move(vector2D(x, y + 2), this->position));
            if (x + 1 < 8 && y + 1 < 8 && board[getIndexFromPosition(x + 1, y + 1)].color == BLACK)
                moves.push_back(Move(vector2D(x + 1, y + 1), this->position));
            if (x - 1 >= 0 && y + 1 < 8 && board[getIndexFromPosition(x - 1, y + 1)].color == BLACK)
                moves.push_back(Move(vector2D(x - 1, y + 1), this->position));
        }
        else
        {
            if (y - 1 >= 0 && board[getIndexFromPosition(x, y - 1)].type == emptySpace)
            {
                moves.push_back(Move(vector2D(x, y - 1), this->position));
            }
            if (y - 2 >= 0 && board[getIndexFromPosition(x, y - 2)].type == emptySpace && board[getIndexFromPosition(x, y - 1)].type == emptySpace && this->hasMoved == false)
                moves.push_back(Move(vector2D(x, y - 2), this->position));
            if (x + 1 < 8 && y - 1 >= 0 && board[getIndexFromPosition(x + 1, y - 1)].color == WHITE)
                moves.push_back(Move(vector2D(x + 1, y - 1), this->position));
            if (x - 1 >= 0 && y - 1 >= 0 && board[getIndexFromPosition(x - 1, y - 1)].color == WHITE)
                moves.push_back(Move(vector2D(x - 1, y - 1), this->position));
        }
        return moves;
    };
};

class Board
{

public:
    vector<Piece> pieces;
    bool movesSearched = false;
    bool inCheck = false;
    char currentTurn = WHITE;

    Board()
    {
        vector<char> newBoard = {
            'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
            'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
            '-', '-', '-', '-', '-', '-', '-', '-',
            '-', '-', '-', '-', '-', '-', '-', '-',
            '-', '-', '-', '-', '-', '-', '-', '-',
            '-', '-', '-', '-', '-', '-', '-', '-',
            'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
            'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'};
        for (int i = 0; i < newBoard.size(); i++)
        {
            pieces.push_back(Piece(newBoard[i], i % 8, i / 8));
        }
    }

    Board(vector<char> newBoard)
    {
        for (int i = 0; i < newBoard.size(); i++)
        {
            pieces.push_back(Piece(newBoard[i], i % 8, i / 8));
        }
    };

    void movePiece(int x1, int y1, int x2, int y2)
    {
        int index1 = x1 + y1 * 8;
        int index2 = x2 + y2 * 8;
        this->pieces[index2] = Piece(this->pieces[index1].type, x2, y2);
        this->pieces[index1] = Piece(emptySpace, x1, y1);
    }

    void displayBoard()
    {

        for (int i = 0; i < 8; i++)
        {
            for (int j = 0; j < 8; j++)
            {
                if (j == 0)
                    cout << "\n"
                         << i << " ";
                cout << "|" << this->pieces[j + i * 8].type;
                if (j == 7)
                    cout << "|";
            }
        }
        cout << "\n"
                " __________________";
        cout << "\n"
                "   0 1 2 3 4 5 6 7  ";
    };

    void findMoves()
    {
        if (this->movesSearched == true)
        {
            return;
        };

        // 1) Check if in check.
        // 2) if yes, I should create a different findMoves function that only looks for moves that get me out of check.
        // 3) if no, find moves like normal

        // 4) if castling is allowed from king variable, add castling move to non moved rooks.
        // 5) check for en passant moves.
        // 6) check for pawn promotion moves.
        // 7) if there any of those apply, I need to add a special moves variable to the board.
        //  this moves are different because they require changes to two pieces.
        // if we thing about workflow again, minimax is going to call a function that execute the move, this should create a newBoard
        // but one of the executable moves are special moves, so when looping over moves, we can't have the same logic.
        // for example when checking the tree, some move just involve adding a single vector to a specific piece.
        // other involve chaging two pieces simultaneulsy. This would be easier if I could use board level moves.
        // If I store moves, at the board level, I should just convert them to starting and endigin index, but again, there is special cases
        // where two vector addition need to be executed.

        // lets think about the data strucutre for board level moves, I can't make destrucutred objects, I should make a moves class, since it is the easiest thing.
        // then the find moves function return an array of moves from piece, and then adds it to the current array of move in board,
        // this move can be both normal and special but have identical api.

        for (int i = 0; i < pieces.size(); i++)
        {
            pieces[i].findMoves(pieces);
            // this finds all pseudo legal moves I need to add en passant and castling right here, and also check for check, as well as crowning pawns
        }
        this->movesSearched = true;
    }

    void setPosition(Piece piece)
    {
        this->pieces[getIndexFromPosition(piece.position.x, piece.position.y)] = piece;
    }

    Piece check(int x, int y)
    {
        return this->pieces[getIndexFromPosition(x, y)];
    }

    void displayPossibleMoves(vector2D position)
    {
        Piece piece = this->check(position.x, position.y);
        piece.displayMoves();
        for (int i = 0; i < piece.possibleMoves.size(); i++)
        {
            int x = piece.possibleMoves[i].instructions[0].y % 8;
            int y = piece.possibleMoves[i].instructions[0].y / 8;
            setPosition(Piece(piece.type, x, y));
        }
        displayBoard();
    }

    bool amIInCheck()
    {
        if(this->currentTurn == WHITE){
            //I need a function that gets the diagonal distance to other pieces
            //first lets check for long range attacks, if I can move the king like a queen can I hit, any oposing
            //color long range piece?
            int KingIndex;
            for(int i = 0; i < this->pieces.size(); i++){
                if(this->pieces[i].type == whiteKing){
                    KingIndex = i;
                }
            }
            Piece king = this->pieces[KingIndex];
            vector<Move> rookMoves = king.findRookMoves(this->pieces);
            vector<Move> bishopMoves = king.findBishopMoves(this->pieces);

            vector<int> attackIndexes;
            for(int i =0; i < rookMoves.size(); i++){
                if(this->pieces[rookMoves[i].instructions[0].y].type == blackRook || this->pieces[rookMoves[i].instructions[0].y].type == blackQueen){
                    attackIndexes.push_back(rookMoves[i].instructions[0].y);
                }
                attackIndexes.push_back(rookMoves[i].instructions[0].y);
            }

            for(int i =0; i < bishopMoves.size(); i++){
                if(this->pieces[bishopMoves[i].instructions[0].y].type == blackBishop || this->pieces[bishopMoves[i].instructions[0].y].type == blackQueen){
                    attackIndexes.push_back(bishopMoves[i].instructions[0].y);
                }
                attackIndexes.push_back(bishopMoves[i].instructions[0].y);
            }

            
           

            //the moves get turned into instructions. Each move is an array of vectors, each y component of the vector 
            //is an index of the final position of the piece, if any of those indexes is a long rage piece, then I am likely check, need to check
            //bishops, rooks and quuens. 

        }

        
    }

};

int main()
{

    // here's the problem, the current moves are stored in the pieces class
    // but each move affects board state, it changes the current turn, it can affect, castling it can affect en passant
    // so I need to store the moves in the board class, but I don't know how to do that
    // what happens is that the main class calls getMoves,and then findMoves, finds findMoves for each possible piece.
    // however piece moves are dependent on each other.
    // each move represents a newBoardState
    // so eachMoveShouldCreateANewBoardState
    // what I can do is find every possible move based on rough rules
    // and then when I actually execute the move, I can check if the move is legal by checking board state
    // so find moves should ignore en-peassant, castling and turn.

    // so lets' think about the workflow of a game.
    // I move, then the AI needs to call findMoves, however, the initial board state, starts out with default values, and default board state.
    // I then take one of those moves, and execute it on a seperate function ,that will check if it needs to change board state.
    // by default, I should add castling to kings, once they have moved, we remove this option.
    // but not when searching possible moves, but when executing the move.

    // for pawn moves, it will check if it's on the right position and row, to exectue en passant.
    // the move execution results in a new board state, I will run an evaluation function, and the investigate, the next move on the same layer until all are done.
    // then I have to sort the moves in order, and run a recursive call for minimax, that goes to the second layer, then once again to third, and so on.
    // setting a processing time limit, so that it can stop going down after a certain amount of depth.
    // this will result in a guess for the best move, and then the AI can take that move and execute it on the main board,
    // the program, also needs to clear memory for previous boards, so that when it doesn't need them anymore it can reuse that memory.
    // so I need to use pointers.

    vector<char> custom = {
        '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', 'P', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-'};

    Board customBoard = Board(custom);
    customBoard.findMoves();
    customBoard.displayPossibleMoves(vector2D(3, 5));
}

int getIndexFromPosition(int x, int y)
{
    return (y * 8) + x;
};
