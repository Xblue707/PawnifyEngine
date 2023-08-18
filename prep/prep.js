function onDrop (source, target, piece, newPos, oldPos, orientation) {
  //An FEN consists of piece placement (e.g. rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR), colour to move (e.g. w), castling rights for black (e.g. KQ) and for white (e.g. kq), possible en passant targets (e.g. when white plays e4 as the first move, the FEN will be rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1)... research urself lol
  //Update FEN when any piece drop
  var fenImputBox = Chessboard.objToFen(newPos)
  document.getElementById('fenImputBox').value = fenImputBox + ' w KQkq - 0 1';
}

var config = {
  draggable: true,
  position: 'start',
  onDrop: onDrop,
  sparePieces: true,
  dropOffBoard: 'trash'
}
var board = Chessboard('myBoard', config)

function yes(){
  var fen=document.getElementById("fenImputBox").value;
  board.position(fen);
}

// add event listeners for the buttons
var startBtn = document.getElementById('startBtn')
var clearBtn = document.getElementById('clearBtn')
var flipBtn = document.getElementById('flipBtn')

startBtn.addEventListener('click', function() {
  // reset the board to the starting position
  board.start()
  document.getElementById('fenImputBox').value = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
})

clearBtn.addEventListener('click', function() {
  // clear the board of all pieces
  board.clear()
  document.getElementById('fenImputBox').value = "8/8/8/8/8/8/8/8 w - - 0 1";
})

flipBtn.addEventListener('click', function() {
  //Flip the orientation of the board
  board.flip()
})

//add event listerners for the colour pickers
var whiteToMove = document.getElementById('whiteToMove')
var randomToMove = document.getElementById('randomToMove')
var blackToMove = document.getElementById('blackToMove')
var colourToMove = 'white';

whiteToMove.addEventListener('click', function() {
  //change the orientation of the board to the white pieces
  board.orientation('white')
  //Set the colour 'white' to the colourToMove variable
  colourToMove = 'white';
})

randomToMove.addEventListener('click', function() {
  // Create an array of the two strings
  let colours = ['white', 'black'];
  // Generate a random index between 0 and 1
  let index = Math.floor(Math.random() * 2);
  //change the orientation of the board to a random colour
  board.orientation(colours[index])
  //Set the random colour to the colourToMove variable
  colourToMove = colours[index]
})

blackToMove.addEventListener('click', function() {
  //change the orientation of the board to the white pieces
  board.orientation('black')
  //Set the colour 'black' to the colourToMove variable
  colourToMove = 'black'
})

// Get all the input elements with the class name
let colourBtns = document.querySelectorAll('.colourBtn');

// Loop through them and add a click event listener
for (let colourBtn of colourBtns) {
  colourBtn.addEventListener('click', function(event) {
    // Remove the class from any element that has it
    let colourBtnActiveBtn = document.querySelector('.colourBtnActive');
    if (colourBtnActiveBtn) {
      colourBtnActiveBtn.classList.remove('colourBtnActive');
    }

    // Add the class to the current element
    event.target.classList.add('colourBtnActive');
  });
}

//Variable 1: Playing Strength
//Update uciElo value and uciEloSlider value
var v1slider = document.getElementById('uciEloSlider');
var v1input = document.getElementById('uciElo');
v1slider.oninput = function() {
  v1input.value = this.value;
}
v1input.oninput = function() {
  v1slider.value = this.value;
}

//Add an event listener to the question mark
var v1questionMark = document.getElementById('v1questionMark');
v1questionMark.addEventListener('mouseover',function() {
  document.getElementById('v1messageBox').style.display = 'block';
})
v1questionMark.addEventListener('mouseout',function() {
  document.getElementById('v1messageBox').style.display = 'none';
})

//Variable 2: Move time
//Update moveTime value and moveTimeSlider value
var v2slider = document.getElementById('moveTime');
var v2input = document.getElementById('moveTimeSlider');
v2slider.oninput = function() {
  v2input.value = this.value * 1000;
}
v2input.oninput = function() {
  v2slider.value = this.value / 1000;
}

//Add an event listener to the question mark
var v2questionMark = document.getElementById('v2questionMark');
v2questionMark.addEventListener('mouseover',function() {
  document.getElementById('v2messageBox').style.display = 'block';
})
v2questionMark.addEventListener('mouseout',function() {
  document.getElementById('v2messageBox').style.display = 'none';
})

//Variable 3: Hash Size
//Update threads value and threadsSlider value
var v3slider = document.getElementById('threads');
var v3input = document.getElementById('threadsSlider');
v3slider.oninput = function() {
  v3input.value = this.value;
}
v3input.oninput = function() {
  v3slider.value = this.value;
}

