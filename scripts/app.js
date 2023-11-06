console.log('working')
// Elements //

// All gamestates - these are individual pages and include
// 0: start-menu screen (optional)
// 1: loading screen (optional)
// 2: gameplay-screen (required)
// 3: gameover-screen (required)
// 4: pause-screen (optional)
const gameStates = document.querySelectorAll('.gamestate')

// play button - to start gameplay
const startBtn = document.querySelector('.start-play')

// grid-wrapper width to create the cells
const gridWrapperWidth = document.querySelector('.grid-wrapper').offsetWidth

// grid area to create and append cells into
const grid = document.querySelector('.grid')

// current-score - to show current score
const currentScoreDisplay = document.querySelector('.current-score .nominal-score')
let currentScore = 0 // the actual current score value

// high-score - to fetch and show the high score from localstorage
const highScore = document.querySelector('.high-score .nominal-score')

// available lives area to manipulate how many lives the player has
const remainingLives = document.querySelector('.lives-remaining')

// Variables //
// cells - every individual cell that's created with the createGrid() function
const cells = []

// Directions array to use for random ghost movement
// 0: up
// 1: right
// 2: down
// 3: left
const directions = ['up', 'right', 'down', 'left']

// available lives
let lives = null

// gameState - this will be the global variable that's deciding which screen is being shown
// 0: start-menu screen (optional)
// 1: loading screen (optional)
// 2: gameplay-screen (required)
// 3: gameover-screen (required)
// 4: pause-screen (optional)
let gameState = 0 // on page load we start on the start-menu

// gameRunning - boolean to help with other functions checking to see if the game is running or not
let gameRunning

// standard Pacman maze width and height ratios
const stdWidth = 28 // this will be the base variable we use to decide how many grid cells to create
const stdHeight = 31 // this will be the base variable we use to decide how many rows of cells we're going to create

// the width and height of our cells dynamically created based on screen size
const width = gridWrapperWidth / stdWidth
// cell count - how many grid cells we need to create
const cellCount = stdHeight * stdWidth

// Out of bounds areas in the maze indexed from top left to bottom right
const oobs = [
  {
    start: 58,
    width: 4,
    height: 3,
  },
  {
    start: 63,
    width: 5,
    height: 3,
  },
  {
    start: 13,
    width: 2,
    height: 5,
  },
  {
    start: 72,
    width: 5,
    height: 3,
  },
  {
    start: 78,
    width: 4,
    height: 3,
  },
  {
    start: 170,
    width: 4,
    height: 2,
  },
  {
    start: 175,
    width: 2,
    height: 8,
  },
  {
    start: 178,
    width: 8,
    height: 2,
  },
  {
    start: 187,
    width: 2,
    height: 8,
  },
  {
    start: 190,
    width: 4,
    height: 2,
  },
  {
    start: 237,
    width: 2,
    height: 3,
  },
  {
    start: 252,
    width: 6,
    height: 5,
  },
  {
    start: 261,
    width: 3,
    height: 2,
  },
  {
    start: 268,
    width: 5,
    height: 2,
  },
  {
    start: 274,
    width: 6,
    height: 5,
  },
  {
    start: 346,
    width: 3,
    height: 1,
  },
  {
    start: 351,
    width: 3,
    height: 1,
  },
  {
    start: 346,
    width: 1,
    height: 5,
  },
  {
    start: 353,
    width: 1,
    height: 5,
  },
  {
    start: 420,
    width: 6,
    height: 5,
  },
  {
    start: 427,
    width: 2,
    height: 5,
  },
  {
    start: 439,
    width: 2,
    height: 5,
  },
  {
    start: 442,
    width: 6,
    height: 5,
  },
  {
    start: 458,
    width: 8,
    height: 1,
  },
  {
    start: 514,
    width: 8,
    height: 2,
  },
  {
    start: 517,
    width: 2,
    height: 5,
  },
  {
    start: 590,
    width: 4,
    height: 2,
  },
  {
    start: 595,
    width: 5,
    height: 2,
  },
  {
    start: 604,
    width: 5,
    height: 2,
  },
  {
    start: 610,
    width: 4,
    height: 2,
  },
  {
    start: 648,
    width: 2,
    height: 3,
  },
  {
    start: 666,
    width: 2,
    height: 3,
  },
  {
    start: 673,
    width: 2,
    height: 2,
  },
  {
    start: 679,
    width: 2,
    height: 4,
  },
  {
    start: 682,
    width: 8,
    height: 2,
  },
  {
    start: 691,
    width: 2,
    height: 4,
  },
  {
    start: 697,
    width: 2,
    height: 2,
  },
  {
    start: 758,
    width: 10,
    height: 2,
  },
  {
    start: 741,
    width: 2,
    height: 3,
  },
  {
    start: 772,
    width: 10,
    height: 2,
  }
]

