# Task Manager

A full-stack task management application built with Node.js, Express, React, and Supabase. This project was developed following the [Node.js course on Udemy](https://www.udemy.com/course/understand-nodejs/learn/lecture/3453072?start=0#overview) and enhanced with additional features including tag support.

## 🚀 Features

- **Task Management**: Create, read, update, and delete tasks
- **Task Completion**: Toggle task completion status
- **Tag System**: Add and manage tags for better task organization
- **Filtering**: View all tasks, open tasks, or completed tasks
- **Responsive Design**: Modern UI that works on desktop and mobile
- **Real-time Updates**: Immediate UI updates when tasks are modified
- **API Documentation**: Swagger UI for API exploration

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Supabase** - PostgreSQL database with real-time features
- **Swagger** - API documentation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **CSS3** - Styling with custom properties
- **React Icons** - Icon library

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Supabase account** and project setup
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mlph-rvitriolo/task-manager.git
cd task-manager
```

### 2. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create the following tables in your Supabase SQL editor:

```sql
-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    complete BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Task-Tags junction table
CREATE TABLE task_tags (
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id, tag_id)
);

-- Indexes for better performance
CREATE INDEX idx_tasks_complete ON tasks(complete);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_task_tags_task_id ON task_tags(task_id);
CREATE INDEX idx_task_tags_tag_id ON task_tags(tag_id);

-- Trigger for updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_task_modtime
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tag_modtime
    BEFORE UPDATE ON tags
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
```

### 3. Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Update the Supabase configuration in `server/config/supabase.js` with your credentials.

5. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

### 4. Frontend Setup

1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

## 🏗️ How It Works

### Architecture Overview

The application follows a **client-server architecture** with a **relational database**:

```
┌─────────────┐    HTTP/REST    ┌─────────────┐    SQL    ┌─────────────┐
│   React     │ ──────────────► │   Express   │ ────────► │  Supabase   │
│  Frontend   │                 │   Backend   │           │ PostgreSQL  │
└─────────────┘                 └─────────────┘           └─────────────┘
```

### Database Schema

The application uses three main tables:

1. **`tasks`** - Stores task information (id, title, description, complete, timestamps)
2. **`tags`** - Stores unique tag names (id, name, created_at)
3. **`task_tags`** - Junction table linking tasks to tags (many-to-many relationship)

### API Endpoints

The backend provides RESTful API endpoints:

- `GET /api/tasks` - Get all tasks with their tags
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/:id/toggle` - Toggle task completion

### Tag System

The tag system works as follows:

1. **Creating Tags**: When a task is created with tags, the system:
   - Checks if tags already exist in the database
   - Creates new tags if they don't exist
   - Links the task to all specified tags via the junction table

2. **Updating Tags**: When a task is updated:
   - Removes all existing tag relationships
   - Creates new relationships for the updated tags
   - Maintains tag uniqueness across the application

3. **Displaying Tags**: Tags are returned as simple strings to the frontend for easy rendering

### Frontend Features

- **Task List**: Displays all tasks in a responsive grid layout
- **Task Filtering**: Filter by completion status (All, Open, Completed)
- **Task Creation**: Form with title, description, tags, and completion status
- **Task Editing**: Edit existing tasks with real-time updates
- **Tag Management**: Add/remove tags with visual feedback
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📁 Project Structure

```
task-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api/           # API service functions
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/            # Express routes
│   ├── services/          # Business logic
│   ├── config/            # Configuration files
│   └── package.json
└── README.md
```

## 🔧 Development

### Running in Development Mode

1. **Backend**: `cd server && npm start`
2. **Frontend**: `cd client && npm run dev`

### API Documentation

Once the server is running, visit `http://localhost:3000/api-docs` to view the interactive Swagger documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Based on the [Node.js course by Andrew Mead on Udemy](https://www.udemy.com/course/understand-nodejs/learn/lecture/3453072?start=0#overview)
- Enhanced with additional features including tag support and improved UI/UX
