const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const playerSpeed = 5;
const bulletSpeed = 10;
const enemySpeed = 2;
const enemyBulletSpeed = 5;
const largeEnemyBulletSpeed = 3;
const largeEnemyHealth = 20;
const messageDuration = 5000; // 5 seconds
const flashInterval = 500; // Flash interval in milliseconds

let bullets = [];
let enemies = [];
let enemyBullets = [];
let largeEnemies = [];
let keys = {};
let playerAlive = true;
let enemyCount = 0;








document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' && playerAlive) {
        shootBullet();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function movePlayer() {
    if (!playerAlive) return;
    if (keys['w'] && player.offsetTop > 0) {
        player.style.top = player.offsetTop - playerSpeed + 'px';
    }
    if (keys['s'] && player.offsetTop < gameArea.clientHeight - player.clientHeight) {
        player.style.top = player.offsetTop + playerSpeed + 'px';
    }
    if (keys['a'] && player.offsetLeft > 0) {
        player.style.left = player.offsetLeft - playerSpeed + 'px';
    }
    if (keys['d'] && player.offsetLeft < gameArea.clientWidth - player.clientWidth) {
        player.style.left = player.offsetLeft + playerSpeed + 'px';
    }
}

function shootBullet() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = player.offsetLeft + player.clientWidth + 'px';
    bullet.style.top = player.offsetTop + player.clientHeight / 2 - 5 + 'px';
    gameArea.appendChild(bullet);
    bullets.push(bullet);
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.style.left = bullet.offsetLeft + bulletSpeed + 'px';
        if (bullet.offsetLeft > gameArea.clientWidth) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });
}

function spawnEnemy() {
    if (enemyCount >= 10) {
        spawnLargeEnemy();
        enemyCount = 0;
    } else {
        const enemy = document.createElement('img'); // Create img element
        enemy.src = 'enemysmall.png'; // Set the src attribute to your enemy image
        enemy.classList.add('enemy');
        enemy.style.left = gameArea.clientWidth - 50 + 'px';
        enemy.style.top = Math.random() * (gameArea.clientHeight - 50) + 'px';
        gameArea.appendChild(enemy);
        enemies.push(enemy);
        enemyCount++;
    }
}

function spawnLargeEnemy() {
    setTimeout(() => { // Delay large enemy spawn
        const largeEnemy = document.createElement('img'); // Create img element
        largeEnemy.src = 'largeenemy1.png'; // Set the src attribute to your large enemy image
        largeEnemy.classList.add('largeEnemy');
        largeEnemy.style.left = gameArea.clientWidth - 100 + 'px';
        largeEnemy.style.top = Math.random() * (gameArea.clientHeight - 100) + 'px';
        largeEnemy.health = largeEnemyHealth;
        gameArea.appendChild(largeEnemy);
        largeEnemies.push(largeEnemy);
    }, messageDuration); // Spawn large enemy after message duration
    displayFlashingMessage('CAPITAL SHIP INBOUND', 3); // Display flashing message
}

function displayFlashingMessage(message, flashes) {
    const flashingText = document.createElement('div');
    flashingText.textContent = "CAPITAL SHIP INBOUND";
    flashingText.style.position = 'absolute';
    flashingText.style.top = '50px'; // Adjust the top position as needed
    flashingText.style.left = '50%';
    flashingText.style.transform = 'translateX(-50%)';
    flashingText.style.fontSize = '24px';
    flashingText.style.color = 'white';
    flashingText.style.textAlign = 'center';
    flashingText.style.fontWeight = 'bold';
    flashingText.style.visibility = 'hidden';
    gameArea.appendChild(flashingText);

    let flashCount = 0;
    const flashIntervalId = setInterval(() => {
        flashCount++;
        if (flashingText.style.visibility === 'hidden') {
            flashingText.style.visibility = 'visible';
        } else {
            flashingText.style.visibility = 'hidden';
        }
        if (flashCount === flashes * 2) {
            clearInterval(flashIntervalId);
            flashingText.remove();
        }
    }, flashInterval);
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        if (enemy.offsetLeft > gameArea.clientWidth / 2) {
            enemy.style.left = enemy.offsetLeft - enemySpeed + 'px';
        } else {
            if (!enemy.shooting) {
                enemy.shooting = true;
                setInterval(() => shootEnemyBullet(enemy), 1000);
            }
        }
    });

    largeEnemies.forEach((largeEnemy, index) => {
        // Adjust the speed calculation for large enemies
        const largeEnemyMoveSpeed = enemySpeed / 3; // 1/3rd of the normal enemy speed

        if (largeEnemy.offsetLeft > gameArea.clientWidth / 2) {
            largeEnemy.style.left = largeEnemy.offsetLeft - largeEnemyMoveSpeed + 'px';
        } else {
            if (!largeEnemy.shooting) {
                largeEnemy.shooting = true;
                setInterval(() => shootEnemyBullet(largeEnemy, largeEnemyBulletSpeed), 1000);
            }
        }
    });
}

function shootEnemyBullet(enemy, speed = enemyBulletSpeed) {
    const bullet = document.createElement('div');
    bullet.classList.add('enemyBullet');
    bullet.style.left = enemy.offsetLeft + 'px';
    bullet.style.top = enemy.offsetTop + enemy.clientHeight / 2 - 5 + 'px';
    bullet.speed = speed;
    gameArea.appendChild(bullet);
    enemyBullets.push(bullet);
}

function moveEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
        bullet.style.left = bullet.offsetLeft - bullet.speed + 'px';
        if (bullet.offsetLeft < 0) {
            bullet.remove();
            enemyBullets.splice(index, 1);
        }

        // Check collision with player
        if (checkCollision(bullet, player)) {
            playerAlive = false;
            alert("Game Over! You were hit by an enemy bullet.");
            bullet.remove();
            enemyBullets.splice(index, 1);
        }
    });
}

function checkCollision(rect1, rect2) {
    return !(rect1.offsetLeft > rect2.offsetLeft + rect2.clientWidth ||
             rect1.offsetLeft + rect1.clientWidth < rect2.offsetLeft ||
             rect1.offsetTop > rect2.offsetTop + rect2.clientHeight ||
             rect1.offsetTop + rect1.clientHeight < rect2.offsetTop);
}

function checkBulletCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (checkCollision(bullet, enemy)) {
                bullet.remove();
                bullets.splice(bulletIndex, 1);
                enemy.remove();
                enemies.splice(enemyIndex, 1);
            }
        });

        largeEnemies.forEach((largeEnemy, largeEnemyIndex) => {
            if (checkCollision(bullet, largeEnemy)) {
                bullet.remove();
                bullets.splice(bulletIndex, 1);
                largeEnemy.health--;
                if (largeEnemy.health <= 0) {
                    largeEnemy.remove();
                    largeEnemies.splice(largeEnemyIndex, 1);
                }
            }
        });
    });
}

function gameLoop() {
    if (playerAlive) {
        movePlayer();
        moveBullets();
        moveEnemies();
        moveEnemyBullets();
        checkBulletCollisions();
        requestAnimationFrame(gameLoop);
    }
}

setInterval(spawnEnemy, 700);
gameLoop();
