document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("startButton");
    const introButton = document.getElementById("introButton");
    const bestiaryButton = document.getElementById("bestiaryButton");
    const quitButton = document.getElementById("quitButton");

    const mainMenu = document.getElementById("mainMenu");
    const gameArea = document.getElementById("gameArea");
    const introVideo = document.getElementById("introVideo");
    const bestiary = document.getElementById("bestiary");

    const musicButton = document.getElementById("musicButton");
    const gameMusic = document.getElementById("gameMusic");

    let gameLoopInterval;
    let enemySpawnInterval;
    let largeEnemySpawnInterval;

    function startGame() {
        gameArea.style.display = "block";
        mainMenu.style.display = "none";
        introVideo.style.display = "none";
        bestiary.style.display = "none";
        musicButton.style.display = "inline";

        const player = document.getElementById('player');
        const playerSpeed = 5;
        const bulletSpeed = 10;
        const enemySpeed = 2;
        const largeEnemyHealth = 50;
        const dodgeDuration = 1000;
        const dodgeSpeed = 20;
        const dodgeCooldown = 3000;
        const missileCooldown = 6000;
        const missileDamage = 10;
        const messageDuration = 5000;
        const flashInterval = 500;

        let bullets = [];
        let enemies = [];
        let largeEnemies = [];
        let enemyBullets = [];
        let keys = {};
        let playerAlive = true;
        let isDodging = false;
        let dodgeTimeout;
        let dodgeCooldownTimeout;
        let canDodge = true;
        let canShootMissile = true;

        document.addEventListener('keydown', (e) => {
            if (e.key !== ' ' && e.key !== 'r') {
                keys[e.key] = true;
            } else if (e.key === ' ') {
                if (playerAlive) shootBullet();
                e.preventDefault();
            } else if (e.key === 'r') {
                if (canShootMissile) shootMissile();
                e.preventDefault();
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
            if (keys['Shift'] && canDodge) {
                dodge();
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

        function shootMissile() {
            const missile = document.createElement('div');
            missile.classList.add('missile');
            missile.style.left = player.offsetLeft + player.clientWidth + 'px';
            missile.style.top = player.offsetTop + player.clientHeight / 2 - 5 + 'px';
            gameArea.appendChild(missile);

            const nearestEnemy = findNearestEnemy(missile);
            if (nearestEnemy) {
                moveMissile(missile, nearestEnemy);
            }

            canShootMissile = false;
            updateMissileCooldownDisplay();

            setTimeout(() => {
                canShootMissile = true;
                updateMissileCooldownDisplay();
            }, missileCooldown);
        }

        function updateMissileCooldownDisplay() {
            const missileCooldownDisplay = document.getElementById('missileCooldown');
            missileCooldownDisplay.textContent = canShootMissile ? 'Ready' : 'Recharging';
        }

        function findNearestEnemy(missile) {
            let nearestEnemy = null;
            let minDistance = Infinity;

            enemies.concat(largeEnemies).forEach(enemy => {
                const dx = enemy.offsetLeft - missile.offsetLeft;
                const dy = enemy.offsetTop - missile.offsetTop;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestEnemy = enemy;
                }
            });

            return nearestEnemy;
        }

        function moveMissile(missile, target) {
            const missileSpeed = 7;

            function updateMissilePosition() {
                const dx = target.offsetLeft - missile.offsetLeft;
                const dy = target.offsetTop - missile.offsetTop;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const velocityX = (dx / distance) * missileSpeed;
                const velocityY = (dy / distance) * missileSpeed;

                missile.style.left = missile.offsetLeft + velocityX + 'px';
                missile.style.top = missile.offsetTop + velocityY + 'px';

                if (checkCollision(missile, target)) {
                    missile.remove();
                    if (target.classList.contains('largeEnemy')) {
                        target.health -= missileDamage;
                        if (target.health <= 0) {
                            target.remove();
                            largeEnemies = largeEnemies.filter(e => e !== target);
                        }
                    } else {
                        target.remove();
                        enemies = enemies.filter(e => e !== target);
                    }
                    clearInterval(missileInterval);
                }
            }

            const missileInterval = setInterval(updateMissilePosition, 20);
        }

        function dodge() {
            isDodging = true;
            player.classList.add('dodging');
            const originalTop = player.offsetTop;

            if (keys['w']) {
                player.style.top = Math.max(player.offsetTop - dodgeSpeed, 0) + 'px';
            } else if (keys['s']) {
                player.style.top = Math.min(player.offsetTop + dodgeSpeed, gameArea.clientHeight - player.clientHeight) + 'px';
            }

            dodgeTimeout = setTimeout(() => {
                isDodging = false;
                player.classList.remove('dodging');
            }, dodgeDuration);

            canDodge = false;
            dodgeCooldownTimeout = setTimeout(() => {
                canDodge = true;
            }, dodgeCooldown);
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
            console.log('Spawning enemy...');
            if (enemies.length > 0 && gameArea.clientWidth - enemies[enemies.length - 1].offsetLeft < 150) {
                console.log('Spawn skipped to prevent overlap.');
                return;
            }
            const enemy = document.createElement('img');
            enemy.classList.add('enemy');
            enemy.style.left = gameArea.clientWidth - 50 + 'px';
            enemy.style.top = Math.random() * (gameArea.clientHeight - 50) + 'px';
            enemy.initialLeft = enemy.offsetLeft;
            gameArea.appendChild(enemy);
            enemies.push(enemy);
            startEnemyFiring(enemy);
        }

        function spawnLargeEnemy() {
            console.log('Spawning large enemy...');
            if (largeEnemies.length > 0 && gameArea.clientWidth - largeEnemies[largeEnemies.length - 1].offsetLeft < 300) {
                console.log('Spawn skipped to prevent overlap.');
                return;
            }
            const largeEnemy = document.createElement('img');
            largeEnemy.classList.add('largeEnemy');
            largeEnemy.style.left = gameArea.clientWidth - 100 + 'px';
            largeEnemy.style.top = Math.random() * (gameArea.clientHeight - 100) + 'px';
            largeEnemy.health = largeEnemyHealth;
            gameArea.appendChild(largeEnemy);
            largeEnemies.push(largeEnemy);
            startLargeEnemyFiring(largeEnemy);
            displayFlashingMessage('CAPITAL SHIP INBOUND', 3);
        }

        function startEnemyFiring(enemy) {
            const enemyFireInterval = setInterval(() => {
                if (!document.body.contains(enemy) || enemy.offsetLeft < gameArea.clientWidth / 2) {
                    clearInterval(enemyFireInterval);
                    return;
                }
                const bullet = document.createElement('div');
                bullet.classList.add('enemyBullet');
                bullet.style.left = enemy.offsetLeft - 10 + 'px';
                bullet.style.top = enemy.offsetTop + enemy.clientHeight / 2 - 5 + 'px';
                gameArea.appendChild(bullet);
                enemyBullets.push(bullet);
            }, 1000);
        }

        function startLargeEnemyFiring(largeEnemy) {
            const largeEnemyFireInterval = setInterval(() => {
                if (!document.body.contains(largeEnemy) || largeEnemy.offsetLeft < gameArea.clientWidth / 2) {
                    clearInterval(largeEnemyFireInterval);
                    return;
                }

                const playerX = player.offsetLeft + player.clientWidth / 2;
                const playerY = player.offsetTop + player.clientHeight / 2;

                createLargeEnemyBullet(largeEnemy, playerX, playerY + 20);
                createLargeEnemyBullet(largeEnemy, playerX, playerY - 20);
            }, 1000);
        }

        function createLargeEnemyBullet(largeEnemy, targetX, targetY) {
            const bullet = document.createElement('div');
            bullet.classList.add('enemyBullet');
            bullet.style.left = largeEnemy.offsetLeft - 10 + 'px';
            bullet.style.top = largeEnemy.offsetTop + largeEnemy.clientHeight / 2 - 5 + 'px';

            const deltaX = targetX - (largeEnemy.offsetLeft - 10);
            const deltaY = targetY - (largeEnemy.offsetTop + largeEnemy.clientHeight / 2 - 5);
            const angle = Math.atan2(deltaY, deltaX);
            const velocityX = Math.cos(angle) * bulletSpeed;
            const velocityY = Math.sin(angle) * bulletSpeed;

            gameArea.appendChild(bullet);

            const bulletMovementInterval = setInterval(() => {
                bullet.style.left = bullet.offsetLeft + velocityX + 'px';
                bullet.style.top = bullet.offsetTop + velocityY + 'px';

                if (bullet.offsetLeft < 0 || bullet.offsetTop < 0 ||
                    bullet.offsetLeft > gameArea.clientWidth || bullet.offsetTop > gameArea.clientHeight) {
                    bullet.remove();
                    clearInterval(bulletMovementInterval);
                }
            }, 20);
        }

        function moveEnemyBullets() {
            enemyBullets.forEach((bullet, index) => {
                bullet.style.left = bullet.offsetLeft - bulletSpeed + 'px';
                if (bullet.offsetLeft < 0) {
                    bullet.remove();
                    enemyBullets.splice(index, 1);
                }
                if (checkCollision(bullet, player)) {
                    endGame();
                }
            });
        }

        function moveEnemies() {
            enemies.forEach((enemy, index) => {
                enemy.style.left = enemy.offsetLeft - enemySpeed + 'px';
                if (enemy.offsetLeft < 0) {
                    enemy.remove();
                    enemies.splice(index, 1);
                }

                bullets.forEach((bullet, bulletIndex) => {
                    if (checkCollision(bullet, enemy)) {
                        bullet.remove();
                        bullets.splice(bulletIndex, 1);
                        enemy.remove();
                        enemies.splice(index, 1);
                    }
                });

                if (checkCollision(enemy, player)) {
                    endGame();
                }
            });
        }

        function moveLargeEnemies() {
            largeEnemies.forEach((largeEnemy, index) => {
                largeEnemy.style.left = largeEnemy.offsetLeft - enemySpeed + 'px';
                if (largeEnemy.offsetLeft < 0) {
                    largeEnemy.remove();
                    largeEnemies.splice(index, 1);
                }

                bullets.forEach((bullet, bulletIndex) => {
                    if (checkCollision(bullet, largeEnemy)) {
                        bullet.remove();
                        bullets.splice(bulletIndex, 1);
                        largeEnemy.health -= 1;
                        if (largeEnemy.health <= 0) {
                            largeEnemy.remove();
                            largeEnemies.splice(index, 1);
                        }
                    }
                });

                if (checkCollision(largeEnemy, player)) {
                    endGame();
                }
            });
        }

        function checkCollision(obj1, obj2) {
            const rect1 = obj1.getBoundingClientRect();
            const rect2 = obj2.getBoundingClientRect();
            return !(rect1.right < rect2.left ||
                     rect1.left > rect2.right ||
                     rect1.bottom < rect2.top ||
                     rect1.top > rect2.bottom);
        }

        function endGame() {
            playerAlive = false;
            clearInterval(gameLoopInterval);
            clearInterval(enemySpawnInterval);
            clearInterval(largeEnemySpawnInterval);
        }

        function toggleMusic() {
            if (gameMusic.paused) {
                gameMusic.play();
                musicButton.textContent = "Pause Music";
            } else {
                gameMusic.pause();
                musicButton.textContent = "Play Music";
            }
        }

        musicButton.addEventListener("click", toggleMusic);

        gameLoopInterval = setInterval(() => {
            movePlayer();
            moveBullets();
            moveEnemies();
            moveLargeEnemies();
            moveEnemyBullets();
        }, 20);

        enemySpawnInterval = setInterval(spawnEnemy, 2000);
        largeEnemySpawnInterval = setInterval(spawnLargeEnemy, 10000);
    }

    startButton.addEventListener("click", startGame);
    introButton.addEventListener("click", () => {
        introVideo.style.display = "block";
        mainMenu.style.display = "none";
        gameArea.style.display = "none";
        bestiary.style.display = "none";
    });
    bestiaryButton.addEventListener("click", () => {
        bestiary.style.display = "block";
        mainMenu.style.display = "none";
        gameArea.style.display = "none";
        introVideo.style.display      = "none";
    });
    quitButton.addEventListener("click", () => {
        window.close();
    });

    document.getElementById("introBackButton").addEventListener("click", function() {
        mainMenu.style.display = "block";
        introVideo.style.display = "none";
    });

    document.getElementById("bestiaryBackButton").addEventListener("click", function() {
        mainMenu.style.display = "block";
        bestiary.style.display = "none";
    });

    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    
    searchButton.addEventListener("click", function() {
        const query = searchInput.value;
        if (query) {
            fetch(`http://localhost:3000/api/search?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    displaySearchResults(data);
                })
                .catch(error => {
                    console.error("Error fetching search results:", error);
                });
        }
    });
    
    function displaySearchResults(results) {
        searchResults.innerHTML = ''; // Clear previous results
    
        // Check if results is empty or undefined
        if (!results || Object.keys(results).length === 0) {
            searchResults.innerHTML = '<p>No results found.</p>';
            return;
        }
    
        const ul = document.createElement('ul');
    
        // Iterate over each type of result (enemies, factions, locations, lores, ships)
        for (const type in results) {
            if (results.hasOwnProperty(type)) {
                // Extract the array of results for the current type
                const typeResults = results[type];
    
                // Check if the typeResults is not empty and is an array
                if (Array.isArray(typeResults) && typeResults.length > 0) {
                    // Create a header for the type
                    const typeHeader = document.createElement('h3');
                    typeHeader.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize the type
                    ul.appendChild(typeHeader);
    
                    // Create a list item for each result
                    typeResults.forEach(result => {
                        const li = document.createElement('li');
                        let displayText = '';
    
                        // Customize display based on the object type
                        switch (type) {
                            case 'enemies':
                                displayText = `Name: ${result.name}, Description: ${result.description}, Health: ${result.health}`;
                                break;
                            case 'factions':
                                displayText = `Name: ${result.name}, Description: ${result.description}, Status: ${result.status}`;
                                break;
                            case 'locations':
                                displayText = `Name: ${result.name}, Description: ${result.description}, Functional: ${result.functional}, Purpose: ${result.purpose}, Population: ${result.population}`;
                                break;
                            case 'lores':
                                displayText = `Description: ${result.description}`;
                                break;
                            case 'ships':
                                displayText = `Name: ${result.name}, Health: ${result.health}, Description: ${result.description}`;
                                break;
                            default:
                                displayText = ''; // No specific display for other types
                                break;
                        }
    
                        // Add the display text to the list item
                        li.textContent = displayText;
                        ul.appendChild(li);
                    });
                }
            }
        }
    
        searchResults.appendChild(ul);
    }
    
    function displayFlashingMessage(message, duration) {
        const flashingMessage = document.createElement('div');
        flashingMessage.textContent = message;
        flashingMessage.classList.add('flashingMessage');
        gameArea.appendChild(flashingMessage);
        setTimeout(() => {
            flashingMessage.remove();
        }, duration * 1000);
    }
    
    function updateMissileCooldownDisplay() {
        const missileCooldownDisplay = document.getElementById('missileCooldown');
        missileCooldownDisplay.textContent = canShootMissile ? 'Ready' : 'Recharging';
    }});