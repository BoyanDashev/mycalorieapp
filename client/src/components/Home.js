import React from "react";

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-slate-400 via-blue-500 to-purple-600">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 font-sans">
          Welcome to My Calorie App!
        </h1>
        <p className="text-lg text-gray-600 font-sans">
          Track your calorie intake and stay on top of your health goals. Our
          app helps you monitor your daily calorie consumption and provides
          insights to help you maintain a balanced diet.
        </p>
      </div>
    </div>
  );
};

export default Home;
