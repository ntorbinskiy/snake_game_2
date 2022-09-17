import './App.css';
import { useState, useEffect, useCallback } from "react";
import { createState, updateState, TIMER_TICK, UP, DOWN, LEFT, RIGHT } from "./engine/state.js";

function Cells({ state }) {
	const result = [];
	for (let y = 0; y < state.gridWidth; y++) {
		for (let x = 0; x < state.gridHeight; x++) {
			result.push(<Cell key={`${x}_${y}`} type={getCellType(state, x, y)} x={x} y={y} />);
		}
	}
	return result;
}

const HEAD = "HEAD";
const BODY = "BODY";
const CHERRY = "CHERRY";
const CELL = "CELL";
function getSnakeBody(state, x, y) {
	const body = state.snakeBody;
	for (let i = 0; i < body.length; i++) {
		if (body[i].x === x && body[i].y === y) {
			return i;
		}
	}
	return -1;
}
function getCellType(state, x, y) { // return type
	if (state.cherry.x1 === x && state.cherry.y1 === y) {
		return CHERRY;
	}
	const index = getSnakeBody(state, x, y);
	if (index === 0) {
		return HEAD;
	}
	if (index > 0) {
		return BODY;
	}
	return CELL;
}
function getCellContent(type) {
	if (type === HEAD) {
		return <div className='head'></div>;
	}
	if (type === BODY) {
		return <div className='body'></div>;
	}

	if (type === CHERRY) {
		return <div className='cherry'></div>;
	}

	return null;
}

function Cell({ type, x, y }) {
	const cellContent = getCellContent(type);
	return <div className='cell' data-pos={`${x},${y}`}>{cellContent}</div>;
}

const eventFromKeyCodes = {
	ArrowUp: UP,
	ArrowDown: DOWN,
	ArrowLeft: LEFT,
	ArrowRight: RIGHT
};

function App() {
	const [state, setState] = useState(createState);


	const onKeyDown = useCallback(event => {
		const gameEvent = eventFromKeyCodes[event.key];
		if (gameEvent !== undefined) {
			setState(s => updateState(s, gameEvent));
		}
	}, [setState]);

	const restartGame = useCallback(() => {
		setState(createState());
	}, [setState]);


	useEffect(() => {
		const timer = setInterval(() => {
			setState(s => updateState(s, TIMER_TICK));
		}, 100);

		document.addEventListener("keydown", onKeyDown);
		return () => {
			clearInterval(timer);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [setState, onKeyDown]);

	if (state.gameOver) {
		return (
			<div className="App">
				GAME OVER
				<button onClick={restartGame}>Restart</button>
			</div>
		);
	}

	return (
		<div className="App">
			<div className="field" style={{
				gridTemplateColumns: `repeat(${state.gridWidth}, 1fr)`,
				gridTemplateRows: `repeat(${state.gridHeight}, 1fr)`,
			}}>
				<Cells state={state} />
			</div>
		</div>
	);
}
//app js
export default App;
