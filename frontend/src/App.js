import { Route, Routes, BrowserRouter } from "react-router-dom";
import ReactContext from "./ReactContext";
import Login from "./Component/Login/Login";
import Home from "./Component/Home/Home";

import BarCodeGenerator from "./Component/BarCodeGenerator/BarCodeGenerator";

import AllProducts from "./Component/AllProducts/AllProducts";

import BarCodeScanner from "./Component/BarCodeScanner/BarCodeScanner";

import Cart from "./Component/Cart/Cart";

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
        <Route 
          path="/barCodeGenerator" 
          element={
            <ReactContext element={<BarCodeGenerator />} />
          }
        />

        <Route 
          path="/allProducts" 
          element={
            <ReactContext element={<AllProducts />} />
          }
        />

        <Route
        path="/barCodeScanner"
        element={
          <ReactContext element={<BarCodeScanner />} />
          }
          />
          <Route
          path="/cart"
          element={
            <ReactContext element={<Cart />} />
            }
            />
       
      </Routes>
    </BrowserRouter>
  );
};

export default App;
