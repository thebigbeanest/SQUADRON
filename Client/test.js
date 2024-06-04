document.addEventListener("DOMContentLoaded", function() {
    // Get references to menu buttons and sections
    const startButton = document.getElementById("startButton");
    const introButton = document.getElementById("introButton");
    const bestiaryButton = document.getElementById("bestiaryButton");
    const quitButton = document.getElementById("quitButton");

    const mainMenu = document.getElementById("mainMenu");
    const gameArea = document.getElementById("gameArea");
    const introVideo = document.getElementById("introVideo");
    const bestiary = document.getElementById("bestiary");

    let gameLoopInterval;
    let enemySpawnInterval;

    // Function to start the game
    function startGame() {
        // Show game area, hide other sections
        gameArea.style.display = "block";
        mainMenu.style.display = "none";
        introVideo.style.display = "none";
        bestiary.style.display = "none";

        // Game code starts here
        const player = document.getElementById('player');
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

        // Add event listeners for player controls
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
                largeEnemy.src = 'assets/largeenemy.png'; // Set the src attribute to your large enemy image
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

        if (!gameLoopInterval) {
            gameLoopInterval = requestAnimationFrame(gameLoop);
        }

        if (!enemySpawnInterval) {
            enemySpawnInterval = setInterval(spawnEnemy, 700);
        }
    }

    // Add event listener to start button
    startButton.addEventListener("click", startGame);

    // Add event listeners for other buttons
    introButton.addEventListener("click", function() {
        // Show intro video, hide other sections
        introVideo.style.display = "block";
        mainMenu.style.display = "none";
        gameArea.style.display = "none";
        bestiary.style.display = "none";
    });

    bestiaryButton.addEventListener("click", function() {
        // Show bestiary, hide other sections
        bestiary.style.display = "block";
        mainMenu.style.display = "none";
        gameArea.style.display = "none";
        introVideo.style.display = "none";
    });

    quitButton.addEventListener("click", function() {
        // Close the tab
        window.close();
    });

    // Add event listeners to back buttons
    document.getElementById("introBackButton").addEventListener("click", function() {
        // Show main menu, hide intro video
        mainMenu.style.display = "block";
        introVideo.style.display = "none";
    });

    document.getElementById("bestiaryBackButton").addEventListener("click", function() {
        // Show main menu, hide bestiary
        mainMenu.style.display = "block";
        bestiary.style.display = "none";
    });

    // Bestiary search functionality
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
});