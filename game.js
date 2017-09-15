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
        var location = placementArray[i];
        var shipType = location.substring(0,1);
		var locations = location.substring(1).split("-");
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

function parseShipPlacement(placementStr) {
    //This regexp matches acceptable input for ship placement. Regexp does not check that the placement is valid(i.e. 4-cell submarine is allowed)
    /* var shipPlacementRegex = new RegExp('[ABS][:(][A-J](?:[1-9]|10)-[A-J](?:[1-9]|10)[)]?;?', 'g');
    placementStr = placementStr.replace(/\s+/g, '');
	//document.write(placementStr);
    var ships = [];
    var matches;
    while ((matches = shipPlacementRegex.exec(placementStr)) != null) {
		document.write(matches[0]);
        ships.push(matches[0]);
    } */
    if (placementStr == null) {
        return null;
    }
	var ships = [];
	placementStr = placementStr.replace(/\s+/g, '');
	if (placementStr.charAt(placementStr.length-1) == ";") {
		placementStr = placementStr.substring(0,placementStr.length-1);
	}
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
	}
    return ships;
}

function generateTopGrid(playerInfo) {
    var body = document.body;
    var container = document.createElement("div");
    var columnLabel = document.createElement("div");
    columnLabel.className = "columnLabel";
    container.appendChild(columnLabel);
    
    var rowLabel = document.createElement("div");
    rowLabel.className = "rowLabel";
    
    var rowLabelAndGrid = document.createElement("div");
    rowLabelAndGrid.className = "rowLabelAndGrid";
    rowLabelAndGrid.appendChild(rowLabel);
    var gridDiv = document.createElement("div");
    gridDiv.className = "grid";  
    for (var row = 0; row < 10; row++) {
        var rowDiv = document.createElement("div");
        rowDiv.className = "row";
        for (var col = 1; col <= 10; col++) {
            var cellDiv = document.createElement("div");
            var cellNum = (row*10+col);
            cellDiv.id = playerInfo["playerNum"] + "cell" + cellNum;
            var classname = "cell" + ((contains(playerInfo["shipsHit"], cellNum)) ? " redBackground" : " blueBackground");
            cellDiv.className = classname;
            rowDiv.appendChild(cellDiv);
        }
        gridDiv.appendChild(rowDiv);
    }
    rowLabelAndGrid.appendChild(gridDiv);
    container.appendChild(rowLabelAndGrid);
    body.appendChild(container);
    //return gridDiv;
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

function generateBottomGrid(playerInfo) {
    var gridDiv = document.createElement("div");
    gridDiv.className = "grid";
    for (var row = 0; row < 10; row++) {
        var rowDiv = document.createElement("div");
        rowDiv.className = "row";
        for (var col = 1; col <= 10; col++) {
            var cellDiv = document.createElement("div");
            var cellNum = (row*10+col);
            cellDiv.id = playerInfo["playerNum"] + "cell" + cellNum;
            var classname = "cell" + ((contains(playerInfo["shipsHit"], cellNum)) ? " redBackground" : " blueBackground");
            cellDiv.className = classname;
            //Label ship type
            var ships = playerInfo["shipPlacement"];
            var shipType = determineShipType(ships, cellNum);
            var p = document.createElement("p");
            p.className = "shipType";
            var node = document.createTextNode(shipType);
            p.appendChild(node);
            cellDiv.appendChild(p);
            rowDiv.appendChild(cellDiv);
        }
        gridDiv.appendChild(rowDiv);
    }
    return gridDiv;
}

function getInfo(playerNum) {
    var name = prompt("Player" + playerNum +  ", please enter your name", "Player" + playerNum);
    var shipPlacement = prompt(name + ", please enter your ship placement");

    var shipPlacements = parseShipPlacement(shipPlacement);
    var shipPlacementGrid = convertShipPlacementToGrid(shipPlacements);
    if (!validateShipPlacement(shipPlacementGrid)) {
        return null;
    }
    var playerInfo = {"name": name, "playerNum": "playerNum" + playerNum, "shipPlacement": shipPlacementGrid, "shipsHit":[]};
    return playerInfo;
}