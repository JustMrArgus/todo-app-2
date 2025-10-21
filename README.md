## Deployed Version

You can access the live application's parts here:

- **[Backend](https://todo-app-2-1qr7.onrender.com)**
- **[Frontend](https://justmrargus.github.io/todo-app-2/)**

**IMPORTANT: Run the deployed API first before accessing the deployed frontend.**

## Tech Stack

- **Backend:** [NestJS](https://nestjs.com/), TypeScript
- **Frontend:** [Next.js](https://nextjs.org/), TypeScript

## Running the Project Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Backend (NestJS) Setup

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `/backend` directory and add your environment-specific keys.

    ```.env
    # The port to run the server on
    PORT=5000
    ```

4.  **Run the application:**
    ```bash
    npm start
    ```
    The backend server will be running on **http://localhost:5000 (PORT=3000 by default)**.

### 2. Frontend (Next.js) Setup

1.  **Open a new terminal window** and navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `/frontend` directory.

    ```.env
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The frontend development server will be running on **http://localhost:3000 (3001 if PORT in backend's .env file isn't specified)**).

## 🧪 Running Tests

You can run the full test suites for both the server.

### Backend (NestJS) Tests

Navigate to the `/backend` directory and run:

```bash
# Run unit and integration tests
npm run test

# Run end-to-end (e2e) tests
npm run test:e2e

```
