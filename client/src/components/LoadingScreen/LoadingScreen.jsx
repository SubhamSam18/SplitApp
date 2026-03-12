import React from "react";
import { useLoading } from "../../context/LoadingContext";
import "./LoadingScreen.css";

const LoadingScreen = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
        <p className="loading-text">Splitting things up...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
