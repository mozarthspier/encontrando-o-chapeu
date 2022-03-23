const prompt = require('prompt-sync')({sigint: true});
const _ = require('lodash')

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Player {
  constructor(field) {
    this.playingField = field;
  }

  move(playerMove) {
    if (!(this.validateMove(playerMove))) {
      console.log("Invalid move. Please choose between u, d, l, r.")
      return;
    }

    this[this.mapMove(playerMove)]();
  }

  validateMove(move) {
    const validMoves = ['u', 'd', 'l', 'r'];
    return validMoves.indexOf(move) !== -1;
  }

  mapMove(move) {
    const validMoves = ['u', 'd', 'l', 'r'];
    const mappedMoves = ['moveUp', 'moveDown', 'moveLeft', 'moveRight']
    return mappedMoves[validMoves.indexOf(move)];
  }

  moveUp() {
    this.playingField.movePlayer(this.playingField.playerCurrentPosition[0] - 1, this.playingField.playerCurrentPosition[1])
  }

  moveDown() {
    this.playingField.movePlayer(this.playingField.playerCurrentPosition[0] + 1, this.playingField.playerCurrentPosition[1])
  }

  moveLeft() {
    this.playingField.movePlayer(this.playingField.playerCurrentPosition[0], this.playingField.playerCurrentPosition[1] - 1)
  }

  moveRight() {
    this.playingField.movePlayer(this.playingField.playerCurrentPosition[0], this.playingField.playerCurrentPosition[1] + 1)
  }

}

class Field {
  constructor(fieldSchema) {
    this.fieldSchema = fieldSchema;
    this.playerCurrentPosition = [0, 0];
    this.heightLimit = fieldSchema.length;
    this.widthLimit = fieldSchema[0].length;
  }

  print() {
    for (let i = 0; i < this.fieldSchema.length; i++) {
      console.log(this.fieldSchema[i].join(''));
    }
  }

  movePlayer(moveX, moveY) {
    if (!_.inRange(moveX, this.heightLimit)) {
      console.log("You fell out of the board. Game over!");
      process.exit();
    } else if (!_.inRange(moveY, this.widthLimit)) {
      console.log("You fell out of the board. Game over!");
      process.exit();
    } else if (this.fieldSchema[moveX][moveY] === 'O') {
      this.fieldSchema[ this.playerCurrentPosition[0]][ this.playerCurrentPosition[1]] = '░';
      this.fieldSchema[moveX][moveY] = '*';
      this.print();
      console.log("You fell into a hole. Game over!");
      process.exit();
    } else if (this.fieldSchema[moveX][moveY] === '^') {
      this.fieldSchema[ this.playerCurrentPosition[0]][ this.playerCurrentPosition[1]] = '░';
      this.fieldSchema[moveX][moveY] = '*';
      this.print();
      console.log("You found the hat. You won!");
      process.exit();
    } else {
      this.fieldSchema[ this.playerCurrentPosition[0]][ this.playerCurrentPosition[1]] = '░';
      this.fieldSchema[moveX][moveY] = '*';
      this.playerCurrentPosition = [moveX, moveY];
    }
  }

  static generateField(width, height, percentage = 0.3) {
    let generatedField = [];
    if (percentage > 1 || percentage < 0) {
      return "Invalid percentage. Percentage should be between 0 and 1."
    }

    for (let i = 0; i < height; i++) {
      generatedField.push([]);
      for (let j = 0; j < width; j++) {
        if (Math.random() < percentage) {
          let newArr = generatedField[i];
          newArr.push('O');
        } else {
          let newArr = generatedField[i];
          newArr.push('░');
        }
      }
    }

    generatedField[0][0] = '*';
    let posX;
    let posY;
    do {
      posX = Math.floor(Math.random() * width);
      posY = Math.floor(Math.random() * height);
    } while (posX === 0 && posY === 0);

    generatedField[posY][posX] = '^';

    return generatedField;
  }
}

/*const myField = new Field([
  ['*', '░', '░', '░'],
  ['░', 'O', 'O', '░'],
  ['░', 'O', '░', '░'],
]);*/

const newField = Field.generateField(5, 3);
const myField = new Field(newField);

const myPlayer = new Player(myField);

while (true) {
  myField.print();
  let playerMove = prompt("Which way? ");
  myPlayer.move(playerMove);
}