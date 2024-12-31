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
  foodArray.push([x, y]);
};
const win = function () {
  document.querySelector(`.message`).classList.toggle("hidden");
};

// Starting config //
let x = 1;
let y = 1;
const moveInterval = 800;
let gameSize = 5;
let gameWidth = 5;
let gameHeight = 5;
let snakeLength = 1;
let snakeBody = [[x, y]];
const foodArray = [];

let moveDirection = 0;
let lastMoveDirection = 0;
let bodyBlock = 0;

const inGameBounds = function () {
  if (y <= gameHeight && x <= gameWidth && y > 0 && x > 0) {
    return true;
  } else {
    return false;
  }
};

// Movement direction and limit
const down = function () {
  if (y < gameHeight) {
    y++;
    if (!bodyBlock) {
      //later is used to determine if to use tuned body element or straight
      //lastMoveDirection = moveDirection;
    }
    moveDirection = 1;
  }
};
const right = function () {
  if (x < gameWidth) {
    x++;
    if (!bodyBlock) {
      //lastMoveDirection = moveDirection;
    }
    moveDirection = 0;
  }
};
const up = function () {
  if (y > 1) {
    y--;
    if (!bodyBlock) {
      //lastMoveDirection = moveDirection;
    }
    moveDirection = 3;
  }
};
const left = function () {
  if (x > 1) {
    x--;
    if (!bodyBlock) {
      //lastMoveDirection = moveDirection;
    }
    moveDirection = 2;
  }
};

let direction = right; // starting direction, later acts as function

