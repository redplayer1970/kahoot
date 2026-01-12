let money;
let slotBet = 0, rouletteBet = 0, rouletteBetType = null, rouletteSelectedNumber = null, blackjackBet = 0;
let deck = [], playerCards = [], dealerCards = [], inRound = false;

// Récupération du solde et des mises sauvegardés
const savedMoney = localStorage.getItem("money");
const savedSlotBet = localStorage.getItem("slotBet");
const savedRouletteBet = localStorage.getItem("rouletteBet");
const savedBlackjackBet = localStorage.getItem("blackjackBet");

if (savedMoney === null) {
    money = 1000;
    localStorage.setItem("money", money);
} else {
    money = Number(savedMoney);
}

// Restaurer les mises sauvegardées
if (savedSlotBet !== null) {
    slotBet = Number(savedSlotBet);
}
if (savedRouletteBet !== null) {
    rouletteBet = Number(savedRouletteBet);
}
if (savedBlackjackBet !== null) {
    blackjackBet = Number(savedBlackjackBet);
}

const moneyEl = document.getElementById('money');
const moneySlotEl = document.getElementById('money-slot');
const moneyRouletteEl = document.getElementById('money-roulette');
const moneyBlackjackEl = document.getElementById('money-blackjack');
const slotBetEl = document.getElementById('slot-bet');
const rouletteBetEl = document.getElementById('roulette-bet');
const blackjackBetEl = document.getElementById('blackjack-bet');

function updateMoney() {
    moneyEl.textContent = money;
    moneySlotEl.textContent = money;
    moneyRouletteEl.textContent = money;
    moneyBlackjackEl.textContent = money;
    localStorage.setItem("money", money);
    checkBankrupt();
}

function saveBets() {
    localStorage.setItem("slotBet", slotBet);
    localStorage.setItem("rouletteBet", rouletteBet);
    localStorage.setItem("blackjackBet", blackjackBet);
}

// Initialiser l'affichage
updateMoney();
slotBetEl.textContent = slotBet;
rouletteBetEl.textContent = rouletteBet;
blackjackBetEl.textContent = blackjackBet;

function showRules(g) {
    if (g === 'slots') alert('Règles Machine à sous:\n- 3 symboles identiques = x8 la mise\n- 2 symboles identiques = x2 la mise');
    else if (g === 'roulette') alert('Règles Roulette:\n- Numéro direct (0-36) : x36 la mise\n- Couleur/Pair/Impair : x2 la mise\n- 1-18/19-36 : x2 la mise');
    else if (g === 'blackjack') alert('Règles Blackjack:\n- Objectif : battre la banque sans dépasser 21\n- Gain simple : x2\n- Blackjack : x2.5\n- Égalité : remboursé');
}

document.getElementById('rules-slots').onclick = () => showRules('slots');
document.getElementById('rules-roulette').onclick = () => showRules('roulette');
document.getElementById('rules-blackjack').onclick = () => showRules('blackjack');

function checkBankrupt() {
    if (money === 0 && slotBet === 0 && rouletteBet === 0 && blackjackBet === 0) {
        if (confirm('Vous n\'avez plus d\'argent pour recommencer ! Voulez-vous recommencer avec 1000€ ?')) {
            money = 1000;
            slotBet = 0;
            rouletteBet = 0;
            blackjackBet = 0;
            rouletteBetType = null;
            rouletteSelectedNumber = null;
            inRound = false;
            slotBetEl.textContent = slotBet;
            rouletteBetEl.textContent = rouletteBet;
            blackjackBetEl.textContent = blackjackBet;
            document.getElementById('slot-msg').textContent = '';
            document.getElementById('roulette-msg').textContent = '';
            document.getElementById('blackjack-msg').textContent = '';
            document.getElementById('reel1').querySelector('.reel-content').textContent = '?';
            document.getElementById('reel2').querySelector('.reel-content').textContent = '?';
            document.getElementById('reel3').querySelector('.reel-content').textContent = '?';
            document.getElementById('roulette-wheel').querySelector('.roulette-center').textContent = '0';
            document.getElementById('player-cards').innerHTML = '';
            document.getElementById('dealer-cards').innerHTML = '';
            document.getElementById('player-value').textContent = '0';
            document.getElementById('dealer-value').textContent = '0';
            playerCards = [];
            dealerCards = [];
            document.querySelectorAll('.roulette-number').forEach(n => n.classList.remove('selected'));
            updateMoney();
            saveBets();
        }
    }
}

