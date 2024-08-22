import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./Home";

test("renders Home component with correct content", () => {
  render(<Home />);

  const headingElement = screen.getByText(/Welcome to My Calorie App!/i);
  expect(headingElement).toBeInTheDocument();

  const paragraphElement = screen.getByText(
    /Track your calorie intake and stay on top of your health goals/i
  );
  expect(paragraphElement).toBeInTheDocument();

  expect(headingElement).toHaveClass(
    "text-4xl font-bold text-gray-800 mb-4 font-sans"
  );
  expect(paragraphElement).toHaveClass("text-lg text-gray-600 font-sans");
});
