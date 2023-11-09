console.log('working')
//!--------------------------Elements-------------------------!//
// All gamestates - these are individual pages and include
// 0: start-menu screen (optional)
// 1: loading screen (optional)
// 2: gameplay-screen (required)
// 3: gameover-screen (required)
// 4: win-screen (optional)
const gameStates = document.querySelectorAll('.gamestate')
const startBtn = document.querySelector('.start-play') // play button - to start gameplay
const mainMenuBtn = document.querySelectorAll('.main-menu') // main menu button - to return to main menu
const gridWrapperWidth = document.querySelector('.grid-wrapper').offsetWidth // grid-wrapper width to create the cells
const grid = document.querySelector('.grid') // grid area to create and append cells into
const currentScoreDisplay = document.querySelector('.current-score .nominal-score') // current-score - to show current score
const remainingFoodDisplay = document.querySelector('.remaining-food .nominal-score') // remaining food - to show remaining food on the grid
const lostScoreDisplay = document.querySelector('.lost-score .nominal-score') // final-score on losing - to show final score
const wonScoreDisplay = document.querySelector('.won-score .nominal-score') // final-score on losing - to show final score
const highScoreDisplay = document.querySelectorAll('.high-score .nominal-score') // high-score - to fetch and show the high score from localstorage
const remainingLives = document.querySelector('.lives-remaining') // available lives area to manipulate how many lives the player has
const ready = document.querySelector('.floating-ready') // READY! disclaimer to display or not at game start
const mute = document.querySelector('.mute') // mute button

//!--------------------------Variables-------------------------!//
let musicState = true // music is toggled on on page load
let currentScore = 0 // the actual current score value
let remainingFood = null // the actual count of available food on the screen
let finalScore = null // the actual current score value
let highScore = 0 // high score value
let cells = [] // cells - every individual cell that's created with the createGrid() function
const powerUpDuration = 10 // duration of power up mode when you eat a power pellet
let powerUpState = false // power up mode checker for logic
let lives = null // available lives at pageload
let gameState = 0 // on page load we start on the start-menu game state 0
let gameRunning = false // boolean to help with other functions checking to see if the game is running or not

// Directions array to use for random ghost movement
// 0: up
// 1: right
// 2: down
// 3: left
const directions = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']
const enemySpeed = 100 // Interval variable dictating ghost movement speed
const stdWidth = 28 // standard Pacman maze width and height ratios
const stdHeight = 31 /// standard Pacman maze width and height ratios
const width = gridWrapperWidth / stdWidth // the width and height of our cells dynamically created based on screen size
const cellCount = stdHeight * stdWidth // cell count - how many grid cells we need to create

// Out of bounds areas in the maze indexed from top left to bottom right (would've done with canvas if allowed :))
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

// All sprites and their characteristics in an array of objects (should'food here, next time!)
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

function swapScreen(gameState) { // screen swapper to move from screen to screen
  // hide all screens
  gameStates.forEach(state => state.classList.add('hidden'))
  // show the active screen
  gameStates[gameState].classList.remove('hidden')
}

function startGame() { // startGame() - function to start the game upon start button 'click'
  clearInterval(musicInterval) // stop active music
  gameState = 1 // change to loading screen gamestate
  swapScreen(gameState) // swap to loading screen
  setTimeout(function() { // swap to gameplay screen with a little delay to simulate loading
    gameState = 2
    swapScreen(gameState)
  }, 2500)
  setTimeout(function() { // time delay to get the player ready to start
    gameRunning = true
    ready.classList.add('hidden') // hide the READY! disclaimer
    playMusic(gameState, 0)
  }, 5500)
  createGrid() // function to create grid where the game will be played 
  randomMovement() // start making the ghosts move randomly on the map
}


