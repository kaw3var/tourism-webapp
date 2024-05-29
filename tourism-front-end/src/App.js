import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Header from "./components/header/Header";
import Profile from "./pages/Profile";
import Clients from "./pages/Clients";


import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/client.css";
import "./styles/header.css";


function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/clients" element={<Clients />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;