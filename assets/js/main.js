

let firstCard, secondCard;
let isCardFlipped = false;
let gameBusy = false;
let totalTime;
let countdownTimer;
let deck;
let currentLevel;
let matchedPairs = 0;
let totalPairs;

//Check for DOM to finish loading, then set game level to easy by default.
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", levelSelect(4, 100));
} else {
	levelSelect(4, 100);
}

function startGame(time) {
	resetTimer();
	startTimer(time);
	let cards = Array.from(document.getElementsByClassName("card-wrapper"));
	cards.forEach(card => {
		card.addEventListener("click", () => {
			flipCard(card)
		});
	});

}


//Fisher-Yates Shuffle Method
function shuffleCards(deck) {

	for (let i = deck.length - 1; i > 0; i--) {
		let randPosition = Math.floor(Math.random() * (i + 1));
		deck[randPosition].style.order = i;
		deck[i].style.order = randPosition;
	}
}


function startTimer(time) {
	console.log("timer running");
	countdownTimer = setInterval(() => {
		let newTime = time--;
		$("#countdown").text(newTime);

		if (newTime === 0) {
			resetTimer();
			gameOver();
		}
	}, 1000);
}

function resetTimer() {
	// game over when timer runs out
	clearInterval(countdownTimer);
}

function gameOver() {
	console.log("game over");
}

function flipCard(card) {

	if (canFlipCard(card)) {
		console.log('can flip');

		//increment #moves-total by one each time
		flipCounter();
		card.classList.add("flipped");

		if (!isCardFlipped) {
			isCardFlipped = true;
			firstCard = card;
		} else {
			isCardFlipped = false;
			secondCard = card;
			gameBusy = true;

			let card1 = firstCard.dataset.cardvalue;
			let card2 = secondCard.dataset.cardvalue;

			if (cardMatchCheck(card1, card2)) {
				// it's a match sound and animation?
				console.log("match!");
				matchedPairs++;
				gameBusy = false;
				checkGameWin();
			} else {
				resetCards();
			}
		}
	}
}

function checkGameWin() {
	// check to see when game is over
	if (matchedPairs <= totalPairs-2) {
		console.log(matchedPairs + " of " + totalPairs);
		// return;
	} else {
		console.log("game over, you win!");
		// flip remainin pair of cards
		// let remainder = document.getElementsByClassName("card-wrapper");
		// flipCard(remainder[0,1]);
		let remain = $(".card-wrapper:not(.flipped)");
		remain[0].classList.add("flipped");
		remain[1].classList.add("flipped");
	}
}

function resetCards() {
	// it's not a match sound?
	setTimeout(() => {
		firstCard.classList.remove("flipped");
		secondCard.classList.remove("flipped");
		gameBusy = false;
	}, 900);
	return true;
}

function flipCounter() {

	let clicks = $("#moves-total").text();
	clicks++;
	$("#moves-total").text(clicks);

}

function cardMatchCheck(card1, card2) {

	if (card1 === card2) {
		return true;
	} else {
		return false;
	}
}

function canFlipCard(card) {
	// returns false if the current card is already flipped i.e. has 'flipped' class
	return !card.classList.contains("flipped") && !gameBusy;

}

function levelSelect(num1, time) {

	currentLevel = num1;
	matchedPairs = 0;

	//To add if statement to check if the difficulty level selected is already the level
	//being displayed, use .preventDefualt() else resetGame().

	resetGame();

	totalPairs = (num1 * num1) / 2; //calculate the required number of divs
	let gridBox = "";	//create an empty string to hold the generated html

	$("#countdown").text(time);
	totalTime = time;


	for (let i = 0; i < totalPairs; i++) {
		for (let j = 0; j < 2; j++) {
			gridBox = `${gridBox}
					<div class="card-wrapper" data-cardvalue="${i + 1}">
						<div class="card card-back">
							<img class="back-image" src="assets/images/cardfront.png" alt="hidden card"/>
						</div>
						<div class="card card-front">
							<img class="front-image" src="assets/images/${i + 1}.png" alt="sock picture"/>
						</div>
					</div>`;
		}
	}

	$(".game-wrapper").css(`grid-template-columns`, `repeat(${num1}, auto)`);
	$(".game-wrapper").css("display", "grid");
	$(".game-wrapper").append(gridBox);

	// if(num1 == 6) {
	// 	this.classList.add(".card-wrapper.small");
	// 	console.log("small");
	// }

	deck = Array.from(document.getElementsByClassName("card-wrapper"));
	startGame(time);
	shuffleCards(deck);


}


function resetGame() {

	//To add: modal here to check if user is sure they want to reset the game.
	//To add: check what level is currently being played and match it.
	$(".card-wrapper").remove();		//remove any previously generated game instances
	$("#moves-total").text(0);
	console.log('game reset');

}

//To add check gameplay function to see what game is being played and adjust the time remaining
//accordingly. 

