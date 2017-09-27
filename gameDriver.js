getInfo(1);
while (player1Info == null) {
	alert("You entered invalid data");
	player1Info = getInfo(1);
}

getInfo(2);
while (player2Info == null) {
	alert("You entered invalid data");
	player2Info = getInfo(2);
}
/*var player1 = {"name": "Alice", "playerNum": "playerNum1", "shipPlacement": {'B': [52, 53, 54, 55], 'S': [28, 29, 30], 'A': [1, 11, 21, 31, 41]}, "shipsHit":[52]};
var player2 = {"name": "Alice", "playerNum": "playerNum1", "shipPlacement": {'B': [52, 53, 54, 55], 'S': [28, 29, 30], 'A': [1, 11, 21, 31, 41]}, "shipsHit":[52]};*/
currentPlayer = player2Info;
otherPlayer = player1Info;
generateTopGrid();
//currentPlayer = player1Info;
generateBottomGrid();