function createGrid() { //creates a grid where the game will be played
  function generateBounds() { // creates a grid of cells
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div') // create individual divs for each cell
      cell.id = i
      cell.style.width = `${width}px`
      cell.style.height = `${width}px`
      cell.classList.add('cell') // adds ".cell" class to all the created divs
      cells.push(cell) // add each cell to an array
      grid.append(cell) // add each cell to the screen
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
  
  function addFoodAndPellets() { // adds food and power pellets to the grid
    cells.forEach(cell => !cell.classList.contains('oob') ? cell.classList.add('food') : '') // if a cell is not out of bounds add food (to be tweaked later in the code)
    cells[349].classList.remove('food') // remove food from starting positions of sprites
    cells[350].classList.remove('food') // remove food from starting positions of sprites
    cells[657].classList.remove('food') // remove food from starting positions of sprites
    for (let i = 375; i < 432; i += 28) { // remove  food from Ghost nest
      for (let j = 0; j < 6; j++) {
        cells[i + j].classList.remove('food')
      }
    }
    const powerPellets = [85, 110, 645, 670] // defining location of power pellets
    powerPellets.forEach(pellet => cells[pellet].classList.remove('food')) // remove food where power pellets will be placed
    powerPellets.forEach(pellet => cells[pellet].classList.add('powerPellet')) // add power pellets to the map
    cells.forEach(cell => cell.classList.contains('food') ? remainingFood++ : '') // counting and adding foods to remaining food count
    cells.forEach(cell => cell.classList.contains('powerPellet') ? remainingFood++ : '') // counting and adding power pellets to remaining food count
  }
  addFoodAndPellets()

  addSprites() // creates Pacman and all Ghosts and place them at their starting position

  lives = 3
  function addLives() {// sets lives to 3 at the beginning of the game and display lives
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


function resetGrid() { // clears the grid to enable recreation at new gameplay
  cells.forEach(cell => cell.remove()) // Remove previously created cell divs
  cells = [] // empty the cells array to be able to add the new cells upon new game
  currentScore = 0 // reset current score to 0 and display it
  currentScoreDisplay.innerText = 0 // display it
  remainingLives.innerHTML = '' // remove lives from remaining lives div
  remainingFood = 0 // reset remaining food
  remainingFoodDisplay.innerText = remainingFood // display it
}

function keyPress(evt) { //handles pacman movement
  if (gameRunning === false) return // check game is running
  removePacman(evt.code) // remove pacman from previous location
  if (evt.code === 'ArrowRight' && sprites[0].currentPos === 419) { 
    sprites[0].currentPos = 392 // warps pacman to the left of screen when pacman is at the right warp
  } else if (evt.code === 'ArrowLeft' && sprites[0].currentPos === 392) { 
    sprites[0].currentPos = 419 // warps pacman to the right of screen when pacman is at the left warp
  } else if (evt.code === 'ArrowUp' && !cells[sprites[0].currentPos - stdWidth].classList.contains('oob')) {
    sprites[0].currentPos -= stdWidth // move up
  } else if (evt.code === 'ArrowRight' && !cells[sprites[0].currentPos + 1].classList.contains('oob')) {
    sprites[0].currentPos++ // move right
  } else if (evt.code === 'ArrowDown' && !cells[sprites[0].currentPos + stdWidth].classList.contains('oob')) {
    sprites[0].currentPos += stdWidth // move down
  } else if (evt.code === 'ArrowLeft' && !cells[sprites[0].currentPos - 1].classList.contains('oob')) {
    sprites[0].currentPos-- // move left
  }
  movePacman(sprites[0].currentPos, evt.code) // move pacman based on the new current position
}

function movePacman(newPosition, direction) { // make Pacman move around the screen given new position and direction
  if (cells[newPosition].classList.contains('ghost')) { // check ghost collision
    const touchedGhost = sprites.findIndex((sprite => cells[newPosition].classList.contains(sprite.name))) // find which ghost is collided
    if (powerUpState === true) { // if pacman is in powerup mode
      currentScore += 200 // increase score by 200
      removeSpecificGhost(touchedGhost, newPosition) // ghost is removed from location and returned to starting position
    } else {
      removeLife() // remove a life
      if (lives === 0) { // if 0 life left cue game over (this code repeats and for the life of me I couldn't refactor)
        gameOver()
        return
      } else {
        restartLevel() // if > 0 cue restart the level function
        return
      }
    }
  } else if (cells[newPosition].classList.contains('food')) { // check food collision
    currentScore += 10 // increase score
    remainingFood-- // decrease remaining food
    cells[newPosition].classList.remove('food') // remove food from screen
    playSound(audios[8][8]) // play food eating sound
  } else if (cells[newPosition].classList.contains('powerPellet')) { // check power pellet collision
    currentScore += 50 // increase score
    remainingFood-- // decrease remaining food
    playSound(audios[9][9]) // play power pellet eating sound
    powerUpMode() // go into powerUpMode
    cells[newPosition].classList.remove('powerPellet') // remove power pellet from screen
  }
  highScoreCheck() // check if current score > higherscore
  winCheck() // check if game is won
  currentScoreDisplay.innerText = parseFloat(currentScore) // increase score display
  remainingFoodDisplay.innerText = parseFloat(remainingFood) // reduce remaining food display
  cells[newPosition].classList.add('pacman', `${direction}`) // add pacman sprite to new cell
}

function winCheck () { //check if game is won
  if (remainingFood === 0) { // win condition is no food remains
    clearInterval(musicInterval) // stop current music
    highScoreCheck() // check if current score > higherscore
    gameRunning = false // stop running the game
    gameState = 4 // change the gameState to winscreen
    swapScreen(gameState) // swap to win screen
    playSound(audios[11][11]) // play game won music
    finalScore = currentScore // set current score to final score
    wonScoreDisplay.innerText = finalScore // show final score
    removeGhosts() // remove ghosts from map
    removePacman(sprites[0].currentPos) // remove pacman from map
    sprites.forEach(sprite => sprite.currentPos = sprite.startPos) // return everyone to starting position
    resetGrid() // reset the grid
  }
}

function powerUpMode() { // Pacman goes into powerup mode
  powerUpState = true
  playSound(audios[10][10]) // play power up mode sound
  setTimeout(() => { //deactivate powerup after its duration
    powerUpState = false
  }, powerUpDuration * 1000)
}

function removePacman(prevDir) { // removes Pacman from previous cell
  cells[sprites[0].currentPos].classList.remove('pacman','player',`${prevDir}`)
}

function removeGhosts() { // Removes all the ghosts from the screen pretty hardcoded will check later
  cells[sprites[1].currentPos].classList.remove('blinky','ghost')
  cells[sprites[2].currentPos].classList.remove('pinky','ghost')
  cells[sprites[3].currentPos].classList.remove('inky','ghost')
  cells[sprites[4].currentPos].classList.remove('clyde','ghost')
}

// // !
// function ghostMovement(ghostNumber) {
//   function removeGhost() { // removes ghost from previous cell
//     cells[sprites[ghostNumber].currentPos].classList.remove(`${sprites[ghostNumber].name}`,'ghost','vulnerable')
//   }
//   removeGhost() 


// }


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

function highScoreCheck() { //check if current score > highscore, update highscore
  if (currentScore > parseInt(localStorage.getItem('highscore'))) {
    highScore = currentScore // set the new highscore
    highScoreDisplay.forEach(display => display.innerText = highScore) // update highscore display
    localStorage.setItem('highscore', highScore) // update highscore localstorage
  }
}

function toggleMusic () {
  if (musicState === true) {
    activeTune.volume = 0
    musicState = false
  } else {
    activeTune.volume = 0.1
    musicState = true
  }
}

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

function playSound(src) { // plays a single sound
  const sound = new Audio(src)
  sound.volume = 0.05
  sound.play()
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

// mutebutton listener to mute all sound and music
mute.addEventListener('click', toggleMusic)
//!--------------------------Page Load-------------------------!//
// hide all screens and only show main menu upon page load
swapScreen(gameState)

// function to play relevant audio given an index
let activeTune
let musicInterval

function playMusic (audioNumber, frequency) {
  activeTune = new Audio(audios[audioNumber][audioNumber])
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

localStorage.setItem('highscore',highScore)
highScoreDisplay.forEach(display => display.innerText = currentScore)
