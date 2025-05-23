import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Weather from "../src/Pages/Weather";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Nav from "./navigation/Nav";
import { useState } from "react";
import { createContext } from "react";
export const ThemeContext = createContext();
function App() {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };
  return (
    <>
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <div className={theme}>
          <Router>
            <Nav />
            <Routes>
              {/* <Route path='/' element={<Home/>} /> */}
              <Route path="/" element={<Weather />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Router>
        </div>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
