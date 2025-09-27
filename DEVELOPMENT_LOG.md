# HotelFlow - Development Log

## Configuraciones del Proyecto

### ESLint Configuration

El proyecto utiliza ESLint con reglas específicas para mantener la calidad del código y seguir principios de Clean Code.

#### Configuración Actual (`frontend/eslint.config.js`)

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    ignores: ['dist', 'node_modules', 'build']
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // Variables and Imports
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^[A-Z]'
      }],
      'no-undef': 'error',
      'prefer-const': 'error',
      
      // Code Quality
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      
      // React Specific
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      
      // Code Style (Clean Code)
      'max-len': ['warn', { code: 100, ignoreUrls: true }],
      'complexity': ['warn', 10],
      'max-depth': ['warn', 4],
      'max-params': ['warn', 4],
      
      // Naming Conventions
      'camelcase': ['error', { properties: 'never' }],
      
      // Import Organization
      'sort-imports': ['error', {
        ignoreCase: true,
        ignoreDeclarationSort: true
      }]
    },
  },
]
```

#### Reglas Principales

1. **Variables e Imports**
   - `no-unused-vars`: Previene variables no utilizadas
   - `no-undef`: Previene variables no definidas
   - `prefer-const`: Prefiere const sobre let cuando es posible
   - `no-duplicate-imports`: Previene imports duplicados

2. **Calidad de Código**
   - `no-console`: Advierte sobre console.log en producción
   - `no-debugger`: Error en statements debugger
   - `complexity`: Limita complejidad ciclomática a 10
   - `max-depth`: Limita anidación a 4 niveles

3. **React Específicas**
   - `react-hooks/rules-of-hooks`: Reglas de hooks
   - `react-hooks/exhaustive-deps`: Dependencias de useEffect

4. **Estilo de Código (Clean Code)**
   - `max-len`: Líneas máximo 100 caracteres
   - `max-params`: Máximo 4 parámetros por función
   - `camelcase`: Convención de nombres camelCase

### Internacionalización (i18n)

El proyecto utiliza `react-i18next` para soporte multiidioma (Inglés/Español).

#### Configuración (`frontend/src/i18n/index.js`)

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es }
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

#### Estructura de Traducciones

**Inglés (`frontend/src/i18n/locales/en.json`)**
```json
{
  "brand": {
    "name": "HotelFlow",
    "tagline": "Seamless stays, endless possibilities"
  },
  "header": {
    "home": "Home",
    "hotels": "Hotels",
    "about": "About",
    "contact": "Contact",
    "login": "Login",
    "signup": "Sign Up"
  },
  "common": {
    "search": "Search",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "welcome": "Welcome to HotelFlow",
    "comingSoon": "Coming Soon",
    "description": "We're building an amazing hotel booking experience..."
  }
}
```

**Español (`frontend/src/i18n/locales/es.json`)**
```json
{
  "brand": {
    "name": "HotelFlow",
    "tagline": "Estadías perfectas, posibilidades infinitas"
  },
  "header": {
    "home": "Inicio",
    "hotels": "Hoteles",
    "about": "Acerca de",
    "contact": "Contacto",
    "login": "Iniciar Sesión",
    "signup": "Registrarse"
  },
  "common": {
    "search": "Buscar",
    "loading": "Cargando...",
    "error": "Error",
    "success": "Éxito",
    "welcome": "Bienvenido a HotelFlow",
    "comingSoon": "Próximamente",
    "description": "Estamos construyendo una experiencia increíble..."
  }
}
```

### Modo Oscuro (Dark Mode)

Implementado usando Context API y Tailwind CSS.

#### Theme Context (`frontend/src/contexts/ThemeContext.jsx`)

```javascript
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleTheme,
      theme: isDarkMode ? 'dark' : 'light'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

