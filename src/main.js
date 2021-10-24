//variables
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let currentState = {
	gridWidth: 20,
	gridHeight: 20,
	direction: undefined,
	snakeBody: [
		{ x: 15, y: 5 },
		{ x: 14, y: 5 },
		{ x: 13, y: 5 },
		{ x: 12, y: 5 },
		{ x: 11, y: 5 },
		{ x: 10, y: 5 },
		{ x: 9, y: 5 },
		{ x: 8, y: 5 },
		{ x: 7, y: 5 },
		{ x: 6, y: 5 },
		{ x: 5, y: 5 },
		{ x: 4, y: 5 },
		{ x: 3, y: 5 },
	],
	gameOver: false,
	cherry: [{ x: 5, y: 10 }, { x: 5, y: 16 }]
};

const UP = "UP",
	DOWN = "DOWN",
	LEFT = "LEFT",
	RIGHT = "RIGHT",
	TIMER_TICK = "TIMER_TICK";

const eventFromKeyCodes = {
	ArrowUp: UP,
	ArrowDown: DOWN,
	ArrowLeft: LEFT,
	ArrowRight: RIGHT,
};

function drawSnakeHead(context, x, y, r) {
	context.beginPath();
	context.arc(x, y, r, 0, Math.PI * 2);
	context.fillStyle = "#0099cc";
	context.closePath();
	context.fill();
	context.stroke();
}

function drawSnakeBody(context, x, y, r) {
	context.beginPath();
	context.arc(x, y, r, 0, Math.PI * 2);
	context.fillStyle = "orange";
	context.closePath();
	context.fill();
	context.stroke();
}
function drawCherry(context, x, y, r) {
	context.beginPath();
	context.arc(x, y, r, 0, Math.PI * 2);
	context.fillStyle = "#973434";
	context.closePath();
	context.fill();
	context.stroke();
}

function reduceState(state, event) {
	console.log("reduce", event, state);
	if (state.gameOver === true) {
		return state;
	}

	if (event === UP || event === DOWN || event === LEFT || event === RIGHT) {
		return { ...state, direction: event };
	}

	if (event === TIMER_TICK) {

		const [{ x, y }] = state.snakeBody;
		const rest = state.snakeBody.slice(0, state.snakeBody.length - 1);

		if (state.direction === UP) {
			const snakeBody = [{ x, y: y - 1 }, ...rest];
			return { ...state, snakeBody };
		}

		if (state.direction === DOWN) {
			const snakeBody = [{ x, y: y + 1 }, ...rest];
			return { ...state, snakeBody };
		}

		if (state.direction === LEFT) {
			const snakeBody = [{ x: x - 1, y }, ...rest];
			return { ...state, snakeBody };
		}

		if (state.direction === RIGHT) {
			const snakeBody = [{ x: x + 1, y }, ...rest];

			return { ...state, snakeBody };
		}
	}

	return state;
}

function isGameOver(state) {
	const body = state.snakeBody;
	for (i = 1; i < body.length; i++) {
		if (body[0].x === body[i].x && body[0].y === body[i].y) {
			return true;
		}
	}
	for (i = 1; i <= state.gridWidth; i++) {
		if (body[0].x > state.gridWidth || body[0].y > state.gridHeight || body[0].x < 0 || body[0].y < 0) {
			return true;
		}
	}
}

function gameOverCheck(state) {
	if (isGameOver(state) && state.gameOver === false) {
		return { ...state, gameOver: true };
	}
	return state;
}
// function validateSnakeHeadX(gridWidth, x) {
// 	if (x < 0) {
// 		return gridWidth - 1;
// 	}
// 	if (x >= gridWidth) {
// 		return 0;
// 	}
// 	return x;
// }
// function validateSnakeHeadY(gridHeight, y) {
// 	if (y < 0) {
// 		return gridHeight - 1;
// 	}
// 	if (y >= gridHeight) {
// 		return 0;
// 	}
// 	return y;
// }
// function snakeTeleport(state) {
// 	const [{ x, y }, ...rest] = state.snakeBody;
// const newx = x < 0 ? state.gridWidth - 1 : (x >= state.gridWidth ? 0 : x);
// const newy = y < 0 ? state.gridHeight - 1 : (y >= state.gridHeight ? 0 : y);
// 	const newx = validateSnakeHeadX(state.gridWidth, x);
// 	const newy = validateSnakeHeadY(state.gridHeight, y);
// 	if (newx === x && newy === y) {
// 		return state;
// 	}
// 	return { ...state, snakeBody: [{ x: newx, y: newy }, ...rest] };
// }
function cherryPick(state) {
	const [{ x, y }] = state.snakeBody;
	for (let i = 0; i < state.cherry.length; i++) {
		if (x === state.cherry[i].x && y === state.cherry[i].y) {
			const newCherry = state.cherry.splice(i, 1);
			return { ...state, newCherry }
		}
	}

	return state;
}

function paintState(context, state) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	if (state.gameOver === true) {
		ctx.textAlign = "center";
		context.font = "30px Arial";
		context.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
		return;
	}
	let cellW = context.canvas.width / currentState.gridWidth;
	let cellH = context.canvas.height / currentState.gridHeight;
	for (i = cellW; i < context.canvas.width; i += cellW) {
		context.beginPath();
		context.moveTo(i, 0);
		context.lineTo(i, 500);
		context.stroke();
		context.closePath();
	}

	for (i = cellH; i < context.canvas.height; i += cellH) {
		context.beginPath();
		context.moveTo(0, i);
		context.lineTo(500, i);
		context.stroke();
		context.closePath();
	}

	drawSnakeHead(
		ctx,
		(state.snakeBody[0].x + 0.5) * cellW,
		(state.snakeBody[0].y + 0.5) * cellH,
		Math.min(cellW / 2, cellH / 2)
	);

	for (i = 1; i < state.snakeBody.length; i++) {
		drawSnakeBody(
			ctx,
			(state.snakeBody[i].x + 0.5) * cellW,
			(state.snakeBody[i].y + 0.5) * cellH,
			Math.min(cellW / 2, cellH / 2)
		);
	}
	for (let i = 0; i < state.cherry.length; i++) {
		drawCherry(ctx,
			(state.cherry[i].x + 0.5) * cellW,
			(state.cherry[i].y + 0.5) * cellH,
			Math.min(cellW / 2, cellH / 2)
		);
	}

}
function handleEvent(event) {
	currentState = gameOverCheck(cherryPick(reduceState(currentState, event)));
	paintState(ctx, currentState);
}

setInterval(() => {
	handleEvent(TIMER_TICK);
}, 100);

document.addEventListener("keydown", (event) =>
	handleEvent(eventFromKeyCodes[event.key])
);

paintState(ctx, currentState);
