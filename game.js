var player1Info = /*{"name": "Alice", "playerNum": "playerNum1", "shipPlacement": {'B': [52, 53, 54, 55], 'S': [28, 29, 30], 'A': [1, 11, 21, 31, 41]}, "shipsHit":{'A':[], 'B':[], 'C':[]}, "cellsHit":[]}*/null;
var player2Info = /*{"name": "Bob", "playerNum": "playerNum2", "shipPlacement": {'B': [47, 57, 67, 77], 'S': [92, 93, 94], 'A': [23, 24, 25, 26, 27]}, "shipsHit":{'A':[], 'B':[], 'C':[]}, "cellsHit":[]}*/null;
var currentPlayer = {};
var otherPlayer = {};

function alert2(str, time){
	return new Promise ((resolve, reject) => {
		setTimeout(function(){
            if (confirm(str)) {
                //resolve actually calls blankScreenAfterTurn, this promise enforces order
                resolve();
            } else {
                reject('');
            }
        }, time);
	});
}

function alertNextTurn() {
	alert2(otherPlayer['name'] + ', click okay to start your turn');
}

var alertNextTurnEvent = new Event('nextTurn');
document.addEventListener('nextTurn', alertNextTurn);

function blankScreenAfterTurn() {
	
	//return new Promise((resolve, reject) => {
		console.log("blanking screen");
		var body = document.getElementById("mainContainer");
		body.innerHTML = "";

		//resolve();
	//});
}

var blankScreenEvent = new Event('blankScreen');
document.addEventListener('blankScreen', blankScreenAfterTurn);


function validateShipPlacement(ships) {    
    if (ships == null) {
        return false;
    }
    //check that they're the right length
    if (ships["A"].length != 5 || ships["B"].length != 4 || ships["S"].length != 3) {
        return false;
    }
    //check that they don't overlap
    var allCoords = ships["A"].concat(ships["B"], ships["S"]);
    var set = new Set(allCoords);
    if (set.size != allCoords.length) {
        return false;
    }
    return true;
}

function convertShipPlacementToGrid(placementArray) {
    if (placementArray == null) {
        return null;
    }
    var letterMap = {'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':6, 'G':7, 'H':8, 'I':9, 'J':10};
    var ships = {};
    for (var i = 0; i < placementArray.length; i++) {
        var loc = placementArray[i];
        var shipType = loc.substring(0,1);
		var locations = loc.substring(1).split("-");
        var startCoord = locations[0];
        var endCoord = locations[1];
        var startsMatch = startCoord.charAt(0) == endCoord.charAt(0);
        var endsMatch = startCoord.substring(1) == endCoord.substring(1);
        if ( !(( startsMatch && !endsMatch ) || ( endsMatch && !startsMatch )) ) {
            //pretty sure this line makes sure the ships are only horizontal/vertical
            return null;
        }

        var gridNums = [];
        var repeat = true;
        var currentCoord = startCoord;
        while (repeat) {
            //grid is laid out with 100 blocks numbered 1-100
            //gridNum = (row-1)*10 + column, where A=1,B=2,...
            var gridNum = ((parseInt(currentCoord.substring(1)) - 1) * 10) + letterMap[currentCoord.substring(0,1)];
            gridNums.push(gridNum);
            if (currentCoord == endCoord) {
                repeat = false;
            }
            if (startsMatch) {
                var nextInt = parseInt(currentCoord.substring(1));
				var end = parseInt(endCoord.substring(1));
				var incr = (end > nextInt) ? 1 : -1;
				nextInt = nextInt + incr;
                currentCoord = currentCoord.charAt(0) + nextInt.toString();
            } else {
                var increment = endCoord.charCodeAt(0) > startCoord.charCodeAt(0);
				var incr = increment ? 1 : -1;
                var nextString = String.fromCharCode(currentCoord.charCodeAt(0) + incr);
                currentCoord = nextString + currentCoord.substring(1);
            }
        }
        ships[shipType] = gridNums;
    }
    return ships;
}

function contains(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == item) {
            return true;
        }
    }
    return false;
}

function determineShipType(ships, cellNum) {
    var shipType = ""; //apparently every cell needs something or else the format gets all out of wack.
    if (contains(ships['B'], cellNum)) {
        shipType = 'B';
    } else if (contains(ships['A'], cellNum)) {
        shipType = 'A';
    } else if (contains(ships['S'], cellNum)) {
        shipType = 'S';
    }
    return shipType;
}

