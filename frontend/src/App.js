import { Route, Routes, BrowserRouter } from "react-router-dom";
import ReactContext from "./ReactContext";
import Login from "./Component/Login/Login";
import Home from "./Component/Home/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Protect the Home route using ReactContext */}
        <Route 
          path="/" 
          element={
            <ReactContext element={<Home />} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
