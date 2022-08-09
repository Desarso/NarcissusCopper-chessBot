import logo from './logo.svg';
import styles from './App.module.css';
import ChessBoard from './components/ChessBoard';

function App() {
  return (
    <div class={styles.App}>
     <ChessBoard/>
    </div>
  );
}

export default App;