function parseShipPlacement(placementStr) {
    //This regexp matches acceptable input for ship placement. Regexp does not check that the placement is valid(i.e. 4-cell submarine is allowed)
    var shipPlacementRegex = new RegExp('[ABS][:(][A-J](?:[1-9]|10)-[A-J](?:[1-9]|10)[)]?;?', 'g');
    placementStr = placementStr.replace(/\s+/g, '');
	
	//document.write(placementStr);
    var ships = [];
    var matches;
    while ((matches = shipPlacementRegex.exec(placementStr)) != null) {
		//document.write(matches[0]);
		var match = matches[0];
		if (match.charAt(match.length-1) == ";") {
			match = match.substring(0,match.length-1);
		}
		match = match.replace(/\(|\)/g, '');
        ships.push(match);
    }
	console.log(ships);
    if (placementStr == null) {
        return null;
    }
	/*var ships = [];
	placementStr = placementStr.replace(/\s+/g, '');
	
	ships = placementStr.split(";");
	if (ships.length != 3) {
        return null;
    }
	for (var i = 0; i < ships.length; i++) {
		ships[i] = ships[i].replace(/[(]|[)]|;|:/g, '');
        if (ships[i].length != 6 && ships[i].length != 7) {
            return null;
        }
        if ( !contains(['A', 'B', 'S'], ships[i].charAt(0))) {
            return null;
        }
	}*/
    return ships;
}

function checkShipSunk(ships, cellNum) {
    var hitsPerShip = {'A':5, 'B':4, 'S':3};
    var shipName = {'A':'Aircraft Carrier', 'B':'Battleship', 'S':'Submarine'};
    var shipType = determineShipType(ships, cellNum);
    var hits = hitsPerShip[shipType];
    if (otherPlayer["shipsHit"][shipType].length == hits) {
        //ship sunk
        alert2("You sunk " + otherPlayer["name"] + " 's " + shipName[shipType] + "!");
    }
}

function failureCallback() {
	//do nothing
	console.log("failure");
}

function fireMissileOnClick() {
    var ships = otherPlayer["shipPlacement"];    
    var cellNum = this.id.split("cell")[1];
    var shipType = determineShipType(ships, cellNum);
    if (shipType == "") {
        //miss
        otherPlayer["cellsHit"].push(cellNum);
        var cell = document.getElementById(this.id);
        cell.className = "cell";
		/*alert2("miss", 50).then(blankScreenAfterTurn())
		.then(alert2(otherPlayer['name'] + ', click okay to start your turn', 50))
		//.then(generateGrids())
		.catch(failureCallback);*/
		alert2('Miss', 50).then(blankScreenAfterTurn, blankScreenAfterTurn);
		//blankScreenAfterTurn();
		
		//document.dispatchEvent(blankScreenEvent);
    } else {
        /*
        a cell thats hit won't have an eventlistener in the next round, so only unhit cells will fire this code.
        */
        console.log("hit");
        document.getElementById(this.id).className = "cell redBackground";
        var ships = otherPlayer["shipsHit"];
        otherPlayer["shipsHit"][shipType].push(cellNum);
        /*alert2("hit", 50)
		.then(blankScreenAfterTurn())
		.then(alert2(otherPlayer['name'] + ', click okay to start your turn', 50))
		.then(generateGrids())
		.catch(failureCallback);*/
        alert2('Hit', 50).then(function() {
            return new Promise ((resolve, reject) => {
                var hitsPerShip = {'A':5, 'B':4, 'S':3};
                var shipName = {'A':'Aircraft Carrier', 'B':'Battleship', 'S':'Submarine'};
                var shipType = determineShipType(ships, cellNum);
                var hits = hitsPerShip[shipType];
                if (otherPlayer["shipsHit"][shipType].length == hits) {
                    //ship sunk
                    return alert2("You sunk " + otherPlayer["name"] + " 's " + shipName[shipType] + "!", 50).then(blankScreenAfterTurn, blankScreenAfterTurn);
                }
                resolve();
            }
        );
        }).then(blankScreenAfterTurn, blankScreenAfterTurn);
		//checkShipSunk(ships, cellNum);
		//document.dispatchEvent(blankScreenEvent);
    }
}

function generateGrids() {
	//switch players
	if (currentPlayer == player1Info) {
		currentPlayer = player2Info;
		otherPlayer = player1Info;
	} else {
		currentPlayer = player1Info;
		otherPlayer = player2Info;
	}
	
	generateTopGrid();
	generateBottomGrid();
}

