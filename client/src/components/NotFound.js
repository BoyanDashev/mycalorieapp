const NotFound  = () => {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-red-400 via-blue-500 to-purple-600">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-sans">
            Welcome to My Calorie App!
          </h1>
          <h2 className="text-lg text-gray-600 font-sans">
            PAGE NOT FOUND.
          </h2>
        </div>
      </div>
    );
}

export default NotFound;