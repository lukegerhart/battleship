function validateShipPlacement(ships) {    
    //check that they're the right length
    if(ships["A"].length != 5 || ships["B"].length != 4 || ships["S"].length != 3) {
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
    var letterMap = {'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':6, 'G':7, 'H':8, 'I':9, 'J':10};
    var ships = {};
    for (var i = 0; i < placementArray.length; i++) {
        var location = placementArray[i].replace(/[(]|-|[)]|;|:/g, '');
        var shipType = location.substring(0,1);
        var startCoord = location.substring(1,3);
        var endCoord = location.substring(3);
        var startsMatch = startCoord.charAt(0) == endCoord.charAt(0);
        var endsMatch = startCoord.charAt(1) == endCoord.charAt(1);
        if ( !(( startsMatch && !endsMatch ) || ( endsMatch && !startsMatch )) ) {
            //pretty sure this line makes sure the ships are only horizontal/vertical
            return false;
        }
        var gridNums = [];
        var repeat = true;
        var currentCoord = startCoord;
//		/document.write(location);
        while (repeat) {
            //grid is laid out with 100 blocks numbered 1-100
            //gridNum = (row-1)*10 + column, where A=1,B=2,...
            var gridNum = ((parseInt(currentCoord.charAt(1)) - 1) * 10) + letterMap[currentCoord.charAt(0)];
            gridNums.push(gridNum);
            
            if (currentCoord == endCoord) {
                repeat = false;
            }
            //currentCoord = next;
            if (startsMatch) {
                var nextInt = parseInt(currentCoord.charAt(1)) + 1;
                currentCoord = currentCoord.charAt(0) + nextInt.toString();
            } else {
                var nextString = String.fromCharCode(currentCoord.charAt(0).charCodeAt(0) + 1);
                currentCoord = nextString + currentCoord.charAt(1);
            }
        }
        ships[shipType] = gridNums;
    }
    return ships;
}

function parseShipPlacement(placementStr) {
    //This regexp matches acceptable input for ship placement. Regexp does not check that the placement is valid(i.e. 4-cell submarine is allowed)
    var shipPlacementRegex = new RegExp('[ABS][:(][A-J](?:[1-9]|10)-[A-J](?:[1-9]|10)[)]?;?', 'g');
    placementStr = placementStr.replace(/\s+/g, '');
    var ships = [];
    var matches;
    while ((matches = shipPlacementRegex.exec(placementStr)) != null) {
        ships.push(matches[0]);
    }
    return ships;
}