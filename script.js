const board = Array(9).fill(null); 
let currentPlayer = "X"; 
const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset-button");


const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6] 
];


cells.forEach(cell => {
  cell.addEventListener("click", handleCellClick);
});


resetButton.addEventListener("click", resetGame);


function handleCellClick(event) {
  const cell = event.target;
  const index = cell.dataset.index;

  if (board[index] || checkWinner(board)) return; 

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;

  if (checkWinner(board)) {
    alert(`${currentPlayer} wins!`);
    resetGame();
    return;
  }

  if (board.every(cell => cell !== null)) {
    alert("It's a tie!");
    resetGame();
    return;
  }

  currentPlayer = "O"; 
  makeAIMove();
}


function makeAIMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  board[bestMove] = "O";
  cells[bestMove].textContent = "O";

  if (checkWinner(board)) {
    alert("O wins!");
    resetGame();
    return;
  }

  if (board.every(cell => cell !== null)) {
    alert("It's a tie!");
    resetGame();
    return;
  }

  currentPlayer = "X"; 
}


function minimax(board, depth, isMaximizing) {
  const winner = checkWinner(board);

  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (board.every(cell => cell !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}


function checkWinner(board) {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}


function resetGame() {
  board.fill(null);
  cells.forEach(cell => (cell.textContent = " "));
  currentPlayer = "X";
}
