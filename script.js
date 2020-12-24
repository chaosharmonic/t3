// initial game state
let board = new Array(9).fill(null)

let human, cpu, turn

const players = ['X', 'O']
const spaces = [0, 1, 2, 3, 4, 5, 6, 7, 8]
// let hardMode = true

const message = document.getElementById('message')

const updateMessage = (text) => {
  message.innerText = text
}

const generateBlank = (target) => target
  .map((space, index) => !space
    ? index
    : null
  ).filter(space => space !== null)

let blank = generateBlank(board)

// game start
const resetGame = () => {
  board = new Array(9).fill(null)
  blank = generateBlank(board)
  for (const num in spaces) {
    const id = String(num)
    document.getElementById(id).innerText = ''
  }
  turn = 'X'

  const r = Math.round(Math.random())
  const s = r !== 0 ? 0 : 1
  human = players[r]
  cpu = players[s]

  turn === cpu
    ? takeCpuTurn()
    : updateMessage(`Your move, ${human}`)
}

const takeHumanTurn = (space) => {
  const turnCondition = turn &&
    blank.includes(Number(space)) &&
    turn === human

  if (turnCondition) write(space, human)
}

// mark a space
const write = (space, player) => {
  board[space] = player

  document.getElementById(space).innerText = player

  blank = generateBlank(board)

  if (moveWinsGame(board, player)) return gameOver(player)
  if (!blank.length) return gameOver(null)

  if (player === human) {
    turn = cpu
    takeCpuTurn()
  }
}

// win conditions
const moveWinsGame = (space, player) => {
  const winConditions = [
    [space[0], space[1], space[2]], // top row
    [space[3], space[4], space[5]], // mid row
    [space[6], space[7], space[8]], // bot row
    [space[0], space[3], space[6]], // left col
    [space[1], space[4], space[7]], // mid col
    [space[2], space[5], space[8]], // right col
    [space[0], space[4], space[8]], // diag from top left
    [space[6], space[4], space[2]] // diag from bot left
  ]

  const playerWins = winConditions.some(row => row.every(s => s === player))

  return playerWins
}

const generateWinMessage = (winner) => {
  if (!winner) return 'It\'s a draw!'

  return winner === human
    ? 'You win!'
    : 'Sorry!'
}

// complete game
function gameOver (winner) {
  turn = null

  const message = generateWinMessage(winner)
  updateMessage(message)
}

// handle CPU turn
const cpuTurn = () => {
  if (turn) {
    const move = chooseMove()
    write(move, cpu)

    setTimeout(endCpuTurn, 1000)
  }
}

const takeCpuTurn = () => {
  if (turn) {
    updateMessage('My turn!')
    setTimeout(cpuTurn, 2000)
  }
}

const endCpuTurn = () => {
  if (turn) {
    turn = human
    updateMessage(`Your move, ${human}`)
  }
}

// analyze for a winning move on either side
const checkWinningMove = (player) => {
  for (const i in blank) {
    const move = blank[i]
    const boardCopy = board.slice()
    boardCopy[move] = player
    const winningMove = moveWinsGame(boardCopy, player)

    if (winningMove) return move
  }
  return null
}

// analyze for an opportunity to branch (create two winning moves)
const checkBranch = (player) => {
  for (const i in blank) {
    const move = i
    const newBoard = board.slice()
    newBoard[move] = player

    const newBlank = generateBlank(newBoard)

    const winningMoves = newBlank.filter(space => checkWinningMove(space))

    if (winningMoves.length > 1) return move
  }
  return null
}

const chooseMove = () => {
  const corners = blank.filter(e => [0, 2, 6, 8].includes(e))
  const sides = blank.filter(e => [1, 3, 5, 7].includes(e))

  // prioritize the following moves

  // make (or block) winning move if one exists
  const winningMove = checkWinningMove(cpu) || checkWinningMove(human)
  if (winningMove) return winningMove

  // build (or block) branch if opportunity exists
  const branch = checkBranch(cpu) || checkBranch(human)
  if (branch) return branch

  // move on the center space
  if (blank.includes(4)) return 4

  // move on a corner space, or (finally) a side space
  const choice = corners.length > 0 ? corners : sides
  const r = Math.floor(Math.random() * choice.length)

  return choice[r]
}

// click events

for (const num in spaces) {
  const id = String(num)
  const square = document.getElementById((id))
  square.addEventListener('click', () => takeHumanTurn(id))
}

const reset = document.getElementById('reset')
reset.addEventListener('click', () => resetGame())
