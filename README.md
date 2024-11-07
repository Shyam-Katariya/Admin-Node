# REALME for Admin-Node

Welcome to **Admin-Node**, a Node.js application that provides both Admin and User panels. This file is designed to help you understand the setup, configuration, and running of the application, including how to initialize the database and collections.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Database Initialization](#database-initialization)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)
7. [Folder Structure](#folder-structure)
8. [License](#license)

---

### System Requirements

-   **Node.js**: v18 or higher
-   **MongoDB**: Local or cloud MongoDB instance (MongoDB Atlas or other services)
-   **npm**: v6 or higher (recommended)

---

### Installation

To set up **Admin-Node**, follow these steps:

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/your-repository-url
    cd Admin-Node
    ```

2. **Install Dependencies**:
   Install all required dependencies listed in `package.json`:

    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:

    ```plaintext
    PORT=3000
    MONGO_URI=<your-mongo-database-uri>
    SECRET_KEY=<your-secret-key>
    ```

    Replace `<your-mongo-database-uri>` with the URI of your MongoDB database, and `<your-secret-key>` with a strong secret key for session management and authentication.

---

### Configuration

-   **Database Configuration**: Ensure your MongoDB URI is correct in the `.env` file.
-   **Theme Settings**: You can modify the application’s theme settings in `public/css` or add new themes.
-   **Authentication**: The application supports role-based authentication (admin/user).

---

### Database Initialization

1. **Run the Database Initialization Script**:

    After setting up the environment, you need to initialize your database and collections by running the following script:

    ```bash
    node scripts/initDatabase.js
    ```

    This script will:

    - Connect to your MongoDB instance.
    - Create the necessary collections (e.g., `users`).
    - Set up any default data (such as admin users, if needed).

    If you don't have MongoDB installed locally, you can also use MongoDB Atlas or another cloud-based database provider.

2. **Example Output of Initialization**:

    Once the script completes, you should see the following message in the console:

    ```plaintext
    Connected to MongoDB
    Database and collections initialized successfully
    ```

---

### Running the Application

1. **Start the Application**:

    After setting up your environment and database, start the server by running:

    ```bash
    npm start
    ```

    The application will run on `http://localhost:3000` by default. You can modify the port in the `.env` file if needed.

2. **Accessing the Panels**:
    - **Admin Panel**: Visit `http://localhost:3000/admin` for the admin dashboard (requires login).
    - **User Panel**: Visit `http://localhost:3000/user` for the user dashboard (requires login).

---

### Testing

For testing purposes, you can use tools like Postman or any browser-based tool to test your API endpoints.

1. **Login as Admin**:
    - Endpoint: `POST /admin/login`
    - Request body: `{ "username": "admin", "password": "your-password" }`
2. **Login as User**:
    - Endpoint: `POST /user/login`
    - Request body: `{ "username": "user", "password": "your-password" }`

---

### Folder Structure

The project follows a simple and organized structure for easy scalability:

```
Admin-Node/
├── public/             # Static files (CSS, images)
├── controllers/        # App logic for admin and user
├── middleware/         # Middleware for authentication, logging
├── models/             # Database models
├── routes/             # API and web route definitions
├── logger/             # contain log files & create Log
├── service/            # Provide services to controllers
├── utils/              # Utils provide utility functions
├── views/              # Handlebars templates
├── scripts/            # Initialization scripts
│   └── init.js         # Script to initialize database
├── .env                # Environment variables
├── app.js              # Main app file (Entry point)
├── index.js            # Get App & start project
└── REALME.md           # Documentation for developers and contributors
```

---

### License

This project is licensed under the MIT License.
Registered under SK By Shyam Katariya

---

This **REALME.md** file serves as a concise guide for the setup, configuration, and execution of the **Admin-Node** application. It contains instructions for initialization, configuration, running the application, and contributing to the project.
