//Check for DOM to finish loading, then set game level to easy by default.

if(document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", levelSelect(4));
} else {
	levelSelect(4);
}

function startGame() {
	let cards = Array.from(document.getElementsByClassName("card-wrapper"));

	cards.forEach(card => {
		card.addEventListener("click", function() {
			//game play...
			console.log("click");
		});
	});
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
					<div class="card-wrapper">
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
	$(".game-info").css("display", "none");

	console.log('game reset');

}

//To add check gameplay function to see what game is being played and adjust the time remaining
//accordingly. 

