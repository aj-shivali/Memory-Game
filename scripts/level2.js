class memoryGame {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRem = totalTime;
    this.timer = document.getElementById("time-remaining");
    this.flipped = document.getElementById("flips");
    this.score = document.getElementById("game-score");
    this.finalScore = document.getElementById("victory-score");
    this.highScores = document.getElementById("high-score");
  }
  start() {
    this.checkCard = null;
    this.totalClicks = 0;
    this.timeRem = this.totalTime;
    this.cardMatched = [];
    this.cont = true;
    this.currScore = 0;
    this.victoryScore = 0;
    this.high = 0;

    setTimeout(() => {
      this.shuffle();
      this.countdown = this.startCount();
      this.cont = false;
    }, 500);
    this.timer.innerText = this.timeRemaining;
    this.flipped.innerText = this.totalClicks;
  }

  startCount() {
    return setInterval(() => {
      this.timeRem--;
      this.timer.innerText = this.timeRem;
      if (this.timeRem === 0) this.gameOver();
    }, 1000);
  }
  flipCard(card) {
    if (this.canFlip(card)) {
      this.totalClicks++;
      this.flipped.innerText = this.totalClicks;
      card.classList.add("flip");

      if (this.checkCard) this.checkCardMatch(card);
      else {
        this.checkCard = card;
      }
    }
  }

  checkCardMatch(card) {
    if (this.getCardName(card) === this.getCardName(this.checkCard))
      this.cardMatch(card, this.checkCard);
    else {
      this.cardMismatched(card, this.checkCard);
    }
    this.checkCard = null;
  }

  cardMatch(card, checkCard) {
    this.cardMatched.push(card);
    this.cardMatched.push(checkCard);
    this.currScore += 10;
    this.score.innerText = this.currScore;
    console.log(this.currScore);
    if (this.cardMatched.length === this.cardsArray.length) {
      this.victory(this.currScore);
    }
  }
  highScore(victoryScore) {
    if (!localStorage.getItem("level2-clicks")) {
      localStorage.setItem("level2-clicks", this.totalClicks);
    }
    let temp = localStorage.getItem("level2-clicks");
    if (this.totalClicks <= temp) {
      localStorage.setItem("High Score-2", this.victoryScore);
      localStorage.setItem("level2-clicks", this.totalClicks);
      this.high = localStorage.getItem("level2-clicks");
      this.highScores.innerText = this.high;
    } else {
      this.high = localStorage.getItem("level2-clicks");
      this.highScores.innerText = this.high;
    }
  }
  victory(currScore) {
    clearInterval(this.countdown);
    this.victoryScore = currScore;
    this.finalScore.innerText = this.totalClicks;
    document.getElementById("victory-text").classList.remove("hide");
    document.getElementById("victory-text").classList.add("show");
    this.highScore(this.victoryScore);
  }
  cardMismatched(card, checkCard) {
    this.cont = true;
    setTimeout(() => {
      card.classList.remove("flip");
      checkCard.classList.remove("flip");
      this.cont = false;
    }, 1000);
  }

  getCardName(card) {
    return card.dataset.name;
  }

  shuffle() {
    for (let i = this.cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randIndex].style.order = i;
      this.cardsArray[i].style.order = randIndex;
    }
  }

  canFlip(card) {
    return (
      !this.cont && !this.cardMatched.includes(card) && card !== this.checkCard
    );
  }
  gameOver() {
    clearInterval(this.countdown);
    document.getElementById("game-over-text").classList.remove("hide");
    document.getElementById("game-over-text").classList.add("show");
  }
}

function gameReady() {
  const cards = document.querySelectorAll(".card");
  let overlays = Array.from(document.getElementsByClassName(`overlay-text`));
  let game = new memoryGame(100, cards);
  overlays.forEach((overlay) => {
    overlay.addEventListener("click", () => {
      overlay.classList.remove("visible");
      overlay.classList.add("hide");
      game.start();
    });
  });
  cards.forEach((cards) =>
    cards.addEventListener("click", () => {
      game.flipCard(cards);
    })
  );
}

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", gameReady);
} else {
  gameReady();
}