// MACHINE À SOUS
const slotChipsEl = document.getElementById('slot-chips');
[1, 5, 25, 100, 500].forEach(v => {
    let c = document.createElement('div');
    c.className = 'chip';
    c.textContent = v;
    c.onclick = () => {
        if (money >= v) {
            slotBet += v;
            money -= v;
            slotBetEl.textContent = slotBet;
            updateMoney();
            saveBets();
        }
    };
    slotChipsEl.appendChild(c);
});

document.getElementById('slot-allin').onclick = () => {
    if (money > 0) {
        slotBet += money;
        money = 0;
        slotBetEl.textContent = slotBet;
        updateMoney();
        saveBets();
    }
};

document.getElementById('slot-launch').onclick = () => {
    if (slotBet <= 0) {
        alert('Place une mise !');
        return;
    }
    const btn = document.getElementById('slot-launch');
    btn.disabled = true;
    
    // Sauvegarder la mise actuelle avant de la réinitialiser
    const currentBet = slotBet;
    slotBet = 0;
    slotBetEl.textContent = slotBet;
    saveBets();
    
    const symbols = ["🔔", "⭐", "🍋", "🍒", "7️⃣", "💎", "💰", "🎰"];
    const reel1 = document.getElementById('reel1').querySelector('.reel-content');
    const reel2 = document.getElementById('reel2').querySelector('.reel-content');
    const reel3 = document.getElementById('reel3').querySelector('.reel-content');
    
    // Générer le résultat final dès le début
    const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];
    
    reel1.classList.add('spinning');
    reel2.classList.add('spinning');
    reel3.classList.add('spinning');
    let spins = 0;
    const interval = setInterval(() => {
        reel1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        reel2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        reel3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        spins++;
        if (spins > 20) {
            clearInterval(interval);
            reel1.classList.remove('spinning');
            reel2.classList.remove('spinning');
            reel3.classList.remove('spinning');
            
            // Afficher le résultat final
            reel1.textContent = result[0];
            reel2.textContent = result[1];
            reel3.textContent = result[2];
            
            // Attendre 800ms avant d'afficher le résultat
            setTimeout(() => {
                const msg = document.getElementById('slot-msg');
                if (result[0] === result[1] && result[1] === result[2]) {
                    const gain = currentBet * 8;
                    money += gain;
                    msg.textContent = `JACKPOT !!! +${gain}€`;
                } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
                    const gain = currentBet * 2;
                    money += gain;
                    msg.textContent = `Petit gain ! +${gain}€`;
                } else {
                    msg.textContent = 'Perdu.';
                }
                
                updateMoney();
                btn.disabled = false;
            }, 800);
        }
    }, 100);
};

// ROULETTE
const rouletteChipsEl = document.getElementById('roulette-chips');
[1, 5, 25, 100, 500].forEach(v => {
    let c = document.createElement('div');
    c.className = 'chip';
    c.textContent = v;
    c.onclick = () => {
        if (money >= v) {
            rouletteBet += v;
            money -= v;
            rouletteBetEl.textContent = rouletteBet;
            updateMoney();
            saveBets();
        }
    };
    rouletteChipsEl.appendChild(c);
});

document.getElementById('roulette-allin').onclick = () => {
    if (money > 0) {
        rouletteBet += money;
        money = 0;
        rouletteBetEl.textContent = rouletteBet;
        updateMoney();
        saveBets();
    }
};

const rouletteNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const redNums = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const blackNums = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
const rouletteTableEl = document.getElementById('roulette-table');

rouletteNumbers.forEach(num => {
    const el = document.createElement('div');
    el.className = 'roulette-number ' + (num === 0 ? 'green' : redNums.includes(num) ? 'red' : 'black');
    el.textContent = num;
    el.onclick = () => {
        document.querySelectorAll('.roulette-number').forEach(n => n.classList.remove('selected'));
        el.classList.add('selected');
        rouletteSelectedNumber = num;
        rouletteBetType = 'number';
    };
    rouletteTableEl.appendChild(el);
});

document.getElementById('roulette-bet-red').onclick = () => {
    rouletteBetType = 'red';
    document.querySelectorAll('.roulette-number').forEach(n => n.classList.remove('selected'));
};
document.getElementById('roulette-bet-black').onclick = () => {
    rouletteBetType = 'black';
    document.querySelectorAll('.roulette-number').forEach(n => n.classList.remove('selected'));
};
document.getElementById('roulette-bet-even').onclick = () => {
    rouletteBetType = 'even';
    document.querySelectorAll('.roulette-number').forEach(n => n.classList.remove('selected'));
};
document.getElementById('roulette-bet-odd').onclick = () => {
    rouletteBetType = 'odd';
    document.querySelectorAll('.roulette-number').forEach(n => n.classList.remove('selected'));
};
document.getElementById('roulette-bet-1to18').onclick = () => {
    rouletteBetType = '1to18';
    document.querySelectorAll('.roulette-number').forEach(n => n.classList.remove('selected'));
};
document.getElementById('roulette-bet-19to36').onclick = () => {
    rouletteBetType = '19to36';
    document.querySelectorAll('.roulette-number').forEach(n => n.classList.remove('selected'));
};

