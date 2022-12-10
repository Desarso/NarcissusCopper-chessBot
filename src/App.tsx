import type { Component } from 'solid-js';
import '../css/styles.css'
import  Chessboard  from './components/Chessboard';


const App: Component = () => {
  return (
    <div>
      <Chessboard/>
    </div>
  );
};

export default App;
