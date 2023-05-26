# ToDoList API Documentation

This is the documentation for the ToDoList API. It provides endpoints to manage ToDoList items and user authentication.

## Getting Started

To run the project, follow these steps:

1. Clone the repository: `git clone https://github.com/your-repo/todo-list-app.git`
2. Install dependencies: `npm install`
3. Configure the database in `config/config.json`
4. Run database migrations: `npx sequelize-cli db:migrate`
5. Start the server: `node index.js`

## Endpoints

### Register a New User

- URL: `/register`
- Method: `POST`
- Body Parameters:
  - `username`: User's username
  - `password`: User's password

### Login

- URL: `/login`
- Method: `POST`
