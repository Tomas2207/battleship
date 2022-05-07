class Ship {
  constructor(length, hit, sunk, name) {
    this.length = length;
    this.hit = hit;
    this.sunk = sunk;
    this.name = name;
  }

  hitF() {
    this.hit++;
  }

  sunkF() {
    if (this.hit === this.length.length) {
      this.sunk = true;
      return true;
    } else return false;
  }
}

const gameBoard = (playerName) => {
  const player = playerName;
  const board = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    [51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
    [61, 62, 63, 64, 65, 66, 67, 68, 69, 70],
    [71, 72, 73, 74, 75, 76, 77, 78, 79, 80],
    [81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
    [91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
  ];

  const shipsArr = [];

  const buildShip = (arr, nameShip) => {
    return new Ship(arr, 0, false, nameShip);
  };

  const placeShip = (arr, name) => {
    for (let i = 0; i < arr.length; i++) {
      let el = arr[i];
      el = el.split('');
      let x = el[0];
      let y = el[1];

      board[x][y] = name;
    }
  };

  const receiveAttack = (attack) => {
    let el = attack;
    el = el.split('');
    let x = el[1];
    let y = el[2];
    if (!Number.isInteger(board[x][y])) {
      board[x][y] = 'hit';
    } else {
      board[x][y] = 'miss';
    }
  };
  return { player, board, buildShip, placeShip, receiveAttack, shipsArr };
};

let loop = 4;
let loopCounter = 0;
const p1Board = gameBoard('Player 1');

function populateBoard() {
  let x = 0;
  let y = 0;
  let numberName = 0;
  let counter = 0;
  const p1DomBoard = document.getElementById('player1');

  p1Board.board.forEach((row) => {
    row.forEach((tile) => {
      const domTile = document.createElement('div');
      p1DomBoard.appendChild(domTile);
      domTile.classList.add('tile');
      domTile.dataset.xy = 'f' + x.toString() + y;

      p1DomBoard.appendChild(domTile);
      counter++;
      y++;
      if (y === 10) {
        x++;
      }
      if (counter === 10) {
        counter = 0;
        y = 0;
      }

      domTile.addEventListener(
        'click',
        (clickHandler = function (event) {
          let arr = [];
          let x = domTile.dataset.xy;
          x.split('');
          let y = x[2];
          x = x[1];
          if (
            parseInt(y) + loop <= 10 &&
            !domTile.classList.contains('selected-tile')
          ) {
            for (let i = 0; i < loop; i++) {
              const tileShip = document.querySelector(
                '[data-xy=' + 'f' + x + y + ']'
              );
              tileShip.classList.add('selected-tile');

              y++;
              arr.push('' + x + y + '');
            }
            loopCounter++;
            if (loopCounter <= 2) {
              loop = 3;
            } else if (loopCounter > 2 && loopCounter <= 5) {
              loop = 2;
            } else if (loopCounter > 5 && loopCounter <= 9) {
              loop = 1;
            } else if (loopCounter > 9) {
              loop = 0;
              const p2 = document.querySelector('#player2');
              p2.classList.add('seen');
            }

            if (loopCounter <= 10) {
              const newShip = p1Board.buildShip(arr, 'S' + numberName);

              numberName++;

              p1Board.placeShip(arr, newShip.name);

              p1Board.shipsArr.push(newShip);
            }
          }
        })
      );
    });
  });
}
let loopAI = 4;
let arrAI = [];

function populateAIBoard() {
  let sinkCounter = 0;
  let x = 0;
  let y = 0;
  let counter = 0;
  const p2DomBoard = document.getElementById('player2');
  const p2Board = gameBoard('AI');
  p2Board.board.forEach((row) => {
    row.forEach((tile) => {
      const domTile = document.createElement('div');
      p2DomBoard.appendChild(domTile);
      domTile.classList.add('tile');
      domTile.dataset.xy = 'A' + x.toString() + y;

      domTile.addEventListener('click', () => {
        if (
          !domTile.classList.contains('hit-tile') &&
          !domTile.classList.contains('miss-tile')
        ) {
          let att = domTile.getAttribute('data-xy');
          p2Board.receiveAttack(att);
          if (domTile.classList.contains('hidden-tile')) {
            domTile.classList.add('hit-tile');
            let yes;
            for (let x = 0; x < 10; x++) {
              yes = checkShips(p2Board, x);
              if (yes === true) sinkCounter++;
              sinkCounter;
            }
          } else {
            domTile.classList.add('miss-tile');
          }

          let attackCoor = AIattack();
          attackCoor.split('');
          attackX = attackCoor[1];
          attackY = attackCoor[2];

          let tileShip = document.querySelector(
            '[data-xy=' + 'f' + attackX + attackY + ']'
          );
          while (
            tileShip.classList.contains('miss-tile') ||
            tileShip.classList.contains('hit-tile')
          ) {
            attackCoor = AIattack();
            attackCoor.split('');
            attackX = attackCoor[1];
            attackY = attackCoor[2];
            tileShip = document.querySelector(
              '[data-xy=' + 'f' + attackX + attackY + ']'
            );
          }
          p1Board.receiveAttack(attackCoor);
          if (tileShip.classList.contains('selected-tile')) {
            tileShip.classList.add('hit-tile');
            let yess;
            for (let x = 0; x < 10; x++) {
              checkShips(p1Board, x);
            }
          } else {
            tileShip.classList.add('miss-tile');
          }
        }
      });

      p2DomBoard.appendChild(domTile);
      counter++;
      y++;
      if (y === 10) {
        x++;
      }
      if (counter === 10) {
        counter = 0;
        y = 0;
      }
    });
  });

  let xCoord = Math.floor(Math.random() * 5);
  let yCoord = Math.floor(Math.random() * 5);

  for (let x = 0; x < 10; x++) {
    if (x < 2) {
      xCoord = Math.floor(Math.random() * 5);
      yCoord = Math.floor(Math.random() * 2);
      while (!Number.isInteger(p2Board.board[xCoord][yCoord])) {
        xCoord = Math.floor(Math.random() * 5);
        yCoord = Math.floor(Math.random() * 2);
      }
    } else if (x >= 2 && x < 5) {
      xCoord = Math.floor(Math.random() * 5);
      yCoord = Math.floor(Math.random() * (7 - 6) + 6);
      while (!Number.isInteger(p2Board.board[xCoord][yCoord])) {
        xCoord = Math.floor(Math.random() * 5);
        yCoord = Math.floor(Math.random() * (7 - 6) + 6);
      }
    } else if (x >= 5 && x < 8) {
      xCoord = Math.floor(Math.random() * (10 - 5) + 5);
      yCoord = Math.floor(Math.random() * 2);
      while (!Number.isInteger(p2Board.board[xCoord][yCoord])) {
        xCoord = Math.floor(Math.random() * (10 - 5) + 5);
        yCoord = Math.floor(Math.random() * 2);
      }
    } else if (x >= 8) {
      xCoord = Math.floor(Math.random() * (10 - 5) + 5);
      yCoord = Math.floor(Math.random() * (7 - 6) + 6);
      while (!Number.isInteger(p2Board.board[xCoord][yCoord])) {
        xCoord = Math.floor(Math.random() * (10 - 5) + 5);
        yCoord = Math.floor(Math.random() * (7 - 6) + 6);
      }
    }
    createTile(xCoord, yCoord, arrAI, p2Board, x);
    arrAI = [];
  }
}

populateBoard();
populateAIBoard();

function AIattack() {
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);
  return 'f' + x + y;
}

function createTile(xCoord, yCoord, arrAI, p2Board, loopCounterAI) {
  for (let i = 0; i < loopAI; i++) {
    const tileShipAI = document.querySelector(
      '[data-xy=' + 'A' + xCoord + yCoord + ']'
    );

    tileShipAI.classList.add('hidden-tile');

    arrAI.push('' + xCoord + yCoord + '');

    yCoord++;
    direction = 2;
  }
  const newShip = p2Board.buildShip(arrAI, 'S' + loopCounterAI);
  p2Board.placeShip(arrAI, newShip.name);

  arrAI = [];

  if (loopCounterAI <= 2) {
    loopAI = 3;
    tileLength = 3;
  } else if (loopCounterAI > 2 && loopCounterAI <= 5) {
    loopAI = 2;
    tileLength = 2;
  } else if (loopCounterAI > 5 && loopCounterAI <= 9) {
    loopAI = 1;
    tileLength = 1;
  } else if (loopCounterAI > 9) {
    loopAI = 0;
  }

  p2Board.shipsArr.push(newShip);
}

function checkShips(player, x) {
  let check = false;

  player.board.forEach((row) => {
    row.forEach((tile) => {
      if (tile === 'S' + x) {
        check = true;
      }
    });
  });

  if (check === false) {
    player.shipsArr = player.shipsArr.filter(function (obj) {
      return obj.name !== 'S' + x;
    });
    if (player.shipsArr.length === 0) {
      const winning = document.querySelector('.winning');
      winning.classList.add('winning-show');
      const winner = document.querySelector('.winner');
      if (player.player === 'AI') {
        winner.innerHTML = 'PLAYER 1 WINS';
      } else {
        winner.innerHTML = 'AI WINS';
      }
    }
  }
}

module.exports = { Ship, gameBoard };
