# Notes App – Full Stack Notes Management Application

A full-stack notes project with a Spring Boot backend and a Next.js frontend. The repo includes backend APIs for users and notes, plus a separate UI app in `notes-frontend/`.

## Short Overview

This is a full-stack Notes App repo. The backend is built with Spring Boot and PostgreSQL, and the frontend is built with Next.js, React, TypeScript, and Tailwind CSS. The project is in progress, with the next focus on frontend-backend integration.

## Features

### Backend

- User register/login APIs
- Create, read, update, delete notes
- User-note relationship using JPA
- Layered architecture: Controller / Service / Repository / Entity

### Frontend

- Login and register pages UI
- Dashboard page UI
- Notes listing UI
- Create Note page UI
- Favorites, categories, trash, settings/profile UI
- Light/dark theme support
- Reusable components and context-based note state


## Project Structure

```text
Notes/
  pom.xml
  mvnw
  mvnw.cmd
  src/
    main/
      java/com/example/Notes/
        controller/
        service/
        repository/
        entity/
      resources/
        application.properties
  notes-frontend/
    app/
    components/
    context/
    public/
    package.json
```

## Quick Start

### Backend setup

1. Clone the repo:

```bash
git clone https://github.com/veyra34/notes-app.git
```

2. Update `src/main/resources/application.properties` with PostgreSQL settings:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/notesdb
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

3. Run the backend:

```bash
./mvnw.cmd clean package
./mvnw.cmd spring-boot:run
```

### Frontend setup

1. Go to frontend folder:

```bash
cd notes-frontend
```

2. Install dependencies and start dev server:

```bash
npm install
npm run dev
```

3. Open the app at `http://localhost:3000`

## API Endpoints

### User APIs

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/users/register` | Register a new user |
| POST | `/users/login` | Authenticate a user |

### Notes APIs

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/notes/create/{userId}` | Create a note for the specified user |
| GET  | `/notes/all/{userId}` | List all notes for the specified user |
| GET  | `/notes/{id}/{userId}` | Get a note by id for the specified user |
| PUT  | `/notes/update/{id}/{userId}` | Update a note for the specified user |
| PUT  | `/notes/delete/{id}/{userId}` | Delete a note for the specified user |

## Architecture / Design

### Backend architecture

- Controller layer handles HTTP requests
- Service layer contains business logic
- Repository layer handles database access
- Entity layer maps PostgreSQL tables

### Frontend architecture

- App Router pages are in `notes-frontend/app/`
- Reusable UI is in `notes-frontend/components/`
- App-level state is in `notes-frontend/context/NotesContext.tsx`
- Frontend currently uses local state/context and is meant to connect to backend APIs later



## Planned Improvements
- Frontend-backend integration
- JWT authentication and authorization
- DTOs and request validation
- Centralized exception handling
- Persistent auth flow
- Notes sync with backend
- Loading and error states

