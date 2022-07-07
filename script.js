//Establishing card decks

//These are the three card types I will use for the base version of the game.
const cardTypes = ['Mileage', 'Hazard', 'Remedy']

//This is the first thing I would like to improve - there must be a better way to store the card values other than counting out each type.

//These are the values of cards used to score - they will be added to a value shown on the board. These will be put in a deck the player draws from.
// 10 copies each of the 25, 50 and 75 mile cards
// 12 copies of the 100 mile cards
// 4 copies of the 200 mile cards
const mileValues = [
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 50, 50, 50, 50, 50, 50, 50, 50, 50,
  25, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 100, 100, 100, 100, 100, 100, 100,
  100, 100, 100, 100, 100, 200, 200, 200, 200
]

//These will be put in a deck the computer draws from.
//3 copies each of Flat tire, Out of gas, and Accident cards
//5 copies of Red light cards
const hazardTypes = [
  'Flat tire',
  'Flat tire',
  'Flat tire',
  'Out of gas',
  'Out of gas',
  'Out of gas',
  'Accident',
  'Accident',
  'Accident',
  'Red light',
  'Red light',
  'Red light',
  'Red light',
  'Red light'
]

//These will be put in the deck the player draws from.
//6 copies each of Spare tire, Gas and Repairs cards
//14 copies of Green light cards
const remedyTypes = [
  'Spare tire',
  'Spare tire',
  'Spare tire',
  'Spare tire',
  'Spare tire',
  'Spare tire',
  'Gas',
  'Gas',
  'Gas',
  'Gas',
  'Gas',
  'Gas',
  'Repairs',
  'Repairs',
  'Repairs',
  'Repairs',
  'Repairs',
  'Repairs',
  'Green light',
  'Green light',
  'Green light',
  'Green light',
  'Green light',
  'Green light',
  'Green light',
  'Green light',
  'Green light',
  'Green light',
  'Green light',
  'Green light',
  'Green light',
  'Green light'
]
//card-related variables
let computerDeck = []
let playerDeck = []
let playerHand = []
let discardPile = []
let cardDraw = []

let turnsRemaining = 20

//Variables that interact with DOM elements
let cardArray = document.querySelectorAll('.player-card')
let discardButton = document.querySelector('.discardButton')
let playButton = document.querySelector('.playButton')
let playerCardsOnScreen = document.querySelectorAll('.all-card') //playerCards needs to be an array of objects? These can't be objects because it's just used to reference DOM elements
//Had to set empty values for the object in the battlePile array to test the computerTurn function
// let playerCards = [
//     {value: "",
//     type: ""
// }
// ]
//If battle pile is changed from array to single object, you must make changes in the computerTurn function
let battlePile = {
  value: '',
  type: ''
}

let playerScore = 0

//let cardPosition = 0;

let selectedCard = {
  value: '',
  type: ''
}

//This function will build both the player deck containing miles and remedies, and the computer deck containing the hazards.

document.querySelector(
  '.turnCount'
).innerText = `Number of turns left: ${turnsRemaining}`
document.querySelector('.battle-pile').innerText =
  'Battle pile: ' + battlePile.value

function buildDeck() {
  for (i = 0; i < cardTypes.length; i++) {
    if (i == 0) {
      for (j = 0; j < mileValues.length; j++) {
        let card = {
          value: mileValues[j],
          type: cardTypes[i],
          isInPlayerHand: false
        }
        playerDeck.push(card)
      }
    } else if (i == 2) {
      for (j = 0; j < remedyTypes.length; j++) {
        let card = {
          value: remedyTypes[j],
          type: cardTypes[i],
          isInPlayerHand: false
        }
        playerDeck.push(card)
      }
    } else if (i == 1) {
      for (j = 0; j < hazardTypes.length; j++) {
        let card = {
          value: hazardTypes[j],
          type: cardTypes[i],
          isInPlayerHand: false
        }
        computerDeck.push(card)
      }
    }
  }
}

buildDeck()
//Card shuffling tutorial found here: https://www.programiz.com/javascript/examples/shuffle-card
//Studied documentation on Math.random (https://www.w3schools.com/js/js_random.asp) and Math.floor (https://www.w3schools.com/jsref/jsref_floor.asp)
function shuffleDeck() {
  //shuffling player's deck
  for (i = playerDeck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i)
    let shuffler = playerDeck[i]
    playerDeck[i] = playerDeck[j]
    playerDeck[j] = shuffler
  }

  //shuffling computer's deck
  for (i = computerDeck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i)
    let shuffler = computerDeck[i]
    computerDeck[i] = computerDeck[j]
    computerDeck[j] = shuffler
  }
}

