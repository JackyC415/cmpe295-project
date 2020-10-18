import React from 'react';
import Main from "./components/Main";
import { Route, BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <div>
          <Route path="/" component={Main} />
        </div>
      </div>
    </Router>
  );
}

export default App;
