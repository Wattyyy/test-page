document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game");
    const gridSize = 8;
    const mineCount = 10; // Adjust the number of mines if desired
    let board = [];

    // Initialize the board array with cell objects
    function createBoard() {
        board = [];
        for (let i = 0; i < gridSize; i++) {
            board[i] = [];
            for (let j = 0; j < gridSize; j++) {
                board[i][j] = {
                    x: i,
                    y: j,
                    mine: false,
                    revealed: false,
                    adjacentMines: 0,
                };
            }
        }

        // Randomly place mines
        let minesPlaced = 0;
        while (minesPlaced < mineCount) {
            const randX = Math.floor(Math.random() * gridSize);
            const randY = Math.floor(Math.random() * gridSize);
            if (!board[randX][randY].mine) {
                board[randX][randY].mine = true;
                minesPlaced++;
            }
        }

        // Calculate adjacent mines for each cell
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                board[i][j].adjacentMines = countAdjacentMines(i, j);
            }
        }
    }

    // Count the number of mines around a given cell
    function countAdjacentMines(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newX = x + i;
                const newY = y + j;
                if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
                    if (board[newX][newY].mine) count++;
                }
            }
        }
        return count;
    }

    // Render the board to the DOM
    function renderBoard() {
        gameContainer.innerHTML = "";
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const cell = board[i][j];
                const cellDiv = document.createElement("div");
                cellDiv.classList.add("cell");
                cellDiv.dataset.x = i;
                cellDiv.dataset.y = j;

                if (cell.revealed) {
                    cellDiv.classList.add("revealed");
                    if (cell.mine) {
                        cellDiv.classList.add("mine");
                        cellDiv.textContent = "💣";
                    } else if (cell.adjacentMines > 0) {
                        cellDiv.textContent = cell.adjacentMines;
                    }
                }
                cellDiv.addEventListener("click", onCellClick);
                gameContainer.appendChild(cellDiv);
            }
        }
    }

    // Handle a cell click
    function onCellClick(e) {
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);
        if (board[x][y].revealed) return; // Ignore clicks on already revealed cells

        board[x][y].revealed = true;

        // If a mine is clicked, reveal all mines and end the game
        if (board[x][y].mine) {
            revealAllMines();
            alert("Game Over! You clicked on a mine.");
            return;
        }

        // If there are no adjacent mines, reveal neighboring cells recursively
        if (board[x][y].adjacentMines === 0) {
            revealEmptyCells(x, y);
        }

        renderBoard();
        checkWin();
    }

    // Recursively reveal empty cells with no adjacent mines
    function revealEmptyCells(x, y) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newX = x + i;
                const newY = y + j;
                if (
                    newX >= 0 &&
                    newX < gridSize &&
                    newY >= 0 &&
                    newY < gridSize &&
                    !board[newX][newY].revealed
                ) {
                    board[newX][newY].revealed = true;
                    if (board[newX][newY].adjacentMines === 0 && !board[newX][newY].mine) {
                        revealEmptyCells(newX, newY);
                    }
                }
            }
        }
    }

    // Reveal all mines (called when the player clicks on a mine)
    function revealAllMines() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (board[i][j].mine) {
                    board[i][j].revealed = true;
                }
            }
        }
        renderBoard();
    }

    // Check if the player has won (all non-mine cells revealed)
    function checkWin() {
        let win = true;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (!board[i][j].mine && !board[i][j].revealed) {
                    win = false;
                    break;
                }
            }
        }
        if (win) {
            alert("Congratulations! You cleared the board.");
            revealAllMines();
        }
    }

    // Initialize the game
    createBoard();
    renderBoard();
});
