## Intro

This application is a system for handling Youtube comments.

## Backend Setup:

The project is dockerized. It implements swagger for API documentation through which one can view and test the endpoints. The commands below can be used to set up the project locally.

### Prerequisites

- Docker
- Docker Compose

### Create a .env file at the root of the project containing the required environment variables

I have attached a file containing the values in the email sent. These values can be copied into the .env file created.

### Install dependencies

`docker compose run --rm ycsbackend yarn`

### Run project

This will set up the project including the creation of the database and the execution of the db-schema.sql file for creating the necessary tables.

`docker compose up`

### For introspecting the database and generating the types

`docker compose run --rm ycsbackend yarn drizzle:introspect`

### For applying migrations to the database

`docker compose run --rm ycsbackend yarn drizzle:migrate`

### API documentation (Swagger)

`http://localhost:3031/docs`
