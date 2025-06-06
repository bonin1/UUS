# UUS - University Management System

A comprehensive university management system built with modern web technologies to handle various academic and administrative operations.

## 🏫 About

UUS (University Management System) is a full-stack web application designed to streamline university operations including student management, course administration, faculty management, applications, feedback collection, and more. The system provides separate interfaces for students, professors, and administrators with role-based access control.

## 🚀 Features

### 👨‍🎓 Student Features
- **User Registration & Authentication** - Secure login system with session management
- **Course Management** - View available courses and enrollment information
- **Grade Tracking** - Access to academic performance and grades
- **Application System** - Apply for programs and Erasmus exchanges
- **Feedback System** - Submit feedback about courses and services
- **Profile Management** - Update personal information and profile images
- **E-Learning Portal** - Access to online learning resources and tasks
- **News & Announcements** - Stay updated with university news

### 👨‍🏫 Professor Features
- **Professor Dashboard** - Dedicated interface for faculty members
- **Course Management** - Manage assigned courses and students
- **Grade Management** - Record and update student grades
- **Task Management** - Create and manage academic tasks

### 👨‍💼 Admin Features
- **User Management** - Create, update, and manage user accounts
- **Login Information Management** - Handle user authentication credentials
- **Department Management** - Organize university departments
- **Course Administration** - Create and manage academic courses
- **Partner Management** - Manage university partnerships
- **News Management** - Create and publish university news
- **Application Review** - Review and process student applications
- **Audit Logging** - Track system activities and changes
- **Change Request System** - Handle modification requests with approval workflow
- **Statistics Dashboard** - View system analytics and reports

### 🎯 General Features
- **Responsive Design** - Mobile-friendly interface
- **Multi-language Support** - Albanian and English content
- **File Upload System** - Handle images and documents
- **Real-time Chat** - Integrated chat functionality
- **Search Functionality** - Search users, courses, and partners
- **Security Features** - CSRF protection, rate limiting, input validation

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MySQL** - Primary database
- **Sequelize** - ORM for database operations
- **Spring Boot** - Java microservice for additional functionality

### Frontend
- **EJS** - Template engine
- **Bootstrap 5** - CSS framework
- **JavaScript** - Client-side functionality
- **jQuery** - DOM manipulation
- **FontAwesome** - Icons

### Authentication & Security
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **csurf** - CSRF protection

### Additional Tools
- **Multer** - File upload handling
- **Sharp** - Image processing
- **Nodemailer** - Email functionality
- **Socket.io** - Real-time communication
- **Axios** - HTTP client
- **Node-cron** - Scheduled tasks

## 📁 Project Structure

```
UUS/
├── app.js                  # Main application configuration
├── server.js              # Server entry point
├── database.js            # Database connection
├── package.json           # Node.js dependencies
├── config/                # Configuration files
│   ├── session.js         # Session configuration
│   ├── emailConfig.js     # Email settings
│   └── UploadImageConfig.js # File upload settings
├── controller/            # Business logic controllers
│   ├── Admin/            # Admin-specific controllers
│   ├── USERauth/         # Authentication controllers
│   ├── Professor/        # Professor controllers
│   └── ...
├── middleware/           # Custom middleware
├── model/               # Database models (Sequelize)
├── routes/              # Route definitions
├── service/             # Business services
├── static/              # Static assets (CSS, JS, images)
├── views/               # EJS templates
├── java-service/        # Spring Boot microservice
└── utils/               # Utility functions
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Java 17 (for Spring Boot service)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/bonin1/UUS.git
cd UUS
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_NAME=uus_database
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Session Secret
SESSION_SECRET=your_session_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Database Setup
1. Create a MySQL database named `uus_database`
2. The application will automatically create tables using Sequelize models
3. Run the application once to initialize the database schema

### 5. Java Service Setup (Optional)
```bash
cd java-service
./mvnw spring-boot:run
```
The Java service runs on port 8081 and provides additional functionality.

### 6. Start the Application
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🚦 Usage

### Default Admin Access
1. Navigate to `/admin` to access the admin panel
2. Create an admin user through the database or use the registration system
3. Set the user role to 'admin' in the database

### Student Registration
1. Students can register through the main application
2. Admin approval may be required depending on configuration

### Professor Access
1. Admin creates professor accounts
2. Professors access the system through `/professor`

## 📊 Database Models

The system includes comprehensive database models:
- **Users** - User information and roles
- **Login** - Authentication credentials
- **Departments** - University departments
- **Courses** - Academic courses
- **Enrollments** - Student course enrollments
- **Grades** - Student academic performance
- **Applications** - Student applications
- **Feedback** - User feedback
- **News** - University news and announcements
- **Partners** - University partnerships
- **Tasks** - Academic tasks and assignments
- **AuditLog** - System activity tracking

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **Session Management** - Secure session handling
- **CSRF Protection** - Cross-site request forgery prevention
- **Rate Limiting** - Prevent abuse and brute force attacks
- **Input Validation** - Server-side validation using express-validator
- **Role-based Access Control** - Different access levels for users
- **Secure Headers** - Helmet.js for security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🚧 Development Status

**Status:** Under Active Development

This project is currently in development phase. New features are being added regularly, and the system is being refined based on user feedback and requirements.

## 🎯 Roadmap

- [ ] Complete testing coverage
- [ ] API documentation
- [ ] Mobile application
- [ ] Advanced reporting features
- [ ] Integration with external systems
- [ ] Performance optimization
- [ ] Internationalization improvements

---

**Note:** This is an active development project. Some features may be incomplete or subject to change.
