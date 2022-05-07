import { expect, test } from '@jest/globals';
import exp from 'constants';
import { gameBoard, Ship } from './script';

//Ship class

test('creates a ship', () => {
  const ship = new Ship(4, 2, false);
  expect(ship).toEqual({ length: 4, hit: 2, sunk: false });
});

test('should be sunk', () => {
  const ship = new Ship([1, 2, 3, 4], 4, false);
  expect(ship.sunkF()).toBeTruthy();
});

test('test this.sunk', () => {
  const ship = new Ship([['A1'], ['A2'], ['A3'], ['A4']], 4, false);
  ship.sunkF();
  expect(ship.sunk).toBeTruthy();
});

test('plus a hit', () => {
  const ship = new Ship([1, 2, 3, 4], 0, false);
  ship.hitF();
  expect(ship.hit).toBe(1);
});

test('place a ship', () => {
  const theBoard = gameBoard();
  theBoard.buildShip();
  expect(theBoard.board[0][1]).toEqual('ship');
});

test('place a ship2', () => {
  const theBoard = gameBoard();
  theBoard.buildShip();
  expect(theBoard.board[0][2]).toEqual('ship');
});

test('place a ship3', () => {
  const theBoard = gameBoard();
  theBoard.buildShip();
  expect(theBoard.board[0][5]).toEqual('ship');
});

test('receive attack', () => {
  const theBoard = gameBoard();
  theBoard.buildShip();
  theBoard.receiveAttack('11');
  expect(theBoard.board[0][1]).toEqual('hit');
});

test('receive attack', () => {
  const theBoard = gameBoard();
  theBoard.buildShip();
  theBoard.receiveAttack('51');
  expect(theBoard.board[4][1]).toEqual('miss');
});
