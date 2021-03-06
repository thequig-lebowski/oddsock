//Variable declaration

let firstCard, secondCard;
let isFlipped = false;
let gameBusy = false;
let totalTime;
var countdownTimer;
let cards;
let currentLevel;
let matchedPairs = 0;
let totalPairs;
let endTime;
let totalMoves;
let finalScore = 0;
let canTime = false;
let canReset = true;
let canVictory = true;
let gapSize;

// Check for DOM to finish loading, then set game level to easy by default.
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", levelSelect(4, 100));
} else {
	levelSelect(4, 100);
}

//--------------------------------------Resize Card-wrapper according to level select
function resize() {

	if(currentLevel === 6){
		$(".card-wrapper").addClass("small");
	}
}

//--------------------------------------Calculate Grid Gap Size for Responsiveness
function calcGapSize() {

	if (currentLevel === 4) {
		gapSize = 10;
	} else {
		gapSize = 7;
	}
}

//--------------------------------------Level Select
function levelSelect(num1, time) {

	currentLevel = num1;
	totalTime = time;
	matchedPairs = 0;

	clearGameBoard();
	calcGapSize();
	
	totalPairs = (num1 * num1) / 2; //calculate the required number of divs
	let gridBox = "";	//create an empty string to hold the generated html

	$("#countdown").text(time); //set the time limit for this level

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
	$(".game-wrapper").css(`grid-gap`, `${gapSize}px`);
	$(".game-wrapper").append(gridBox);

	//create array of all the cards to be shuffled
	cards = Array.from(document.getElementsByClassName("card-wrapper"));
	shuffleCards(cards);
	startGame();
	resize();
}

//--------------------------------------Start Game
function startGame() {

	resetTimer();
	startTimer();
	cards.forEach(card => {
		card.addEventListener("click", () => {
			flipCard(card)
		});
	});
}

//--------------------------------------Timer function
function startTimer() {

	let time = totalTime;
	countdownTimer = setInterval(() => {
		if (canTime) {
			let newTime = time--;
			$("#countdown").text(newTime);
			if (newTime === 0) {
				resetTimer();
				gameOver();
			}
		}
	}, 1000);
}

//--------------------------------------Fisher-Yates Shuffle Method
function shuffleCards(cards) {

	for (let i = cards.length - 1; i > 0; i--) {
		let randPosition = Math.floor(Math.random() * (i + 1));
		cards[randPosition].style.order = i;
		cards[i].style.order = randPosition;
	}
}

//--------------------------------------Reset Timer
function resetTimer() {

	clearInterval(countdownTimer);
}

//--------------------------------------Flip Card
function flipCard(card) {

	if (canFlipCard(card)) {
		//increment #moves-total by one each time
		flipCounter();
		card.classList.add("flipped");
		card.children[1].classList.add("selected");

		if (!isFlipped) {
			isFlipped = true;
			firstCard = card;
		} else {
			isFlipped = false;
			secondCard = card;
			gameBusy = true;

			//check the two flipped cards against each other using thier datasets
			if (cardMatchCheck(firstCard, secondCard)) {
				cardHighlight(firstCard, secondCard);
				matchedPairs++;
				gameBusy = false;
				checkGameWin();
			} else {
				resetCards();
			}
		}
	}
}

//--------------------------------------Check Card Match
function cardMatchCheck(card1, card2) {

	//compare the datasets of flipped cards to see if they are a match
	if (canVictory) {
		card1 = firstCard.dataset.cardvalue;
		card2 = secondCard.dataset.cardvalue;

		if (card1 === card2) {
			return true;
		} else {
			return false;
		}
	}
}

//--------------------------------------Highlight Card Select
function cardHighlight(firstCard, secondCard) {

	//remove the boarder from already matched pairs of cards
	setTimeout(() => {
		firstCard.children[1].classList.remove("selected");
		secondCard.children[1].classList.remove("selected");
	}, 900);
}

//--------------------------------------Check to see when game is over
function checkGameWin() {

	// check to see when game is over
	if (matchedPairs <= totalPairs - 2) {
		return;
	} else {
		victory();
		// flip remaining pair of cards auctomatically as this is an obvious pair.
		setTimeout(() => {
			let remain = $(".card-wrapper:not(.flipped)");
			remain[0].classList.add("flipped");
			remain[1].classList.add("flipped");
		}, 400);
	}
}

//--------------------------------------Victory
function victory() {

	endTime = $("#countdown").text();
	totalMoves = $("#moves-total").text();
	canTime = false;//freeze the timer

	pauseOverlay();

	//calculate final score
	let elapsedTime = totalTime - endTime;
	let movesOver = (parseInt(totalMoves) + 2) - (totalPairs * 2);
	let score = elapsedTime / movesOver;
	resetTimer();

	//Set the text for the score
	$("#score").text(score);

	//Display You win overlay
	setTimeout(() => {
		$(".you-win").addClass("visible");
	}, 1400);

	canTime = true;//unfreeze the timer.
}

//--------------------------------------Game Over
function gameOver() {

	canVictory = false;
	pauseOverlay();

	setTimeout(() => {
		$(".game-over").addClass("visible");
		canVictory = true;
	}, 1000);

	canTime = true;// unfreeze the timer
}

//--------------------------------------Pause Clicking Overlays
function pauseOverlay() {

	//Prevent overlay from being accidentially clicked for a short moment.
	canReset = false;
	setTimeout(() => {
		canReset = true;
	}, 2200);
}

//--------------------------------------Reset Cards (unflip)
function resetCards() {

	// reset cards after a short delay when flipped pair are not a match
	setTimeout(() => {
		firstCard.classList.remove("flipped");
		secondCard.classList.remove("flipped");
		gameBusy = false;
	}, 900);
	return true;
}

//--------------------------------------Move Counter
function flipCounter() {

	//increment moves counter by 1 for each card flip
	let clicks = $("#moves-total").text();
	clicks++;
	$("#moves-total").text(clicks);
}

//--------------------------------------Prevent click during animations and on already matched cards
function canFlipCard(card) {

	// returns false if the current card is already flipped i.e. has 'flipped' class
	// or game is busy
	return !card.classList.contains("flipped") && !gameBusy;
}

//--------------------------------------Reset Game
function resetGame(elm) {

	//Reset the game to the same level that was just played.
	if (canReset) {
		levelSelect(currentLevel, totalTime);
		// target parent element of click event and remove class to hide screen
		elm.classList.remove("visible");
		canTime = true;//unfreeze the timer
	}
}

//--------------------------------------Remove previously generated card divs
function clearGameBoard() {
	
	//remove any previously generated game instances and set game counter to zero.
	$(".card-wrapper").remove();
	$("#moves-total").text(0);
}