#### Configuración Tailwind (`frontend/tailwind.config.js`)

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilitado para modo oscuro
  theme: {
    extend: {
      colors: {
        // Colores de marca HotelFlow
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Orange principal
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308', // Yellow principal
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        }
      }
    },
  },
  plugins: [],
}
```

## Arquitectura de Componentes

### Atomic Design

El proyecto sigue la metodología Atomic Design:

```
src/components/
├── atoms/           # Componentes básicos
│   ├── Button.jsx
│   ├── Logo.jsx
│   ├── ThemeToggle.jsx
│   ├── LanguageToggle.jsx
│   └── index.js
├── molecules/       # Combinaciones de átomos
│   └── index.js
├── organisms/       # Secciones complejas
│   ├── Header.jsx
│   └── index.js
├── templates/       # Layouts de página
│   └── index.js
└── index.js        # Export central
```

### Componentes Implementados

#### 1. Logo (Atom)
- SVG responsivo con colores de marca
- Soporte para diferentes tamaños
- Optimizado para modo oscuro

#### 2. Button (Atom)
- Variantes: primary, secondary, outline, ghost
- Tamaños: sm, md, lg
- Estados hover y focus
- Soporte completo para modo oscuro

#### 3. ThemeToggle (Atom)
- Botón para cambiar entre modo claro/oscuro
- Iconos SVG para sol/luna
- Persistencia en localStorage

#### 4. LanguageToggle (Atom)
- Selector de idioma EN/ES
- Integración con react-i18next
- Persistencia automática

#### 5. Header (Organism)
- Navegación principal
- Logo, menú y controles
- Responsive design
- Posición fija (sticky)
- Soporte completo i18n y dark mode

## Principios de Desarrollo

### Clean Code
- Funciones pequeñas y enfocadas
- Nombres descriptivos
- Máximo 4 parámetros por función
- Complejidad ciclomática ≤ 10
- Líneas ≤ 100 caracteres

### Responsive Design
- Mobile-first approach
- Breakpoints Tailwind estándar
- Componentes adaptables

### Accesibilidad
- Contraste adecuado en ambos modos
- Navegación por teclado
- Etiquetas semánticas

### Performance
- Lazy loading preparado
- Componentes optimizados
- Bundle size controlado

## Resolución de Problemas Técnicos

### Problema: Tailwind CSS v4 Incompatibilidad
**Síntoma**: Los estilos no se aplicaban, aparecía HTML sin estilos
**Causa**: Instalación automática de Tailwind CSS v4 (beta) con sintaxis diferente
**Solución**:
1. Desinstalación de Tailwind CSS v4 y `@tailwindcss/postcss`
2. Instalación de Tailwind CSS v3.4.0 (versión estable)
3. Restauración de configuración PostCSS clásica
4. Actualización de `index.css` con directivas v3: `@tailwind base/components/utilities`

### Problema: Traducciones No Funcionando
**Síntoma**: Aparecían claves como `navigation.createAccount` en lugar de texto traducido
**Causa**: Desajuste entre claves usadas en componentes y definidas en archivos de traducción
**Solución**:
1. Corrección de claves en Header: `navigation.login` → `header.login`
2. Adición de traducciones faltantes para tema e idioma
3. Actualización de componentes LanguageToggle y ThemeToggle con traducciones

## Estado Actual

### ✅ Completado
- [x] **Sprint 1 - Historia 1**: Header con navegación completa y responsive
- [x] **Sprint 1 - Historia 2**: Main body con identidad de marca y tres secciones
- [x] Configuración ESLint con reglas específicas
- [x] Sistema de traducciones i18n (EN/ES) con detección automática
- [x] Modo oscuro con persistencia y detección del sistema
- [x] Estructura Atomic Design completa
- [x] Componentes base (Logo, Button, Toggles) con traducciones
- [x] Configuración Tailwind CSS v3 con colores de marca
- [x] Resolución de problemas de compatibilidad CSS
- [x] Documentación completa y actualizada

### 🔄 En Progreso
- [ ] Testing setup (Jest + React Testing Library)
- [ ] Storybook para documentación de componentes

### 📋 Próximos Pasos
- [ ] Implementar páginas principales
- [ ] Sistema de autenticación
- [ ] Búsqueda de hoteles
- [ ] Carrito de reservas

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Linting
npm run lint
npm run lint:fix

# Build
npm run build

# Preview
npm run preview
```

## Sprint 1 - Historia de Usuario 2: Main Body

### 🎯 Objetivo
Implementar el cuerpo principal del sitio con identidad de marca y las tres secciones requeridas.

### ✅ Criterios de Aceptación Cumplidos
- [x] **Background de marca**: Gradiente con colores primary/secondary
- [x] **100% altura**: Main con `min-h-screen`
- [x] **Responsive**: Grid adaptativo para diferentes dispositivos
- [x] **Tres secciones**: SearchSection, CategoriesSection, RecommendationsSection

### 🏗️ Componentes Implementados

#### SearchSection (`frontend/src/components/organisms/SearchSection.jsx`)
- Sección hero con título prominente
- Placeholder para futuro componente de búsqueda
- Diseño centrado y responsive

#### CategoriesSection (`frontend/src/components/organisms/CategoriesSection.jsx`)
- Grid de 6 categorías (2x3 mobile, 3x2 desktop)
- Cards con iconos circulares numerados
- Background alternativo para contraste visual

#### RecommendationsSection (`frontend/src/components/organisms/RecommendationsSection.jsx`)
- Grid de 3 hoteles recomendados
- Cards con imagen placeholder, título, descripción y precio
- Estrellas de rating visual

### 🎨 Diseño Visual
- **Background principal**: `bg-gradient-to-br from-primary-50 to-secondary-50`
- **Modo oscuro**: `dark:from-gray-900 dark:to-gray-800`
- **Transiciones**: Smooth color transitions (200ms)
- **Espaciado**: Padding consistente de 16 unidades

### 📱 Responsive Design
- **Mobile**: Layout vertical, grid 2 columnas para categorías
- **Desktop**: Grid 3 columnas para categorías y recomendaciones
- **Breakpoints**: Tailwind CSS responsive utilities

## Dependencias Principales

### Producción
- `react` ^18.3.1
- `react-dom` ^18.3.1
- `react-i18next` ^15.1.3
- `i18next` ^23.17.4
- `i18next-browser-languagedetector` ^8.0.2

### Desarrollo
- `@vitejs/plugin-react` ^4.3.4
- `eslint` ^9.15.0
- `eslint-plugin-react-hooks` ^5.0.0
- `eslint-plugin-react-refresh` ^0.4.14
- `tailwindcss` ^3.4.17
- `vite` ^6.0.1

---

*Última actualización: $(date)*