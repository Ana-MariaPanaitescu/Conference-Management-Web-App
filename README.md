# Conference Management System

A web application for managing academic conferences, article submissions, and peer reviews. This system allows conference organizers, authors, and reviewers to collaborate efficiently in the academic paper submission and review process.

## Features

### Role-Based Access Control
- **Organizers:** Create and manage conferences, monitor article statuses
- **Authors:** Submit articles to conferences, track review status
- **Reviewers:** Review assigned articles, provide feedback

### Key Functionalities
- Conference creation and management
- Article submission system
- Automated reviewer assignment
- Review management system
- Real-time status updates
- User authentication and authorization

## Technology Stack

### Backend
- Node.js
- Express.js
- Sequelize ORM
- SQLite Database
- JWT Authentication

### Frontend
- React
- React Router DOM
- Tailwind CSS
- Axios
- Context API for state management

## Project Structure

```
conference-management/
├── backend/
│   ├── classes/           # Database models
│   ├── middleware/        # Auth middleware
│   ├── routes/           # API routes
│   ├── config.js         # Configuration
│   ├── database.js       # Database setup
│   └── server.js         # Server entry point
│
└── frontend/
    ├── public/
    └── src/
        ├── components/   # React components
        ├── contexts/     # Context providers
        ├── services/     # API services
        └── utils/        # Utility functions
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Running the Application

1. Start the Backend Server
```bash
cd backend
npm run dev
```

2. Start the Frontend Development Server
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users` - User registration

### Conferences
- `GET /api/conferences` - Get all conferences
- `POST /api/conferences` - Create a conference
- `GET /api/conferences/:id` - Get conference details

### Articles
- `GET /api/articles` - Get all articles
- `POST /api/articles` - Submit an article
- `PUT /api/articles/:id` - Update an article
- `GET /api/articles/author` - Get author's articles

### Reviews
- `GET /api/reviews/assigned` - Get assigned reviews
- `PUT /api/reviews/:id` - Update a review
- `GET /api/reviews/article/:articleId` - Get article reviews

## Database Schema

### Users
- id (Primary Key)
- name
- email
- password
- role (organizer/reviewer/author)

### Conferences
- id (Primary Key)
- title
- description
- date
- organizerId (Foreign Key)

### Articles
- id (Primary Key)
- title
- content
- status
- authorId (Foreign Key)
- conferenceId (Foreign Key)

### Reviews
- id (Primary Key)
- feedback
- status
- articleId (Foreign Key)
- reviewerId (Foreign Key)

## Testing

You can test different user roles using these credentials:

### Organizer
```
Email: john.smith@org.com
Password: password123
```

### Reviewer
```
Email: d.wilson@review.com
Password: password123
```

### Author
```
Email: j.anderson@author.com
Password: password123
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
