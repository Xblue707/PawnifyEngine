var colourToMove = localStorage.getItem("colourToMove");
var stockfishStrength = localStorage.getItem("v1input");
stockfishStrength -= 1320;
stockfishStrength /= 76.5;
stockfishStrength = Math.floor(stockfishStrength);
var whiteMin = parseInt(localStorage.getItem("whiteTimeControlMin"));
var whiteSec = parseInt(localStorage.getItem("whiteTimeControlSec"));
var whiteBonus = parseInt(localStorage.getItem("whiteTimeControlBonusSec"));
var blackMin = parseInt(localStorage.getItem("blackTimeControlMin"));
var blackSec = parseInt(localStorage.getItem("blackTimeControlSec"));
var blackBonus = parseInt(localStorage.getItem("blackTimeControlBonusSec"));
var whiteTime = whiteSec + whiteMin * 60;
var blackTime = blackSec + blackMin * 60;
var playerLogo = document.querySelector(".playerLogo");
var stockfishLogo = document.querySelector(".stockfishLogo");
var moveColour = 'white';
var premove = null;
if (whiteMin < 10) {
  whiteMin = '0' + whiteMin;
}
if (blackMin < 10) {
  blackMin = '0' + blackMin;
}
if (whiteSec < 10) {
  whiteSec = '0' + whiteSec;
}
if (blackSec < 10) {
  blackSec = '0' + blackSec;
}
$('#time1').text(whiteMin + ':' + whiteSec);
$('#time2').text(blackMin + ':' + blackSec);
if (colourToMove == 'white') {
  function func1() {
    stockfishStrength++;
    if (stockfishStrength > 20) stockfishStrength = 20;
    stockfishStrength *= 76.5;
    stockfishStrength += 1320;
    localStorage.setItem("v1input", stockfishStrength);
    location.reload();
  }
  function func2() {
    location.reload();
  }
  function func3() {
    stockfishStrength--;
    if (stockfishStrength < 0) stockfishStrength = 0;
    stockfishStrength *= 76.5;
    stockfishStrength += 1320;
    localStorage.setItem("v1input", stockfishStrength);
    location.reload();
  }
  function func4() {
    location.reload();
  }
  function func5() {
    location.reload();
  }
  var waitSec = function () {
    setTimeout(waitSec, 1000);
    if (whiteTime == 0 || blackTime == 0) {
      if (userGameEnd == 0) endGame();
    }
    if (userGameEnd == 0) {
      if (moveColour == 'white') {
        whiteTime--;
        whiteMin = Math.floor(whiteTime / 60);
        whiteSec = whiteTime % 60;
        if (whiteMin < 10) {
          whiteMin = '0' + whiteMin;
        }
        if (whiteSec < 10) {
          whiteSec = '0' + whiteSec;
        }
        var display = whiteMin + ':' + whiteSec;
        $('#time1').text(display);
      }
      else {
        blackTime--;
        blackMin = Math.floor(blackTime / 60);
        blackSec = blackTime % 60;
        if (blackMin < 10) {
          blackMin = '0' + blackMin;
        }
        if (blackSec < 10) {
          blackSec = '0' + blackSec;
        }
        var display = blackMin + ':' + blackSec;
        $('#time2').text(display);
      }
    }
  }
  waitSec();
  var stockfish = new Worker('stockfish.js');
  stockfish.postMessage("setoption name skill level type spin default " + stockfishStrength + " min " + stockfishStrength + " max " + stockfishStrength);
  var pgnIndex = 0;
  var movesPlayed = 0;
  var moveIndex = 0;
  var userGameEnd = 0;
  var userLines = parseInt(localStorage.getItem("v8input"));
  var userDepth = localStorage.getItem("v6input");
  var squareClass = 'square-55d63';
  var squareToHighlight = null;
  var colorToHighlight = null;
  var userTakeBacks = parseInt(localStorage.getItem("v11input"));
  if (userTakeBacks == 21) userTakeBacks = 2147483647;
  var contemptLvl = localStorage.getItem("v5input");
  var $board = $('#board');
  var slowMove = parseInt(localStorage.getItem("v7input"));
  for (var i = userLines + 1; i <= 10; i++) {
    document.getElementById("eval_" + i).remove();
    document.getElementById("num" + i).remove();
    document.getElementById("evalnum" + i).remove();
  }
  stockfish.postMessage("setoption name slow mover type spin default " + slowMove + " min " + slowMove + " max " + slowMove);
  stockfish.postMessage("setoption name contempt type spin default " + contemptLvl + " min " + contemptLvl + " max " + contemptLvl);
  stockfish.postMessage("setoption name threads type spin default 1 min 1 max " + localStorage.getItem("v3input"));
  stockfish.postMessage("setoption name MultiPV value " + userLines);
  var pgnGetIndex = 3;
  var userPosInput = localStorage.getItem("fenImputBox");
  if (userPosInput == 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
    pgnGetIndex = 0;
  }
  var board,
    game = new Chess(userPosInput);
  var onDragStart = function (source, piece, position, orientation) {
    if (userGameEnd == 0) {
      if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
      }
    }
  };

  var makeMove = function () {
    if (userGameEnd == 0) {

      var possibleMoves = game.moves();

      if (possibleMoves.length === 0) return;

      var FEN = game.fen();
      stockfish.postMessage("position fen" + " " + FEN);
      stockfish.postMessage("go depth " + String(userDepth));
      stockfish.onmessage = function (event) {

        var str = event.data;
        var res = str.match(/score/g);
        res = str.split(" ");
        if ((res[0] == "info") && (res[3] == "seldepth")) {
          var score = parseInt(res[9]);
          var pv = res[6];
          if (pv == 1) {
            document.getElementById("evalVal").style.height = ((Math.floor(score / 10)) + 250) + "px";
          }
          var id = "eval_" + pv;
          var line = "";
          document.getElementById("evalnum" + pv).innerHTML = " " + parseInt(score) / 100;
          var maximumRun = 25;
          const chess2 = new Chess(game.fen());
          if (parseInt(res.length - 1) < 33) maximumRun = parseInt(res.length - 1);
          for (var i = 21; i <= parseInt(maximumRun); i++) {
            var result = res[i];
            var from = result[0] + result[1];
            var to = result[2] + result[3];
            var pieceFrom = chess2.get(from);
            var pieceTo = chess2.get(to);
            var ppp = "";
            if (pieceFrom != null) {
              if (pieceFrom.type != "p" && pieceFrom.type != "P") {
                if (pieceFrom.color == "b") ppp += pieceFrom.type;
                else ppp += pieceFrom.type.toUpperCase();
                if (pieceTo != null) {
                  ppp += "x";
                }
              }
              else {
                if (pieceTo != null) {
                  ppp += result[0];
                  ppp += "x";
                }
              }
            }
            ppp += to;
            line += ppp;
            chess2.move(ppp);
            line += " ";
          }
          document.getElementById(id).innerHTML = line;
        }

        if (res[0] == "bestmove" && userGameEnd == 0) {

          zug = res[1].split("");
          console.log(zug);

          botmovesource = zug[0] + zug[1];
          botmovetarget = zug[2] + zug[3];

          var move = game.move({
            color: 'b',
            to: botmovetarget,
            from: botmovesource,
            promotion: 'q'
          });
          console.log(move.from);
          $board.find('.' + squareClass).removeClass('highlight-white')
          $board.find('.' + squareClass).removeClass('highlight-black')
          $board.find('.square-' + move.from).addClass('highlight-black')
          squareToHighlight = move.to
          colorToHighlight = 'black'
          var pgn = game.pgn();
          pgn = String(pgn);
          const dummyarray = pgn.split("\n");
          const pgnArray = dummyarray[pgnGetIndex].split(" ");
          addMove(pgnArray[pgnIndex], 0, pgnArray[pgnIndex - 2]);
          pgnIndex++;
          board.position(game.fen());
          movesPlayed++;
          moveIndex++;
          blackTime += blackBonus;
          blackMin = Math.floor(blackTime / 60);
          blackSec = blackTime % 60;
          if (blackMin < 10) {
            blackMin = '0' + blackMin;
          }
          if (blackSec < 10) {
            blackSec = '0' + blackSec;
          }
          var display = blackMin + ':' + blackSec;
          $('#time2').text(display);
          moveColour = 'white';
          sound();
          if (premove != null) {
            // $board.find('.' + squareClass).removeClass('highlight-white')
            // $board.find('.' + squareClass).removeClass('highlight-black')
            // $board.find('.square-' + premove[]).addClass('highlight-white')
            console.log("hihi")
            console.log(premove);
            var move = game.move({
              color: 'w',
              from: premove[0] + premove[1],
              to: premove[2] + premove[3],
              promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });
            board.position(game.fen());
            whiteTime += whiteBonus;
            whiteMin = Math.floor(whiteTime / 60);
            whiteSec = whiteTime % 60;
            if (whiteMin < 10) {
              whiteMin = '0' + whiteMin;
            }
            if (whiteSec < 10) {
              whiteSec = '0' + whiteSec;
            }
            var display = whiteMin + ':' + whiteSec;
            $('#time1').text(display);
            moveColour = 'black';
            window.setTimeout(makeMove, 150);
            var pgn = game.pgn();
            pgn = String(pgn);
            const dummyarray = pgn.split("\n");
            const pgnArray = dummyarray[pgnGetIndex].split(" ");
            pgnIndex++;
            addMove(pgnArray[pgnIndex], 1, pgnArray[pgnIndex - 1]);
            pgnIndex++;
            movesPlayed++;
            moveIndex++;
            sound();
            premove = null;
          }
        }
      };
    }
  };

  var onDrop = function (source, target) {
    if (userGameEnd == 0) {
      var move = game.move({
        color: 'w',
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      });
      $board.find('.' + squareClass).removeClass('highlight-white')
      $board.find('.' + squareClass).removeClass('highlight-black')
      $board.find('.square-' + source).addClass('highlight-white')
      $board.find('.square-' + target).addClass('highlight-white')
      colorToHighlight = 'white'
      if (move === null) {
        premove = source + target;
        console.log("premove")
        console.log(premove);
        return "snapback";
      }
      whiteTime += whiteBonus;
      whiteMin = Math.floor(whiteTime / 60);
      whiteSec = whiteTime % 60;
      if (whiteMin < 10) {
        whiteMin = '0' + whiteMin;
      }
      if (whiteSec < 10) {
        whiteSec = '0' + whiteSec;
      }
      var display = whiteMin + ':' + whiteSec;
      $('#time1').text(display);
      moveColour = 'black';
      window.setTimeout(makeMove, 150);
    }
  };

  var onSnapEnd = function () {
    if (userGameEnd == 0) {

      board.position(game.fen());
      var pgn = game.pgn();
      pgn = String(pgn);
      const dummyarray = pgn.split("\n");
      const pgnArray = dummyarray[pgnGetIndex].split(" ");
      pgnIndex++;
      addMove(pgnArray[pgnIndex], 1, pgnArray[pgnIndex - 1]);
      pgnIndex++;
      movesPlayed++;
      moveIndex++;
      sound();
    }
  };

  function onMoveEnd() {
    $board.find('.square-' + squareToHighlight)
      .addClass('highlight-' + colorToHighlight);
  }

  var cfg = {
    draggable: true,
    position: userPosInput,
    onDragStart: (userGameEnd === 1 ? null : onDragStart),
    onDrop: (userGameEnd === 1 ? null : onDrop),
    onSnapEnd: (userGameEnd === 1 ? null : onSnapEnd),
    onMoveEnd: (userGameEnd === 1 ? null : onMoveEnd)
  };
  board = ChessBoard('board', cfg);

  function moveBackward() {
    moveIndex--;
    if (moveIndex < 0) moveIndex = 0;
    var chess3 = new Chess(userPosInput);
    const moves = game.history();
    for (var i = 0; i < moveIndex; i++) {
      chess3.move(moves[i]);
    }
    board.position(chess3.fen());
  }

  function moveForward() {
    moveIndex++;
    var chess3 = new Chess(userPosInput);
    const moves = game.history();
    if (moveIndex > moves.length) moveIndex = moves.length;
    for (var i = 0; i < moveIndex; i++) {
      chess3.move(moves[i]);
    }
    board.position(chess3.fen());
  }

  function sound() {
    if (game.in_checkmate() === true || game.in_draw() === true) {
      endGame();
      document.getElementById('sound').innerHTML = '<audio autoplay preload controls> <source src="sound/game-end.mp3" type="audio/mp3" /> </audio>';
      if (game.in_draw() === true) {
        document.getElementById("boxDraw").style.display = "block";
      }
      else if (moveColour == "black") {
        document.getElementById("boxWin").style.display = "block";
      }
      else {
        document.getElementById("boxLose").style.display = "block";
      }
    }
    else if (game.in_check() === true) {
      document.getElementById('sound').innerHTML = '<audio autoplay preload controls> <source src="sound/move-check.mp3" type="audio/mp3" /> </audio>';
    }
    else {
      document.getElementById('sound').innerHTML = '<audio autoplay preload controls> <source src="sound/move.mp3" type="audio/mp3" /> </audio>';
    }
  }

  function undoMove(undoMoveNumber, player) {
    if (userTakeBacks > 0 && userGameEnd == 0) {
      userTakeBacks--;
      $board.find('.' + squareClass).removeClass('highlight-white')
      $board.find('.' + squareClass).removeClass('highlight-black')
      const moves = game.history();
      game = new Chess(userPosInput);
      pgnIndex = -2 + (parseInt(undoMoveNumber) * 3) + (player == "black");
      pgnIndex++;
      if (player == "white") {
        document.getElementById(undoMoveNumber * 2 - (player == "white") + 1).remove();
        document.getElementById(undoMoveNumber * 2 - (player == "white") + 1 + "breakid").remove();
      }
      for (var i = undoMoveNumber * 2 - (player == "white") + 1; i < moves.length; i++) {
        document.getElementById(i + 1).remove();
        if (i % 2 == 1) document.getElementById((i + 1) / 2 + ".").remove();
      }
      for (var i = 0; i < undoMoveNumber * 2 - (player == "white"); i++) {
        game.move(moves[i]);
      }
      board.position(game.fen());
      if (player == "white") {
        window.setTimeout(makeMove, 150);
        board.position(game.fen());
      }
    }
    else if (userGameEnd == 1) {
      const moves = game.history();
      var game5 = new Chess(userPosInput);
      for (var i = 0; i < undoMoveNumber * 2 - (player == "white"); i++) {
        game5.move(moves[i]);
      }
      board.position(game5.fen());
    }
  }

  function addMove(move, white, moveNumber) {
    var table = document.getElementById("moves");
    if (move == "O-O") {
      move = "O~O";
    }
    else if (move == "O-O-O") {
      move = "O~O~O";
    }
    if (white == "1") {
      var row = document.createElement("div");
      row.setAttribute("class", "moveRow");
      row.setAttribute("id", moveNumber);
      var cell = document.createElement("span");
      cell.textContent = moveNumber + " ";
      cell.setAttribute("class", "moveNumber");
      row.appendChild(cell);
      var cell2 = document.createElement("span");
      var config = "undoMove(" + moveNumber + ", 'white')";
      cell2.setAttribute("onclick", config);
      var ind = parseInt(pgnIndex) + 2;
      ind /= 3;
      ind *= 2;
      ind--;
      cell2.setAttribute("class", "moveonsidebar whiteMove");
      cell2.setAttribute("id", ind);
      cell2.textContent = move;
      row.appendChild(cell2);
      table.appendChild(row);
    }
    else {
      var row = document.getElementById(moveNumber);
      var cell = document.createElement("span");
      var config = "undoMove(" + moveNumber + ", 'black')";
      cell.setAttribute("onclick", config);
      var ind = parseInt(pgnIndex) + 1;
      ind /= 3;
      ind = Math.floor(ind);
      ind *= 2;
      cell.setAttribute("class", "moveonsidebar blackMove");
      cell.setAttribute("id", ind);
      cell.textContent = " " + move;
      row.appendChild(cell);
      table.appendChild(row);
      var nextLine = document.createElement("br");
      nextLine.setAttribute("id", ind + "breakid");
      row.appendChild(nextLine);
    }
  }

  document.addEventListener("keypress", function (event) {
    if (event.key == ',') {
      moveBackward();
    }
    else if (event.key == 'ArrowLeft') {
      moveBackward();
    }
    else if (event.key == '.') {
      moveForward();
    }
  });

  //Code added for End Screen
  var colourToWin = null;
  var wayOfWin = 'Resignation';

  function endGame() {
    var win = 0;
    var lose = 0;
    var draw = 0;
    console.log("hi");
    userGameEnd = 1;
    userTakeBacks = 2147483647;
    cfg.draggable = false;
    cfg.position = board.position();
    board = ChessBoard('board', cfg);
    document.getElementById('sound').innerHTML = '<audio autoplay preload controls> <source src="sound/game-end.mp3" type="audio/mp3" /> </audio>';
    //Code added for End Screen
    // var endScreenPopup = document.getElementById("endScreen");
    // endScreenPopup.modal("show");
    $('#endScreen').modal('show');
    document.getElementById("endScreenBigTitle").style.color = 'white';
    document.getElementById("endScreenSmallTitle").style.color = 'white';
    //Set the colourToWin variable
    console.log(game.in_checkmate());
    if (game.in_checkmate() === true) {
      colourToWin = (game.turn() === 'w') ? 'black wins' : 'white wins';
      (game.turn() === 'w') ? lose = 1 : win = 1;
      wayOfWin = 'Checkmate';
    }
    else if (whiteTime == 0) {
      colourToWin = 'black wins';
      lose = 1;
      wayOfWin = 'Timeout';
    } else if (blackTime == 0) {
      colourToWin = 'white wins';
      win = 1;
      wayOfWin = 'Timeout';
    } else if (game.in_stalemate() === true || game.in_threefold_repetition() === true || game.insufficient_material() === true) {
      colourToWin = 'draw';
      draw = 1;
      if (game.in_stalemate()) wayOfWin = 'Stalemate';
      else if (game.in_threefold_repetition()) wayOfWin = 'Threefold Repetition';
      else wayOfWin = 'Insufficient Material';
    } else if (game.in_draw === true && game.insufficient_material() === false) {
      // The game is a draw by the 50-move rule
      colourToWin = 'draw';
      draw = 1;
      wayOfWin = '50-move rule';
    } else {
      //The game is lost by Resignation
      if (colourToMove == 'white') {
        colourToWin = 'black wins';
        lose = 1;
      } else {
        colourToWin = 'white wins';
        win = 1;
      }
    }
    console.log(wayOfWin);
    // Win-loss If conditions
    if (colourToWin == 'white wins' && colourToMove == 'white') {
      // Add an event listener to the modal element to detect when it is shown
      document.getElementById('endScreenBigTitle').innerHTML = 'You win!';
      document.getElementById("endScreenSmallTitle").innerHTML = 'By ' + wayOfWin;
      document.getElementById('endScreenHeader').style.backgroundColor = 'rgb(28, 126, 4)';
      modal.addEventListener("shown.bs.modal", function () {
        // Wait for two seconds before animating the borders
        setTimeout(function () {
          animateBorder(playerLogo);
        }, 200);
      });
    }
    else if (colourToWin == 'black wins' && colourToMove == 'black') {
      // Add an event listener to the modal element to detect when it is shown
      document.getElementById('endScreenBigTitle').innerHTML = 'You win!';
      document.getElementById("endScreenSmallTitle").innerHTML = 'By ' + wayOfWin;
      document.getElementById('endScreenHeader').style.backgroundColor = 'rgb(28, 126, 4)';
      modal.addEventListener("shown.bs.modal", function () {
        // Wait for two seconds before animating the borders
        setTimeout(function () {
          animateBorder(playerLogo);
        }, 200);
      });
    }
    else if (colourToWin == 'white wins' && colourToMove == 'black') {
      // Add an event listener to the modal element to detect when it is shown
      document.getElementById('endScreenBigTitle').innerHTML = 'You lose!';
      document.getElementById("endScreenSmallTitle").innerHTML = 'By ' + wayOfWin;
      document.getElementById('endScreenHeader').style.backgroundColor = 'red';
      modal.addEventListener("shown.bs.modal", function () {
        // Wait for two seconds before animating the borders
        setTimeout(function () {
          animateBorder(stockfishLogo);
        }, 200);
      });
    }
    else if (colourToWin == 'black wins' && colourToMove == 'white') {
      // Add an event listener to the modal element to detect when it is shown
      document.getElementById('endScreenBigTitle').innerHTML = 'You lose!';
      document.getElementById("endScreenSmallTitle").innerHTML = 'By ' + wayOfWin;
      document.getElementById('endScreenHeader').style.backgroundColor = 'rgb(255, 0, 0)';
      modal.addEventListener("shown.bs.modal", function () {
        // Wait for two seconds before animating the borders
        setTimeout(function () {
          animateBorder(stockfishLogo);
        }, 200);
      });
    }
    else {
      document.getElementById('endScreenBigTitle').innerHTML = 'Draw';
      document.getElementById("endScreenSmallTitle").innerHTML = 'By ' + wayOfWin;
      document.getElementById('endScreenHeader').style.backgroundColor = '#B4B0B0';
    }

    //Code for "Copy PGN" button
    document.getElementById("copyPGN").addEventListener("click", function () {
      console.log("pog");
      var pgn = game.pgn();
      navigator.clipboard.writeText(pgn);
      document.getElementById("copyPGN").innerHTML = "Copied to Clipboard!";
    });
  }

  //Code for the Green-Border Animation
  var modal = document.getElementById("endScreen");
  var playerLogo = document.querySelector(".playerLogo");
  var stockfishLogo = document.querySelector(".stockfishLogo");
  function animateBorder(image) {
    image.style.outlineWidth = '7px';

  }

  function displayLines() {
    if (document.getElementById("linesSwitch").checked === true) {
      document.getElementById("lines").style.display = "block";
      document.getElementById("lines").style.height = "100px";
      document.getElementById("lines").style.overflow = "auto";
      document.getElementById("thisisjustherecusineedittobe").style.display = "block";
    }
    else {
      document.getElementById("lines").style.display = "none";
      document.getElementById("thisisjustherecusineedittobe").style.display = "none";
    }
  }

  function displayEval() {
    if (document.getElementById("evalSwitch").checked === true) {
      document.getElementById("evalnum1").style.display = "inline";
      document.getElementById("evalnum2").style.display = "inline";
      document.getElementById("evalnum3").style.display = "inline";
      document.getElementById("evalnum4").style.display = "inline";
      document.getElementById("evalnum5").style.display = "inline";
      document.getElementById("evalnum6").style.display = "inline";
      document.getElementById("evalnum7").style.display = "inline";
      document.getElementById("evalnum8").style.display = "inline";
      document.getElementById("evalnum9").style.display = "inline";
      document.getElementById("evalnum10").style.display = "inline";
    }
    else {
      document.getElementById("evalnum1").style.display = "none";
      document.getElementById("evalnum2").style.display = "none";
      document.getElementById("evalnum3").style.display = "none";
      document.getElementById("evalnum4").style.display = "none";
      document.getElementById("evalnum5").style.display = "none";
      document.getElementById("evalnum6").style.display = "none";
      document.getElementById("evalnum7").style.display = "none";
      document.getElementById("evalnum8").style.display = "none";
      document.getElementById("evalnum9").style.display = "none";
      document.getElementById("evalnum10").style.display = "none";
    }
  }
  function displayClock(color) {
    var display = '#';
    if (color == 'black') display += 'time2';
    else display += 'time1';
    $(id).text();
  }
}
else {
  function func1() {
    stockfishStrength++;
    if (stockfishStrength > 20) stockfishStrength = 20;
    stockfishStrength *= 76.5;
    stockfishStrength += 1320;
    localStorage.setItem("v1input", stockfishStrength);
    location.reload();
  }
  function func2() {
    location.reload();
  }
  function func3() {
    stockfishStrength--;
    if (stockfishStrength < 0) stockfishStrength = 0;
    stockfishStrength *= 76.5;
    stockfishStrength += 1320;
    localStorage.setItem("v1input", stockfishStrength);
    location.reload();
  }
  function func4() {
    location.reload();
  }
  function func5() {
    location.reload();
  }
  var waitSec = function () {
    setTimeout(waitSec, 1000);
    if (userGameEnd == 0) {
      if (whiteTime == 0 || blackTime == 0) {
        if (userGameEnd == 0) endGame();
      }
      if (moveColour == 'white') {
        whiteTime--;
        whiteMin = Math.floor(whiteTime / 60);
        whiteSec = whiteTime % 60;
        if (whiteMin < 10) {
          whiteMin = '0' + whiteMin;
        }
        if (whiteSec < 10) {
          whiteSec = '0' + whiteSec;
        }
        var display = whiteMin + ':' + whiteSec;
        $('#time2').text(display);
      }
      else {
        blackTime--;
        blackMin = Math.floor(blackTime / 60);
        blackSec = blackTime % 60;
        if (blackMin < 10) {
          blackMin = '0' + blackMin;
        }
        if (blackSec < 10) {
          blackSec = '0' + blackSec;
        }
        var display = blackMin + ':' + blackSec;
        $('#time1').text(display);
      }
    }
  }
  waitSec();
  document.getElementById("whiteTimeName").innerHTML = "Black: ";
  document.getElementById("blackTimeName").innerHTML = "White: ";
  var stockfish = new Worker('stockfish.js');
  stockfish.postMessage("setoption name skill level type spin default " + stockfishStrength + " min " + stockfishStrength + " max " + stockfishStrength);
  var pgnIndex = 0;
  var movesPlayed = 0;
  var moveIndex = 0;
  var userLines = parseInt(localStorage.getItem("v8input"));
  var userDepth = localStorage.getItem("v6input");
  var squareClass = 'square-55d63';
  var squareToHighlight = null;
  var colorToHighlight = null;
  var userTakeBacks = parseInt(localStorage.getItem("v11input"));
  if (userTakeBacks == 21) userTakeBacks = 2147483647;
  var contemptLvl = localStorage.getItem("v5input");
  var $board = $('#board');
  var slowMove = parseInt(localStorage.getItem("v7input"));
  for (var i = userLines + 1; i <= 10; i++) {
    document.getElementById("eval_" + i).remove();
    document.getElementById("num" + i).remove();
    document.getElementById("evalnum" + i).remove();
  }
  stockfish.postMessage("setoption name slow mover type spin default " + slowMove + " min " + slowMove + " max " + slowMove);
  stockfish.postMessage("setoption name contempt type spin default " + contemptLvl + " min " + contemptLvl + " max " + contemptLvl);
  stockfish.postMessage("setoption name threads type spin default 1 min 1 max " + localStorage.getItem("v3input"));
  stockfish.postMessage("setoption name MultiPV value " + userLines);
  var pgnGetIndex = 3;
  var userGameEnd = 0;
  var userPosInput = localStorage.getItem("fenImputBox");
  if (userPosInput == 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
    pgnGetIndex = 0;
  }
  var board,
    game = new Chess(userPosInput);
  var onDragStart = function (source, piece, position, orientation) {
    if (userGameEnd == 0) {
      if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^w/) !== -1) {
        return false;
      }
    }
  };

  var makeMove = function () {
    if (userGameEnd == 0) {

      var possibleMoves = game.moves();

      if (possibleMoves.length === 0) return;

      var FEN = game.fen();
      stockfish.postMessage("position fen" + " " + FEN);
      stockfish.postMessage("go depth " + String(userDepth));
      stockfish.onmessage = function (event) {

        var str = event.data;
        var res = str.match(/score/g);
        res = str.split(" ");
        if ((res[0] == "info") && (res[3] == "seldepth")) {
          var score = parseInt(res[9]);
          var pv = res[6];
          if (pv == 1) {
            document.getElementById("evalVal").style.height = ((Math.floor(score / 10)) + 250) + "px";
          } ``
          var id = "eval_" + pv;
          var line = "";
          document.getElementById("evalnum" + pv).innerHTML = " " + parseInt(score) / 100;
          var maximumRun = 25;
          const chess2 = new Chess(game.fen());
          if (parseInt(res.length - 1) < 33) maximumRun = parseInt(res.length - 1);
          for (var i = 21; i <= parseInt(maximumRun); i++) {
            var result = res[i];
            var from = result[0] + result[1];
            var to = result[2] + result[3];
            var pieceFrom = chess2.get(from);
            var pieceTo = chess2.get(to);
            var ppp = "";
            if (pieceFrom != null) {
              if (pieceFrom.type != "p" && pieceFrom.type != "P") {
                if (pieceFrom.color == "b") ppp += pieceFrom.type;
                else ppp += pieceFrom.type.toUpperCase();
                if (pieceTo != null) {
                  ppp += "x";
                }
              }
              else {
                if (pieceTo != null) {
                  ppp += result[0];
                  ppp += "x";
                }
              }
            }
            ppp += to;
            line += ppp;
            chess2.move(ppp);
            line += " ";
          }
          document.getElementById(id).innerHTML = line;
        }

        if (res[0] == "bestmove" && userGameEnd == 0) {

          zug = res[1].split("");

          botmovesource = zug[0] + zug[1];
          botmovetarget = zug[2] + zug[3];

          var move = game.move({
            color: 'w',
            from: botmovesource,
            to: botmovetarget,
            promotion: 'q'
          });
          $board.find('.' + squareClass).removeClass('highlight-white')
          $board.find('.' + squareClass).removeClass('highlight-black')
          $board.find('.square-' + move.from).addClass('highlight-black')
          squareToHighlight = move.to
          colorToHighlight = 'black'
          var pgn = game.pgn();
          pgn = String(pgn);
          const dummyarray = pgn.split("\n");
          const pgnArray = dummyarray[pgnGetIndex].split(" ");
          pgnIndex++;
          addMove(pgnArray[pgnIndex], 1, pgnArray[pgnIndex - 1]);
          pgnIndex++;
          board.position(game.fen());
          movesPlayed++;
          moveIndex++;
          whiteTime += whiteBonus;
          moveColour = 'black';
          whiteMin = Math.floor(whiteTime / 60);
          whiteSec = whiteTime % 60;
          if (whiteMin < 10) {
            whiteMin = '0' + whiteMin;
          }
          if (whiteSec < 10) {
            whiteSec = '0' + whiteSec;
          }
          var display = whiteMin + ':' + whiteSec;
          $('#time1').text(display);
          sound();
        }
      };
    }
  };

  var onDrop = function (source, target) {
    if (userGameEnd == 0) {
      var move = game.move({
        color: 'b',
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      });
      $board.find('.' + squareClass).removeClass('highlight-white')
      $board.find('.' + squareClass).removeClass('highlight-black')
      $board.find('.square-' + source).addClass('highlight-white')
      $board.find('.square-' + target).addClass('highlight-white')
      colorToHighlight = 'white'
      if (move === null) return 'snapback';
      blackTime += blackBonus;
      moveColour = 'white';
      blackMin = Math.floor(blackTime / 60);
      blackSec = blackTime % 60;
      if (blackMin < 10) {
        blackMin = '0' + blackMin;
      }
      if (blackSec < 10) {
        blackSec = '0' + blackSec;
      }
      var display = blackMin + ':' + blackSec;
      $('#time2').text(display);
      window.setTimeout(makeMove, 150);
    }
  };

  var onSnapEnd = function () {
    if (userGameEnd == 0) {

      board.position(game.fen());
      var pgn = game.pgn();
      pgn = String(pgn);
      const dummyarray = pgn.split("\n");
      const pgnArray = dummyarray[pgnGetIndex].split(" ");
      addMove(pgnArray[pgnIndex], 0, pgnArray[pgnIndex - 2]);
      pgnIndex++;
      movesPlayed++;
      moveIndex++;
      sound();
    }
  };

  function onMoveEnd() {
    $board.find('.square-' + squareToHighlight)
      .addClass('highlight-' + colorToHighlight);
  }

  var cfg = {
    draggable: true,
    position: userPosInput,
    onDragStart: (userGameEnd === 1 ? null : onDragStart),
    onDrop: (userGameEnd === 1 ? null : onDrop),
    onSnapEnd: (userGameEnd === 1 ? null : onSnapEnd),
    onMoveEnd: (userGameEnd === 1 ? null : onMoveEnd),
    orientation: 'black'
  };
  board = ChessBoard('board', cfg);
  // board.orientation('black');
  window.setTimeout(makeMove, 150);

  function moveBackward() {
    moveIndex--;
    if (moveIndex < 0) moveIndex = 0;
    var chess3 = new Chess(userPosInput);
    const moves = game.history();
    for (var i = 0; i < moveIndex; i++) {
      chess3.move(moves[i]);
    }
    board.position(chess3.fen());
  }

  function moveForward() {
    moveIndex++;
    var chess3 = new Chess(userPosInput);
    const moves = game.history();
    if (moveIndex > moves.length) moveIndex = moves.length;
    for (var i = 0; i < moveIndex; i++) {
      chess3.move(moves[i]);
    }
    board.position(chess3.fen());
  }

  function sound() {
    if (game.in_checkmate() === true || game.in_draw() === true) {
      endGame();
      document.getElementById('sound').innerHTML = '<audio autoplay preload controls> <source src="sound/game-end.mp3" type="audio/mp3" /> </audio>';
      if (game.in_draw() === true) {
        document.getElementById("boxDraw").style.display = "block";
      }
      else if (moveColour == "black") {
        document.getElementById("boxWin").style.display = "block";
      }
      else {
        document.getElementById("boxLose").style.display = "block";
      }
    }
    else if (game.in_check() === true) {
      document.getElementById('sound').innerHTML = '<audio autoplay preload controls> <source src="sound/move-check.mp3" type="audio/mp3" /> </audio>';
    }
    else {
      document.getElementById('sound').innerHTML = '<audio autoplay preload controls> <source src="sound/move.mp3" type="audio/mp3" /> </audio>';
    }
  }

  function undoMove(undoMoveNumber, player) {
    if (userTakeBacks > 0 && userGameEnd == 0) {
      userTakeBacks--;
      $board.find('.' + squareClass).removeClass('highlight-white')
      $board.find('.' + squareClass).removeClass('highlight-black')
      const moves = game.history();
      game = new Chess(userPosInput);
      pgnIndex = -2 + (parseInt(undoMoveNumber) * 3) + (player == "black");
      pgnIndex++;
      if (player == "white") {
        document.getElementById(undoMoveNumber * 2 - (player == "white") + 1).remove();
        document.getElementById(undoMoveNumber * 2 - (player == "white") + 1 + "breakid").remove();
      }
      if (moves.length % 2 == 1) document.getElementById((moves.length + 1) / 2 + '.').remove();
      else document.getElementById(moves.length / 2 + '.').remove();
      for (var i = undoMoveNumber * 2 - (player == "white") + 1; i < moves.length - 1; i++) {
        document.getElementById(i + 1).remove();
        if (i % 2 == 1) document.getElementById((i + 1) / 2 + ".").remove();
      }
      for (var i = 0; i < undoMoveNumber * 2 - (player == "white"); i++) {
        game.move(moves[i]);
      }
      board.position(game.fen());
      if (player == "black") {
        window.setTimeout(makeMove, 150);
        board.position(game.fen());
      }
    }
    else if (userGameEnd == 1) {
      const moves = game.history();
      var game5 = new Chess(userPosInput);
      for (var i = 0; i < undoMoveNumber * 2 - (player == "white"); i++) {
        game5.move(moves[i]);
      }
      board.position(game5.fen());
    }
  }
  function addMove(move, white, moveNumber) {
    var table = document.getElementById("moves");
    if (move == "O-O") {
      move = "O~O";
    }
    else if (move == "O-O-O") {
      move = "O~O~O";
    }
    if (white == "1") {
      var row = document.createElement("div");
      row.setAttribute("class", "moveRow");
      row.setAttribute("id", moveNumber);
      var cell = document.createElement("span");
      cell.textContent = moveNumber + " ";
      cell.setAttribute("class", "moveNumber");
      row.appendChild(cell);
      var cell2 = document.createElement("span");
      var config = "undoMove(" + moveNumber + ", 'white')";
      cell2.setAttribute("onclick", config);
      var ind = parseInt(pgnIndex) + 2;
      ind /= 3;
      ind *= 2;
      ind--;
      cell2.setAttribute("class", "moveonsidebar whiteMove");
      cell2.setAttribute("id", ind);
      cell2.textContent = move;
      row.appendChild(cell2);
      table.appendChild(row);
    }
    else {
      var row = document.getElementById(moveNumber);
      var cell = document.createElement("span");
      var config = "undoMove(" + moveNumber + ", 'black')";
      cell.setAttribute("onclick", config);
      var ind = parseInt(pgnIndex) + 1;
      ind /= 3;
      ind = Math.floor(ind);
      ind *= 2;
      cell.setAttribute("class", "moveonsidebar blackMove");
      cell.setAttribute("id", ind);
      cell.textContent = " " + move;
      row.appendChild(cell);
      table.appendChild(row);
      var nextLine = document.createElement("br");
      nextLine.setAttribute("id", ind + "breakid");
      row.appendChild(nextLine);
    }
  }

  document.addEventListener("keypress", function (event) {
    if (event.key == ',') {
      moveBackward();
    }
    else if (event.key == 'ArrowLeft') {
      moveBackward();
    }
    else if (event.key == '.') {
      moveForward();
    }
  });
  function endGame() {
    var win = 0;
    var lose = 0;
    var draw = 0;
    console.log("hi");
    userGameEnd = 1;
    userTakeBacks = 2147483647;
    cfg.draggable = false;
    cfg.position = board.position();
    board = ChessBoard('board', cfg);
    document.getElementById('sound').innerHTML = '<audio autoplay preload controls> <source src="sound/game-end.mp3" type="audio/mp3" /> </audio>';
    //Code added for End Screen
    // var endScreenPopup = document.getElementById("endScreen");
    // endScreenPopup.modal("show");
    $('#endScreen').modal('show');
    document.getElementById("endScreenBigTitle").style.color = 'white';
    document.getElementById("endScreenSmallTitle").style.color = 'white';
    //Set the colourToWin variable
    console.log(game.in_checkmate());
    if (game.in_checkmate() === true) {
      colourToWin = (game.turn() === 'w') ? 'black wins' : 'white wins';
      (game.turn() === 'w') ? lose = 1 : win = 1;
      wayOfWin = 'Checkmate';
    }
    else if (whiteTime == 0) {
      colourToWin = 'black wins';
      lose = 1;
      wayOfWin = 'Timeout';
    } else if (blackTime == 0) {
      colourToWin = 'white wins';
      win = 1;
      wayOfWin = 'Timeout';
    } else if (game.in_stalemate() === true || game.in_threefold_repetition() === true || game.insufficient_material() === true) {
      colourToWin = 'draw';
      draw = 1;
      if (game.in_stalemate()) wayOfWin = 'Stalemate';
      else if (game.in_threefold_repetition()) wayOfWin = 'Threefold Repetition';
      else wayOfWin = 'Insufficient Material';
    } else if (game.in_draw === true && game.insufficient_material() === false) {
      // The game is a draw by the 50-move rule
      colourToWin = 'draw';
      draw = 1;
      wayOfWin = '50-move rule';
    } else {
      //The game is lost by Resignation
      if (colourToMove == 'white') {
        colourToWin = 'black wins';
        lose = 1;
      } else {
        colourToWin = 'white wins';
        win = 1;
      }
    }
    console.log(wayOfWin);
    // Win-loss If conditions
    if (colourToWin == 'white wins' && colourToMove == 'white') {
      // Add an event listener to the modal element to detect when it is shown
      document.getElementById('endScreenBigTitle').innerHTML = 'You win!';
      document.getElementById("endScreenSmallTitle").innerHTML = 'By ' + wayOfWin;
      document.getElementById('endScreenHeader').style.backgroundColor = 'rgb(28, 126, 4)';
      modal.addEventListener("shown.bs.modal", function () {
        // Wait for two seconds before animating the borders
        setTimeout(function () {
          animateBorder(playerLogo);
        }, 200);
      });
    }
    else if (colourToWin == 'black wins' && colourToMove == 'black') {
      // Add an event listener to the modal element to detect when it is shown
      document.getElementById('endScreenBigTitle').innerHTML = 'You win!';
      document.getElementById("endScreenSmallTitle").innerHTML = 'By ' + wayOfWin;
      document.getElementById('endScreenHeader').style.backgroundColor = 'rgb(28, 126, 4)';
      modal.addEventListener("shown.bs.modal", function () {
        // Wait for two seconds before animating the borders
        setTimeout(function () {
          animateBorder(playerLogo);
        }, 200);
      });
    }
    else if (colourToWin == 'white wins' && colourToMove == 'black') {
      // Add an event listener to the modal element to detect when it is shown
      document.getElementById('endScreenBigTitle').innerHTML = 'You lose!';
      document.getElementById("endScreenSmallTitle").innerHTML = 'By ' + wayOfWin;
      document.getElementById('endScreenHeader').style.backgroundColor = 'red';
      modal.addEventListener("shown.bs.modal", function () {
        // Wait for two seconds before animating the borders
        setTimeout(function () {
          animateBorder(stockfishLogo);
        }, 200);
      });
    }
    else if (colourToWin == 'black wins' && colourToMove == 'white') {
      // Add an event listener to the modal element to detect when it is shown
      document.getElementById('endScreenBigTitle').innerHTML = 'You lose!';
      document.getElementById("endScreenSmallTitle").innerHTML = 'By ' + wayOfWin;
      document.getElementById('endScreenHeader').style.backgroundColor = 'rgb(255, 0, 0)';
      modal.addEventListener("shown.bs.modal", function () {
        // Wait for two seconds before animating the borders
        setTimeout(function () {
          animateBorder(stockfishLogo);
        }, 200);
      });
    }
    else {
      document.getElementById('endScreenBigTitle').innerHTML = 'Draw';
      document.getElementById("endScreenSmallTitle").innerHTML = 'By ' + wayOfWin;
      document.getElementById('endScreenHeader').style.backgroundColor = '#B4B0B0';
    }

    //Code for "Copy PGN" button
    document.getElementById("copyPGN").addEventListener("click", function () {
      console.log("pog");
      var pgn = game.pgn();
      navigator.clipboard.writeText(pgn);
      document.getElementById("copyPGN").innerHTML = "Copied to Clipboard!";
    });
  }

  //Code for the Green-Border Animation
  var modal = document.getElementById("endScreen");
  var playerLogo = document.querySelector(".playerLogo");
  var stockfishLogo = document.querySelector(".stockfishLogo");
  function animateBorder(image) {
    image.style.outlineWidth = '7px';

  }
  function displayLines() {
    if (document.getElementById("linesSwitch").checked === true) {
      document.getElementById("lines").style.display = "block";
      document.getElementById("lines").style.height = "100px";
      document.getElementById("lines").style.overflow = "auto";
      document.getElementById("thisisjustherecusineedittobe").style.display = "block";
    }
    else {
      document.getElementById("lines").style.display = "none";
      document.getElementById("thisisjustherecusineedittobe").style.display = "none";
    }
  }

  function displayEval() {
    if (document.getElementById("evalSwitch").checked === true) {
      document.getElementById("evalnum1").style.display = "inline";
      document.getElementById("evalnum2").style.display = "inline";
      document.getElementById("evalnum3").style.display = "inline";
      document.getElementById("evalnum4").style.display = "inline";
      document.getElementById("evalnum5").style.display = "inline";
      document.getElementById("evalnum6").style.display = "inline";
      document.getElementById("evalnum7").style.display = "inline";
      document.getElementById("evalnum8").style.display = "inline";
      document.getElementById("evalnum9").style.display = "inline";
      document.getElementById("evalnum10").style.display = "inline";
    }
    else {
      document.getElementById("evalnum1").style.display = "none";
      document.getElementById("evalnum2").style.display = "none";
      document.getElementById("evalnum3").style.display = "none";
      document.getElementById("evalnum4").style.display = "none";
      document.getElementById("evalnum5").style.display = "none";
      document.getElementById("evalnum6").style.display = "none";
      document.getElementById("evalnum7").style.display = "none";
      document.getElementById("evalnum8").style.display = "none";
      document.getElementById("evalnum9").style.display = "none";
      document.getElementById("evalnum10").style.display = "none";
    }
  }
}
