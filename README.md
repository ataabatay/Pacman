# PACMAN (solo project - 4 days)
## Description
This is my attempt at recreating the classic 80s arcade game, Pacman where the player navigates through a maze, eating food pellets, and avoiding enemy ghosts. The game progresses through levels, each with increased difficulty (currently not implemented). The project serves as a demonstration of my ability to design and implement a classic arcade game and is my first project & portfolio piece out of the software engineering course I completed with General Assembly.

## Demo Link
To play the game online visit [Pacman](https://ataabatay.github.io/Pacman/).

## Getting Started
1. Access the source code via the 'Clone or download' button.
2. Open the index.html file in your browser of choice to start the game.

## Timeframe & Working Team
This was a solo four day project. The project timeline was from Monday, November 6th, to Thursday evening of the same week.

## Technologies Used
### HTML
Used for structuring the project and creating the necessary elements for the game interface.

### CSS
Employed for styling and layout, ensuring a visually appealing and responsive design.

### JavaScript
Leveraged for DOM manipulation, creating a grid of cells dynamically, handling game logic, and enabling player interaction. The absence of HTML Canvas prompted the use of JavaScript to generate and manage the game grid.

## Brief
The project aimed to recreate the classic 80s arcade game, Pacman. The aim of the game is to move through and collect all the food pellets scattered around a maze while avoiding the enemy ghosts chasing the player. 

The goal was to develop a browser game using only HTML, CSS and JavaScript within a constrained time frame and individual effort. HTML canvas was forbidden for use thus a creative approach was required to build the gameplay area.

### Requirements and deliverables
- Render a grid based game in the browser without utilising HTML Canvas;
- Ensure the player could clear at least one board;
- Display the player's score at the end of the game;
- Implementing a responsive design (optional and not implemented);
- Increase difficulty with each level (optional and not implemented);
- Incorporate a persistent leaderboard using localStorage

## Planning
First part of the work was research and an extensive plan with wireframes and pseudocode. Below are snippets from the research and wireframes.

### Research
_**(Images to come)**_

### Wireframes
_**(Images to come)**_

These were followed by the actual coding which followed 4 iterations of the game. The plan was followed as a checklist using Notion to save time but use of Jira was considered to create tickets and track.

## Build Process
First couple of days were spent on creating the grid where the game is played on as well as bringing the sprites on the grid with their movement patterns. 

I started with creating CSS classes for:
- a regular grid class on the maze,
- an OOB (out of bounds) class which was used for grid cells where the player was not allowed to go in or through (think of walls and empty cells where Pacman cannot go),
- a food pellet class,
- a warp class for the sides of the map to allow the user to warp from one side of the map to the other,
- a power pellet class,
- a Pacman class,
- the ghost classes.

Creating these classes meant to design with CSS as well as using relevant background images and gifs where appropriate.

Next, I created the createGrid() function which draws the actual grid on screen with:
- streets for Pacman and Ghosts to move in,
- out of bounds cells,
- warp cells for left-right/right-left warping of the map for all sprites,
- placement of food pellets on all relevant grid cells,
- placement of power pellets on specific grid cells.

_**(Images to come)**_

Followed by placing Pacman sprite on grid with:
- move() function for Pacman to move, abiding to the bounds of the grid,
- movement control by keyUp, keyDown, keyLeft and keyRight events,
- food pellet consumption and effects for Pacman inside the move function.

**_(Images to come)_**

Followed by placing Ghost sprites on the grid with:
- randomMovement() function using an interval loop to allow ghost movement on the grid while abiding the bounds of the grid.

**_(Images to come)_**

Once the building blocks of the game was developed, I moved onto the win/lose mechanism of the game where I worked on:
- displaying available lives on screen,
- handling the collision of Pacman with enemies,
- introducing a resetGrid function to:
  - remove life upon collision,
  - restart level with Pacman and ghosts at starting locations.
- triggering the gameOver function to:
  - switch to the game over screen,
  - show final score,
  - display a button to return to the main menu,
- triggering level won handling to:
  - show win screen,
  - display final score,
  - display a button to return to the main menu.

Once this was done I worked on quality improvements for the game with:
- adding more enemies,
- removing food pellets from several locations,
- displaying current score on screen,
- building a start game screen,

At this point the MVP was well completed and I continued with quality features and nice to haves by working on: 
- power up mode for Pacman upon eating power pellets to:
  - increase score by 50 instead of 10,
  - render Ghosts blue and vulnerable,
  - allow Pacman to eat ghosts,
  - regenerate ghosts at their starting nest,
- high score display on screen,
- updating and displaying a persistent high score,
- implementing a "Ready!" disclaimer with a timeout before the game begins or after a life loss.
- adding sounds and SFX:
  - background music for start, loading, gameplay, loss, and win screens,
  - SFX for eating food and power pellets, power-up mode, and death,
- adding a music on/off toggle button,
- improving pathfinding logic for ghosts.

The improved algorithm, even if it may not be very intelligent, follows the following logic:
1. Set a random active direction,
2. Check if the next cell following this direction is not out of bounds,
   - If yes, move to that location,
     - Repeat from step 2,
   - If no, set another random active direction,
     - Repeat from step 1.

## Challenges
- **Pathfinding logic for ghost movement:** At first a random movement logic was implemented with a time interval. Later this logic was slightly improved but still was not complex or intelligent enough. The complexity of the problem combined with the time constraint only allowed me to create a simple pathfinding logic for the enemy which I will revisit to ameliorate.
- **Time management:** I decided to spend time designing gifs to improve the look and feel of gameplay. I was not able to implement 90% of the new designs I have worked on which turned the time spent on this into a waste.
- **Rebuilding with classes:** In the middle of the journey I noticed I should have coded the sprites using classes. I spent another half day rewriting everything using classes yet I understood the magnitude of this task and had to abandon the idea.

## Wins
- **Dynamically creating grids:** which means creating new levels would be an easy task later on thanks to the createGrid function I created,
- **Ghost AI:** despite not spending as much time as I would have like to, I ended up with a decent, even though not 100% functioning, algorithm for enemy movement,
- **Planning** phase was really strong and I was able to come up with powerful designs and versions to develop iteratively.

## Key Learnings
- Seeing the value of using JavaScript classes to create sprite and how complicated it can get without classes,
- Solidified DOM manipulation using vanilla JavaScript.

## Bugs
- High score resets upon page reload and only functions if you continue playing the game,
- If Pacman eats food pellets too fast the munching sound mixes as I did not implement the playSound function with a global audio variable that gets reset,
- When the main menu button is used upon winning the game, the next time you play the game ghosts’ pace increases dramatically simulating - increased difficulty. This is not an intended behaviour,
- Mute button only mutes music does not mute sfx but not a bug rather a feature that was not implemented,

## Future Improvements
- Pause button to pause the game and freeze screen,
- Improved enemy AI,
- Fruits randomly appear on the screen that gives other bonus score point,
- Random level generation research - wall generation,
- Responsive design for screen sizes for all elements,
- Making the sprites look into the direction they are going to (only Pacman rotates when it changes direction),
- Make the sprites move with transition (CSS animation) for smoother gameplay,
- Re-attempt the project with React.
