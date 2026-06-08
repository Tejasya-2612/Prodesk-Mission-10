# Prodesk Mission 10 - Data Hub API

## Project Overview

This project is a REST API built using Node.js, Express.js, MongoDB Atlas, and Mongoose. It demonstrates cloud database integration and CRUD operations for managing posts.

## Technologies Used

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Postman
* dotenv

## Features

* Connects to MongoDB Atlas
* Create a new post
* Fetch all posts
* Delete a post
* Environment variable security using .env
* Tested using Postman

## API Endpoints

### Create Post

POST /posts

Request Body:
{
"title": "Sample Post",
"content": "Sample Content"
}

### Get All Posts

GET /posts

### Delete Post

DELETE /posts/:id

## Installation

1. Clone the repository
2. Install dependencies

npm install

3. Create a .env file

MONGO_URI=your_mongodb_connection_string

4. Start the server

node server.js

## Testing

All endpoints were tested using Postman.

## Deployment

Backend deployed using Render.

## Author

Tejasya
P/IL/26/NOIDA/M1299
