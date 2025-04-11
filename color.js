const game = document.getElementById('game');
const player = document.getElementById('player');
const info = document.getElementById('info');
const startBtn = document.getElementById('startBtn');

const colors = ['red', 'green', 'blue','yellow'];
let playerColorIndex = 0;
let score = 0;
let level = 1;
let interval;
let isPlaying = false;
let highScore = localStorage.getItem('colorCatchHigh') || 0;

function updateInfo() {
  info.innerText = `Level: ${level} | Score: ${score} | Best: ${highScore}`;
}

function changePlayerColor(dir) {
  if (dir === 'left') {
    playerColorIndex = (playerColorIndex + 3) % 4;
  } else if (dir === 'right') {
    playerColorIndex = (playerColorIndex + 1) % 4;
  }
  player.style.background = colors[playerColorIndex];
}

function dropColor() {
  const block = document.createElement('div');
  const colorIndex = Math.floor(Math.random() * 4);
  block.classList.add('falling');
  block.style.background = colors[colorIndex];
  block.style.left = (colorIndex * 100) + 'px';
  game.appendChild(block);

  let top = 0;
  const speed = 2 + level * 0.3;

  const fall = setInterval(() => {
    top += speed;
    block.style.top = top + 'px';

    if (top >= 370) {
      clearInterval(fall);
      if (colorIndex === playerColorIndex) {
        block.remove();
        score++;
        if (score % 6 === 0) level++;
        updateInfo();
      } else {
        endGame();
      }
    }
  }, 20);
}

function endGame() {
  isPlaying = false;
  clearInterval(interval);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('colorCatchHigh', highScore);
  }
  alert(`💥 Game Over!\nScore: ${score}\nBest: ${highScore}`);
  resetGame();
}

function resetGame() {
  document.querySelectorAll('.falling').forEach(b => b.remove());
  score = 0;
  level = 1;
  playerColorIndex = 0;
  player.style.background = colors[playerColorIndex];
  updateInfo();
}

function startGame() {
  if (isPlaying) return;
  resetGame();
  isPlaying = true;
  interval = setInterval(dropColor, 1000);
}

document.addEventListener('keydown', (event) => {
  if (!isPlaying) return;
  if (event.key === 'ArrowLeft') changePlayerColor('left');
  if (event.key === 'ArrowRight') changePlayerColor('right');
});

startBtn.addEventListener('click', startGame);