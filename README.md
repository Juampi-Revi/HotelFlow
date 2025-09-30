# 🏨 HotelFlow

> **"Seamless stays, endless possibilities"**

## 📋 Definición del Proyecto

**HotelFlow** es una solución integral de gestión hotelera que revoluciona la experiencia de reservas y administración de hoteles. Nuestro sistema combina una interfaz pública moderna para huéspedes con un panel administrativo completo para la gestión hotelera.

### 🎯 Solución que Desarrollamos

**Problema identificado**: Los sistemas hoteleros tradicionales son complejos, poco intuitivos y no ofrecen una experiencia fluida tanto para huéspedes como para administradores.

**Nuestra solución**: Una plataforma web moderna que ofrece:

#### Para Huéspedes:
- **Exploración intuitiva** de habitaciones con paginación optimizada
- **Interfaz multiidioma** (Español/Inglés) para accesibilidad global
- **Diseño responsivo** que funciona perfectamente en móviles y desktop
- **Experiencia visual moderna** con glassmorphism y transiciones suaves

#### Para Administradores:
- **Panel de administración completo** con sidebar persistente
- **Gestión avanzada de habitaciones** con formularios de 25+ campos organizados
- **Sistema de notificaciones** con toast messages para feedback inmediato
- **Componentes reutilizables** siguiendo Atomic Design
- **Validación robusta** de formularios con manejo de errores

### 🏗️ Arquitectura de la Solución

- **Frontend**: React 18 con Vite, Tailwind CSS y arquitectura de componentes atómicos
- **Backend**: Spring Boot 3.5.6 con Java 17 y base de datos H2
- **Principios**: SOLID, Clean Architecture, código en inglés, sin console.logs
- **Internacionalización**: Sistema completo con 250+ claves de traducción

A modern hotel booking system built with React and Spring Boot, following clean architecture principles and best practices.

## 🎨 Diseño de Identidad de Marca

### 📝 Información de la Marca
- **Nombre**: HotelFlow
- **Tagline**: "Seamless stays, endless possibilities"
- **Concepto**: Experiencia de reserva fluida con diseño glassmorphism moderno
- **Personalidad**: Moderna, confiable, elegante, accesible

### 🎨 Logo de la Marca
- **Logo principal**: `docs/assets/logo-hotelflow.svg`
- **Icono simplificado**: `docs/assets/logo-icon.svg`
- **Elementos del logo**:
  - Edificio hotelero estilizado con ventanas
  - Ondas de flujo que representan la fluidez del servicio
  - Gradientes que reflejan modernidad
  - Tipografía limpia y profesional

### 🌈 Paleta de Colores de Identidad

#### Colores Primarios
- **Azul Principal**: `#3b82f6` (rgb(59, 130, 246))
  - Uso: Botones principales, enlaces, elementos destacados
  - Significado: Confianza, profesionalismo, tecnología
  
- **Índigo Secundario**: `#6366f1` (rgb(99, 102, 241))
  - Uso: Gradientes, acentos, hover states
  - Significado: Innovación, creatividad, modernidad

#### Colores de Soporte
- **Blanco**: `#ffffff` (rgb(255, 255, 255))
  - Uso: Fondos principales, texto en elementos oscuros
  
- **Gris Oscuro**: `#1f2937` (rgb(31, 41, 55))
  - Uso: Texto principal, títulos
  
- **Gris Medio**: `#6b7280` (rgb(107, 114, 128))
  - Uso: Texto secundario, subtítulos
  
- **Gris Claro**: `#f3f4f6` (rgb(243, 244, 246))
  - Uso: Fondos de secciones, bordes sutiles

#### Colores de Estado
- **Verde Éxito**: `#10b981` (rgb(16, 185, 129))
  - Uso: Mensajes de éxito, confirmaciones
  
- **Rojo Error**: `#ef4444` (rgb(239, 68, 68))
  - Uso: Errores, validaciones fallidas
  
- **Amarillo Advertencia**: `#f59e0b` (rgb(245, 158, 11))
  - Uso: Advertencias, información importante

