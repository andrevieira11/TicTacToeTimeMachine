import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className={props.winningSquare ? "filledSquare" : "square"}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      winningSquare={ (i === this.props.positions[0]) || (i === this.props.positions[1]) || (i === this.props.positions[2]) ? true : false}
    />;
  }

  render() {
    let rows = []
    for(let i = 0; i < 3; i++){
      let columns = []
      for(let j = 0; j < 3; j++){
        columns.push(this.renderSquare((i*2) + i+j))
      }
      rows.push(<div className="board-row">{columns}</div>)
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      lastPlaced: [],
      xIsNext: true,
      descending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      lastPlaced: this.state.lastPlaced.concat([i]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleOrder() {
    this.setState({descending: !this.state.descending})
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move: ' + (move%2 === 0 ? 'O' : 'X') + ' on (' + (this.state.lastPlaced[move-1]%3 + 1) + ', ' + (Math.trunc(this.state.lastPlaced[move - 1]/3) + 1) + ')':
      'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}
          >{move == this.state.stepNumber ? (<b>{desc}</b>) : desc}</button>
        </li>
      );
    });

    let status;
    if(winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else {
      if(this.state.stepNumber >= 9){
        status = 'Game is tied!'
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            positions = {winner != null ? winner : [9]}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.descending ? moves : moves.reverse()}</ol>
          <button onClick={() => this.toggleOrder()}>Toggle moves order</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}
