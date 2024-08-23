# MyCalorieApp

**MyCalorieApp** is a user-friendly application that helps users track their daily calorie intake and manage their nutrition goals. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), this app allows users to log meals, monitor their nutritional intake.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **User Authentication**: Secure sign-up, login, and logout functionalities using JWT.
- **Calorie Tracking**: Log meals and track daily.
- **Nutrient Analysis**: Break down of protein, carbs, fats, and other nutrients.
- **Custom Goals**: Set personalized nutrition goals based on dietary needs.
- **Responsive Design**: Works seamlessly on mobile, and desktop devices.

You can check out the live app (https://mycalorieapp-both.onrender.com/)

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/atlas) - you need to have a mongo db local or Atlas Database.

### Steps to Install

1. **Clone the repository**:
    ```bash
    git clone https://github.com/BoyanDashev/MyCalorieApp.git
    cd MyCalorieApp
    ```

2. **Install server dependencies**:
    ```bash
    cd server
    npm install
    ```

3. **Install client dependencies**:
    ```bash
    cd client
    npm install
    ```

4. **Set up environment variables**:

    Create a `.env` file in the `backend` directory with the following content:

    ```plaintext
    NODE_ENV=development
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

5. **Run the application**:

    In the `backend` directory, start the server:
    ```bash
    npm run dev or node server
    ```

    In the `frontend` directory, start the React app:
    ```bash
    npm start
    ```

    The app should now be running at `http://localhost:3000`.

## Usage

- **Sign Up/Login**: Create a new account or log in to your existing account.
- **Track Meals**: Add meals and automatically calculate the total calories and nutrients.
- **Set Goals**: Customize your daily calorie.
- **Monitor Progress**: View daily reports on your nutrition.


## Technologies Used

- **Frontend**: React.js, Redux, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS, Tailwind CSS

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a pull request.


## Contact

If you have any questions or suggestions, feel free to reach out!

- **Email**: b.dashevv@gmail.com
- **LinkedIn**: (https://www.linkedin.com/in/boyan-dashev-aa1a69299/)

---

Thank you for using MyCalorieApp! Happy tracking!
