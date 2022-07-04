//Establishing card decks

//These are the three card types I will use for the base version of the game.
const cardTypes = [
    "Mileage",
    "Hazard",
    "Remedy"
];

//This is the first thing I would like to improve - there must be a better way to store the card values other than counting out each type.

//These are the values of cards used to score - they will be added to a value shown on the board. These will be put in a deck the player draws from.
// 10 copies each of the 25, 50 and 75 mile cards
// 12 copies of the 100 mile cards
// 4 copies of the 200 mile cards
const mileValues = [
    25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 
    50, 50, 50, 50, 50, 50, 50, 50, 50, 25,
    75, 75, 75, 75, 75, 75, 75, 75, 75, 75,
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
    200, 200, 200, 200
];

//These will be put in a deck the computer draws from.
//3 copies each of Flat tire, Out of gas, and Accident cards
//5 copies of Red light cards
const hazardTypes = [
    "Flat tire", "Flat tire", "Flat tire",
    "Out of gas", "Out of gas", "Out of gas",
    "Accident", "Accident", "Accident",
    "Red light", "Red light", "Red light", "Red light", "Red light"
];

//These will be put in the deck the player draws from.
//6 copies each of Spare tire, Gas and Repairs cards
//14 copies of Green light cards
const remedyTypes = [
    "Spare tire", "Spare tire", "Spare tire", "Spare tire", "Spare tire", "Spare tire",
    "Gas", "Gas", "Gas", "Gas", "Gas", "Gas",
    "Repairs", "Repairs", "Repairs", "Repairs", "Repairs", "Repairs",
    "Green light", "Green light", "Green light", "Green light", "Green light", "Green light", "Green light",
    "Green light", "Green light", "Green light", "Green light", "Green light", "Green light", "Green light"
];

let computerDeck = [];
let playerDeck = [];
let playerHand = [];
let discardPile = [];
let cardDraw = null;
let turnsRemaining = 20;
let playButtons = document.querySelectorAll(".playButton");
let battlePile = [];
let playerScore = 0;

//This function will build both the player deck containing miles and remedies, and the computer deck containing the hazards.
function buildDeck ()  {
    for (i = 0; i < cardTypes.length; i++){
        if(i == 0) {
            for (j = 0; j < mileValues.length; j++){
                let card = {value: mileValues[j], type: cardTypes[i]};
                playerDeck.push(card);
            }
        } else if (i == 2){
            for (j = 0; j < remedyTypes.length; j++){
                let card = {value: remedyTypes[j], type: cardTypes[i]};
                playerDeck.push(card);
            }
        } else if (i == 1){
            for (j = 0; j < hazardTypes.length; j++){
                let card = {value: hazardTypes[j], type: cardTypes[i]};
                computerDeck.push(card);
            }
        }
    }
    //console.log("Player's deck: "+JSON.stringify(playerDeck));
    //console.log("Computer's deck: "+JSON.stringify(computerDeck));
}

buildDeck();
//Card shuffling tutorial found here
//Studied documentation on Math.random (https://www.w3schools.com/js/js_random.asp) and Math.floor (https://www.w3schools.com/jsref/jsref_floor.asp)
function shuffleDeck(){
    //shuffling player's deck
    for(i = playerDeck.length - 1; i> 0; i--) {
        let j = Math.floor(Math.random() * i);
        let shuffler = playerDeck[i];
        playerDeck[i] = playerDeck[j];
        playerDeck[j] = shuffler;
    }

    //shuffling computer's deck
    for(i = computerDeck.length - 1; i> 0; i--) {
        let j = Math.floor(Math.random() * i);
        let shuffler = computerDeck[i];
        computerDeck[i] = computerDeck[j];
        computerDeck[j] = shuffler;
    }
    // console.log("Player's deck: "+JSON.stringify(playerDeck));
    // console.log("Computer's deck: "+JSON.stringify(computerDeck));
}

shuffleDeck();

//Assigns values of top 6 cards in the player deck to corresponding positiions in the player hand, and removes those objects from the top of the deck array.
function dealCards(){
    for (i = 0; i < 6; i++){
        playerHand.push(playerDeck[i]);
        playerDeck.shift();
    }
    console.log("Player's hand: ");
    for(i = 0; i<6; i++){
        console.log(playerHand[i].value)
    }
    document.getElementById('0').innerText = playerHand[0].value;
    document.getElementById('1').innerText = playerHand[1].value;
    document.getElementById('2').innerText = playerHand[2].value;
    document.getElementById('3').innerText = playerHand[3].value;
    document.getElementById('4').innerText = playerHand[4].value;
    document.getElementById('5').innerText = playerHand[5].value;

    console.log("Player's deck: "+JSON.stringify(playerDeck));
    console.log("Computer's deck: "+JSON.stringify(computerDeck));
}

dealCards ();

//Assigns a spot in the player's hand the value of the first card in the deck, and then removes that card from the "top" of the deck. This function will be called inside the "playerTurn" function. Drawn card is temporarily stored in the "cardDraw" variable. Since the card cannot return to the deck per the rules, the shift function is called on the player deck here, to remove it.
function drawCard(){
    cardDraw = playerDeck[0];
    playerDeck.shift();
    document.getElementById('6').innerText = cardDraw.value;
    console.log("Drawn card: "+JSON.stringify(cardDraw))
}

//removes selected card from play and adds it to the discard pile.
function discardCard(){
    
}

//Plays card to the table - either adds to score (mileage) or plays a remedy on top of a hazard.
// function playCard(e){
//     e.target.
//}

//This function will generate a random number, and based on that number, either draw a hazard card from the computer deck and play it on the battle pile, or pass its turn.
function computerTurn(){
    let i = Math.round(Math.random())
    if(i === 0){
        console.log("Clear road ahead")
        document.querySelector(".message-area").innerText = "Clear road ahead"
    } else if (i === 1){
        document.querySelector(".battle-pile").innerText = ("Battle pile: "+JSON.stringify(computerDeck[0].value))
        battlePile.unshift(computerDeck[0]);
        computerDeck.shift();
        document.querySelector(".message-area").innerText = ("Hazard played: "+JSON.stringify(battlePile[0].value))
        document.querySelector(".battle-pile").innerText = (JSON.stringify(battlePile[0].value))
        console.log("Hazard played: "+JSON.stringify(battlePile[0].value))
    }
}
computerTurn();
//Player should be able to draw a card, and either play a card to the table or discard.
function playerTurn(){
//Player:
// 1) Draws a card, and MUST either
// 2) a) play a card to the table
//      i) A miles card to the score counter, or
//      ii) a remedy card to the battle pile
//    b) discard a card
// should be able to play card by mousing over and clicking, possibly add buttons for discarding instead.
//Might be nice to add a hand sorting function that automatically keeps your cards in order.

    drawCard();
}
drawCard();

//Event listener section - add event listeners for various buttons (play, discard for each card)
// playButtons.forEach(playerTurn){
//     playButtons[i].addEventListener("click", playCard)
// }