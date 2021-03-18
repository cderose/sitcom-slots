const carousel = document.querySelectorAll(".carousel")
const button = document.querySelector("#button")

// set spin variables
i = 0
let increment = 0
const min = 20
const max = 80

// prepare variables for final slot images
var finalImages = []
var imageTitles = []

// set bonus variables
const bonusImages = ["sign.png", "sign.png", "sign.png", "jellybean.png",]
const bonusElemArray = document.querySelectorAll(".bonus-images")
var clicks = 3

// set scoring
var score = 0
const ROB_LAURA = 30
const SALLY_BUDDY = 15
const LOGO = 100
const TWO_LOGOS = 50
const ONE_LOGO = 5


/******************* START GAME LOGIC *************************/
button.addEventListener("click", function() {
  button.style.display="none";
  
  var buttonText = this.textContent;
  if (buttonText == "SPIN") {
    carousel.forEach(function(item){
      spin(item);
    })
  } else {
    resumeMainGame();
  }
})

function resumeMainGame(){
  // hide bonus images
  bonusElemArray.forEach(function(item){
    item.style.display = "none";
    item.classList.remove("revealed-images");
  });
  document.getElementById("bonus-text").style.display="none";
    document.getElementById("bonus-container").style.display="none";
  document.getElementById("spin-text").style.display="block";
  document.getElementsByClassName("container")[0].style.display="block";
  document.getElementById("button").style.display="inline-block"
  document.getElementById("button").innerText="SPIN";
}

/******************* SPIN LOGIC *************************/
function spin(item) {
  var intervalId = setInterval(function(){

    if(i > spinAmount()){
      clearInterval(intervalId);
      // console.log(i)
      i = 0;
    } else {
        i++;
        increment++;
        $(item).css({
          "-webkit-transform": "rotateX(" + (increment * -60) + "deg)"
        })
        // keep only front image in focus
        $(item).attr("data-state", (increment % 6) + 1);
      } 
  }, 50);

  // wait for image positions to finalize
  setTimeout(function(){
    finalImages.push(item);
    if (finalImages.length === 3){
      getImageTitles(finalImages);
    }
  }, 3500);
}

// choose random number for each wheel spin
function spinAmount(){
  // randomNumber = Math.round(Math.random() * 10 + 5)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/******************* SCORING LOGIC *************************/
function getImageTitles(resultingImages){
  for (i = 0; i < 3; i++){
    var imageObject = Object.values(resultingImages)[i];
    var dataState = imageObject.getAttribute('data-state') - 1;
    var image = imageObject.children[dataState];
    var imageTitle = image.innerHTML.split('-')[1].split('.')[0];
    imageTitles.push(imageTitle);
  }

  getScore();
}

function getScore(){
  var robTotal = countResults(imageTitles, "rob");
  var lauraTotal = countResults(imageTitles, "laura");
  var sallyTotal = countResults(imageTitles, "sally");
  var buddyTotal = countResults(imageTitles, "buddy");
  var logoTotal = countResults(imageTitles, "logo");

  if (robTotal == 3 || lauraTotal == 3){
    score += ROB_LAURA;
  } else if (sallyTotal == 3 || buddyTotal == 3){
    score += SALLY_BUDDY;
  } else if (logoTotal == 3){
    score += LOGO;
    setTimeout(function(){ 
      bonusGame();
    }, 1500);
  } else if (logoTotal == 2){
    score += TWO_LOGOS;
  } else if (logoTotal == 1){
    score += ONE_LOGO;
  } else {
    ;
  }

  document.getElementById("score").innerText = "Score: " + score;
  finalImages = [];
  imageTitles = [];
  button.style.display="inline-block";
}

function countResults(array, value) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}



/******************* BONUS GAME *************************/
function bonusGame(){
  document.getElementsByClassName("container")[0].style.display="none"
  document.getElementById("spin-text").style.display="none";
  document.getElementById("bonus-text").style.display="block";
  document.getElementById("bonus-container").style.display="block";
  bonusElemArray.forEach(function(item){
    item.src = "images/jellybean-cover.png";
    item.style.display = "inline-block";
    item.addEventListener("click", clickHandler);
  });
}

function clickHandler(){
  if (clicks > 1) {
    revealBonusImage(this);
    displayRemainingChances(); 
  } else {
    revealBonusImage(this);
    clicks = 3;
    document.getElementById("button").innerText="RETURN";
    document.getElementById("button").style.display="inline-block";
  }
}   

function revealBonusImage(elem) {
    var randomBonusImage = bonusImages[Math.floor(Math.random() * bonusImages.length)];
    elem.src = "images/" + randomBonusImage;
    elem.classList.add("revealed-images");

    if (elem.src.indexOf("jellybean") != -1) {
      score += 500;
      document.getElementById("score").innerText = "Score: " + score;
    }
    clicks--;
    elem.removeEventListener("click", clickHandler);
    return
}

function displayRemainingChances(){
  document.getElementById("bonus-text").innerText = clicks + " chances left!";
  return
}
