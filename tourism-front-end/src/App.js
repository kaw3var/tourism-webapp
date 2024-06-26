import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./entities/header/ui";
import { RouteTrip, Main, Clients } from "./pages"

import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/client.css";
import "./styles/header.css";


const App = () => (
  <div className="App">
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/routes" element={<RouteTrip />}/>
        <Route path="/clients" element={<Clients />}/>
        {/* <Route path="/book-tour" element={<BookTour />}/> */}
      </Routes>
    </Router>
  </div>
);

export default App;