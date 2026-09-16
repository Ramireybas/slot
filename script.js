const images = [
    'imagen1.jpg', // Sensa
    'imagen2.jpg', // Nokia
    'imagen3.jpg', // ISP Group
    'imagen4.jpg'  // Tu combo perfecto
];

const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const leverTrigger = document.getElementById('lever-trigger');
const spinButton = document.getElementById('spin-button');
const resultMessage = document.getElementById('result-message');

let isSpinning = false;

const getRandomImage = () => images[Math.floor(Math.random() * images.length)];

function inicializarRodillos() {
    reels.forEach(reel => {
        reel.innerHTML = '';
        let strip = document.createElement('div');
        strip.classList.add('strip');
        strip.style.transform = 'translateY(0px)';
        
        // AQUÍ ESTÁ LA MAGIA: getBoundingClientRect no redondea los decimales
        const reelHeight = reel.getBoundingClientRect().height || 200;
        const symbolHeight = reelHeight / 3;

        for (let i = 0; i < 4; i++) {
            let img = document.createElement('img');
            img.src = getRandomImage();
            img.style.height = `${symbolHeight}px`; 
            strip.appendChild(img);
        }
        reel.appendChild(strip);
    });
}
// Aseguramos que la fuente y el CSS carguen antes de calcular tamaños
window.addEventListener('load', inicializarRodillos);

function dispararGiro() {
    if (isSpinning) return; 
    
    isSpinning = true;
    
    reels.forEach(reel => {
        reel.classList.remove('win-glow', 'lose-glow');
    });
    
    if (resultMessage) {
        resultMessage.textContent = '¡GIRANDO...!';
        resultMessage.style.color = '#fff';
    }
    
    iniciarGiroMultiFila();
}

if (leverTrigger) leverTrigger.addEventListener('click', dispararGiro);
if (spinButton) spinButton.addEventListener('click', dispararGiro);

function iniciarGiroMultiFila() {
    let completed = 0;
    const finalResults = [];
    const maxSpinTimeMs = 4500; 

    const safetyTimeout = setTimeout(() => {
        if (isSpinning) isSpinning = false;
    }, maxSpinTimeMs + 500);

    reels.forEach((reel, index) => {
        // Cálculo milimétrico para el giro
        const reelHeight = reel.getBoundingClientRect().height || 200;
        const totalSymbols = 20 + (index * 5); 
        const symbolHeight = reelHeight / 3;
        
        const strip = document.createElement('div');
        strip.classList.add('strip');

        const symbolsArray = [];
        for (let i = 0; i < totalSymbols; i++) {
            const chosen = getRandomImage();
            symbolsArray.push(chosen);
            const img = document.createElement('img');
            img.src = chosen;
            img.style.height = `${symbolHeight}px`; // Medida exacta con decimales
            strip.appendChild(img);
        }

        const winningIndex = totalSymbols - 2; 
        finalResults.push(symbolsArray[winningIndex]);

        reel.innerHTML = '';
        reel.appendChild(strip);
        
        void strip.getBoundingClientRect(); 

        const distance = -((totalSymbols - 3) * symbolHeight);
        const spinTime = 1.5 + (index * 0.5); 
        
        strip.style.transition = `transform ${spinTime}s cubic-bezier(0.25, 1, 0.45, 1.05)`;
        strip.style.transform = `translateY(${distance}px)`;

        setTimeout(() => {
            completed++;
            if (completed === 3) {
                clearTimeout(safetyTimeout);
                checkResult(finalResults);
                isSpinning = false; 
            }
        }, spinTime * 1000);
    });
}

function checkResult(results) {
    if (!resultMessage) return;
    
    const img1 = results[0];
    const img2 = results[1];
    const img3 = results[2];

    if (img1 === img2 && img2 === img3) {
        reels.forEach(reel => reel.classList.add('win-glow'));

        if (img1 === images[0]) {
            resultMessage.textContent = '🎉 ¡PREMIO MAYOR (Sensa)! 🎉';
            resultMessage.style.color = '#f1c40f';
        } else if (img1 === images[1]) {
            resultMessage.textContent = '🥈 ¡PREMIO NOKIA! 🥈';
            resultMessage.style.color = '#bdc3c7';
        } else if (img1 === images[2]) {
            resultMessage.textContent = '🥉 ¡PREMIO ISP GROUP! 🥉';
            resultMessage.style.color = '#cd7f32';
        } else {
            resultMessage.textContent = '¡COMBO PERFECTO GANADOR!';
            resultMessage.style.color = '#00ffcc';
        }
    } else {
        reels.forEach(reel => reel.classList.add('lose-glow'));
        resultMessage.textContent = 'INTÉNTALO DE NUEVO';
        resultMessage.style.color = '#ff3366';
    }
}