//Add an event listener to the question mark
var v3questionMark = document.getElementById('v3questionMark');
v3questionMark.addEventListener('mouseover',function() {
  document.getElementById('v3messageBox').style.display = 'block';
})
v3questionMark.addEventListener('mouseout',function() {
  document.getElementById('v3messageBox').style.display = 'none';
})

//Variable 4: Hash Size
//Update hashSize value and hashSizeSlider value
var v4slider = document.getElementById('hashSize');
var v4input = document.getElementById('hashSizeSlider');
v4slider.oninput = function() {
  v4input.value = this.value;
}
v4input.oninput = function() {
  v4slider.value = this.value;
}

//Add an event listener to the question mark
var v4questionMark = document.getElementById('v4questionMark');
v4questionMark.addEventListener('mouseover',function() {
  document.getElementById('v4messageBox').style.display = 'block';
})
v4questionMark.addEventListener('mouseout',function() {
  document.getElementById('v4messageBox').style.display = 'none';
})

//Variable 5: Contempt Level
//Update contemptLevel value and contemptLevelSlider value
var v5slider = document.getElementById('contemptLevel');
var v5input = document.getElementById('contemptLevelSlider');
v5slider.oninput = function() {
  v5input.value = this.value;
}
v5input.oninput = function() {
  v5slider.value = this.value;
}

//Add an event listener to the question mark
var v5questionMark = document.getElementById('v5questionMark');
v5questionMark.addEventListener('mouseover',function() {
  document.getElementById('v5messageBox').style.display = 'block';
})
v5questionMark.addEventListener('mouseout',function() {
  document.getElementById('v5messageBox').style.display = 'none';
})

//Variable 6: Maximum Nodes
//Update maximumNodes value and maximumNodesSlider value
var v6slider = document.getElementById('maximumNodes');
var v6input = document.getElementById('maximumNodesSlider');
v6slider.oninput = function() {
  v6input.value = this.value;
}
v6input.oninput = function() {
  v6slider.value = this.value;
}

//Add an event listener to the question mark
var v6questionMark = document.getElementById('v6questionMark');
v6questionMark.addEventListener('mouseover',function() {
  document.getElementById('v6messageBox').style.display = 'block';
})
v6questionMark.addEventListener('mouseout',function() {
  document.getElementById('v6messageBox').style.display = 'none';
})

//Variable 7: Slow Mover
//Update slowMover value and slowMoverSlider value
var v7slider = document.getElementById('slowMover');
var v7input = document.getElementById('slowMoverSlider');
v7slider.oninput = function() {
  v7input.value = this.value;
}
v7input.oninput = function() {
  v7slider.value = this.value;
}

//Add an event listener to the question mark
var v7questionMark = document.getElementById('v7questionMark');
v7questionMark.addEventListener('mouseover',function() {
  document.getElementById('v7messageBox').style.display = 'block';
})
v7questionMark.addEventListener('mouseout',function() {
  document.getElementById('v7messageBox').style.display = 'none';
})

//Variable 8: Engine Lines
//Update engineLines value and engineLinesSlider value
var v8slider = document.getElementById('engineLines');
var v8input = document.getElementById('engineLinesSlider');
v8slider.oninput = function() {
  v8input.value = this.value;
}
v8input.oninput = function() {
  v8slider.value = this.value;
}

//Add an event listener to the question mark
var v8questionMark = document.getElementById('v8questionMark');
v8questionMark.addEventListener('mouseover',function() {
  document.getElementById('v8messageBox').style.display = 'block';
})
v8questionMark.addEventListener('mouseout',function() {
  document.getElementById('v8messageBox').style.display = 'none';
})

//Variable 11: Number of Takebacks
//Update takebackNumber value and takebackNumberSlider value
var v11slider = document.getElementById('takebackNumber');
var v11input = document.getElementById('takebackNumberSlider');
v11slider.oninput = function() {
  if(v11slider=='21') v11input.value='INF';
  else v11input.value = this.value;
}
v11input.oninput = function() {
  if(v11input=='INF') v11slider.value=21;
  else v11slider.value = this.value;
}

//Add an event listener to the question mark
var v11questionMark = document.getElementById('v11questionMark');
v11questionMark.addEventListener('mouseover',function() {
  document.getElementById('v11messageBox').style.display = 'block';
})
v11questionMark.addEventListener('mouseout',function() {
  document.getElementById('v11messageBox').style.display = 'none';
})

//Varaible 9: Evaluation Type
// Get the radio buttons by id
var evaluationTypeOption1 = document.getElementById("evaluationTypeOption1");
var evaluationTypeOption2 = document.getElementById("evaluationTypeOption2");