shuffleDeck()

//Assigns values of top 6 cards in the player deck to corresponding positiions in the player hand, and removes those objects from the top of the deck array.
function dealCards() {
  for (i = 0; i < 6; i++) {
    playerHand.push(playerDeck.shift())

    playerHand[i].isInPlayerHand = true
  }
  console.log("Player's hand: ")
  for (i = 0; i < 6; i++) {
    playerHand[i].position = i
    console.log(playerHand[i])
  }

  document.getElementById('0').innerText = playerHand[0].value
  document.getElementById('1').innerText = playerHand[1].value
  document.getElementById('2').innerText = playerHand[2].value
  document.getElementById('3').innerText = playerHand[3].value
  document.getElementById('4').innerText = playerHand[4].value
  document.getElementById('5').innerText = playerHand[5].value
}

dealCards()

//Assigns a spot in the player's hand the value of the first card in the deck, and then removes that card from the "top" of the deck. This function will be called inside the "playerTurn" function. Drawn card is temporarily stored in the "cardDraw" variable. Since the card cannot return to the deck per the rules, the shift function is called on the player deck here, to remove it.
function drawCard() {
  cardDraw = playerDeck.shift()
  //cardDraw.position = 6;
  document.getElementById('6').innerText = cardDraw.value
  console.log('Drawn card: ' + Object.values(cardDraw))
}

//This function will generate a random number, and based on that number, either draw a hazard card from the computer deck and play it on the battle pile, or pass its turn. (Might possibly be able to make this number adjustable to change the difficulty of the game.)
function computerTurn() {
  let i = Math.round(Math.random())
  if (i === 0) {
    console.log('Clear road ahead')
    document.querySelector('.message-area').innerText = 'Clear road ahead'
  } else if (i === 1 && battlePile.value === 'Green light') {
    document.querySelector('.battle-pile').innerText =
      'Battle pile: ' + Object.values(computerDeck[0])[0]
    battlePile = computerDeck[0]
    computerDeck.shift()
    document.querySelector(
      '.message-area'
    ).innerText = `Hazard played: ${battlePile.value}`
    document.querySelector(
      '.battle-pile'
    ).innerText = `Battle pile: ${battlePile.value}`
    const tripLog = document.querySelector('.game-log')
    const newLogItem = document.createElement('li')
    newLogItem.appendChild(
      document.createTextNode(`Hazard played: ${battlePile.value}`)
    )
    tripLog.appendChild(newLogItem)
    // console.log(`Hazard played: ${battlePile.value}`)
  }
}
computerTurn()
//Player should be able to draw a card, and either play a card to the table or discard.
function playerTurn() {
  //remember to call at the end
  drawCard()
  playCard()

  //Player:
  // 1) Draws a card, and MUST either
  // 2) a) play a card to the table
  //      i) A miles card to the score counter, or
  //      ii) a remedy card to the battle pile
  //    b) discard a card
  // should be able to play card by mousing over and clicking, possibly add buttons for discarding instead.
  //Might be nice to add a hand sorting function that automatically keeps your cards in order.
} //turnsRemaining--;

//drawCard();

function chooseCard(selectedCard) {
  for (i = 0; i < 7; i++) {
    playerCardsOnScreen[i].addEventListener('click', (e) => {
      let cardPosition = document.getElementById(e.target.id).id
      selectedCard.position = cardPosition

      selectedCard.value = e.target.innerText
      let cardChoice = selectedCard.value
      if (
        cardChoice === '25' ||
        cardChoice === '50' ||
        cardChoice === '75' ||
        cardChoice === '100' ||
        cardChoice === '200'
      ) {
        selectedCard.value = parseInt(selectedCard.value)
        selectedCard.type = cardTypes[0]
        selectedCard.isInPlayerHand = playerHand[e.target.id] ? true : false
      } else if (
        cardChoice === 'Spare tire' ||
        cardChoice === 'Gas' ||
        cardChoice === 'Repairs' ||
        cardChoice === 'Green light'
      ) {
        selectedCard.type = cardTypes[2]
        selectedCard.isInPlayerHand = playerHand[e.target.id] ? true : false
      }

      document.querySelector('.selected-card').innerText = `Card selected: ${
        Object.values(selectedCard)[0]
      }`

      // return selectedCard;
      // add calls to playCard and discardCard here??
      // playCard();
      // discardCard();
    })
  }
}

chooseCard(selectedCard)
//return selectedCard;

