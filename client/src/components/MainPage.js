const MainPage = () => {
    return (
      <div className="flex items-start justify-center h-screen bg-gradient-to-r from-red-400 via-blue-500 to-purple-600">
            <div className="text-center mt-4 p-6 bg-white rounded-lg shadow-lg">
                
                <h1>Calorie Remaining</h1>
                <p>2890 - 200 = 2690</p>
                <p>Goal - Food = Remaining</p>
                <h2>Todays Day</h2>
                <button>Add Food</button>
                {/* When the add food button is clicked it should be able to make a Modal component which should add food.
                 */}
                <div> The food will be rendered here</div>
                <div>Calories will be rendered here</div>
                <p> Paragraph for telling the people What these results mean.</p>


                
                
         </div>
      </div>
    );
    
}

export default MainPage;