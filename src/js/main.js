// const { doc } = require("prettier");
//variables
import { paintState } from './paint.js';
import { updateState, TIMER_TICK, UP, DOWN, RIGHT, LEFT } from './state.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const eventFromKeyCodes = {
	ArrowUp: UP,
	ArrowDown: DOWN,
	ArrowLeft: LEFT,
	ArrowRight: RIGHT
};


function handleEvent(event) {
	updateState(event, function (state) {
		paintState(ctx, state)
	});
}

setInterval(() => {
	handleEvent(TIMER_TICK);
}, 100);

document.addEventListener("keydown", (event) =>
	handleEvent(eventFromKeyCodes[event.key])
);



