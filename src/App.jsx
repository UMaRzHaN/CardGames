import "./App.css";
import { React, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCards } from "./redux/action";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import GamePage from "./pages/GamePage";
import RegisterPage from "./pages/RegisterPage";
import ModalGame from "./componets/ModalGame";
import Klondike from "./pages/Klondike";
import EnterUser from "./pages/EnterUser";
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCards());
  }, [dispatch]);
  return (
    <div className="App">
      <Routes>
        <Route
          element={
            localStorage.getItem("user") ? (
              <Navigate to="/user:" replace />
            ) : (
              <RegisterPage />
            )
          }
          path="/"
        />
        <Route element={<RegisterPage />} path="/register" />
        <Route element={<UserPage />} path="/user:" />
        <Route element={<ModalGame />} path="/modal" />
        <Route element={<GamePage />} path="/game/:roomCode" />
        <Route element={<Klondike />} path="/klondike" />
        <Route element={<EnterUser />} path="/enter" />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
