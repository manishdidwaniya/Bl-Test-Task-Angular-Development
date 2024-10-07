# Angular Task Documentation

## Overview
This documentation outlines the key features and technologies used in the Angular application, which implements user authentication and management functionalities, including sign-up, sign-in, group management, and expense tracking.

## Features
- **User Authentication**:
  - **Sign Up**: Users can register by providing a username and password.
  - **Sign In**: Users can log in with their credentials (username and password).

- **Group Management**:
  - Users can create and manage groups.

- **Expense Management**:
  - Users can add and view expenses groups.

- **Custom Error Page**:
  - Displays error 404 page.

- **Dashboard**:
  - Displays key metrics and insights using **Syncfusion Charts**.

## Technologies Used
- **Angular**: Frontend framework for building the application.
- **Json-server**: Used to create a RESTful API with a local `db.json` file for data storage and retrieval.
- **Syncfusion**: UI components library used for building a responsive and modern user interface.
- **Tailwind CSS**: Utility-first CSS framework for responsive design and styling.
- **RxJS**: For reactive programming and managing state.

## Setup Instructions

### 1. Run JSON Server

Make sure you have **json-server** installed globally:

```bash
npm install -g json-server

json-server --watch db.json  // run this in terminal
```
### 2. Syncfusion License
   The Syncfusion license bar displays at the top of the application. To adjust the application layout, margin is set to display content slightly below the top.