//might have to build separate functions for playing and discarding?
//"If you chose to play a remedy card, check if it's the correct one and play it to the battle pile. (If it's not, throw an error message.)"
//"If you chose to play a mileage card, check if the battle pile has a Green light card on top. (If not, throw an error message."
function playCard() {
  //Add event listener to "play" button - done

  //If selected card is a mileage card:
  //check if battle pile shows a "Green light" card
  // - if yes, add value of mileage card to score, end turn
  // - if not, show error, do not play card, run function again(?)

  //If selected card is a remedy card:
  //If remedy card is a "Green light" card,
  //check if battle pile is a different remedy card OR a "red light" hazard card
  //If yes - play card on top of battle pile, end turn
  //If not - show error, do not play card, run function again
  //If remedy card is NOT a "Green light" card,
  //check if battle pile shows associated hazard card
  // - if yes, put remedy card on top of battle pile, end turn
  // - if not, show error, do not play card, run function again

  //If the played card was the newly drawn card, move it to a pile and draw a new card.

  //If the played card was in the player's hand, remove it from the hand, add the drawn card to the hand.

  //When function completes (player turn ends), the computer will play its turn
  //chooseCard();

  //Should I wrap this whole thing in a for loop, and replace each discardCard call with the splice from the discardCard function?

  if (selectedCard.value === '') {
    console.log('No card selected.')
  } else {
    //if/else starts here
    if (selectedCard.type === cardTypes[0]) {
      if (battlePile.value === 'Green light') {
        document.querySelector('.error-message').innerText = 'All good.'
        console.log('Miles played')
        playerScore = playerScore + selectedCard.value
        // console.log("Score: "+playerScore)
        document.querySelector(
          '.score-counter'
        ).innerText = `Miles: ${playerScore}`
        // turnsRemaining--;
        discardCard()
      } else {
        document.querySelector('.error-message').innerText =
          'You must have a green light on the battle pile to play miles.'
        // console.log("You must have a green light on the battle pile to play miles.")
      }
    } else if (selectedCard.type === cardTypes[2]) {
      // console.log(selectedCard)
      if (selectedCard.value === 'Green light') {
        if (
          (battlePile.type === cardTypes[2] &&
            battlePile.value != 'Green light') ||
          (battlePile.type === '' && battlePile.value === '') ||
          battlePile.value === 'Red light'
        ) {
          const tripLog = document.querySelector('.game-log')
          const newLogItem = document.createElement('li')
          newLogItem.appendChild(
            document.createTextNode(`Green light - let's roll!`)
          )
          tripLog.appendChild(newLogItem)
          // console.log("Green light played")
          battlePile.type = selectedCard.type
          battlePile.value = selectedCard.value
          document.querySelector('.error-message').innerText = 'All good.'
          // turnsRemaining--;
          discardCard()
        } else if ((battlePile.type = cardTypes[1])) {
          document.querySelector('.error-message').innerText =
            "You can't play a green light until you fix the hazard."
          // console.log("You can't play a green light until you fix the hazard.")
        }
      } else if (selectedCard.value != 'Green light') {
        if (
          selectedCard.value === 'Spare tire' &&
          battlePile.value === 'Flat tire'
        ) {
          const tripLog = document.querySelector('.game-log')
          const newLogItem = document.createElement('li')
          newLogItem.appendChild(
            document.createTextNode(
              `${battlePile.value} replaced with ${selectedCard.value}.`
            )
          )
          tripLog.appendChild(newLogItem)
          // console.log(`${battlePile.value} replaced with ${selectedCard.value}.`);
          battlePile.type = selectedCard.type
          battlePile.value = selectedCard.value
          discardCard()
          // selectedCard.type = "";
          // selectedCard.value = "";
          // turnsRemaining--;
        } else if (
          selectedCard.value === 'Gas' &&
          battlePile.value === 'Out of gas'
        ) {
          const tripLog = document.querySelector('.game-log')
          const newLogItem = document.createElement('li')
          newLogItem.appendChild(document.createTextNode(`Gas tank refilled.`))
          tripLog.appendChild(newLogItem)
          // console.log(`Gas tank refilled.`);
          battlePile.type = selectedCard.type
          battlePile.value = selectedCard.value
          discardCard()
          // selectedCard.type = "";
          // selectedCard.value = "";
          // turnsRemaining--;
        } else if (
          selectedCard.value === 'Repairs' &&
          battlePile.value === 'Accident'
        ) {
          const tripLog = document.querySelector('.game-log')
          const newLogItem = document.createElement('li')
          newLogItem.appendChild(
            document.createTextNode(
              `${battlePile.value} fixed with ${selectedCard.value}.`
            )
          )
          tripLog.appendChild(newLogItem)
          // console.log(`${battlePile.value} fixed with ${selectedCard.value}.`);
          battlePile.type = selectedCard.type
          battlePile.value = selectedCard.value
          discardCard()
          // selectedCard.type = "";
          // selectedCard.value = "";
          // turnsRemaining--;
        } else if ((battlePile.type = cardTypes[1])) {
          document.querySelector('.error-message').innerText =
            'Incorrect remedy - choose another card.'
          // console.log("Incorrect remedy - choose another card.")
        }
      } //discardCard();
      console.log(playerHand)
    }
    //if/else ends here
    document.querySelector(
      '.battle-pile'
    ).innerText = `Battle pile: ${battlePile.value}`
    document.querySelector(
      '.turnCount'
    ).innerText = `Number of turns left: ${turnsRemaining}`
    computerTurn()
    selectedCard.position = null
    gameEnd()
  }
}