function generateTopGrid() {
    var numToString = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    var body = document.getElementById("mainContainer");
    var container = document.createElement("div");
    var gridDiv = document.createElement("div");
    gridDiv.className = "topGrid";  
    for (var row = 0; row < 11; row++) {
        var rowDiv = document.createElement("div");
        rowDiv.className = "row";
        for (var col = 0; col < 11; col++) {
            var cellDiv = document.createElement("div");
            if (row == 0) {
                var p = document.createElement("p");
                p.className = "columnLabel";
                var node = document.createTextNode(numToString[col]);
                p.appendChild(node);
                cellDiv.appendChild(p);
                cellDiv.className = "cell";
            } else if (col == 0) {
                var p = document.createElement("p");
                p.className = "rowLabel";
                var node = document.createTextNode(row);
                p.appendChild(node);
                cellDiv.appendChild(p);
                cellDiv.className = "cell";
            } else {
                var p = document.createElement("p");
                p.className = "rowLabel";
                var node = document.createTextNode("");
                p.appendChild(node);
                cellDiv.appendChild(p); 
                var cellNum = ((row-1)*10+(col));
                var className = "cell blueBackground";
                cellDiv.id = otherPlayer["playerNum"] + "cell" + cellNum;
                if (contains(otherPlayer["shipsHit"], cellNum)) {
                    className = className + " redBackground";
                } else if (contains(otherPlayer["cellsHit"], cellNum)) {
                    className = "cell"
                }
                if (/*className == "cell" || */className == "cell blueBackground") {
                    cellDiv.addEventListener("click", fireMissileOnClick);
                }
                cellDiv.className = className;
                
            }        
            rowDiv.appendChild(cellDiv);
        }
        gridDiv.appendChild(rowDiv);
    }
    container.appendChild(gridDiv);
    body.appendChild(container);
}

function generateBottomGrid() {
    var numToString = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    var body = document.getElementById("mainContainer");
    var container = document.createElement("div");
    var gridDiv = document.createElement("div");
    gridDiv.className = "bottomGrid";
    for (var row = 0; row < 11; row++) {
        var rowDiv = document.createElement("div");
        rowDiv.className = "row";
        for (var col = 0; col < 11; col++) {
            var cellDiv = document.createElement("div");
            if (row == 0) {
                var p = document.createElement("p");
                p.className = "columnLabel";
                var node = document.createTextNode(numToString[col]);
                p.appendChild(node);
                cellDiv.appendChild(p);
                cellDiv.className = "cell";
            } else if (col == 0) {
                var p = document.createElement("p");
                p.className = "rowLabel";
                var node = document.createTextNode(row);
                p.appendChild(node);
                cellDiv.appendChild(p);
                cellDiv.className = "cell";
            } else {
                var p = document.createElement("p");
                p.className = "rowLabel";
                var node = document.createTextNode("");
                p.appendChild(node);
                cellDiv.appendChild(p); 
                var cellNum = ((row-1)*10+(col));
                var className = "";
                cellDiv.id = currentPlayer["playerNum"] + "cell" + cellNum;
                className = "cell" + ((contains(currentPlayer["shipsHit"], cellNum)) ? " redBackground" : " blueBackground");
                cellDiv.className = className;
                //Label ship type
                var ships = currentPlayer["shipPlacement"];
                var shipType = determineShipType(ships, cellNum);
                var pShip = document.createElement("p");
                pShip.className = "shipType";
                var node = document.createTextNode(shipType);
                pShip.appendChild(node);
                cellDiv.appendChild(pShip);
            }
            
            rowDiv.appendChild(cellDiv);
        }
        gridDiv.appendChild(rowDiv);
    }
    container.appendChild(gridDiv);
    body.appendChild(container);
    
}

function getInfo(playerNum) {
    var name = prompt("Player" + playerNum +  ", please enter your name", "Player" + playerNum);
    var shipPlacement = prompt(name + ", please enter your ship placement");

    var shipPlacements = parseShipPlacement(shipPlacement);
    var shipPlacementGrid = convertShipPlacementToGrid(shipPlacements);
    if (!validateShipPlacement(shipPlacementGrid)) {
        if (playerNum == 1) {
			player1Info = null;
		} else {
			player2Info = null;
		}
    } else {
		if (playerNum == 1) {
			player1Info = {"name": name, "playerNum": "playerNum" + playerNum, "shipPlacement": shipPlacementGrid, "shipsHit":{'A':[], 'B':[], 'C':[]}, "cellsHit":[]};
		} else {
			player2Info = {"name": name, "playerNum": "playerNum" + playerNum, "shipPlacement": shipPlacementGrid, "shipsHit":{'A':[], 'B':[], 'C':[]}, "cellsHit":[]};
		}
	}
    
}