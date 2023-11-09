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
const powerUpDuration = 10 // duration of power up mode when you eat a power pellet

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
    height: 3,
  },
  {
    start: 353,
    width: 1,
    height: 3,
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
    direction: 'ArrowLeft',
    startPos: 657,
    currentPos: 657,
  },
  {
    name: 'blinky',
    nature: 'ghost',
    direction: 'ArrowUp',
    startPos: 322,
    currentPos: 322,
    vulnerable: false,
  },
  {
    name: 'pinky',
    nature: 'ghost',
    direction: 'ArrowRight',
    startPos: 349,
    currentPos: 349,
    vulnerable: false,
  },
  {
    name: 'inky',
    nature: 'ghost',
    direction: 'ArrowDown',
    startPos: 404,
    currentPos: 404,
    vulnerable: false,
  },
  {
    name: 'clyde',
    nature: 'ghost',
    direction: 'ArrowLeft',
    startPos: 407,
    currentPos: 407,
    vulnerable: false,
  }
]

// All audio files
const audios = [
  { 0: '../sounds/intro.wav' },
  { 1: '../sounds/waiting.wav' },
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
  for (let i = 1; i < sprites.length; i++) {
    cells[sprites[i].currentPos].classList.remove(`${sprites[i].name}`,'ghost')
  }
}

function ghostMovement(ghostNumber) { // Ghost movement logic
  function removeGhost(ghostNumber) { // removes ghost from previous cell
    cells[sprites[ghostNumber].currentPos].classList.remove(`${sprites[ghostNumber].name}`,'ghost','vulnerable')
  }
  removeGhost(ghostNumber)

  function moveGhost(ghostNumber, nextPosition) { // move the ghost to the next cell
    if (cells[nextPosition].classList.contains('pacman')) { // check to see if pacman is in next cell
      if (powerUpState === true) { // check if pacman is in powerup state
        removeGhost(ghostNumber) // ghost eaten by pacman - remove from location
        sprites[ghostNumber].currentPos = sprites[ghostNumber].startPos // return ghost to starting location
      } else { // if pacman not in powerup mode
        removeLife() // remove life 
        lives === 0 ? gameOver() : restartLevel() // check how many lives remain and act on it
        return
      } 
    } else {
      if (powerUpState) {
        cells[nextPosition].classList.add(`${sprites[ghostNumber].name}`)
        cells[nextPosition].classList.add('ghost')
        cells[nextPosition].classList.add('vulnerable')
      } else {
        cells[nextPosition].classList.add(`${sprites[ghostNumber].name}`)
        cells[nextPosition].classList.add('ghost')
      }
    }
  }

  let activeDirection = directions[Math.floor(Math.random() * directions.length)] // set an initial random starting direction to go
  let sanityCheck = 0 // sanity check for while loop to be able to exit
  function isNextCellAvailable() { // check if the next cell following that direction is available and adjust current position
    if (activeDirection === 'ArrowRight' && sprites[ghostNumber].currentPos === 419) { // check if warping left
      sprites[ghostNumber].currentPos = 392      
      return true
    } else if (activeDirection === 'ArrowLeft' && sprites[ghostNumber].currentPos === 392) { // check if warping right
      sprites[ghostNumber].currentPos = 419
      return true
    } else if (activeDirection === 'ArrowUp' && !cells[sprites[ghostNumber].currentPos - stdWidth].classList.contains('oob')) { // check cell north
      sprites[ghostNumber].currentPos -= stdWidth
      return true
    } else if (activeDirection === 'ArrowRight' && !cells[sprites[ghostNumber].currentPos + 1].classList.contains('oob')) { // check cell east
      sprites[ghostNumber].currentPos++
      return true
    } else if (activeDirection === 'ArrowDown' && !cells[sprites[ghostNumber].currentPos + stdWidth].classList.contains('oob')) { // check cell south
      sprites[ghostNumber].currentPos += stdWidth
      return true
    } else if (activeDirection === 'ArrowLeft' && !cells[sprites[ghostNumber].currentPos - 1].classList.contains('oob')) { // check cell west
      sprites[ghostNumber].currentPos--
      return true
    } else {
      return false
    }
  }
  do { // move the ghost if it can
    if (isNextCellAvailable()) { // set the new position if next cell is available
      moveGhost(ghostNumber, sprites[ghostNumber].currentPos) // move the ghost
      sanityCheck = 1 // get us out of the loop
    } else {
      activeDirection = directions[Math.floor(Math.random() * directions.length)] // set a new direction to go
    }
  } while (sanityCheck === 0)
}

