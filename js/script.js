document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM
    const startScreen = document.getElementById('start-screen');
    const gameInfo = document.getElementById('game-info');
    const gameArea = document.getElementById('game-area');
    const endScreen = document.getElementById('end-screen');
    const rankingContainer = document.getElementById('ranking-container');
    const startButton = document.getElementById('start-button');
    const playAgainButton = document.getElementById('play-again-button');
    const playerNameInput = document.getElementById('player-name');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const colorToClickDisplay = document.getElementById('color-to-click');
    const colorGrid = document.getElementById('color-grid');
    const finalMessageDisplay = document.getElementById('final-message');
    const finalScoreDisplay = document.getElementById('final-score');
    const rankingList = document.getElementById('ranking-list');

    // Variáveis do jogo
    let score = 0;
    let timeLeft = 20; 
    let timer;
    let playerName = '';
    
    // 
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'cyan', 'magenta'];
    
    // Aumentado o tamanho da grade para 4x4 = 16
    const gridSize = 16; 
    let currentColorToClick = '';

    // Função para embaralhar um array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // Função para iniciar o jogo
    const startGame = () => {
        playerName = playerNameInput.value.trim();
        if (playerName === '') {
            alert('Por favor, digite seu nome para jogar.');
            return;
        }

        startScreen.style.display = 'none';
        endScreen.style.display = 'none';
        rankingContainer.style.display = 'none';
        gameInfo.style.display = 'flex';
        gameArea.style.display = 'block';

        score = 0;
        timeLeft = 15; // Reinicia o tempo para 15
        updateScore();
        updateTimer();
        colorGrid.innerHTML = '';
        
        // Crie os quadrados e adicione o evento de clique
        for (let i = 0; i < gridSize; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.addEventListener('click', handleSquareClick);
            colorGrid.appendChild(square);
        }

        generateNewRound();
        startTimer();
    };

    // Função para gerar uma nova rodada
    const generateNewRound = () => {
        // Embaralha as cores
        const shuffledColors = [...colors];
        shuffleArray(shuffledColors);

        // Seleciona uma cor aleatória para ser o alvo
        const colorIndex = Math.floor(Math.random() * colors.length);
        currentColorToClick = colors[colorIndex];
        colorToClickDisplay.textContent = `Clique na cor: ${currentColorToClick}`;

        // Aplica as cores aos quadrados
        const squares = document.querySelectorAll('.square');
        squares.forEach((square, index) => {
            // Garante que a grade tenha cores suficientes para preencher
            square.style.backgroundColor = shuffledColors[index % shuffledColors.length];
            square.setAttribute('data-color', shuffledColors[index % shuffledColors.length]);
        });
    };

    // Lida com o clique nos quadrados
    const handleSquareClick = (event) => {
        const clickedColor = event.target.getAttribute('data-color');

        if (clickedColor === currentColorToClick) {
            score += 5; // Recompensa menor por acerto
        } else {
            score -= 10; // Penalidade maior por erro
        }
        updateScore();
        generateNewRound();
    };

    // Atualiza a pontuação na tela
    const updateScore = () => {
        scoreDisplay.textContent = score;
    };

    // Inicia o cronômetro
    const startTimer = () => {
        timer = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    };

    // Atualiza o cronômetro na tela
    const updateTimer = () => {
        timerDisplay.textContent = `${timeLeft}s`;
    };

    // Função para finalizar o jogo
    const endGame = () => {
        clearInterval(timer);
        gameInfo.style.display = 'none';
        gameArea.style.display = 'none';
        endScreen.style.display = 'block';
        
        finalMessageDisplay.textContent = `Parabéns, ${playerName}!`;
        finalScoreDisplay.textContent = score;
        
        saveScore(playerName, score);
        showRanking();
    };

    // BÔNUS: Ranking
    const saveScore = (name, finalScore) => {
        let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
        ranking.push({ name, score: finalScore });
        ranking.sort((a, b) => b.score - a.score);
        localStorage.setItem('ranking', JSON.stringify(ranking));
    };

    const showRanking = () => {
        let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
        rankingContainer.style.display = 'block';
        rankingList.innerHTML = '';
        ranking.forEach((player, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${player.name}`;
            const scoreSpan = document.createElement('span');
            scoreSpan.textContent = `Pontuação: ${player.score}`;
            li.appendChild(scoreSpan);
            rankingList.appendChild(li);
        });
    };

    // Event Listeners
    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', () => {
        startScreen.style.display = 'block';
        endScreen.style.display = 'none';
        rankingContainer.style.display = 'none';
    });

    // Ao carregar a página, mostra o ranking, se houver
    if (localStorage.getItem('ranking')) {
        showRanking();
    }
});