// All sprites and their characteristics in an array of objects
const sprites = [
  {
    name: 'pacman',
    startPos: 657,
    currentPos: 657,
  },
  {
    name: 'blinky',
    startPos: 322,
    currentPos: 322,
  },
  {
    name: 'pinky',
    startPos: 349,
    currentPos: 349,
  },
  {
    name: 'inky',
    startPos: 404,
    currentPos: 404,
  },
  {
    name: 'clyde',
    startPos: 407,
    currentPos: 407,
  }
]

// highScore - high score to be stored inside the localstorage for persistence

// Functions
// screen swapper to move from screen to screen
function swapScreen(gameState) {
  // hide all screens to decide which one to show later
  gameStates.forEach(state => state.classList.add('hidden'))
  // show the relevant screen
  gameStates[gameState].classList.remove('hidden')
}

// createGrid() - function to create a grid where the game will be played
function createGrid() {
// creates a grid of cells
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div')
    cell.innerText = i // REMOVE WHEN DONE
    cell.id = i
    cell.style.width = `${width}px`
    cell.style.height = `${width}px`
    // adds ".cell" class to all the created divs
    cell.classList.add('cell')
    cells.push(cell)
    grid.append(cell)
  }
  
  // adds ".oob" class to the cell divs that are out-of-bounds
  // creates the outer wall
  for (let i = 0; i < cellCount; i++) {
    if (i < stdWidth || i % stdWidth === stdWidth - 1 || i > cellCount - stdWidth || i % stdWidth === 0) {
      cells[i].classList.add('oob')
    }
  }
  
  // creates inner walls with given coordinates of the walls (defined in an array called 'oob' above)
  function insideWallCreator (startingId, width, height) {
    for (let i = startingId; i < startingId + (height * stdWidth); i = i + stdWidth) {
      for (let j = 0; j < width; j++) {
        cells[i + j].classList.add('oob')
      }
    }
  }
  oobs.forEach(oob => insideWallCreator(oob.start, oob.width, oob.height))

  // creates warps - crazy and might be unnecessary to calculate like this rather than assigning ids but lets see might come in handy
  cells[(Math.floor(stdHeight - 1) / 2) * stdWidth - 1].classList.remove('oob')
  cells[(Math.floor(stdHeight - 1) / 2) * stdWidth - stdWidth].classList.remove('oob')
  
  // creates food for Pacman on the available cells
  // adds ".food" class to all the cell divs where food will be
  cells.forEach(cell => !cell.classList.contains('oob') ? cell.classList.add('food') : true)

  // adds power pellets to the map
  // removes food and adds ".powerPellet" class to the cell divs where power pellets will be placed
  // coordintes of the powerPellets
  const powerPellets = [85, 110, 645, 670]
  powerPellets.forEach(pellet => cells[pellet].classList.remove('food'))
  powerPellets.forEach(pellet => cells[pellet].classList.add('powerPellet'))

  // function to create Pacman and all Ghosts and place them at their starting position
  function addSprites() {
    sprites.forEach(sprite => cells[sprite.startPos].classList.add(`${sprite.name}`))
  }
  addSprites()

  // function to set lives to 3 at the beginning of the game and display lives
  lives = 3
  function addLives() {
    for (let i = 0; i < lives; i++) {
      const life = document.createElement('div')
      life.classList.add('life')
      // life.innerText = i // REMOVE WHEN DONE
      life.id = i
      life.style.width = `${width}px`
      life.style.height = `${width}px`
      remainingLives.append(life)
    }
  }
  addLives()
  blinkyMovement()
}
createGrid()

// startGame() - function to run when the start button is 'clicked'
function startGame() {
  gameRunning = true
  gameState = 1
  // swap to loading screen
  swapScreen(gameState)
  // swap to gameplay screen with a little delay to simulate loading
  setTimeout(function() {
    gameState = 2
    swapScreen(gameState)
  }, 3000)

  createGrid()
}

