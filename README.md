# 🏨 HotelFlow

> **"Seamless stays, endless possibilities"**

A modern hotel booking system built with React and Spring Boot, following clean architecture principles and best practices.

## 🎨 Brand Identity

- **Name**: HotelFlow
- **Tagline**: "Seamless stays, endless possibilities"
- **Concept**: Fluid booking experience with modern glassmorphism design
- **Color Palette**: 
  - Primary Blue: `#3b82f6`
  - Secondary Indigo: `#6366f1`
  - Background White: `#ffffff`
- **Design Language**: Modern glassmorphism with gradients and smooth transitions

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast development and build tool
- **Tailwind CSS** - Utility-first CSS framework with custom color palette
- **React i18next** - Internationalization support
- **Node.js 20.19.5** - Runtime environment
- **Glassmorphism Design** - Modern UI effects with backdrop blur and gradients

### Backend
- **Spring Boot 3.5.6** - Java framework
- **Java 17** - Programming language
- **H2 Database** - In-memory database for development
- **Maven** - Dependency management

## 🎯 Development Principles

- ✅ **SOLID Principles** - Applied throughout the codebase
- ✅ **Clean Architecture** - Separation of concerns and dependencies
- ✅ **Clean Code** - Readable, maintainable code
- ✅ **English Only** - All code, comments, and documentation in English
- ✅ **No Unnecessary Comments** - Self-documenting code
- ✅ **React Hooks** - Modern React patterns
- ✅ **Atomic Design** - Reusable component architecture

## 📁 Project Structure

```
HotelFlow/
├── backend/                 # Spring Boot API
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml             # Maven dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Atomic design components
│   │   │   ├── atoms/      # Basic UI elements
│   │   │   ├── molecules/  # Component combinations
│   │   │   ├── organisms/  # Complex components
│   │   │   └── templates/  # Page layouts
│   │   ├── pages/          # Application pages
│   │   │   └── Admin/      # Admin panel pages
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── i18n/           # Internationalization
│   │   └── services/       # API services
│   ├── public/             # Static assets
│   ├── tailwind.config.js  # Tailwind configuration
│   └── package.json        # npm dependencies
└── docs/                   # Project documentation
    └── DEVELOPMENT_LOG.md  # Development progress log
```

## 🛠️ Setup Instructions

### Prerequisites
- Java 17
- Node.js 20+
- Maven 3.6+
- Git

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```
Server runs on: `http://localhost:8082`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Development server runs on: `http://localhost:5173`

**Available Routes:**
- Main site: `http://localhost:5173`
- Admin panel: `http://localhost:5173/admin`
- Room management: `http://localhost:5173/admin/rooms`

### Database Access
- H2 Console: `http://localhost:8082/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

## 📋 Development Methodology

### Sprint-Based Development
- **4 Sprints** with user stories
- **Feature branches** for each user story
- **Clean commits** with descriptive messages
- **Code reviews** before merging

### Current Sprint: Sprint 1
**Goal**: Develop basic site structure and add registration, visualization, and product deletion functionalities.

#### User Story #1: Header Component ✅
**As a user**, I want a header that displays the application logo and a navigation bar to facilitate site navigation.

**Acceptance Criteria**:
- Header occupies 100% screen width on all pages
- Header is fixed at the top, visible even when scrolling
- Consistent across all application pages
- Optimized for different devices and screen resolutions
- Left-aligned block with logo and company tagline
- Clickable logo/tagline redirects to main page
- Right-aligned block with "Create Account" and "Sign In" buttons

#### User Story #7: Footer Component ✅
**As a user**, I want a footer that provides consistent branding and information across all pages.

**Acceptance Criteria**:
- Footer occupies 100% screen width on all pages
- Present on all pages (public and admin)
- Left-aligned block with company isologotype, year, and copyright
- Optimized for different devices and screen resolutions
- Legible design elements consistent with company visual identity

## 🌟 Features

### ✅ Completed Features
- [x] **Project Setup** - Complete development environment
- [x] **Modern UI Design** - Glassmorphism effects and gradients
- [x] **Header Component** - Fixed navigation with logo and branding
- [x] **Footer Component** - Consistent branding across all pages
- [x] **Admin Panel** - Full administrative interface with dashboard
- [x] **Room Management** - CRUD operations for hotel rooms
- [x] **Responsive Design** - Optimized for all devices
- [x] **Dark/Light Mode** - Theme switching with system preference
- [x] **Internationalization** - Multi-language support
- [x] **Component Architecture** - Atomic design with reusable components

### 🚧 In Development
- [ ] User authentication system
- [ ] Hotel listing and search
- [ ] Booking functionality
- [ ] User dashboard
- [ ] Payment integration

### 📋 Admin Panel Features
- **Dashboard**: Overview with statistics and recent activity
- **Room Management**: Add, edit, delete, and view rooms
- **Modern UI**: Glassmorphism design with blue-indigo palette
- **Responsive**: Mobile-optimized interface
- **Dark Mode**: Full dark theme support

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/user-story-X-description`
2. Follow coding standards and principles
3. Write clean, self-documenting code
4. Test thoroughly before committing
5. Create pull request with detailed description

## 📄 License

This project is part of a Digital House educational program.

---

**Built with ❤️ following clean architecture and modern development practices**