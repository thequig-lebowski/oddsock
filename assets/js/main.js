

let firstCard, secondCard;
let isCardFlipped = false;
let gameBusy = false;
let totalTime;
let countdownTimer;
let cards;
let currentLevel;
let matchedPairs = 0;
let totalPairs;
let endTime;
let totalMoves;
let timeLimit;
let finalScore;

//Check for DOM to finish loading, then set game level to easy by default.
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", levelSelect(4, 100));
} else {
	levelSelect(4, 100);
}

//--------------------------------------Start Game
function startGame(time) {
	resetTimer();
	startTimer(time);

	cards.forEach(card => {
		card.addEventListener("click", () => {
			flipCard(card)
		});
	});

}


//--------------------------------------Fisher-Yates Shuffle Method
function shuffleCards(cards) {

	for (let i = cards.length - 1; i > 0; i--) {
		let randPosition = Math.floor(Math.random() * (i + 1));
		cards[randPosition].style.order = i;
		cards[i].style.order = randPosition;
	}
}

//--------------------------------------Timer function
function startTimer(time) {
	countdownTimer = setInterval(() => {
		let newTime = time--;
		$("#countdown").text(newTime);
		if (newTime === 0) {
			resetTimer();
			gameOver();
		}
	}, 1000);
}

//--------------------------------------Reset Timer
function resetTimer() {
	// game over when timer runs out
	clearInterval(countdownTimer);
}

//--------------------------------------Game Over
function gameOver() {
	console.log("game over");
}

//--------------------------------------Flip Card
function flipCard(card) {

	if (canFlipCard(card)) {
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
				matchedPairs++;
				gameBusy = false;
				checkGameWin();
			} else {
				resetCards();
			}
		}
	}
}

//--------------------------------------Check to see when game is over
function checkGameWin() {
	// check to see when game is over
	if (matchedPairs <= totalPairs - 2) {
	} else {
		victory();
		// flip remainin pair of cards
		setTimeout(() => {
			let remain = $(".card-wrapper:not(.flipped)");
			remain[0].classList.add("flipped");
			remain[1].classList.add("flipped");
		}, 400);
	}
}

//--------------------------------------Victory
function victory() {
	//Display You win overlay
	endTime = $("#countdown").text();
	totalMoves = $("#moves-total").text();
	//calculate final score
	let elapsedTime = totalTime - endTime; 
	console.log(elapsedTime);
	finalScore = Math.floor((elapsedTime / totalMoves) * 100);
	console.log("your score is " + finalScore);

	
}

//--------------------------------------Reset Cards (unflip)
function resetCards() {
	// it's not a match sound?
	setTimeout(() => {
		firstCard.classList.remove("flipped");
		secondCard.classList.remove("flipped");
		gameBusy = false;
	}, 900);
	return true;
}

//--------------------------------------Move Counter
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

//--------------------------------------Prevent click during animations and on already matched cards
function canFlipCard(card) {
	// returns false if the current card is already flipped i.e. has 'flipped' class
	return !card.classList.contains("flipped") && !gameBusy;

}

//--------------------------------------Level Select
function levelSelect(num1, time) {

	currentLevel = num1;
	timeLimit = time;
	matchedPairs = 0;

	//To add if statement to check if the difficulty level selected is already the level
	//being displayed, use .preventDefualt() else resetGame().

	clearGameBoard();

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

	cards = Array.from(document.getElementsByClassName("card-wrapper"));
	shuffleCards(cards);
	startGame(time);

}

//--------------------------------------Reset Game
function resetGame() {
	levelSelect(currentLevel, timeLimit);
}

//--------------------------------------Remove previously generated card divs
function clearGameBoard() {

	//To add: modal here to check if user is sure they want to reset the game.
	//To add: check what level is currently being played and match it.
	$(".card-wrapper").remove();		//remove any previously generated game instances
	$("#moves-total").text(0);
}

//To add check gameplay function to see what game is being played and adjust the time remaining
//accordingly. 

