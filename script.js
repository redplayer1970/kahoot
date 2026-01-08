// Solde unifié
    let money = 1000;
    const moneyEl = document.getElementById('money');
    const moneySlotEl = document.getElementById('money-slot');
    const moneyRouletteEl = document.getElementById('money-roulette');
    const moneyBlackjackEl = document.getElementById('money-blackjack');
    // Mise à jour du solde (met à jour toutes les vues)
    function updateMoney() {
      moneyEl.textContent = money;
      moneySlotEl.textContent = money;
      moneyRouletteEl.textContent = money;
      moneyBlackjackEl.textContent = money;
    }
    // Bouton reset solde
    const resetBtn = document.getElementById('reset-money');
    resetBtn.onclick = () => {
      money = 1000;
      // reset bets and messages
      slotBet = 0; rouletteBet = 0; blackjackBet = 0;
      slotBetEl.textContent = slotBet;
      rouletteBetEl.textContent = rouletteBet;
      blackjackBetEl.textContent = blackjackBet;
      document.getElementById('slot-msg').textContent = '';
      document.getElementById('roulette-msg').textContent = '';
      document.getElementById('blackjack-msg').textContent = '';
      updateMoney();
    };
    updateMoney();
    // Machine à sous
    let slotBet = 0;
    const slotBetEl = document.getElementById('slot-bet');
    const slotChipsEl = document.getElementById('slot-chips');
    // Initialisation des jetons pour la machine à sous
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
        }
      };
      slotChipsEl.appendChild(c);
    });
    document.getElementById('slot-launch').onclick = () => playSlot();
    function playSlot() {
      if (slotBet <= 0) {
        alert('Place une mise !');
        return;
      }
      const symbols = ["🔔", "⭐", "🍋", "🍒", "7️⃣"];
      const result = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ];
      document.getElementById('reel1').innerHTML = `<div class="reel-item">${result[0]}</div>`;
      document.getElementById('reel2').innerHTML = `<div class="reel-item">${result[1]}</div>`;
      document.getElementById('reel3').innerHTML = `<div class="reel-item">${result[2]}</div>`;
      const msg = document.getElementById('slot-msg');
      if (result[0] === result[1] && result[1] === result[2]) {
        const gain = slotBet * 8;
        money += gain;
        msg.textContent = `JACKPOT !!! +${gain}€`;
      } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
        const gain = slotBet * 2;
        money += gain;
        msg.textContent = `Petit gain ! +${gain}€`;
      } else {
        msg.textContent = 'Perdu.';
      }
      slotBet = 0;
      slotBetEl.textContent = slotBet;
      updateMoney();
    }
    // Roulette
    let rouletteBet = 0;
    let rouletteBetType = null;
    const rouletteBetEl = document.getElementById('roulette-bet');
    const rouletteChipsEl = document.getElementById('roulette-chips');
    // Initialisation des jetons pour la roulette
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
        }
      };
      rouletteChipsEl.appendChild(c);
    });
    // Fonctions pour placer les paris
    document.getElementById('roulette-bet-red').onclick = () => rouletteBetType = 'red';
    document.getElementById('roulette-bet-black').onclick = () => rouletteBetType = 'black';
    document.getElementById('roulette-bet-even').onclick = () => rouletteBetType = 'even';
    document.getElementById('roulette-bet-odd').onclick = () => rouletteBetType = 'odd';
    document.getElementById('roulette-bet-1to18').onclick = () => rouletteBetType = '1to18';
    document.getElementById('roulette-bet-19to36').onclick = () => rouletteBetType = '19to36';
    document.getElementById('roulette-spin').onclick = () => {
      if (rouletteBet <= 0) {
        alert('Place une mise !');
        return;
      }
      if (!rouletteBetType) {
        alert('Choisis un type de mise !');
        return;
      }
      const wheel = document.getElementById('roulette-wheel');
      wheel.classList.add('spin-roulette');
      setTimeout(() => {
        wheel.classList.remove('spin-roulette');
        const result = Math.floor(Math.random() * 37);
        wheel.textContent = result;
        let win = false;
        if (rouletteBetType === 'red' && [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(result)) win = true;
        else if (rouletteBetType === 'black' && [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(result)) win = true;
        else if (rouletteBetType === 'even' && result !== 0 && result % 2 === 0) win = true;
        else if (rouletteBetType === 'odd' && result % 2 === 1) win = true;
        else if (rouletteBetType === '1to18' && result >= 1 && result <= 18) win = true;
        else if (rouletteBetType === '19to36' && result >= 19 && result <= 36) win = true;
        const msg = document.getElementById('roulette-msg');
        if (win) {
          const gain = rouletteBet * 2;
          money += gain;
          msg.textContent = `Gagné ! +${gain}€`;
        } else {
          msg.textContent = 'Perdu.';
        }
        rouletteBet = 0;
        rouletteBetType = null;
        rouletteBetEl.textContent = rouletteBet;
        updateMoney();
      }, 1000);
    };
    // Blackjack
    let blackjackBet = 0;
    const blackjackBetEl = document.getElementById('blackjack-bet');
    const blackjackChipsEl = document.getElementById('blackjack-chips');
    // Initialisation des jetons pour le blackjack
    [1, 5, 25, 100, 500].forEach(v => {
      let c = document.createElement('div');
      c.className = 'chip';
      c.textContent = v;
      c.onclick = () => {
        if (inRound) {
      alert("Tu ne peux pas ajouter de mise pendant une partie en cours !");
      return;
        }
        if (money >= v) {
          blackjackBet += v;
          money -= v;
          blackjackBetEl.textContent = blackjackBet;
          updateMoney();
        }
      };
      blackjackChipsEl.appendChild(c);
    });
    function createChip(value){
      const d = document.createElement('div'); d.className='chip'; d.dataset.value=value; d.textContent = value + '€';
      d.addEventListener('click', ()=>{
        if(inRound) return; // impossible de changer la mise en cours
        if(balance - currentBet < value) { flash("Fonds insuffisants pour cette mise"); return; }
        currentBet += value; updateUI();
        
      });
      return d;
    }
    
    
    // Logique du blackjack
    let deck = [];
    let playerCards = [];
    let dealerCards = [];
    let inRound = false;
    // Fonctions de base pour le blackjack
    function createDeck() {
      const suits = ['♤', '♢', '♧', '♡'];
      const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      let deck = [];
      for (let suit of suits) {
        for (let value of values) {
          deck.push({ suit, value });
        }
      }
      return deck;
    }
    function shuffleDeck(deck) {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      return deck;
    }
    function drawCard(deck) {
      return deck.pop();
    }
    function cardValue(card) {
      if (['K', 'Q', 'J'].includes(card.value)) return 10;
      if (card.value === 'A') return 11;
      return parseInt(card.value);
    }
    function calculateHand(hand) {
      let total = 0;
      let aces = 0;
      for (let card of hand) {
        total += cardValue(card);
        if (card.value === 'A') aces++;
      }
      while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
      }
      return total;
    }
    function renderCard(card, container) {
      const cardEl = document.createElement('div');
      cardEl.className = 'card';
      cardEl.textContent = `${card.value}${card.suit}`;
      container.appendChild(cardEl);
    }
    function renderHand(hand, container, isDealer = false) {
      container.innerHTML = '';
      if (isDealer && inRound) {
        const hiddenCard = document.createElement('div');
        hiddenCard.className = 'card back';
        container.appendChild(hiddenCard);
        if (hand.length > 0) renderCard(hand[0], container);
      } else {
        hand.forEach(card => renderCard(card, container));
      }
    }
    function log(message) {
      document.getElementById('blackjack-msg').textContent = message;
    }
    document.getElementById('blackjack-deal').onclick = () => {
      if (blackjackBet <= 0) {
        log('Place une mise pour commencer !');
        return;
      }
      if (inRound) {
        log('Termine la partie en cours !');
        return;
      }
      
      updateMoney();
      
      deck = shuffleDeck(createDeck());
      playerCards = [drawCard(deck), drawCard(deck)];
      dealerCards = [drawCard(deck), drawCard(deck)];
      inRound = true;
      renderHand(playerCards, document.getElementById('player-cards'));
      renderHand(dealerCards, document.getElementById('dealer-cards'), true);
      const playerTotal = calculateHand(playerCards);
      const dealerTotal = calculateHand([dealerCards[0]]);
      document.getElementById('player-value').textContent = playerTotal;
      document.getElementById('dealer-value').textContent = dealerTotal;
      
      // Auto-blackjack
      if (playerTotal === 21) {
        const gain = Math.floor(blackjackBet * 3.5);
        log(`Blackjack ! Tu gagnes ! (+${gain}€)`);
        money += gain;
        blackjackBet = 0;
        blackjackBetEl.textContent = blackjackBet;
        inRound = false;
        updateMoney();
      }
    };
    document.getElementById('blackjack-hit').onclick = () => {
      if (!inRound) return;
      playerCards.push(drawCard(deck));
      renderHand(playerCards, document.getElementById('player-cards'));
      const playerTotal = calculateHand(playerCards);
      document.getElementById('player-value').textContent = playerTotal;
      if (playerTotal > 21) {
        log('Tu as dépassé 21 ! Tu perds.');
        blackjackBet = 0;
        blackjackBetEl.textContent = blackjackBet;
        inRound = false;
      }
    };
    document.getElementById('blackjack-stand').onclick = () => {
      if (!inRound) return;
      inRound = false;
      renderHand(dealerCards, document.getElementById('dealer-cards'));
      let dealerTotal = calculateHand(dealerCards);
      document.getElementById('dealer-value').textContent = dealerTotal;
      while (dealerTotal < 17) {
        dealerCards.push(drawCard(deck));
        dealerTotal = calculateHand(dealerCards);
        renderHand(dealerCards, document.getElementById('dealer-cards'));
        document.getElementById('dealer-value').textContent = dealerTotal;
      }
      const playerTotal = calculateHand(playerCards);
      let gain = 0;
      if (dealerTotal > 21 || playerTotal > dealerTotal) {
        gain = blackjackBet * 2;
        money += gain;
        log(`Tu gagnes ! (+${gain}€)`);
      } else if (playerTotal === dealerTotal) {
        gain = blackjackBet;
        money += gain;
        log(`Égalité ! (+${gain}€ remboursés)`);
      } else {
        log('Tu perds.');
      }
      blackjackBet = 0;
      blackjackBetEl.textContent = blackjackBet;
      updateMoney();
    };
  
// Function to show rules in a nicer modal-like alert
function showRules(game){
  if(game==='slots'){
    alert('Règles Machine à sous:\n- 3 symboles identiques = x8 la mise\n- 2 symboles identiques = x2 la mise');
  } else if(game==='roulette'){
    alert('Règles Roulette:\n- Couleur / Pair / Impair : x2 la mise\n- 1-18 / 19-36 : x2 la mise');
  } else if(game==='blackjack'){
    alert('Règles Blackjack:\n- Objectif : dépasser la banque sans dépasser 21\n- Gain simple : x2 la mise\n- Blackjack : x3.5 la mise\n- Égalité : mise remboursée');
  }
}