//keyboard
document.addEventListener("keydown", (e) => {
  if (direction != up && y < gameHeight) {
    // cannot turn back into itself
    e.key === "ArrowDown" ? (direction = down) : "";
  }
  if (direction != left && x < gameWidth) {
    e.key === "ArrowRight" ? (direction = right) : "";
  }
  if (direction != down && y > 1) {
    e.key === "ArrowUp" ? (direction = up) : "";
  }
  if (direction != right && x > 1) {
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
  if (e.key === "Enter") {
    resizeGame(gameSize + 1);
  }
  //console.log(`Key: ${e.key}, KeyCode: ${e.keyCode}, Code: ${e.code}`);
});

/* const ItMoves = function () {
  //Checks if current XY are different from snakeBody's last coordinate
  return (
    x != snakeBody[snakeBody.length - 1][0] ||
    y != snakeBody[snakeBody.length - 1][1]
  );
}; */

//////FOOD FUNCTION////////
const food = function () {
  let xFood = Math.floor(Math.random() * 5 + 1);
  let yFood = Math.floor(Math.random() * 5 + 1);
  let foodDone = 0;
  while (foodDone === 0) {
    xFood = Math.floor(Math.random() * 5 + 1);
    yFood = Math.floor(Math.random() * 5 + 1);

    if (
      snakeBody.some((pair) => pair[0] === xFood && pair[1] === yFood) === false
    ) {
      makeFood(xFood, yFood);
      foodDone = 1;
    }
  }
};

//////BODY IMAGE FUNCTION////////

const bodyChange = function (x, y, newBody) {
  document
    .querySelector(`.square[data-x="${x}"][data-y="${y}"]`)
    .classList.remove(
      "pea",
      "kere",
      "kere_vasakule",
      "kere_paremale",
      "saba",
      "pea_solo"
    );
  document
    .querySelector(`.square[data-x="${x}"][data-y="${y}"]`)
    .classList.add(newBody);
};
///// TURN FUNCTION /////
const turn = function (direction, x1 = x, y1 = y) {
  document
    .querySelector(`.square[data-x="${x1}"][data-y="${y1}"]`)
    .classList.remove("alla", "vasakule", "üles");
  document
    .querySelector(`.square[data-x="${x1}"][data-y="${y1}"]`)
    .classList.add(direction);
};

//////MOVEMENT FUNCTION//////
const move = function () {
  let stopper = 0;
  //active(x, y); // once
  bodyChange(x, y, "pea_solo");

  const mover = setInterval(() => {
    //movement interval

    stopper++;
    stopper === 2000 ? clearInterval(mover) : ""; //

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

    /// self collison ///

    if (snakeBody.some((pair) => pair[0] === x && pair[1] === y)) {
      x = snakeBody[snakeBody.length - 1][0];
      y = snakeBody[snakeBody.length - 1][1];
      bodyBlock = 1;
    } else {
      snakeBody.push([x, y]);
      bodyBlock = 0; // head moves on in array
      //active(x, y); // head moves on screen

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
    }

    if (snakeBody.length > snakeLength) {
      //active(snakeBody[0][0], snakeBody[0][1]);
      bodyChange(snakeBody[0][0], snakeBody[0][1]);
    }

    // snake tail is removed
    /*  if (snakeBody.length >= snakeLength) {
        
        // in the very beginnin
      } //  */ //delete snake tail as first entry in snakeBody
    snakeBody.length > snakeLength ? snakeBody.splice(0, 1) : ""; // erase from the beginning of movement log
    if (snakeBody.length > snakeLength) {
      //active(snakeBody[0][0], snakeBody[0][1]);
      snakeBody.splice(0, 1);
    }
    if (snakeBody.length > snakeLength) {
      snakeBody.splice([snakeBody.length - 1]);
    }
    if (snakeLength < 2) {
      bodyChange(x, y, "pea_solo");
    } else {
      bodyChange(x, y, "pea");
    }

    //// Snake head direction ////

    if (!bodyBlock) {
      switch (moveDirection) {
        case 0:
          document
            .querySelector(`.square[data-x="${x}"][data-y="${y}"]`)
            .classList.remove("alla", "vasakule", "üles");
          break;
        case 1:
          turn("alla");
          break;
        case 2:
          turn("vasakule");
          break;
        case 3:
          turn("üles");
          break;
      }

      //// Snake first body direction ////
      if (snakeLength > 1) {
        switch (moveDirection) {
          case 0:
            document
              .querySelector(
                `.square[data-x="${
                  snakeBody[snakeBody.length - 2][0]
                }"][data-y="${snakeBody[snakeBody.length - 2][1]}"]`
              )
              .classList.remove("alla", "vasakule", "üles");
            break;
          case 1:
            turn(
              "alla",
              snakeBody[snakeBody.length - 2][0],
              snakeBody[snakeBody.length - 2][1]
            );
            break;
          case 2:
            turn(
              "vasakule",
              snakeBody[snakeBody.length - 2][0],
              snakeBody[snakeBody.length - 2][1]
            );
            break;
          case 3:
            turn(
              "üles",
              snakeBody[snakeBody.length - 2][0],
              snakeBody[snakeBody.length - 2][1]
            );
            break;
        }
      }

      if (lastMoveDirection === moveDirection) {
        snakeLength > 1
          ? bodyChange(
              snakeBody[snakeBody.length - 2][0],
              snakeBody[snakeBody.length - 2][1],
              "kere"
            )
          : "";
      } else if (
        (moveDirection > lastMoveDirection &&
          lastMoveDirection - moveDirection != -3) ||
        lastMoveDirection - moveDirection === 3
      ) {
        snakeLength > 1
          ? bodyChange(
              snakeBody[snakeBody.length - 2][0],
              snakeBody[snakeBody.length - 2][1],
              "kere_paremale"
            )
          : "";
        lastMoveDirection = moveDirection;
      } else if (
        moveDirection < lastMoveDirection ||
        moveDirection - lastMoveDirection === 3
      ) {
        snakeLength > 1
          ? bodyChange(
              snakeBody[snakeBody.length - 2][0],
              snakeBody[snakeBody.length - 2][1],
              "kere_vasakule"
            )
          : "";
        lastMoveDirection = moveDirection;
      }
      if (snakeLength > 1) {
        bodyChange(snakeBody[0][0], snakeBody[0][1], "saba");
      }
    }
  }, moveInterval);
};

/// GAME AREA CHANGE ///
const resizeGame = function (size) {
  gameSize = size;
  gameWidth = size;
  gameHeight = size;
  let markup = `<div class="row">`;
  const main = document.getElementById("main");

  for (let i = 0; i < gameSize; i++) {
    markup += `<div class="column">`;

    for (let j = 0; j < gameSize; j++) {
      markup += `<div class="square" data-x="${i + 1}" data-y="${
        j + 1
      }"></div>`;
    }
    markup += `</div>`;
  }
  markup += `</div>`;
  main.innerHTML = markup;

  makeFood(foodArray[0][0], foodArray[0][1]);
};

////////////////////
//MOVEMENT EXECUTION//
////////////////////
move();
food();
resizeGame(5);
////////Clickable boxes/////
box.addEventListener("click", function (e) {
  e.target.classList.toggle("snake");
});
