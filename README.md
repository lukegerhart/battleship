# you-sunk-my-battleship-lukegerhart
For this version, you will assume that only one user is viewing the page that presents your game at a time (e.g., the two players are using a laptop that they pass back and forth between turns).
Wikipedia's Battleship entry lays out the rules.
Your game will be built on a 10x10 grids, with rows labeled 1-10 and columns labeled A-J.
We will assume that players will place 3 game pieces
an aircraft carrier (5 spaces long)
a battleship (4 spaces long)
a submarine (3 spaces long).
These pieces can be placed either horizontally or vertically, and cannot overlap.
Specifications
These are the base requirements for making the page work. You can enhance. You cannot use external libraries like jQuery for this project.

When the page is loaded, your game should begin by asking the first player for her name (for example, lets assume that the first player is Alice), and a string representing her ship placements.
Your game should be flexible in accepting the syntax of a ship placement string. Specifically, it should accept strings of the following forms as equivalent, with each resulting in an aircraft carrier placed on A1, A2, A3, A4, A5; a battleship at B6, C6, D6, E6; and a submarine at H3, I3, J3:
A:A1-A5;B:B6-E6; S:H3-J3
A(A1-A5); B(B6-E6); S(H3-J3);
B(B6-E6);S(H3-J3);A(A1-A5)
After gathering the first player's name and ship placement, your game should prompt the second player for their name and ship placement (for example, lets assume the second player is Bob).
With this starting info in hand, your game should begin the first player's turn
At the start of a turn, your game should pop up an alert indicating whose turn it is (e.g., "Click OK to begin Alice's turn").
After the prompt is dismissed, your game should render 2 10x10 grids, one at the top of the window, and the other just below it, closer to the bottom of the browser window.
Both grids should have a light blue background.
The top grid should represent the current players target (i.e., the grid where the other player's ships reside), while the bottom represents the current player's ship deployment.
At the start of the first player's first turn, the top grid will be completely empty, and the bottom grid will show only the location of the first player's ships
On the bottom grid, each space occupied by part of an aircraft carrier should contain an "A", each space occupied by part of a battleship should contain a "B", each space occupied by part of a submarine should contain an "S".
The player is then free to click a space into top grid to "fire" at.
Clicks on the lower grid should have no effect.
The game should pop up an alert to inform the player whether the shot was a hit or a miss.
If the player clicks on a space where no part of any of the other player's ships was placed, the shot is a miss, and the space should be colored white.
If some part of one of the other player's ships was placed in the clicked space, the shot is a hit, and the space should be colored red.
If this hit represents the final portion of a ship (i.e., the 5th hit on an aircraft carrier, the 4th hit on a battleship, or the 3rd hit on a submarine), the player should be alerted as to which of the other player's ships they have sunk.
After the player has clicked on their target space and the hit or miss has been reported, the player's turn is ended and the other player's turn should begin with a popup (e.g., "Click to begin Bob's turn").
Note: that this will require blanking the page before the alert is created to prevent Bob from seeing Alice's ship placement (and vice-versa), and will require a rearranging of the page after the alert is dismissed so that Bob's target grid appears at the top of the page, and his ship placement appears on the bottom.
At any point in time, a player's top grid should display all the hits(red spaces) and misses (white spaces) that they have fired, while the bottom grid shows all of the hits and misses their opponents have fired along with their ship placements.
The game continues until all of one player's ships have been sunk, at which point the other player wins the game.
Once a winner has been established, your game should compute the winner's score
Score is computed as: 24 - (2 points for each hit against them)
10 points for sinking the opponent's aircraft carrier
8 points for sinking the opponent's battleship
6 points for sinking the opponent's submarine
If Alice won the game while Bob was able to sink her submarine and land a single hit on her battle ship, but did not hit her aircraft carrier at all, Alice score would be 16
24 - (2 * 4)
Your game should keep track of the names and scores of the 10 players with the highest scores in local storage.
If 10 players have all achieved the max score (24), no further updates to local storage are required.