// handling life loss when Pacman touches a ghost 
function removeLife () {
  // if lives = 0 cue the game over screen and stop the game
  // if lives - 1 > 0, 
  // reduce life by 1
  // restart the level: 
  // all sprites go back to their starting location
}

// movement is enabled by keydown style
// When Pacman changes position (moves) - a value is added to the current position based on the key pressed and updating current position and repeating every time that event happens
function keyPress(evt) { 
  // move() - function to make Pacman move around the screen
  function movePacman(newPosition) {
    if (cells[newPosition].classList.contains('food')) {
      currentScore += 10
      // Remove food screen when Pacman eats it
      cells[newPosition].classList.remove('food')
    } else if (cells[newPosition].classList.contains('powerPellet')) {
      currentScore += 50
      // Remove power pellet from screen when Pacman eats it
      cells[newPosition].classList.remove('powerPellet')
      // TO ADD: vulnerability and bonus mode to chase ghosts add as a function
    }
    currentScoreDisplay.innerText = parseFloat(currentScore)
    cells[newPosition].classList.add('pacman')
  }
  
  // remove() - function to remove Pacman from the previous cell
  function removePacman() {
    cells[sprites[0].currentPos].classList.remove('pacman')
  }
  // remove pacman from current location
  removePacman()
  // listen to which key is pressed and check to ensure the cell to move does not have oob class
  // using zero index which I know is bad but will fix if I have time, just looks ugly and tough to read in long version
  // handles when Pacman is at the right warp on the map
  if (evt.code === 'ArrowRight' && sprites[0].currentPos === 419) {
    sprites[0].currentPos = 392
  // handles when Pacman is at the right warp on the map
  } else if (evt.code === 'ArrowLeft' && sprites[0].currentPos === 392) {
    sprites[0].currentPos = 419
  } else if (evt.code === 'ArrowUp' && !cells[sprites[0].currentPos - stdWidth].classList.contains('oob')) {
    sprites[0].currentPos -= stdWidth
  } else if (evt.code === 'ArrowRight' && !cells[sprites[0].currentPos + 1].classList.contains('oob')) {
    sprites[0].currentPos++
  } else if (evt.code === 'ArrowDown' && !cells[sprites[0].currentPos + stdWidth].classList.contains('oob')) {
    sprites[0].currentPos += stdWidth
  } else if (evt.code === 'ArrowLeft' && !cells[sprites[0].currentPos - 1].classList.contains('oob')) {
    sprites[0].currentPos--
  }
  // move pacman based on the new current position
  movePacman(sprites[0].currentPos)
}

// REREAD AND REWORK RIGHT NOW ITS JUST BAD
function blinkyMovement() {
  // REREAD AND REWORK RIGHT NOW ITS JUST BAD
  function removeBlinky() {
    cells[sprites[1].currentPos].classList.remove('blinky')
  }
  
  // REREAD AND REWORK RIGHT NOW ITS JUST BAD
  function moveBlinky(newPosition) {
    cells[newPosition].classList.add('blinky')
  }
  // choose a random direction
  let activeDirection = null
  // reset the random direction every second
  setInterval(function randomMovement() {
    removeBlinky()
    activeDirection = directions[Math.floor(Math.random() * directions.length)]
    if (activeDirection === 'right' && sprites[1].currentPos === 419) {
      sprites[1].currentPos = 392
    } else if (activeDirection === 'left' && sprites[1].currentPos === 392) {
      sprites[1].currentPos = 419
    } else if (activeDirection === 'up' && !cells[sprites[1].currentPos - stdWidth].classList.contains('oob')) {
      sprites[1].currentPos -= stdWidth
    } else if (activeDirection === 'right' && !cells[sprites[1].currentPos + 1].classList.contains('oob')) {
      sprites[1].currentPos++
    } else if (activeDirection === 'down' && !cells[sprites[1].currentPos + stdWidth].classList.contains('oob')) {
      sprites[1].currentPos += stdWidth
    } else if (activeDirection === 'left' && !cells[sprites[1].currentPos - 1].classList.contains('oob')) {
      sprites[1].currentPos--
    }
    moveBlinky(sprites[1].currentPos)
  }, 300)
}

// Increase currentscore by 10 + if highscore <= currentscore update highscore as well

// Event Listeners
// startbutton.onclick.run startGame eventlistener
// startBtn.addEventListener('click', startGame)
// keystroke listener event that listens for key presses
document.addEventListener('keydown', keyPress)