// Declare a variable to store the value
var evaluationType;

// Add a click event listener to evaluationTypeOption1
evaluationTypeOption1.addEventListener("click", function() {
  // Assign the value of evaluationTypeOption1 to the variable
  evaluationType = evaluationTypeOption1.nextSibling.textContent.trim();
  // Display the value of the variable in the console
});

// Add a click event listener to evaluationTypeOption2
evaluationTypeOption2.addEventListener("click", function() {
  // Assign the value of evaluationTypeOption2 to the variable
  evaluationType = evaluationTypeOption2.nextSibling.textContent.trim();
  // Display the value of the variable in the console
});

//Add an event listener to the question mark
var v9questionMark = document.getElementById('v9questionMark');
v9questionMark.addEventListener('mouseover',function() {
  document.getElementById('v9messageBox').style.display = 'block';
})
v9questionMark.addEventListener('mouseout',function() {
  document.getElementById('v9messageBox').style.display = 'none';
})

//Varaible 10: Engine Ponder
// Get the radio buttons by id
var enginePonderOption1 = document.getElementById("enginePonderOption1");
var enginePonderOption2 = document.getElementById("enginePonderOption2");

// Declare a variable to store the value
var enginePonder;

// Add a click event listener to enginePonderOption1
enginePonderOption1.addEventListener("click", function() {
  // Assign the value of enginePonderOption1 to the variable
  enginePonder = enginePonderOption1.nextSibling.textContent.trim();
  // Display the value of the variable in the console
});

// Add a click event listener to enginePonderOption2
enginePonderOption2.addEventListener("click", function() {
  // Assign the value of enginePonderOption2 to the variable
  enginePonder = enginePonderOption2.nextSibling.textContent.trim();
  // Display the value of the variable in the console
});

//Add an event listener to the question mark
var v10questionMark = document.getElementById('v10questionMark');
v10questionMark.addEventListener('mouseover',function() {
  document.getElementById('v10messageBox').style.display = 'block';
})
v10questionMark.addEventListener('mouseout',function() {
  document.getElementById('v10messageBox').style.display = 'none';
})

//Logic for the "Play" button
// get the button element by its id
var playButton = document.getElementById("playButton");

// add a click event listener to the button
playButton.addEventListener("click", function() {
  // export the relevant variables using localStorage
  // log to console to make sure the code works
  localStorage.setItem("fenImputBox", fenImputBox.value);
  //Export the time control
  var whiteTimeControlMin = document.getElementById('whiteTimeControlMin').value;
  var whiteTimeControlSec = document.getElementById('whiteTimeControlSec').value;
  var whiteTimeControlBonusSec = document.getElementById('whiteTimeControlBonusSec').value;
  var blackTimeControlMin = document.getElementById('blackTimeControlMin').value;
  var blackTimeControlSec = document.getElementById('blackTimeControlSec').value;
  var blackTimeControlBonusSec = document.getElementById('blackTimeControlBonusSec').value;
  if(whiteTimeControlMin=='') whiteTimeControlMin=0;
  if(whiteTimeControlSec=='') whiteTimeControlSec=0;
  if(whiteTimeControlBonusSec=='') whiteTimeControlBonusSec=0;
  if(blackTimeControlMin=='') blackTimeControlMin=0;
  if(blackTimeControlSec=='') blackTimeControlSec=0;
  if(blackTimeControlBonusSec=='') blackTimeControlBonusSec=0;
  localStorage.setItem("whiteTimeControlMin", whiteTimeControlMin);
  localStorage.setItem("whiteTimeControlSec", whiteTimeControlSec);
  localStorage.setItem("whiteTimeControlBonusSec", whiteTimeControlBonusSec);
  localStorage.setItem("blackTimeControlMin", blackTimeControlMin);
  localStorage.setItem("blackTimeControlSec", blackTimeControlSec);
  localStorage.setItem("blackTimeControlBonusSec", blackTimeControlBonusSec);
  localStorage.setItem("colourToMove", colourToMove);
  localStorage.setItem("v1input", v1input.value);
  localStorage.setItem("v2input", v2input.value);
  localStorage.setItem("v3input", v3input.value);
  localStorage.setItem("v4input", v4input.value);
  localStorage.setItem("v5input", v5input.value);
  localStorage.setItem("v6input", v6input.value);
  localStorage.setItem("v7input", v7input.value);
  localStorage.setItem("v8input", v8input.value);
  localStorage.setItem("v11input", v11input.value);
  evaluationType = "Classical";
  localStorage.setItem("evaluationType", evaluationType);
  enginePonder = "On";
  localStorage.setItem("enginePonder", enginePonder);
  window.location.href = "../play/play.html";
});