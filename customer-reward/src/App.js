import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AllRewards from "./component/AllRewards";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AllRewards />
      </BrowserRouter>
    </div>
  );
}

export default App;
