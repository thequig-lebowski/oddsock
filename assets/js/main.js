//Check for DOM to finish loading, then set game level to easy by default.

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", levelSelect(4));
} else {
	levelSelect(4);
}

function startGame() {
	let cards = Array.from(document.getElementsByClassName("card-wrapper"));
	cards.forEach(card => {
		card.addEventListener("click", () => {
			flipCard(card)
		});
	});
}

let firstCard, secondCard;
let isCardFlipped = false;
let gameBusy = false;

function flipCard(card) {

	if (canFlipCard(card)) {
		console.log('can');

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
				gameBusy = false;
				checkGameWin();
			} else {
				resetCards();
			}
		}
	} else {
		console.log("can't flipp");
	}
}

function checkGameWin() {
	// check to see when game is over
}

function gameOver() {
	// game over when timer runs out
}

function resetCards() {
	// it's not a match sound?
	// flippedCards = true;
	setTimeout(() => {
		firstCard.classList.remove("flipped");
		secondCard.classList.remove("flipped");
		console.log("inside timeout");
		gameBusy = false;
	}, 900);
	console.log("outside timeout");
	return true;
}

function flipCounter() {
	
	let clicks = $("#moves-total").text();
	clicks ++;
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

function levelSelect(num1) {

	//To add if statement to check if the difficulty level selected is already the level
	//being displayed, use .preventDefualt() else resetGame().

	resetGame();

	let totalPairs = (num1 * num1) / 2; //calculate the required number of divs
	let gridBox = "";	//create an empty string to hold the generated html

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

	startGame();


}


function resetGame() {

	//To add: modal here to check if user is sure they want to reset the game.
	//To add: check what level is currently being played and match it.
	$(".card-wrapper").remove();		//remove any previously generated game instances
	// $(".game-info").css("display", "none");

	console.log('game reset');

}

//To add check gameplay function to see what game is being played and adjust the time remaining
//accordingly. 

