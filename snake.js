const gridSize = 20;
const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('reset-btn');

let snake, direction, food, score, gameSpeed, interval;

// Initialize the game state
function initGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: -1 }; // Default direction (up)
  food = { x: 5, y: 5 };
  score = 0;
  gameSpeed = 300;
  scoreDisplay.textContent = score;

  clearInterval(interval);
  updateGrid();
  placeFood();
  interval = setInterval(gameLoop, gameSpeed);
}

// Create the grid
for (let i = 0; i < gridSize * gridSize; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  gameContainer.appendChild(cell);
}

const cells = document.querySelectorAll('.cell');

// Update the grid
function updateGrid() {
  cells.forEach(cell => cell.className = 'cell'); // Clear the grid

  // Draw the snake
  snake.forEach(segment => {
    const index = segment.y * gridSize + segment.x;
    cells[index]?.classList.add('snake');
  });

  // Draw the food
  const foodIndex = food.y * gridSize + food.x;
  cells[foodIndex]?.classList.add('food');
}

// Move the snake
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for collisions
  if (
    head.x < 0 || head.x >= gridSize ||
    head.y < 0 || head.y >= gridSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(interval);
    alert('Game Over! Final Score: ' + score);
    return;
  }

  snake.unshift(head);

  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    placeFood();
    if (gameSpeed > 50) gameSpeed -= 10; // Increase difficulty
    clearInterval(interval);
    interval = setInterval(gameLoop, gameSpeed);
  } else {
    snake.pop();
  }

  updateGrid();
}

// Place food randomly
function placeFood() {
  food.x = Math.floor(Math.random() * gridSize);
  food.y = Math.floor(Math.random() * gridSize);

  // Ensure food doesn't spawn on the snake
  if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    placeFood();
  }
}

// Handle keyboard input to change direction
function changeDirection(event) {
  const { key } = event;

  // Prevent reversing direction
  if (key === 'ArrowUp' && direction.y !== 1) direction = { x: 0, y: -1 };
  if (key === 'ArrowDown' && direction.y !== -1) direction = { x: 0, y: 1 };
  if (key === 'ArrowLeft' && direction.x !== 1) direction = { x: -1, y: 0 };
  if (key === 'ArrowRight' && direction.x !== -1) direction = { x: 1, y: 0 };
}

// Main game loop
function gameLoop() {
  moveSnake();
}

// Event listeners
document.addEventListener('keydown', changeDirection);
resetButton.addEventListener('click', initGame);

// Start the game
initGame();