document.getElementById('roulette-spin').onclick = () => {
    if (rouletteBet <= 0) {
        alert('Place une mise !');
        return;
    }
    if (!rouletteBetType) {
        alert('Choisis un type de mise !');
        return;
    }
    const btn = document.getElementById('roulette-spin');
    btn.disabled = true;
    
    // Sauvegarder la mise actuelle avant de la réinitialiser
    const currentBet = rouletteBet;
    const currentBetType = rouletteBetType;
    const currentSelectedNumber = rouletteSelectedNumber;
    
    rouletteBet = 0;
    rouletteBetType = null;
    rouletteSelectedNumber = null;
    rouletteBetEl.textContent = rouletteBet;
    document.querySelectorAll('.roulette-number').forEach(n => n.classList.remove('selected'));
    saveBets();
    
    const wheel = document.getElementById('roulette-wheel');
    wheel.classList.add('spin-roulette');
    
    setTimeout(() => {
        wheel.classList.remove('spin-roulette');
        const result = Math.floor(Math.random() * 37);
        wheel.querySelector('.roulette-center').textContent = result;
        
        // Attendre 1200ms APRÈS l'affichage du numéro avant d'afficher le résultat
        setTimeout(() => {
            let win = false, multiplier = 2;
            if (currentBetType === 'number' && result === currentSelectedNumber) {
                win = true;
                multiplier = 36;
            } else if (currentBetType === 'red' && redNums.includes(result)) win = true;
            else if (currentBetType === 'black' && blackNums.includes(result)) win = true;
            else if (currentBetType === 'even' && result !== 0 && result % 2 === 0) win = true;
            else if (currentBetType === 'odd' && result % 2 === 1) win = true;
            else if (currentBetType === '1to18' && result >= 1 && result <= 18) win = true;
            else if (currentBetType === '19to36' && result >= 19 && result <= 36) win = true;
            
            const msg = document.getElementById('roulette-msg');
            if (win) {
                const gain = currentBet * multiplier;
                money += gain;
                msg.textContent = multiplier === 36 ? `🎉 NUMÉRO GAGNANT ! +${gain}€ (x36)` : `Gagné ! +${gain}€`;
            } else {
                msg.textContent = 'Perdu.';
            }
            
            updateMoney();
            btn.disabled = false;
        }, 1200);
    }, 2000);
};

// BLACKJACK
const blackjackChipsEl = document.getElementById('blackjack-chips');
[1, 5, 25, 100, 500].forEach(v => {
    let c = document.createElement('div');
    c.className = 'chip';
    c.textContent = v;
    c.onclick = () => {
        if (inRound) {
            alert("Tu ne peux pas miser pendant une partie !");
            return;
        }
        if (money >= v) {
            blackjackBet += v;
            money -= v;
            blackjackBetEl.textContent = blackjackBet;
            updateMoney();
            saveBets();
        }
    };
    blackjackChipsEl.appendChild(c);
});

document.getElementById('blackjack-allin').onclick = () => {
    if (inRound) {
        alert('Tu ne peux pas miser pendant une partie !');
        return;
    }
    if (money > 0) {
        blackjackBet += money;
        money = 0;
        blackjackBetEl.textContent = blackjackBet;
        updateMoney();
        saveBets();
    }
};

function createDeck() {
    const suits = ['♤', '♢', '♧', '♡'], values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let d = [];
    for (let s of suits)
        for (let v of values) d.push({ suit: s, value: v });
    return d;
}

function shuffleDeck(d) {
    for (let i = d.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [d[i], d[j]] = [d[j], d[i]];
    }
    return d;
}

function cardValue(c) {
    if (['K', 'Q', 'J'].includes(c.value)) return 10;
    if (c.value === 'A') return 11;
    return parseInt(c.value);
}

function calculateHand(h) {
    let t = 0, a = 0;
    for (let c of h) {
        t += cardValue(c);
        if (c.value === 'A') a++;
    }
    while (t > 21 && a > 0) {
        t -= 10;
        a--;
    }
    return t;
}

