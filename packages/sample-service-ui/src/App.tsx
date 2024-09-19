import "bulma";
import "./App.scss";
import { MainCard } from "./components/MainCard";

function App() {
  return (
    <div className="container">
      <div className="fixed-grid has-1-cols">
        <div className="grid">
          <div className="cell">
            <MainCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