### 🎭 Lenguaje de Diseño
- **Estilo**: Glassmorphism moderno con gradientes y transiciones suaves
- **Tipografía**: Sans-serif limpia y legible
- **Efectos**: Blur backdrop, sombras sutiles, bordes redondeados
- **Animaciones**: Transiciones fluidas, hover effects elegantes

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

### Current Sprint: Sprint 2 ✅
**Goal**: Room management optimization and technical standards compliance.

#### Sprint 1: Foundation ✅
- **User Story #1**: Header Component - Navigation and branding
- **User Story #7**: Footer Component - Consistent branding
- **Internationalization**: Complete Spanish/English support
- **Mobile Support**: Device detection and responsive design
- **Dark Mode**: Theme switching with system preference

#### Sprint 2: Room Management & Optimizations ✅
**Goal**: Optimize room management interface and ensure 100% technical standards compliance.

##### User Story #8: Room Management Interface Optimization ✅
**As an admin**, I want an improved room management interface with better layout and functionality.

**Acceptance Criteria**:
- ✅ Header layout reorganized with title/subtitle on separate level from controls
- ✅ Controls moved to dedicated gray background section
- ✅ Responsive design maintained across all screen sizes
- ✅ Table columns properly translated in both languages
- ✅ Pagination working correctly from page 1

**Technical Implementation**:
- Reorganized AdminRooms header layout for better UX
- Fixed pagination indexing inconsistency (0-based vs 1-based)
- Verified table translations in both Spanish and English
- Implemented responsive controls layout

##### User Story #10: Enhanced Room Form & Public Page Optimization ✅
**As an admin**, I want a comprehensive room form with all Room model fields and optimized public room listing.

**Acceptance Criteria**:
- ✅ Room form expanded with all Room model fields (25+ fields)
- ✅ Organized sections: Hotel Information, Location, Room Features, Basic Amenities
- ✅ New reusable Checkbox component following Atomic Design
- ✅ Complete Spanish/English translations for all new fields
- ✅ Form validation for all required fields
- ✅ Success/error notifications for room creation and updates
- ✅ Public room page pagination fixed to start at page 1
- ✅ Filters temporarily hidden (preserved for future implementation)
- ✅ Pagination changed to 10 rooms per page

**Technical Implementation**:
- Extended RoomForm with 25+ fields organized in logical sections
- Created reusable Checkbox atom component with proper styling
- Enhanced useRoomForm hook with comprehensive field management
- Added 50+ new translation keys for room form fields and validations
- Implemented Toast notifications for room CRUD operations
- Fixed pagination in ProductsPage to use 0-based indexing correctly
- Temporarily hid filter section while preserving code for future use
- Updated pagination to show 10 rooms per page instead of 6

##### User Story #9: Code Quality & Standards Compliance ✅
**As a developer**, I want the codebase to comply 100% with established technical standards.

**Acceptance Criteria**:
- ✅ All code and comments in English only
- ✅ No console.logs in production code
- ✅ No unnecessary comments or TODO items in Spanish
- ✅ SOLID principles maintained
- ✅ Clean Architecture patterns followed
- ✅ React Hooks properly implemented

**Technical Implementation**:
- Removed Spanish comments from useRoomDetail.js
- Fixed useRoomsPagination hook variable definitions
- Verified 0 console.logs in codebase
- Ensured 100% English-only code
- Maintained clean architecture principles

## 🌟 Features

### ✅ Completed Features
- [x] **Project Setup** - Complete development environment
- [x] **Modern UI Design** - Glassmorphism effects and gradients
- [x] **Header Component** - Fixed navigation with logo and branding
- [x] **Footer Component** - Consistent branding across all pages
- [x] **Admin Panel** - Full administrative interface with dashboard
- [x] **Room Management** - CRUD operations for hotel rooms with optimized interface
- [x] **Enhanced Room Form** - Comprehensive form with 25+ fields, organized sections, and validation
- [x] **Reusable Components** - Checkbox atom component following Atomic Design principles
- [x] **Toast Notifications** - Success/error notifications for room operations
- [x] **Public Room Listing** - Optimized pagination (10 per page) starting from page 1
- [x] **Responsive Design** - Optimized for all devices with mobile-first approach
- [x] **Dark/Light Mode** - Theme switching with system preference
- [x] **Internationalization** - Complete Spanish/English translation system (250+ keys)
- [x] **Component Architecture** - Atomic design with reusable components
- [x] **Mobile Support** - Device detection and mobile-optimized components
- [x] **Custom Hooks** - Reusable logic with useDeviceDetection and optimized useRoomsPagination
- [x] **Pagination System** - Consistent 0-based indexing with proper validation
- [x] **Code Quality** - 100% compliance with technical standards (SOLID, Clean Code)
- [x] **English-Only Codebase** - All code, comments, and documentation in English
- [x] **Error-Free Production** - 0 console.logs, 0 linting errors, 0 browser errors

