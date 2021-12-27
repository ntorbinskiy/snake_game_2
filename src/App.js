import './App.css';
import { useState } from "react";
import { createState } from "./engine/state.js";

function Cells({ state }) {
  const result = [];
  for (let x = 0; x < state.gridWidth; x += 1) {
    for (let y = 0; y < state.gridHeight; y += 1) {
      result.push(<Cell key={x * y} type={getCellType(state, x, y)} />);
    }
  }
  return result;
}

const HEAD = "HEAD";
const BODY = "BODY";
const CHERRY = "CHERRY";

function getCellType(state, x, y) { // return type
  return state.cherry.x1 === x && state.cherry.y1 === y ? CHERRY : HEAD;
}

function Cell({ type }) {
  if (type === HEAD) {
    return <div className="cell">H</div>
  }

  if (type === BODY) {
    return <div className="cell">B</div>
  }

  if (type === CHERRY) {
    return <div className="cell">C</div>
  }

  console.error("Unexpected type", type);
  return null
}

function App() {
  const [state] = useState(createState);

  return (
    <div className="App">
      <div className="field" style={{
        gridTemplateColumns: `repeat(${state.gridWidth}, 1fr)`,
        gridTemplateRows: `repeat(${state.gridHeight}, 1fr)`
      }}>
        <Cells state={state} />
      </div>
    </div>
  );
}

export default App;
