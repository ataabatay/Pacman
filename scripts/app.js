console.log('working')

//!--------------------------Elements-------------------------!//
// All gamestates - these are individual pages and include
// 0: start-menu screen (optional)
// 1: loading screen (optional)
// 2: gameplay-screen (required)
// 3: gameover-screen (required)
// 4: win-screen (optional)
const gameStates = document.querySelectorAll('.gamestate')

// play button - to start gameplay
const startBtn = document.querySelector('.start-play')

// main menu button - to return to main menu
const mainMenuBtn = document.querySelectorAll('.main-menu')

// grid-wrapper width to create the cells
const gridWrapperWidth = document.querySelector('.grid-wrapper').offsetWidth

// grid area to create and append cells into
const grid = document.querySelector('.grid')

// current-score - to show current score
const currentScoreDisplay = document.querySelector('.current-score .nominal-score')

// remaining food - to show remaining food on the grid
const remainingFoodDisplay = document.querySelector('.remaining-food .nominal-score')

// final-score on losing - to show final score
const lostScoreDisplay = document.querySelector('.lost-score .nominal-score')

// final-score on losing - to show final score
const wonScoreDisplay = document.querySelector('.won-score .nominal-score')

// high-score - to fetch and show the high score from localstorage
const highScoreDisplay = document.querySelectorAll('.high-score .nominal-score')

// available lives area to manipulate how many lives the player has
const remainingLives = document.querySelector('.lives-remaining')

// READY! disclaimer to display or not
const ready = document.querySelector('.floating-ready')

//!--------------------------Variables-------------------------!//
let currentScore = 0 // the actual current score value
let remainingFood = null // the actual count of available food on the screen
let finalScore = null // the actual current score value
let highScore = 0 // high score value
let cells = [] // cells - every individual cell that's created with the createGrid() function
const powerUpDuration = 10 // duration of power up mode when you eat a power pellet
let powerUpState = false // power up mode checker for logic

// Directions array to use for random ghost movement
// 0: up
// 1: right
// 2: down
// 3: left
const directions = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']

// !CHANGE THIIIIS!
const enemySpeed = 100 // Interval variable dictating ghost movement speed

let lives = null // available lives

// gameState - this will be the global variable that's deciding which screen is being shown
// 0: start-menu screen (optional)
// 1: loading screen (optional)
// 2: gameplay-screen (required)
// 3: gameover-screen (required)
// 4: win-screen (optional)
let gameState = 0 // on page load we start on the start-menu

let gameRunning = false // gameRunning - boolean to help with other functions checking to see if the game is running or not

// standard Pacman maze width and height ratios
const stdWidth = 28 // this will be the base variable we use to decide how many grid cells to create
const stdHeight = 31 // this will be the base variable we use to decide how many rows of cells we're going to create

const width = gridWrapperWidth / stdWidth // the width and height of our cells dynamically created based on screen size
const cellCount = stdHeight * stdWidth // cell count - how many grid cells we need to create

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
    nature: 'player',
    startingLook: 'ArrowLeft',
    startPos: 657,
    currentPos: 657,
  },
  {
    name: 'blinky',
    nature: 'ghost',
    startingLook: 'ArrowUp',
    startPos: 322,
    currentPos: 322,
    vulnerable: false,
  },
  {
    name: 'pinky',
    nature: 'ghost',
    startingLook: 'ArrowRight',
    startPos: 349,
    currentPos: 349,
    vulnerable: false,
  },
  {
    name: 'inky',
    nature: 'ghost',
    startingLook: 'ArrowDown',
    startPos: 404,
    currentPos: 404,
    vulnerable: false,
  },
  {
    name: 'clyde',
    nature: 'ghost',
    startingLook: 'ArrowLeft',
    startPos: 407,
    currentPos: 407,
    vulnerable: false,
  }
]

