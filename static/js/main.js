class Player {
    constructor() {
        this.name = this.getName();
        this.score = 0;
    }

    getName() {
        const name = prompt("Enter Your Name please");
        if (name == null) {
            return "Player1";
        } else {
            return name;
        }
    }

    newGame() {
        this.score = 0;
    }
}

class Game {
    constructor() {
        this.player = new Player();
        this.rolls = 0;
        this.dices = [0, 0, 0, 0, 0, 0];
        this.highScoreStorage = new HighScoreLocalStorage("highScore");
        this.newGameBtn = document.getElementById("newGame");
        this.newGameBtn.style.display = "none";
        this.newGameBtn.addEventListener("click", () => {
            this.newGame();
        });
        this.gameDiv = document.getElementById("main-game");
        this.gameDiv.style.display = "none";
        this.startGame = document.getElementById("startGame");
        this.startGame.addEventListener("click", () => {
            this.gameDiv.style.display = "block";
            this.startGame.style.display = "none";
        });
        this.diceContainer = document.getElementById("dicy");

        this.rollAgain = document.getElementById("rollAgain");
        // binding it for some weird error
        this.rollAgain.addEventListener("click", this.newRoll.bind(this));
        this.scoreElement = document.getElementById("scoreID");
        this.rollsElement = document.getElementById("rollsID");
        // was fixing up the code just time to render the other stuff
        // to click rollbtn every 4secs to play for me
        // setInterval(() => {
        //     if (this.player.score <= 10000) {
        //         this.rollAgain.click();
        //     }
        // }, 4000);
    }
    showToast(msg) {
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        x.innerHTML = msg;

        // Add the "show" class to DIV
        setTimeout(() => (x.className = "show"), 1000);

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () {
            x.className = x.className.replace("show", "");
        }, 3000);
    }

    // updating values
    updateValues() {
        this.scoreElement.innerHTML = `${this.player.score}`;
        this.rollsElement.innerHTML = `${this.rolls}`;
    }

    newRoll() {
        this.rollAgain.setAttribute("disabled", true);
        this.rolls += 1;
        const dices = this.rollDices();
        this.renderDices(dices);
        this.dices = dices;
        const rollScore = this.calculateScore(dices);
        console.log("The total rollSCore was", rollScore);
        this.player.score += rollScore;
        this.updateValues();
        this.showToast(`Congrats you have just scored ${rollScore} points!`);
        if (this.player.score >= 10000) {
            setTimeout(() => this.endGame(), 1000);
        }
        setTimeout(() => this.rollAgain.removeAttribute("disabled"), 3000);
    }

    endGame() {
        this.showToast(`Congratulations!! ${this.player.name} have won!`);
        this.newGameBtn.style.display = "block";
        // this.rollAgain.removeEventListener("click");
        this.highScoreStorage.setItem(this.rolls);
    }

    newGame() {
        this.player.newGame();
        this.rolls = 0;
        this.dices = [0, 0, 0, 0, 0, 0];
        this.renderDices(this.dices);
        this.showToast("New Game!");
        this.updateValues();
    }

    calculateScore() {
        let score = 0;
        // checking dices to calculate score
        const countArray = [0, 0, 0, 0, 0, 0];
        console.log("dices", this.dices);
        for (let val of this.dices) {
            countArray[val - 1] += 1;
        }
        console.log("Array Count", countArray);
        //checking for each of the conditions and make sure they dont fall through from a top bottom approach
        // full run [1,1,1,1,1,1]
        let result = countArray.filter((num) => num == 1);
        console.log(result);
        if (result.length == 6) {
            console.log("full run", result);
            score += 1500;
            // return score;
        } else {
            // checking 3 of a kind 2-5
            for (let i = 1; i < countArray.length - 1; i++) {
                if (countArray[i] >= 3) {
                    score += (i + 1) * 100;
                    console.log("found a 3", i, score);
                    countArray[i] -= 3;
                }
            }

            // checking for 3 of a kind 1s
            // and single 1s
            // and 6 1s although almost impossible
            if (countArray[0] == 6) {
                score += 1000 * 2;
            } else if (countArray[0] == 3) {
                score += 1000;
                countArray[0] -= 3;
            } else if (countArray[0] < 3) {
                score += 100 * countArray[0];
            }

            // single fives
            score += countArray[4] * 50;
        }
        return score;
    }

    rollDice() {
        return Math.ceil(Math.random() * 6);
    }

    rollDices() {
        return this.dices.map(() => this.rollDice());
    }

    renderDices(dices) {
        this.diceContainer.innerHTML = "";
        console.log(dices);
        let count = 1;
        for (let val of dices) {
            let img = document.createElement("img");
            img.src = `/static/images/dice${val}.png`;
            img.width = 100;
            img.classList.add(`dice-${count}`);
            count += 1;
            this.diceContainer.append(img);
        }
        this.calculateScore();
    }
}

class HighScoreLocalStorage {
    constructor(itemName) {
        this.name = itemName;
        this.data = this.getItem();
        this.highScore = document.getElementById("highScore");
        this.showHighScore();
    }

    getItem() {
        const data = localStorage.getItem(this.name);
        if (data == null) {
            return { value: 100 };
        } else {
            const hs = JSON.parse(data);
            return hs;
        }
    }

    setItem(highScore) {
        if (this.data.value > highScore) {
            const data = { value: highScore };
            localStorage.setItem(this.name, JSON.stringify(data));
            this.data = data;
        }
        this.showHighScore();
    }

    showHighScore() {
        this.highScore.innerHTML = `${this.data.value}`;
    }
}

function pageLoad() {
    const game = new Game();
    // const playerName = prompt("Enter your name please", "User");
    // const player = new Player(playerName);
    // game.newRoll();
}

window.onload = pageLoad();
