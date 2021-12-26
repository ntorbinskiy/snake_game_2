export function paintState(context, state) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	if (state.gameOver) {
		context.textAlign = "center";
		context.font = "30px Arial";
		context.fillText("GAME OVER", context.canvas.width / 2, context.canvas.height / 2);
		return;
	}
	let cellW = context.canvas.width / state.gridWidth;
	let cellH = context.canvas.height / state.gridHeight;
	for (let i = cellW; i < context.canvas.width; i += cellW) {
		context.beginPath();
		context.moveTo(i, 0);
		context.lineTo(i, 500);
		context.stroke();
		context.closePath();
	}

	for (let i = cellH; i < context.canvas.height; i += cellH) {
		context.beginPath();
		context.moveTo(0, i);
		context.lineTo(500, i);
		context.stroke();
		context.closePath();
	}

	drawSnakeHead(
		context,
		(state.snakeBody[0].x + 0.5) * cellW,
		(state.snakeBody[0].y + 0.5) * cellH,
		Math.min(cellW / 2, cellH / 2)
	);

	for (let i = 1; i < state.snakeBody.length; i++) {
		drawSnakeBody(
			context,
			(state.snakeBody[i].x + 0.5) * cellW,
			(state.snakeBody[i].y + 0.5) * cellH,
			Math.min(cellW / 2, cellH / 2)
		);
	}

	drawCherry(context,
		(state.cherry.x1 + 0.5) * cellW,
		(state.cherry.y1 + 0.5) * cellH,
		Math.min(cellW / 2, cellH / 2)
	);

}

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