function restartLevel() { // restart level if sufficient remaining lives
  clearInterval(musicInterval) // stop the active gameplay screen music
  playSound(audios[5][5]) // play death sound
  gameRunning = false // game stopped
  removeGhosts() // removes ghosts from their current cells
  removePacman() // removes pacman from their current cells
  sprites.forEach(sprite => sprite.currentPos = sprite.startPos) // reset current position of all sprites to starting position
  addSprites() // place Pacman and all Ghosts at their starting position
  ready.classList.remove('hidden') // show READY! disclaimer
  setTimeout(() => { // timeout for delayed game continuation
    gameRunning = true // game continued
    ready.classList.add('hidden') // READY! disclaimer removed
    playMusic(gameState, 0) // continue playing music
  }, 3000)
}

function gameOver() { // end game
  gameRunning = false // stop game
  clearInterval(musicInterval) // stop active music
  highScoreCheck() // check if score > highscore and handle
  clearInterval(Ghostinterval) // stop ghosts from moving
  gameState = 3 // gamestate game over
  swapScreen(gameState) // swap to gameover screen
  playSound(audios[5][5]) // play death sound
  finalScore = currentScore // set current score to final score
  lostScoreDisplay.innerText = finalScore // show final score
  removeGhosts() // remove ghosts from screen
  removePacman(sprites[0].direction) // remove pacman from screen
  sprites.forEach(sprite => sprite.currentPos = sprite.startPos) // reset current position of all sprites to starting position
  resetGrid() // reset the grid
}

function addSprites() { // function to place Pacman and all Ghosts at their starting position
  sprites.forEach(sprite => cells[sprite.startPos].classList.add(`${sprite.name}`,`${sprite.nature}`,`${sprite.direction}`))
}

function removeSpecificGhost(touchedGhost, newPosition) { // remove a specific ghost when eaten in vulnerable mode
  cells[newPosition].classList.remove(`${sprites[touchedGhost].name}`,'ghost','vulnerable')
  sprites[touchedGhost].currentPos = sprites[touchedGhost].startPos
}

function removeLife() { // handle removeing a life
  lives-- // remove one life
  if (lives !== 0) { // if no lives remain
    const lifeIcons = document.querySelectorAll('.life') // fetch all displayed life divs
    remainingLives.removeChild(lifeIcons[0]) // remove one life div simulating loss of 1 life
  }
}

function highScoreCheck() { // check if current score > highscore, update highscore
  if (currentScore > parseInt(localStorage.getItem('highscore'))) {
    highScore = currentScore // set the new highscore
    highScoreDisplay.forEach(display => display.innerText = highScore) // update highscore display
    localStorage.setItem('highscore', highScore) // update highscore localstorage
  }
}

function toggleMusic () { // mutes/unmutes active music (does not apply to sfx)
  if (musicState === true) { // if music is playing mute it
    activeTune.volume = 0
    musicState = false
  } else { // if music is muted unmute it 
    activeTune.volume = 0.1
    musicState = true
  }
}

let Ghostinterval 
function randomMovement() { // function to move the ghosts around the grid randomly (pretty bad ai for now)
  setTimeout(() => {
    Ghostinterval = setInterval(() => {
      if (gameRunning === true) {
        for (let i = 1; i < sprites.length; i++)
          ghostMovement(i)
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
startBtn.addEventListener('click', startGame) // event listener for "play" button
mainMenuBtn.forEach(btn => { // event listener for all main menu buttons
  btn.addEventListener('click', function() {
    swapScreen(0) // takes to main menu screen
  })
})
document.addEventListener('keydown', keyPress) // keystroke listener for pacman movement
mute.addEventListener('click', toggleMusic) // mutebutton listener to mute all sound and music
//!--------------------------Page Load-------------------------!//
swapScreen(gameState) // hide all screens and only show main menu upon page load

let activeTune // active song varialble
let musicInterval // continuos music playing interval
function playMusic (audioNumber, frequency) { // function to play relevant audio given an index
  activeTune = new Audio(audios[audioNumber][audioNumber])
  activeTune.volume = 0.1
  musicInterval  = setInterval(() => {
    activeTune.play()
  }, frequency)
}

playSound(audios[0][0]) // playing intro tune on page load once it goes into a loop there after
playMusic(gameState,5000) // play the intro tune until start button is clicked

localStorage.setItem('highscore',highScore) // highscore storage
highScoreDisplay.forEach(display => display.innerText = currentScore) // highscore display