const discardCard = () => {
  //discardButton.addEventListener('click', chooseCard);

  //Take "selectedCard" variable
  //Push to "discardPile" array
  //Remove matching card from either player's hand or drawn card spot
  //reset "selectedCard" to empty object
  //draw new card

  //IF selected card is the Drawn card, push to discard and draw new card

  //IF selected card is in the player's hand, remove card, put Drawn card into player's hand, draw new card

  //when function completes, computer will play its turn
  //use .find to store a card in a local variable
  //chooseCard();
  if (selectedCard.value === '') {
    console.log('No card selected.')
  } else {
    if (selectedCard.isInPlayerHand) {
      let positionHolder = selectedCard.position
      console.log('Position of chosen card: ' + positionHolder)

      for (i = 0; i < 6; i++) {
        if (parseInt(playerHand[i].position) == selectedCard.position) {
          console.log('Card to be discarded: ' + playerHand[i].value)
          discardPile.unshift(selectedCard)
          console.log('Top of discard pile: ', discardPile[0])
          cardDraw.position = positionHolder

          playerHand.splice(i, 1, cardDraw)

          cardArray[i].innerText = cardDraw.value

          turnsRemaining--

          document.querySelector(
            '.turnCount'
          ).innerText = `Number of turns left: ${turnsRemaining}`
          const tripLog = document.querySelector('.game-log')
          const newLogItem = document.createElement('li')
          newLogItem.appendChild(
            document.createTextNode(`${discardPile[0].value} discarded.`)
          )
          tripLog.appendChild(newLogItem)
        }
      }
      // turnsRemaining--;
      // console.log(turnsRemaining);

      document.querySelector(
        '.turnCount'
      ).innerText = `Number of turns left: ${turnsRemaining}`
      //drawCard();
      if (selectedCard.position < 6) {
        drawCard()
      }
    } else {
      discardPile.push(selectedCard)
      turnsRemaining--
      document.querySelector(
        '.turnCount'
      ).innerText = `Number of turns left: ${turnsRemaining}`

      drawCard()
    }

    console.log(turnsRemaining)

    // console.log("Discard button clicked")
    // console.log(`${selectedCard.value}, ${selectedCard.type}`)
    // discardPile.push(selectedCard);
    // console.log(discardPile[0]);
    // selectedCard.value = "";
    // selectedCard.type = "";
    // //chooseCard();
    // drawCard();
    // console.log(`New draw card: ${cardDraw.value}, ${cardDraw.type}`)
    // turnsRemaining--;
    // document.querySelector(".turnCount").innerText = (`Number of turns left: ${turnsRemaining}`)
    console.log('Hand after discarding: ', JSON.stringify(playerHand))
    gameEnd()
    selectedCard = {
      value: '',
      type: ''
    }
  }
}

discardButton.addEventListener('click', discardCard)
playButton.addEventListener('click', playCard)

playerTurn()

function gameEnd() {
  if (turnsRemaining < 1 && playerScore === 1000) {
    document.querySelector(
      '.message-area'
    ).innerText = `Well done! You completed your trip.`
    discardButton.removeEventListener('click', discardCard)
    discardButton.removeEventListener('click', playCard)
  } else if (turnsRemaining < 1 && playerScore < 1000) {
    document.querySelector(
      '.message-area'
    ).innerText = `Nice driving, but you needed a little more time to get there.`
    discardButton.removeEventListener('click', discardCard)
    discardButton.removeEventListener('click', playCard)
  } else if (turnsRemaining < 1 && playerScore > 1000) {
    document.querySelector(
      '.message-area'
    ).innerText = `Nice driving, but looks like you missed your destination.`
    discardButton.removeEventListener('click', discardCard)
    discardButton.removeEventListener('click', playCard)
  }
}
