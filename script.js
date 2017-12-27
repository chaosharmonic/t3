// initial game state
var board = [
  null, null, null,
  null, null, null,
  null, null, null
]

var human = null;
var ai;
var turn;
var hardMode = true;
var r;
var blank;

// game start
function reset() {
  for (var i in board){
    board[i] = null;
  }
  $(".space").text("");
  var players = ["X", "O"];
  r = Math.floor(Math.random() * players.length);
  human = players.splice(r, 1)[0];
  ai = players[0];
  turn = "X";
  if (ai == "X") {
    $("h1").text("My turn!");
    setTimeout(function(){
      aiMove();
    }, 2000);
  }
  else {
    $("h1").text("Your move, " + human);
  }
}

// marking a space
function write(s, l){
  if (board[s] == null && turn == l && human !== null){
    board[s] = l;
    s = "#" + s;
    $(s).text(l);
    if (winner(board, l)) {
      gameOver(l);
    }
    else if(!(board.includes(null))){
      gameOver("draw");
    }
    else if (l == human) {
      turn = ai;
      $("h1").text("My turn!")
      setTimeout(function(){
        aiMove();
      }, 2000);
    }
  }
}

// win conditions
function winner (s, p){
  return (
    (p == s[0] && p == s[1] && p == s[2]) || // top row
    (p == s[3] && p == s[4] && p == s[5]) || // mid row
    (p == s[6] && p == s[7] && p == s[8]) || // bot row
    (p == s[0] && p == s[3] && p == s[6]) || // left col
    (p == s[1] && p == s[4] && p == s[7]) || // mid col
    (p == s[2] && p == s[5] && p == s[8]) || // right col
    (p == s[0] && p == s[4] && p == s[8]) || // diag from top left
    (p == s[6] && p == s[4] && p == s[2]) // diag from bot left
  )
}

// end of game
function gameOver(x) {
  for (var i in board){
    if (board[i] == null){
      board[i] = -1;
    }
  }
  if (x == human){
    $("h1").text("You win!");
  }
  else if (x == ai) {
    $("h1").text("Sorry!");
  }
  else {
    $("h1").text("It's a draw!");
  }
}

// opposing AI logic
function aiMove(){
  // build an array of possible blank
  blank = [];
  for (var i in board){
    if (board[i] == null){
      blank.push(Number(i));
    }
  }

  var move = aiChoice();
  write (move, ai)
  if (!(winner(board, ai)) && board.includes(null)) {
    setTimeout(function(){
      turn = human;
      $("h1").text("Your move, " + human);
    }, 1000)
  }
}

// analyze for a winning move on either side
function checkWinningMove(player){
  for (var i = 0; i < blank.length; i++){
    var j = blank[i];
    var boardCopy = board.slice(0);
    boardCopy[j] = player;
    if (winner(boardCopy, player)){
      return j;
    }
  }
  return null;
}

// analyze for an opportunity to fork (create two winning moves)
function checkMate(player){
  for (var i = 0; i < blank.length; i++){
    var winningMoves = 0;
    var j = blank[i];
    var board2 = board.slice(0);
    board2[j] = player;

    var blank2 = blank.filter(function(x){return x !== j});
    for (var k = 0; k < blank2.length; k++){
      var l = blank2[k];
      var board3 = board2.slice(0);
      board3[l] = player;
      if (winner(board3, player)){
        winningMoves++;
      }
    }
    if (winningMoves > 1){
      return j;
    }
  }
  return null;
}

function aiChoice(){
  var corners = blank.filter(function(i){
    return i == 0 || i == 2 || i == 6 || i == 8;
  });
  var sides = blank.filter(function(i){
    return i == 1 || i == 3 || i == 5 || i == 7;
  });

  // selects from the following options, in order of descending priority:

  // make winning move if one exists
  if (checkWinningMove(ai) !== null) {return checkWinningMove(ai)}

  // prevent opponent's winning move if one exists
  else if (checkWinningMove(human) !== null) {return checkWinningMove(human)}

  // build fork if opportunity exists
  else if (checkMate(ai) !== null) {return checkMate(ai)}

  // prevent fork if player opportunity exists
  else if (checkMate(human) !== null) {return checkMate(human)}

  // move on a corner space
  else if (corners.length > 0) {
    r = Math.floor(Math.random() * corners.length);
    return corners[r];
  }

  // move on the center space
  else if (blank.includes(4)){return 4;}

  // move on a side space
  else if (sides.length > 0) {
    r = Math.floor(Math.random() * sides.length);
    return sides[r];
  }

}

// click events

$(".space").click(function(){
  var num = Number(this.id);
  write(num, human);
});

$("#reset").click(function(){
  reset();
})