function renderCard(c, cont) {
    const el = document.createElement('div');
    el.className = 'card';
    el.textContent = `${c.value}${c.suit}`;
    cont.appendChild(el);
}

function renderHand(h, cont, isDealer = false) {
    cont.innerHTML = '';
    if (isDealer && inRound && h.length > 1) {
        const hid = document.createElement('div');
        hid.className = 'card back';
        hid.textContent = '🎴';
        cont.appendChild(hid);
        renderCard(h[1], cont);
    } else {
        h.forEach(c => renderCard(c, cont));
    }
}

function log(m) {
    document.getElementById('blackjack-msg').textContent = m;
}

document.getElementById('blackjack-deal').onclick = () => {
    if (blackjackBet <= 0) {
        log('Place une mise !');
        return;
    }
    if (inRound) {
        log('Termine la partie !');
        return;
    }
    
    // Sauvegarder la mise actuelle avant de la réinitialiser
    const currentBet = blackjackBet;
    blackjackBet = 0;
    blackjackBetEl.textContent = blackjackBet;
    saveBets();
    
    deck = shuffleDeck(createDeck());
    playerCards = [deck.pop(), deck.pop()];
    dealerCards = [deck.pop(), deck.pop()];
    inRound = true;
    renderHand(playerCards, document.getElementById('player-cards'));
    renderHand(dealerCards, document.getElementById('dealer-cards'), true);
    const pTotal = calculateHand(playerCards), dTotal = cardValue(dealerCards[1]);
    document.getElementById('player-value').textContent = pTotal;
    document.getElementById('dealer-value').textContent = dTotal;
    if (pTotal === 21) {
        setTimeout(() => {
            inRound = false;
            renderHand(dealerCards, document.getElementById('dealer-cards'));
            const dFinal = calculateHand(dealerCards);
            document.getElementById('dealer-value').textContent = dFinal;
            if (dFinal === 21) {
                money += currentBet;
                log(`Égalité ! (+${currentBet}€)`);
            } else {
                const gain = Math.floor(currentBet * 2.5);
                money += gain;
                log(`Blackjack ! (+${gain}€)`);
            }
            updateMoney();
        }, 500);
    }
    
    // Stocker currentBet dans une variable globale temporaire pour hit/stand
    window.currentBlackjackBet = currentBet;
};

document.getElementById('blackjack-hit').onclick = () => {
    if (!inRound) return;
    
    const btn = document.getElementById('blackjack-hit');
    const standBtn = document.getElementById('blackjack-stand');
    btn.disabled = true;
    standBtn.disabled = true;
    
    playerCards.push(deck.pop());
    renderHand(playerCards, document.getElementById('player-cards'));
    const pTotal = calculateHand(playerCards);
    document.getElementById('player-value').textContent = pTotal;
    
    if (pTotal > 21) {
        // Attendre 1200ms APRÈS l'affichage de la carte et de la valeur avant d'afficher le message
        setTimeout(() => {
            log('Dépassé 21 ! Perdu.');
            inRound = false;
            renderHand(dealerCards, document.getElementById('dealer-cards'));
            document.getElementById('dealer-value').textContent = calculateHand(dealerCards);
            updateMoney();
            btn.disabled = false;
            standBtn.disabled = false;
        }, 1200);
    } else {
        btn.disabled = false;
        standBtn.disabled = false;
    }
};

document.getElementById('blackjack-stand').onclick = () => {
    if (!inRound) return;
    inRound = false;
    
    const currentBet = window.currentBlackjackBet || 0;
    
    renderHand(dealerCards, document.getElementById('dealer-cards'));
    let dTotal = calculateHand(dealerCards);
    document.getElementById('dealer-value').textContent = dTotal;
    const dealerDraw = setInterval(() => {
        if (dTotal < 17) {
            dealerCards.push(deck.pop());
            dTotal = calculateHand(dealerCards);
            renderHand(dealerCards, document.getElementById('dealer-cards'));
            document.getElementById('dealer-value').textContent = dTotal;
        } else {
            clearInterval(dealerDraw);
            const pTotal = calculateHand(playerCards);
            let gain = 0;
            if (dTotal > 21 || pTotal > dTotal) {
                gain = currentBet * 2;
                money += gain;
                log(`Tu gagnes ! (+${gain}€)`);
            } else if (pTotal === dTotal) {
                gain = currentBet;
                money += gain;
                log(`Égalité ! (+${gain}€)`);
            } else {
                log('Tu perds.');
            }
            updateMoney();
        }
    }, 800);
};
