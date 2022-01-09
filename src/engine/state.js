export function createState() {
	return {
		gridWidth: 10,
		gridHeight: 10,
		direction: undefined,
		snakeBody: [
			{ x: 8, y: 5 },
			{ x: 7, y: 5 },
			{ x: 6, y: 5 }
		],
		gameOver: false,
		cherry: { x1: 5, y1: 5 },
		teleportSnake: false
	};
}


export const UP = "UP";
export const DOWN = "DOWN";
export const LEFT = "LEFT";
export const RIGHT = "RIGHT";
export const TIMER_TICK = "TIMER_TICK";

function calcHeadPos(direction, x, y) {
	if (direction === UP) {
		return { x, y: y - 1 };
	}

	if (direction === DOWN) {
		return { x, y: y + 1 };
	}

	if (direction === LEFT) {
		return { x: x - 1, y };
	}

	if (direction === RIGHT) {
		return { x: x + 1, y };
	}
	throw new Error("Unexpected direction value: " + direction);
}

function reduceState(state, event) {
	console.log("reduce", event, state);
	if (state.gameOver === true) {
		return state;
	}

	if (event === UP || event === DOWN || event === LEFT || event === RIGHT) {
		return { ...state, direction: event };
	}

	if (event === TIMER_TICK && state.direction !== undefined) {
		const [{ x, y }] = state.snakeBody;
		const head = calcHeadPos(state.direction, x, y);
		let rest = state.snakeBody.slice(0, state.snakeBody.length - 1);
		const { x1, y1 } = state.cherry;
		if (head.x === x1 && head.y === y1) {
			rest = state.snakeBody;
		}

		const snakeBody = [head, ...rest];
		return { ...state, snakeBody };
	}

	return state;
}

function isGameOver(state) {
	const body = state.snakeBody;
	for (let i = 1; i < body.length; i++) {
		if (body[0].x === body[i].x && body[0].y === body[i].y) {
			return true;
		}
	}
	for (let i = 1; i <= state.gridWidth; i++) {
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
// const newx = validateSnakeHeadX(state.gridWidth, x);
// const newy = validateSnakeHeadY(state.gridHeight, y);
function snakeTeleport(state) {
	if (state.teleportSnake) {
		const [{ x, y }, ...rest] = state.snakeBody;
		const newx = x < 0 ? state.gridWidth - 1 : (x >= state.gridWidth ? 0 : x);
		const newy = y < 0 ? state.gridHeight - 1 : (y >= state.gridHeight ? 0 : y);
		if (newx === x && newy === y) {
			return state;
		}
		return { ...state, snakeBody: [{ x: newx, y: newy }, ...rest] };
	} else {
		return state;
	}

}
function cherryPick(state) {
	const [{ x, y }] = state.snakeBody;
	const body = state.snakeBody;
	let cherry = state.cherry;
	if (x === state.cherry.x1 && y === state.cherry.y1) {
		let x1 = Math.floor(Math.random() * (state.gridWidth));
		let y1 = Math.floor(Math.random() * (state.gridHeight));
		for (let i = 0; i < body.length; i++) {
			if (x1 === body[i].x && y1 === body[i].y) {
				x1 = Math.floor(Math.random() * (state.gridWidth));
				y1 = Math.floor(Math.random() * (state.gridHeight));
			}
		}
		console.log(x1);
		console.log(y1);
		cherry = { x1, y1 };
		return { ...state, cherry }
	}

	return state;
}

export function updateState(state, event) {
	return gameOverCheck(snakeTeleport(reduceState(cherryPick(state), event)));
}