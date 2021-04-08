

let firstCard, secondCard;
let isCardFlipped = false;
let gameBusy = false;
let totalTime;
var countdownTimer;
let cards;
let currentLevel;
let matchedPairs = 0;
let totalPairs; //number of pairs of cards on the board
let endTime;
let totalMoves;
// let timeLimit;
let finalScore = 0;
let canTime = false;

// Check for DOM to finish loading, then set game level to easy by default.

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", levelSelect(4, 100));
} else {
	levelSelect(4, 100);
}

// document.getElementById("start-game").onclick = function() {myFunction()};
// if (document.readyState === "loading") {
// 	document.addEventListener("DOMContentLoaded", startScreen());
// } else {
// 	startScreen();
// }

//--------------------------------------Level Select
function levelSelect(num1, time) {

	currentLevel = num1;
	// timeLimit = time;
	totalTime = time;
	matchedPairs = 0;

	//To add if statement to check if the difficulty level selected is already the level
	//being displayed, use .preventDefualt() else resetGame().

	clearGameBoard();

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
	$(".game-wrapper").append(gridBox);

	//create array of all the cards to be shuffled
	cards = Array.from(document.getElementsByClassName("card-wrapper")); 
	shuffleCards(cards);
	startGame();

}

//--------------------------------------Play Again/Start Screen
function overlay(elm, bool) {
	if(bool){
		resetGame();
	}
	elm.parentNode.style.display = "none";
	canTime = true;
}

//--------------------------------------Start Game
function startGame() {
	// canTime = true;
	resetTimer();
	startTimer(time);
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

	// for (let i = cards.length - 1; i > 0; i--) {
	// 	let randPosition = Math.floor(Math.random() * (i + 1));
	// 	cards[randPosition].style.order = i;
	// 	cards[i].style.order = randPosition;
	// }
}

//--------------------------------------Reset Timer
function resetTimer() {
	// game over when timer runs out
	clearInterval(countdownTimer);
}

//--------------------------------------Game Over
function gameOver() {
	setTimeout(() => {
		$(".game-over").css("display", "flex");
	}, 1000);
}

//--------------------------------------Flip Card
function flipCard(card) {

	if (canFlipCard(card)) {
		//increment #moves-total by one each time
		flipCounter();
		card.classList.add("flipped");
		card.children[1].classList.add("selected");

		if (!isCardFlipped) {
			isCardFlipped = true;
			firstCard = card;
		} else {
			isCardFlipped = false;
			secondCard = card;
			gameBusy = true;



			if (cardMatchCheck(firstCard, secondCard)) {
				// it's a match sound and animation?
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

	card1 = firstCard.dataset.cardvalue;
	card2 = secondCard.dataset.cardvalue;

	if (card1 === card2) {
		return true;
	} else {
		return false;
	}
}

//--------------------------------------Highlight Card Select
function cardHighlight(firstCard, secondCard) {
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

	canTime = false;

	//calculate final score
	let elapsedTime = totalTime - endTime;
	let movesOver = (parseInt(totalMoves) + 2) - (totalPairs * 2);
	console.log("elaspsed time " + elapsedTime);
	console.log("moves over " + movesOver);
	resetTimer();

	$("#moves").text(totalMoves);
	$("#time").text(elapsedTime);
	$("#score").text("TBC");

	setTimeout(() => {
		$(".you-win").css("display", "flex");
	}, 1400);
	// finalScore = endTime / 
	// console.log("your score is " + finalScore);


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


//--------------------------------------Prevent click during animations and on already matched cards
function canFlipCard(card) {
	// returns false if the current card is already flipped i.e. has 'flipped' class
	return !card.classList.contains("flipped") && !gameBusy;

}

//--------------------------------------Reset Game
function resetGame() {
	levelSelect(currentLevel, totalTime);
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

