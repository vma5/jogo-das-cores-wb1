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
    let timeLeft = 30; 
    let timer;
    let playerName = '';
    
    // --- CORREÇÃO AQUI: Dicionário de Cores ---
    // O nome da esquerda é o que aparece para o jogador.
    // O código da direita (#...) é o que o navegador usa para pintar o quadrado.
    const colorsMap = {
        'Vermelho': '#FF0000',
        'Verde': '#008000',
        'Azul': '#0000FF',
        'Amarelo': '#FFFF00',
        'Roxo': '#800080',
        'Laranja': '#FFA500',
        'Ciano': '#00FFFF',
        'Rosa': '#FFC0CB'
    };

    // Pegamos apenas os nomes em português para a lógica do sorteio
    const colors = Object.keys(colorsMap);
    
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
        timeLeft = 30; 
        updateScore();
        updateTimer();
        colorGrid.innerHTML = '';
        
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
        const shuffledColors = [...colors];
        shuffleArray(shuffledColors);

        // Seleciona uma cor alvo aleatória
        const colorIndex = Math.floor(Math.random() * colors.length);
        currentColorToClick = colors[colorIndex];
        
        // Exibe o nome em PORTUGUÊS para o jogador
        colorToClickDisplay.textContent = `Clique na cor: ${currentColorToClick}`;

        const squares = document.querySelectorAll('.square');
        squares.forEach((square, index) => {
            const colorNamePT = shuffledColors[index % shuffledColors.length];
            
            // --- AJUSTE TÉCNICO ---
            // Pintamos com o valor hexadecimal do dicionário
            square.style.backgroundColor = colorsMap[colorNamePT];
            // Guardamos o nome em PT para conferir o clique depois
            square.setAttribute('data-color', colorNamePT);
        });
    };

    const handleSquareClick = (event) => {
        const clickedColor = event.target.getAttribute('data-color');

        if (clickedColor === currentColorToClick) {
            score += 5; 
        } else {
            score -= 10; 
        }
        updateScore();
        generateNewRound();
    };

    const updateScore = () => {
        scoreDisplay.textContent = score;
    };

    const startTimer = () => {
        timer = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    };

    const updateTimer = () => {
        timerDisplay.textContent = `${timeLeft}s`;
    };

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
            scoreSpan.textContent = ` - Pontuação: ${player.score}`;
            li.appendChild(scoreSpan);
            rankingList.appendChild(li);
        });
    };

    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', () => {
        startScreen.style.display = 'block';
        endScreen.style.display = 'none';
        rankingContainer.style.display = 'none';
    });

    if (localStorage.getItem('ranking')) {
        showRanking();
    }
});