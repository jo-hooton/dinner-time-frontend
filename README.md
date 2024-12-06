# Dinner Time Frontend

## Overview

Dinner Time is a web application that helps users quickly find the most relevant recipes based on the ingredients they already have at home. The application also allows users to exclude specific ingredients, set time constraints for recipe preparation, and save their favourite recipes.

The frontend of Dinner Time is built using **React** with **TypeScript** for type safety and **Tailwind CSS** for styling. The frontend provides a user-friendly interface to search for recipes, filter by ingredients, exclude specific ingredients, filter by time, and save favourites.

## User Stories

Below are the user stories that outline the core features of Dinner Time and their importance to the overall user experience:

### User Story 1: Search for Recipes by Ingredients

As a **home cook**, I want to **search for recipes using the ingredients** I have at home so that I can **quickly find dishes** to prepare without needing to buy additional ingredients.

- **Acceptance Criteria**:
  - Users can enter multiple ingredients in the search bar.
  - The app displays recipes that match the provided ingredients.
  - Debouncing ensures efficient searching without excessive API requests.

### User Story 2: Exclude Unwanted Ingredients

As a user with limited ingredients in my kitchen, I want to **exclude certain ingredients** from the search results so that I do not see recipes containing ingredients I do not have.

- **Acceptance Criteria**:
  - Users can enter space-separated ingredients they wish to exclude in the "Exclude ingredients" input field.
  - Recipes containing these excluded ingredients are filtered out from the results.

### User Story 3: Filter Recipes by Preparation Time

As a **busy individual**, in addition to filtering by ingredients, I want to **filter recipes by preparation time** so that I can find recipes that fit within my available time frame.

- **Acceptance Criteria**:
  - Users can choose a time filter (e.g., under 15 minutes, under 30 minutes).
  - Only recipes that can be prepared within the specified time are displayed.

## Features

- **Ingredient Search**: Users can input ingredients they have at home to find matching recipes.
- **Exclude Ingredients**: Users can specify ingredients they want to exclude from search results.
- **Filter by Cooking Time**: Set a maximum cooking time to refine the recipe search.

## Installation

To run the frontend locally:

1. Navigate to the frontend directory: `cd dinner-time-frontend`
2. Install dependencies: `yarn install`
3. Start the frontend development server: `yarn start`

## Technologies Used

- **React** (with TypeScript)
- **Tailwind CSS** for styling
- **Axios** for making HTTP requests to the backend
- **Debouncing** with `lodash.debounce` to prevent excessive API calls during input

## Future Improvements

- **Enhance Favourites Management**: Allow users to create accounts to save favourites across devices. Add favourites page for users to easily reference shortlisted recipes.
- **Add User Authentication**: Implement OAuth or local authentication for user accounts.
- **Improve Styling**: Further refine the UI to enhance the user experience.
