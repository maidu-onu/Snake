"use strict";

const box = document.querySelector("#main");

const active = function (x, y) {
  document
    .querySelector(`.square[data-x="${x}"][data-y="${y}"]`)
    .classList.toggle("snake");
};
const makeFood = function (x, y) {
  document
    .querySelector(`.square[data-x="${x}"][data-y="${y}"]`)
    .classList.toggle("food");
};
const win = function () {
  document.querySelector(`.message`).classList.toggle("hidden");
};

// Starting conf
let x = 1;
let y = 1;
const moveInterval = 500;
const gameWidth = 5;
const gameHeight = 5;
let snakeLength = 1;
const snakeBody = [[x, y]];
const foodArray = [];

const inGameBounds = function () {
  if (y <= gameHeight && x <= gameWidth && y > 0 && x > 0) {
    return true;
  } else {
    return false;
  }
};

// Movement direction and limit
const down = function () {
  y < gameHeight ? y++ : false;
};
const right = function () {
  x < gameWidth ? x++ : false;
};
const up = function () {
  y > 1 ? y-- : false;
};
const left = function () {
  x > 1 ? x-- : false;
};

let direction = right; // starting direction, later acts as function

//keyboard
document.addEventListener("keydown", (e) => {
  if (direction != up) {
    // cannot turn back into itself
    e.key === "ArrowDown" ? (direction = down) : "";
  }
  if (direction != left) {
    e.key === "ArrowRight" ? (direction = right) : "";
  }
  if (direction != down) {
    e.key === "ArrowUp" ? (direction = up) : "";
  }
  if (direction != right) {
    e.key === "ArrowLeft" ? (direction = left) : "";
  }
  if (e.key === "Space") {
    console.log("space");
  }
  if (e.key === " ") {
    console.log("space");
    snakeLength++;
  }
  if (e.key === "Control") {
    console.log("Control");
    snakeLength--;
  }
  //console.log(`Key: ${e.key}, KeyCode: ${e.keyCode}, Code: ${e.code}`);
});

const ItMoves = function () {
  //Checks if current XY are different from snakeBody's last coordinate
  return (
    x != snakeBody[snakeBody.length - 1][0] ||
    y != snakeBody[snakeBody.length - 1][1]
  );
};

//////FOOD FUNCTION////////
const food = function () {
  let xFood = Math.floor(Math.random() * 5 + 1);
  let yFood = Math.floor(Math.random() * 5 + 1);
  let foodDone = 0;
  while (foodDone === 0) {
    xFood = Math.floor(Math.random() * 5 + 1);
    yFood = Math.floor(Math.random() * 5 + 1);
    console.log("tere");
    if (
      snakeBody.some((pair) => pair[0] === xFood && pair[1] === yFood) === false
    ) {
      foodArray.push([xFood, yFood]);
      makeFood(xFood, yFood);
      foodDone = 1;
    }
  }
};

//////MOVEMENT FUNCTION//////
const move = function () {
  let stopper = 0;
  active(x, y); // once

  const mover = setInterval(() => {
    //movement interval

    stopper++;
    stopper === 200 ? clearInterval(mover) : ""; //

    direction();

    /* if (ItMoves()) {
      //only first time it does not add new coordinates, because they have not changed yet
      //New element into array
      snakeBody.push([x, y]);
      console.log("it moves");
    }

    console.log("enne", snakeBody.length); */

    /* if (ItMoves() && snakeBody.some((pair) => pair[0] === x && pair[1] === y)) {
      // XY resets latest snakeBody
      x = snakeBody[snakeBody.length - 1][0];
      y = snakeBody[snakeBody.length - 1][1];
    } */
    // Snake tail manipulation

    if (ItMoves()) {
      if (snakeBody.some((pair) => pair[0] === x && pair[1] === y)) {
        x = snakeBody[snakeBody.length - 1][0];
        y = snakeBody[snakeBody.length - 1][1];
      } else {
        snakeBody.push([x, y]); // head moves on in array
        active(x, y); // head moves on screen

        if (foodArray.some((pair) => pair[0] === x && pair[1] === y)) {
          //leidis toidu
          makeFood(x, y);
          foodArray.length = 0;
          food();
          snakeLength++;
        }
        if (snakeLength > 23) {
          win();
          clearInterval(mover);
        }
        console.log(snakeLength);
      }
      if (snakeBody.length > snakeLength) {
        active(snakeBody[0][0], snakeBody[0][1]);
      }

      // snake tail is removed
      /*  if (snakeBody.length >= snakeLength) {
        
        // in the very beginnin
      } //  */ //delete snake tail as first entry in snakeBody
      snakeBody.length > snakeLength ? snakeBody.splice(0, 1) : ""; // erase from the beginning of movement log
      if (snakeBody.length > snakeLength) {
        active(snakeBody[0][0], snakeBody[0][1]);
        snakeBody.splice(0, 1);
      }
    } else if (snakeBody.length > snakeLength) {
      snakeBody.splice([snakeBody.length - 1]);
    }
  }, moveInterval);
};

////////////////////
//MOVEMENT EXECUTION//
////////////////////
move();
food();

////////Clickable boxes/////
box.addEventListener("click", function (e) {
  e.target.classList.toggle("snake");
});
