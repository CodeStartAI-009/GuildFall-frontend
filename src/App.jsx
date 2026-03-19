import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import SplashScreen from "./pages/load/SplashScreen";
import Home from "./pages/Home/Homepage";
import Lobby from "./pages/lobby/lobbypage";
import Game from "./pages/Game/Game";
import InfoPage from "./pages/Home/InfoPage";
import "./App.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route path="/:type" element={<InfoPage />} />
      <Route path="/" element={<Home />} />
      <Route path="/lobby/:roomId" element={<Lobby />} />
     <Route path="/game/:roomId" element={<Game />} />  
    </Routes>
  );
}

export default App;