// All audio files
const audios = [
  { 0: '../sounds/intro.wav' },
  { 1: '../sounds/waitingx.wav' }, // not used was a bit too much
  { 2: '../sounds/gameplaysiren.wav' },
  { 3: '../sounds/eat.wav' },
  { 4: '../sounds/eatghost.wav' },
  { 5: '../sounds/death.wav' },
  { 6: '../sounds/munch.wav' },
  { 7: '../sounds/munch2.wav' },
  { 8: '../sounds/credit.wav' },
  { 9: '../sounds/eatpowerpellet.wav' },
  { 10: '../sounds/powerpelletsong.wav' },
  { 11: '../sounds/winscreen.wav' }
]

//!--------------------------Functions-------------------------!//
// screen swapper to move from screen to screen
function swapScreen(gameState) {
  // hide all screens to decide which one to show later
  gameStates.forEach(state => state.classList.add('hidden'))
  // show the relevant screen
  gameStates[gameState].classList.remove('hidden')
}

// startGame() - function to start the game upon start button 'click'
function startGame() {
  clearInterval(musicInterval)
  gameState = 1
  // playMusic(gameState)
  // swap to loading screen
  swapScreen(gameState)
  // swap to gameplay screen with a little delay to simulate loading
  setTimeout(function() {
    gameState = 2
    swapScreen(gameState)
  }, 2500)
  // time delay to get the player ready to start
  setTimeout(function() {
    gameRunning = true
    ready.classList.add('hidden')
    playMusic(gameState, 0)
  }, 5500)
  createGrid()
  randomMovement()
}

// createGrid() - function to create a grid where the game will be played
function createGrid() {
  function generateBounds() {
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
  }
  generateBounds()
  
  // function to add food and power pellets to the grid
  function addFoodAndPellets() {
  // creates food for Pacman on the available cells
  // adds ".food" class to all the cell divs where food will be
    cells.forEach(cell => !cell.classList.contains('oob') ? cell.classList.add('food') : '')
    // remove the food classes from Ghost nest + starting position as there are not meant to be any food
    cells[349].classList.remove('food')
    cells[350].classList.remove('food')
    cells[657].classList.remove('food')
    for (let i = 375; i < 432; i += 28) {
      for (let j = 0; j < 6; j++) {
        cells[i + j].classList.remove('food')
      }
    }
    // adds power pellets to the map
    // removes food and adds ".powerPellet" class to the cell divs where power pellets will be placed
    // coordintes of the powerPellets
    const powerPellets = [85, 110, 645, 670]
    powerPellets.forEach(pellet => cells[pellet].classList.remove('food'))
    powerPellets.forEach(pellet => cells[pellet].classList.add('powerPellet'))

    // !!CHANGE THIS BACK!! //
    // set the remainingFood so we can track and decide if the game is won or not
    cells.forEach(cell => cell.classList.contains('food') ? remainingFood++ : '')
    cells.forEach(cell => cell.classList.contains('powerPellet') ? remainingFood++ : '')
  }
  addFoodAndPellets()

  // function to create Pacman and all Ghosts and place them at their starting position
  addSprites()

  // function to set lives to 3 at the beginning of the game and display lives
  lives = 3
  function addLives() {
    for (let i = 0; i < lives; i++) {
      const life = document.createElement('div')
      life.style.width = `${width}px`
      life.style.height = `${width}px`
      life.classList.add('life')
      remainingLives.append(life)
    }
  }
  addLives()
}
// createGrid()

// clearGrid() - function to clear the grid for the new gameplay
function resetGrid() {
  // Remove all previously created divs
  cells.forEach(cell => cell.remove())
  cells = []

  // reset current score to 0 and display it
  currentScore = 0
  currentScoreDisplay.innerText = 0
  
  // Reset lives to 0
  remainingLives.innerHTML = ''

  // Reset remaining food to 0 and display it
  remainingFood = 0
  remainingFoodDisplay.innerText = remainingFood
}

