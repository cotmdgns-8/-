const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 캔버스 크기 설정
canvas.width = 600;
canvas.height = 500;

// 게임 상태
const gameState = {
    score: 0,
    timeLeft: 30,
    gameOver: false,
    clicks: 0
};

// 지안이 캐릭터
const jian = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 60,
    speed: 2,
    angle: Math.random() * Math.PI * 2,
    expression: 'normal', // normal, happy, surprised
    expressionTimer: 0
};

// 애니메이션 변수
let frameCount = 0;

// 게임 시작
startGame();

function startGame() {
    updateTime();
    gameLoop();
}

// 시간 업데이트
function updateTime() {
    if (gameState.gameOver) return;
    
    if (gameState.timeLeft > 0) {
        gameState.timeLeft--;
        document.getElementById('time').textContent = gameState.timeLeft;
        setTimeout(updateTime, 1000);
    } else {
        gameState.gameOver = true;
        document.getElementById('gameOverText').textContent = 
            `게임 종료! 총 ${gameState.clicks}번 놀렸어요! 😄`;
    }
}

// 지안이 업데이트
function updateJian() {
    // 지안이가 바운스하며 움직임
    frameCount++;
    
    // 일정 확률로 방향 변경
    if (Math.random() < 0.01) {
        jian.angle = Math.random() * Math.PI * 2;
    }
    
    // 위치 업데이트
    jian.x += Math.cos(jian.angle) * jian.speed;
    jian.y += Math.sin(jian.angle) * jian.speed;
    
    // 경계 체크 (화면 안에 머물도록)
    if (jian.x - jian.radius < 0 || jian.x + jian.radius > canvas.width) {
        jian.angle = Math.PI - jian.angle;
        jian.x = Math.max(jian.radius, Math.min(canvas.width - jian.radius, jian.x));
    }
    if (jian.y - jian.radius < 0 || jian.y + jian.radius > canvas.height) {
        jian.angle = -jian.angle;
        jian.y = Math.max(jian.radius, Math.min(canvas.height - jian.radius, jian.y));
    }
    
    // 표정 타이머
    if (jian.expressionTimer > 0) {
        jian.expressionTimer--;
        if (jian.expressionTimer === 0) {
            jian.expression = 'normal';
        }
    }
    
    // 점점 빨라지게
    if (frameCount % 300 === 0 && jian.speed < 5) {
        jian.speed += 0.3;
    }
}

// 클릭 이벤트
canvas.addEventListener('click', (e) => {
    if (gameState.gameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 클릭 위치와 지안이의 거리 계산
    const distance = Math.sqrt(
        Math.pow(x - jian.x, 2) + Math.pow(y - jian.y, 2)
    );
    
    if (distance < jian.radius) {
        // 지안이를 클릭했다!
        gameState.score += 10;
        gameState.clicks++;
        document.getElementById('score').textContent = gameState.score;
        document.getElementById('speed').textContent = gameState.clicks;
        
        // 표정 변경
        jian.expression = Math.random() > 0.5 ? 'happy' : 'surprised';
        jian.expressionTimer = 20;
        
        // 놀라서 튈 수도 있음
        if (Math.random() < 0.3) {
            jian.angle = Math.random() * Math.PI * 2;
            jian.speed *= 1.2;
        }
    }
});

// 지안이 그리기
function drawJian() {
    // 몸통
    ctx.fillStyle = '#FFDBB4';
    ctx.beginPath();
    ctx.arc(jian.x, jian.y, jian.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 얼굴
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // 눈
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(jian.x - 20, jian.y - 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(jian.x + 20, jian.y - 10, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // 표정에 따라 입 모양 변경
    if (jian.expression === 'happy') {
        // 웃는 입
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(jian.x, jian.y + 10, 15, 0, Math.PI);
        ctx.stroke();
        
        // 눈도 웃는 모양
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(jian.x - 20, jian.y - 10, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(jian.x + 20, jian.y - 10, 5, 0, Math.PI * 2);
        ctx.fill();
    } else if (jian.expression === 'surprised') {
        // 놀란 입 (O)
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(jian.x, jian.y + 15, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // 놀란 눈 (더 크게)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(jian.x - 20, jian.y - 10, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(jian.x + 20, jian.y - 10, 8, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // 평상시 입
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(jian.x - 15, jian.y + 10);
        ctx.lineTo(jian.x + 15, jian.y + 10);
        ctx.stroke();
    }
    
    // 이름 표시
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('지안이', jian.x, jian.y + 90);
}

// 배경 그리기
function drawBackground() {
    // 그라데이션 배경
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFE5E5');
    gradient.addColorStop(1, '#FFB6C1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 데코레이션 (하트)
    ctx.fillStyle = 'rgba(255, 107, 107, 0.2)';
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            3, 0, Math.PI * 2
        );
        ctx.fill();
    }
}

// 메인 그리기 함수
function draw() {
    drawBackground();
    
    if (!gameState.gameOver) {
        drawJian();
    } else {
        // 게임 오버 화면
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('게임 종료!', canvas.width / 2, canvas.height / 2 - 50);
        
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`최종 점수: ${gameState.score}점`, canvas.width / 2, canvas.height / 2 + 20);
        
        ctx.font = '20px Arial';
        ctx.fillText(`총 ${gameState.clicks}번 놀렸어요! 😄`, canvas.width / 2, canvas.height / 2 + 60);
        
        ctx.font = '16px Arial';
        ctx.fillText('새로고침하여 다시 시작하세요', canvas.width / 2, canvas.height / 2 + 100);
    }
}

// 업데이트 함수
function update() {
    if (!gameState.gameOver) {
        updateJian();
    }
}

// 게임 루프
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