### 🚧 In Development
- [ ] User authentication system
- [ ] Hotel listing and search
- [ ] Booking functionality
- [ ] User dashboard
- [ ] Payment integration

### 📋 Admin Panel Features
- **Dashboard**: Overview with statistics and recent activity
- **Room Management**: Add, edit, delete, and view rooms with optimized layout
  - Reorganized header with title/subtitle separated from controls
  - Improved pagination system with consistent 0-based indexing
  - Responsive controls layout with gray background section
  - Table view with properly translated column headers
- **Enhanced Room Form**: Comprehensive form with 25+ fields
  - Hotel Information section (name, chain, rating)
  - Location section (city, country, address, coordinates)
  - Room Features section (view type, floor, size)
  - Basic Amenities section (WiFi, AC, balcony, custom amenities)
  - Form validation with translated error messages
  - Success/error notifications with Toast component
- **Reusable Components**: Atomic Design architecture
  - Checkbox atom component with proper styling
  - Input, Select, Button atoms with consistent design
  - ImageUpload molecule for room photos
- **Modern UI**: Glassmorphism design with blue-indigo palette
- **Responsive**: Mobile-optimized interface with adaptive layouts
- **Dark Mode**: Full dark theme support across all components
- **Multi-language**: Complete Spanish/English support with 250+ translation keys
- **Error-Free**: 0 console.logs, 0 linting errors, production-ready code

### 🌍 Internationalization (i18n)
- **Languages**: Spanish (es) and English (en)
- **Auto-detection**: Browser language preference detection
- **Persistence**: Language choice saved in localStorage
- **Complete Coverage**: All UI elements, messages, and admin panel translated
- **Dynamic Switching**: Real-time language toggle without page reload
- **Translation Keys**: 200+ translation keys covering entire application

### 📱 Mobile & Responsive Features
- **Device Detection**: Custom useDeviceDetection hook
- **Mobile-First Design**: Optimized for mobile devices first
- **Responsive Breakpoints**: Tailwind CSS breakpoints (sm, md, lg, xl)
- **Mobile Components**: Dedicated MobileNotSupported component
- **Adaptive Layouts**: Grid systems that adapt to screen size
- **Touch-Friendly**: Optimized touch targets and interactions

## 🤝 Contributing

### Git Flow - MANDATORY Process

**⚠️ NEVER commit directly to `main` branch!**

Follow this strict workflow for all changes:

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/sprint-X-userstory-Y-description

# 2. Work on your changes
# ... make changes ...

# 3. Commit with descriptive messages
git add .
git commit -m "feat: descriptive commit message following conventional commits"

# 4. Push feature branch
git push origin feature/sprint-X-userstory-Y-description

# 5. Create Pull Request on GitHub
# - Add detailed description
# - Request code review
# - Ensure CI/CD passes

# 6. Merge after approval
# - Use "Squash and merge" for clean history
# - Delete feature branch after merge
```

### Branch Naming Convention
- `feature/sprint-X-userstory-Y-description` - New features
- `bugfix/issue-description` - Bug fixes
- `hotfix/critical-issue` - Critical production fixes
- `docs/update-description` - Documentation updates

### Commit Message Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Code Quality Standards
1. Follow coding standards and principles
2. Write clean, self-documenting code
3. Test thoroughly before committing
4. Ensure no linting errors
5. Maintain SOLID principles and Clean Architecture
6. Use Atomic Design patterns for components

## 📄 License

This project is part of a Digital House educational program.

---

**Built with ❤️ following clean architecture and modern development practices**