// movement is enabled by keydown style
// When Pacman changes position (moves) - a value is added to the current position based on the key pressed and updating current position and repeating every time that event happens
function keyPress(evt) {
  if (gameRunning === true) {
    // remove pacman from current location
    removePacman(evt.code)
    // listen to which key is pressed and check to ensure the cell to move does not have oob class
    // using zero index which I know is bad but will fix if I have time, just looks ugly and tough to read in long version
    // handles when Pacman is at the right warp on the map
    if (evt.code === 'ArrowRight' && sprites[0].currentPos === 419) {
      sprites[0].currentPos = 392
    // handles when Pacman is at the left warp on the map
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
    movePacman(sprites[0].currentPos, evt.code)
  }
}

function winCheck () {
  if (remainingFood === 0) {
    clearInterval(musicInterval)
    highScoreCheck()
    clearInterval(interval)
    clearInterval(realityChecker)
    // stop running the game
    gameRunning = false
    // change the gameState to won
    gameState = 4
    // swap to win screen
    swapScreen(gameState)
    // play game won music
    const winSound = new Audio(audios[11][11])
    winSound.volume = 0.2
    winSound.play()
    // set current score to final score
    finalScore = currentScore
    // show final score
    wonScoreDisplay.innerText = finalScore
    // pacman returns to initial position
    // ghosts return to initial position
    removeGhosts()
    removePacman()
    // reset current position of all sprites to starting position
    sprites.forEach(sprite => sprite.currentPos = sprite.startPos)
    resetGrid()
  }
}

// move() - function to make Pacman move around the screen
function movePacman(newPosition, direction) {
  // If Pacman ends on a location with a class a ghost
  if (cells[newPosition].classList.contains('ghost')) {
    // IF PACMAN TOUCHES A GHOST WHEN PACMAN IS IN POWER UP MODE //
    // find which ghost is touched
    let touchedGhost = sprites.findIndex((sprite => cells[newPosition].classList.contains(sprite.name)))
    console.log(touchedGhost)
    if (powerUpState === true) {
      // increase score by 200 (later to be implemented each ghost eaten in succession increases the score by double)
      currentScore += 200
      // ghost is removed from location
      // ghost gets out of vulnerable mode
      // ghost is returned to starting position
      removeSpecificGhost(touchedGhost, newPosition)
    } else {
    // remove a life
      removeLife()
      console.log(`Pacman touched a ghost => ${lives} lives remain`)
      // check how many lives are left if 0 cue the game over function
      if (lives === 0) {
        gameOver()
        return
      } else {
        restartLevel() // if > 0 cue restart the level function
        return
      }
    }
  } else if (cells[newPosition].classList.contains('food')) {
    currentScore += 10
    remainingFood--
    // Remove food screen when Pacman eats it
    cells[newPosition].classList.remove('food')
    // play munching sound
    const munchSound = new Audio(audios[8][8])
    munchSound.volume = 0.05
    munchSound.play()
  } else if (cells[newPosition].classList.contains('powerPellet')) {
    currentScore += 50
    remainingFood--
    // play eating power pellet sound
    const munchSound = new Audio(audios[9][9])
    munchSound.volume = 0.05
    munchSound.play()
    powerUpMode()
    // Remove power pellet from screen when Pacman eats it
    cells[newPosition].classList.remove('powerPellet')
    // TO ADD: vulnerability and bonus mode to chase ghosts add as a function
  }
  highScoreCheck()
  winCheck()
  currentScoreDisplay.innerText = parseFloat(currentScore)
  remainingFoodDisplay.innerText = parseFloat(remainingFood)
  cells[newPosition].classList.add('pacman', `${direction}`)

// If Pacman ends on a location with power pellet
// increase score by 50
// remove power pellet from the screen
// add .vulnerable class to all the ghosts
// when ghosts are in vulnerable state:
// pacman can eat ghosts as if they're food and gain 200 points
// an eaten ghost:
  // returns to starting point
  // vulnerable state is removed
  // restarts the chase
}

// function to get Pacman invincible mode ---- TO BE DONE
function powerUpMode() {
  powerUpState = true
  console.log('Power Up Active')
  // play power up mode song
  const powerUpModeSong = new Audio(audios[10][10])
  powerUpModeSong.volume = 0.05
  powerUpModeSong.play()
  setTimeout(() => {
    powerUpState = false
    console.log('Power Up Deactivated')
  }, powerUpDuration * 1000)
}

// remove() - function to remove Pacman from the previous cell
function removePacman(prevDir) {
  cells[sprites[0].currentPos].classList.remove('pacman','player',`${prevDir}`)
}

// Ghosts AI to be REREAD AND REWORK RIGHT NOW ITS JUST BAD
function blinkyMovement() {
  // REREAD AND REWORK RIGHT NOW ITS JUST BAD
  function removeBlinky() {
    cells[sprites[1].currentPos].classList.remove('blinky', 'ghost', 'vulnerable')
  }
  removeBlinky()
  
  // choose a random direction
  let activeDirection = null
  
  // adjusting the current position based on the random direction chosen for ghost to move to
  activeDirection = directions[Math.floor(Math.random() * directions.length)]
  if (activeDirection === 'ArrowRight' && sprites[1].currentPos === 419) {
    sprites[1].currentPos = 392
  } else if (activeDirection === 'ArrowLeft' && sprites[1].currentPos === 392) {
    sprites[1].currentPos = 419
  } else if (activeDirection === 'ArrowUp' && !cells[sprites[1].currentPos - stdWidth].classList.contains('oob')) {
    sprites[1].currentPos -= stdWidth
  } else if (activeDirection === 'ArrowRight' && !cells[sprites[1].currentPos + 1].classList.contains('oob')) {
    sprites[1].currentPos++
  } else if (activeDirection === 'ArrowDown' && !cells[sprites[1].currentPos + stdWidth].classList.contains('oob')) {
    sprites[1].currentPos += stdWidth
  } else if (activeDirection === 'ArrowLeft' && !cells[sprites[1].currentPos - 1].classList.contains('oob')) {
    sprites[1].currentPos--
  }

  // REREAD AND REWORK RIGHT NOW ITS JUST BAD
  function moveBlinky(newPosition) {
    if (cells[newPosition].classList.contains('pacman')) {
      // !IF BLINKY TOUCHES PACMAN WHEN PACMAN IS IN POWER UP MODE! //
      if (powerUpState === true) {
        // ghost is removed from location
        removeBlinky()
        // ghost gets out of vulnerable mode 
        cells[newPosition].classList.remove('vulnerable')
        // ghost is returned to starting position
        sprites[1].currentPos = sprites[1].startPos
      } else {
        // remove a life
        removeLife()
        console.log(`Blinky touched Pacman => ${lives} lives remain`)
        // check how many lives are left if 0 cue the game over function
        if (lives === 0) {
          gameOver()
          return
        } else {
          restartLevel() // if > 0 cue restart the level function
          return
        }
      }
    } else {
      if (powerUpState === true) {
        cells[newPosition].classList.add('blinky')
        cells[newPosition].classList.add('ghost')
        cells[newPosition].classList.add('vulnerable')
      } else {
        cells[newPosition].classList.add('blinky')
        cells[newPosition].classList.add('ghost')
      }
    }
  }
  moveBlinky(sprites[1].currentPos)
}

function pinkyMovement() {  
  // REREAD AND REWORK RIGHT NOW ITS JUST BAD
  function removePinky() {
    cells[sprites[2].currentPos].classList.remove('pinky','ghost','vulnerable')
  }
  removePinky()
  
  // choose a random direction
  let activeDirection = null

  // adjusting the current position based on the random direction chosen for ghost to move to
  activeDirection = directions[Math.floor(Math.random() * directions.length)]
  if (activeDirection === 'ArrowRight' && sprites[2].currentPos === 419) {
    sprites[2].currentPos = 392
  } else if (activeDirection === 'ArrowLeft' && sprites[2].currentPos === 392) {
    sprites[2].currentPos = 419
  } else if (activeDirection === 'ArrowUp' && !cells[sprites[2].currentPos - stdWidth].classList.contains('oob')) {
    sprites[2].currentPos -= stdWidth
  } else if (activeDirection === 'ArrowRight' && !cells[sprites[2].currentPos + 1].classList.contains('oob')) {
    sprites[2].currentPos++
  } else if (activeDirection === 'ArrowDown' && !cells[sprites[2].currentPos + stdWidth].classList.contains('oob')) {
    sprites[2].currentPos += stdWidth
  } else if (activeDirection === 'ArrowLeft' && !cells[sprites[2].currentPos - 1].classList.contains('oob')) {
    sprites[2].currentPos--
  }


  // REREAD AND REWORK RIGHT NOW ITS JUST BAD
  function movePinky(newPosition) {
    if (cells[newPosition].classList.contains('pacman')) {
      // !IF PINKY TOUCHES PACMAN WHEN PACMAN IS IN POWER UP MODE! //
      if (powerUpState === true) {
        // ghost is removed from location
        removePinky()
        // ghost gets out of vulnerable mode 
        cells[newPosition].classList.remove('vulnerable')  
        // ghost is returned to starting position
        sprites[2].currentPos = sprites[2].startPos
      } else {
        // remove a life
        removeLife()
        console.log(`Pinky touched Pacman => ${lives} lives remain`)
        // check how many lives are left if 0 cue the game over function
        if (lives === 0) {
          gameOver()
          return
        } else {
          restartLevel() // if > 0 cue restart the level function
          return
        }
      }
    } else {
      if (powerUpState === true) {
        cells[newPosition].classList.add('pinky')
        cells[newPosition].classList.add('ghost')
        cells[newPosition].classList.add('vulnerable')
      } else {
        cells[newPosition].classList.add('pinky')
        cells[newPosition].classList.add('ghost')
      }
    }
  }
  movePinky(sprites[2].currentPos)
}

function inkyMovement() {  
  // REREAD AND REWORK RIGHT NOW ITS JUST BAD
  function removeInky() {
    cells[sprites[3].currentPos].classList.remove('inky','ghost','vulnerable')
  }
  removeInky()
  
  // choose a random direction
  let activeDirection = null

  // adjusting the current position based on the random direction chosen for ghost to move to
  activeDirection = directions[Math.floor(Math.random() * directions.length)]
  if (activeDirection === 'ArrowRight' && sprites[3].currentPos === 419) {
    sprites[3].currentPos = 392
  } else if (activeDirection === 'ArrowLeft' && sprites[3].currentPos === 392) {
    sprites[3].currentPos = 419
  } else if (activeDirection === 'ArrowUp' && !cells[sprites[3].currentPos - stdWidth].classList.contains('oob')) {
    sprites[3].currentPos -= stdWidth
  } else if (activeDirection === 'ArrowRight' && !cells[sprites[3].currentPos + 1].classList.contains('oob')) {
    sprites[3].currentPos++
  } else if (activeDirection === 'ArrowDown' && !cells[sprites[3].currentPos + stdWidth].classList.contains('oob')) {
    sprites[3].currentPos += stdWidth
  } else if (activeDirection === 'ArrowLeft' && !cells[sprites[3].currentPos - 1].classList.contains('oob')) {
    sprites[3].currentPos--
  }

  // REREAD AND REWORK RIGHT NOW ITS JUST BAD
  function moveInky(newPosition) {
    if (cells[newPosition].classList.contains('pacman')) {
      // !IF INKY TOUCHES PACMAN WHEN PACMAN IS IN POWER UP MODE! //
      if (powerUpState === true) {
        // ghost is removed from location
        removeInky()
        // ghost gets out of vulnerable mode 
        cells[newPosition].classList.remove('vulnerable')
        // ghost is returned to starting position
        sprites[2].currentPos = sprites[2].startPos
      } else {
        // remove a life
        removeLife()
        console.log(`Inky touched Pacman => ${lives} lives remain`)
        // check how many lives are left if 0 cue the game over function
        if (lives === 0) {
          gameOver()
          return
        } else {
          restartLevel() // if > 0 cue restart the level function
          return
        }
      }
    } else {
      if (powerUpState === true) {
        cells[newPosition].classList.add('inky')
        cells[newPosition].classList.add('ghost')
        cells[newPosition].classList.add('vulnerable')
      } else {
        cells[newPosition].classList.add('inky')
        cells[newPosition].classList.add('ghost')
      }
    }
  }
  moveInky(sprites[3].currentPos)
}

function clydeMovement() {  
  // REREAD AND REWORK RIGHT NOW ITS JUST BAD
  function removeClyde() {
    cells[sprites[4].currentPos].classList.remove('clyde','ghost','vulnerable')
  }
  removeClyde()
  
  // choose a random direction
  let activeDirection = null

  // adjusting the current position based on the random direction chosen for ghost to move to
  activeDirection = directions[Math.floor(Math.random() * directions.length)]
  if (activeDirection === 'ArrowRight' && sprites[4].currentPos === 419) {
    sprites[4].currentPos = 392
  } else if (activeDirection === 'ArrowLeft' && sprites[4].currentPos === 392) {
    sprites[4].currentPos = 419
  } else if (activeDirection === 'ArrowUp' && !cells[sprites[4].currentPos - stdWidth].classList.contains('oob')) {
    sprites[4].currentPos -= stdWidth
  } else if (activeDirection === 'ArrowRight' && !cells[sprites[4].currentPos + 1].classList.contains('oob')) {
    sprites[4].currentPos++
  } else if (activeDirection === 'ArrowDown' && !cells[sprites[4].currentPos + stdWidth].classList.contains('oob')) {
    sprites[4].currentPos += stdWidth
  } else if (activeDirection === 'ArrowLeft' && !cells[sprites[4].currentPos - 1].classList.contains('oob')) {
    sprites[4].currentPos--
  }

  // REREAD AND REWORK RIGHT NOW ITS JUST BAD
  function moveClyde(newPosition) {
    if (cells[newPosition].classList.contains('pacman')) {
      // !IF CLYDE TOUCHES PACMAN WHEN PACMAN IS IN POWER UP MODE! //
      if (powerUpState === true) {
        // ghost is removed from location
        removeClyde()
        // ghost gets out of vulnerable mode 
        cells[newPosition].classList.remove('vulnerable')
        // ghost is returned to starting position
        sprites[4].currentPos = sprites[4].startPos
      } else {
        // remove a life
        removeLife()
        console.log(`Clyde touched Pacman => ${lives} lives remain`)
        // check how many lives are left if 0 cue the game over function
        if (lives === 0) {
          gameOver()
          return
        } else {
          restartLevel() // if > 0 cue restart the level function
          return
        }
      }
    } else {
      if (powerUpState === true) {
        cells[newPosition].classList.add('clyde')
        cells[newPosition].classList.add('ghost')
        cells[newPosition].classList.add('vulnerable')
      } else {
        cells[newPosition].classList.add('clyde')
        cells[newPosition].classList.add('ghost')
      }
    }
  }
  moveClyde(sprites[4].currentPos)
}

// function to restart level if there are sufficient remaining lives
function restartLevel() {
  clearInterval(musicInterval)
  // play death sound
  const deathSound = new Audio(audios[5][5])
  deathSound.volume = 0.05
  deathSound.play()
  // set the game to not run until it's run again
  gameRunning = false
  // pacman returns to initial position
  // ghosts return to initial position
  removeGhosts()
  removePacman()
  // reset current position of all sprites to starting position
  sprites.forEach(sprite => sprite.currentPos = sprite.startPos)
  addSprites()
  ready.classList.remove('hidden')
  
  // - timeout for delayed start (2s), continue game as normal
  setTimeout(() => {
    gameRunning = true
    ready.classList.add('hidden')
    playMusic(gameState, 0)
  }, 3000)
}

// function to handle when the game is over
function gameOver() {
  console.log(activeTune)
  clearInterval(musicInterval)
  highScoreCheck()
  clearInterval(interval)
  console.log('Game Over!')
  // set gamerunning to false 
  gameRunning = false
  // change screen to gameover screen
  gameState = 3
  // swap to gameover screen
  swapScreen(gameState)
  // play death sound
  const gameOverSound = new Audio(audios[5][5])
  gameOverSound.volume = 0.2
  gameOverSound.play()
  // set current score to final score
  finalScore = currentScore
  // show final score
  activeTune = null
  lostScoreDisplay.innerText = finalScore  
    // pacman returns to initial position
  // ghosts return to initial position
  removeGhosts()
  removePacman()
  // reset current position of all sprites to starting position
  sprites.forEach(sprite => sprite.currentPos = sprite.startPos)
  resetGrid()
  clearInterval(realityChecker)
}

// function to create Pacman and all Ghosts and place them at their starting position
function addSprites() {
  sprites.forEach(sprite => cells[sprite.startPos].classList.add(`${sprite.name}`,`${sprite.nature}`,`${sprite.startingLook}`))
}

// Removes all the ghosts from the screen pretty hardcoded will check later
function removeGhosts() {
  cells[sprites[1].currentPos].classList.remove('blinky','ghost')
  cells[sprites[2].currentPos].classList.remove('pinky','ghost')
  cells[sprites[3].currentPos].classList.remove('inky','ghost')
  cells[sprites[4].currentPos].classList.remove('clyde','ghost')
}

function removeSpecificGhost(touchedGhost, newPosition) {
  cells[newPosition].classList.remove(`${sprites[touchedGhost].name}`,'ghost','vulnerable')
  sprites[touchedGhost].currentPos = sprites[touchedGhost].startPos
}

function removeLife() {
  // remove one life
  lives--

  if (lives !== 0) {
    // fetch individual available lives created in the createGrid function  
    const lifeIcons = document.querySelectorAll('.life')
    // no need to check if we have more than 0 lives as if that was the case this function wouldn't have been run
    // remove one of the life divs simulating loss of 1 life
    remainingLives.removeChild(lifeIcons[0])
  }
}

// function to check if the current score is higher than highscore and update highscore
function highScoreCheck() {
  // the actual high score value stored
  if (currentScore > parseInt(localStorage.getItem('highscore'))) {
    // set the new highscore
    highScore = currentScore
    // update the visuals for highscore
    highScoreDisplay.forEach(display => display.innerText = highScore)
    localStorage.setItem('highscore', highScore)
  }
}

//!--------------------------Event Listeners-------------------------!//
// startbutton.onclick.run startGame eventlistener
startBtn.addEventListener('click', startGame)
// mainmenubutton.onclick.return mainmenu eventlistener
mainMenuBtn.forEach(btn => {
  btn.addEventListener('click', function() {
    swapScreen(0)
  })
})
// keystroke listener event that listens for key presses
document.addEventListener('keydown', keyPress)

//!--------------------------Page Load-------------------------!//
// hide all screens and only show main menu upon page load
swapScreen(gameState)

// function to play relevant audio given an index
let activeTune
let musicInterval

function playMusic (audioNumber, frequency) {
  activeTune = new Audio(audios[audioNumber][audioNumber])
  console.log(activeTune)
  console.log(gameState)
  activeTune.volume = 0.1
  musicInterval  = setInterval(() => {
    activeTune.play()
  }, frequency)
}

// play the intro tune until start button is clicked
// playing intro tune on page load once it goes into a loop there after
const introTune = new Audio(audios[0][0])
introTune.volume = 0.1
introTune.play()
playMusic(gameState,5000)

// functions to move the ghosts around the grid randomly (pretty bad ai for now)
let interval

function randomMovement() {
  setTimeout(() => {
    interval = setInterval(() => {
      if (gameRunning === true) {
        blinkyMovement()
        pinkyMovement()
        inkyMovement()
        clydeMovement()
      }
    }, enemySpeed)
  }, 2000)
}

// Reality checker
const realityChecker = setInterval(() => {
  console.log(gameRunning)
  console.log(musicInterval)
  // const introSound = new Audio('../sounds/intro.wav').play()
}, 1000)

localStorage.setItem('highscore',highScore)
highScoreDisplay.forEach(display => display.innerText = currentScore)
