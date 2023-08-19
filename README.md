# Interface-for-stockfishjs

## Information

Chess graphical user interface for stockfish.js with Sound, PGN Notation, FEN, Score, Bestmove, Eval Bar, Multiple Lines, and full stockfish customization.
This is a project work done by 3 friends + me :D to tackle the problem of limited customisability on big chess websites like chess.com and lichess.org as well as the complicated UIs and legacy designs of chess GUIs such as Arena Chess GUI, BanksiaGUI, Cutechess, Nibbler.

Other than the below JavaScript frameworks, everything else is written with VANILLA HTML, CSS, and JS.

Basics:
* https://github.com/oakmac/chessboardjs
* https://github.com/jhlywa/chess.js
* https://github.com/niklasf/stockfish.js

Official docs of above frameworks:
* https://chessboardjs.com
* https://unpkg.com/browse/chess.js@0.11.0/README.md
* nothing for stockfishjs lol

## Installation and running

To clone repository, use the following command in command prompt:
```
git clone https://github.com/Xblue707/PawnifyEngine
```
Alternatively just download the zip lmao

To run, just use a live server. Simply running the index.html file will not work.

## Prep Screen

On this webpage, there are 3 columns. The first column shows the chess board, with the spare white pieces at the top and the spare black pieces at the bottom. Users can drag and drop the pieces on the board and the spare pieces at the sides. This is to create a user-friendly, easy-to-understand interface, so that the user can change the starting position as much as they want. The second column shows three buttons. Their functions are changing the board orientation, restoring the original starting position and clearing the board. Finally, the third column is a sidebar where users can adjust the parameters of Stockfish. These parameters allow further customisation of our website, which is our main goal of this project. They are the user's playing side, time controls for both sides, playing strength, move time, number of CPU threads, Stockfish hash table size, contempt level, maximum nodes, slow mover, engine lines, number of takebacks, evaluation type, engine ponder, and an FEN box to input start position FEN. *Note that you do have to hit enter after pasting in the FEN to see changes.*

## Play Screen

There are 2 sides in the play screen, the playing side and the sidebar. On the playing side, there is an interactive chess board to allow users to drag and drop pieces to make moves, and the bot will respond accordingly. On the top and the bottom, there are also clocks to keep track of how much time each side has left to play. In the sidebar, there are 2 toggle buttons, one to toggle on and off the engine's line evaluations as well as another to toggle off engine lines altogether. In the moves section, players can __click on moves played by either side in the sidebar to takeback to that position. That will count as 1 takeback.__ The 3 buttons below will allow users to move forward, backwards and resign against the bot respectively.

## End Screen

The top section tells the user if they won/lost and by what method. The middle section has a generic player logo and the stockfish logo. The winning side will have a green border appearing around it when the game ends. At the bottom, there are 3 buttons, the "Copy PGN" button to allow users to copy the game PGN, "play again" button to play with stockfish again, and a "Customise" button, which will bring the user back to the prep screen for further customisation.

## To do list (feel free to submit a PR if you want to contribute)

In order of difficulty:
* Playing premoves
* Improving UI (problems: basic design, choppy animations etc.)
* Toggling of different themes
* Account system + fully working backend
* Hosting on an online server for better experience
