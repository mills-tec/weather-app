import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Weather from "./Pages/Weather";
import Map from "./Pages/Map";
import Contact from "./Pages/Contact";
import Nav from "./navigation/Nav";
import { useState , createContext} from "react";

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
              <Route path="/" element={<Weather />} />
              <Route path="/about" element={<Map />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Router>
        </div>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
