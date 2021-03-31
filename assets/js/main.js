function startGame(num1) {

	resetGame();

	let totalCards = num1*num1;
	let gridBox = "";
	
	for ( let i = 0; i < totalCards; i++) {
		gridBox = `${gridBox}
					<div class="cardback"></div>`;
	}

	$(".game-container").css(`grid-template-columns`, `repeat(${num1}, auto)`);
	$(".game-container").css("display", "grid");
	$(".game-container").append(gridBox);
	
}


function resetGame() {

	$(".cardback").remove();
}