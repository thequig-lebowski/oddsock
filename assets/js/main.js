function startGame(num1) {

	//To add if statement to check if the difficulty level selected is already the level
	//being displayed, use .preventDefualt() else resetGame().



	resetGame();

	let totalPairs = (num1 * num1) / 2; //calculate the required number of divs
	let gridBox = "";

	for (let i = 0; i < totalPairs; i++) {
		for (let j = 0; j < 2; j++) {
			gridBox = `${gridBox}
					<div class="card">
						<div class="card-back">
							<img class"back" src="assets/images/cardfront.png" alt="hidden card"/>
						</div>
						<div class="card-front">
							<img class="sock" src="assets/images/${i + 1}.png" alt="sock picture"/>
						</div>
					</div>`;
		}
	}

	$(".game-container").css(`grid-template-columns`, `repeat(${num1}, auto)`);
	$(".game-container").css("display", "grid");
	$(".game-container").append(gridBox);

}


function resetGame() {

	//To add modal here to check if user is sure they want to reset the game.

	$(".card").remove();
	$(".game-container").css("display", "none");

}

//To add check gameplay function to see what game is being played and adjust the time remaining
//accordingly. 