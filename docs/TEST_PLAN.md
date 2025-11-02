# 🧪 Plan de Pruebas - HotelFlow

## 📋 Información General

- **Proyecto**: HotelFlow - Sistema de Gestión Hotelera
- **Versión**: Sprint 2 - Formulario Mejorado y Optimizaciones
- **Fecha**: 27/12/2024
- **Responsable**: Equipo de Desarrollo
- **Entorno de Pruebas**: http://localhost:5173

---

## 🎯 Historias de Usuario a Probar

### Sprint 1 - Funcionalidades Base
1. **User Story #1**: Header Component
2. **User Story #7**: Footer Component
3. **Internacionalización**: Sistema multiidioma (ES/EN)
4. **Mobile Support**: Detección de dispositivos y diseño responsivo

### Sprint 2 - Optimizaciones
5. **User Story #8**: Optimización de Interfaz de Gestión de Habitaciones
6. **User Story #9**: Cumplimiento de Estándares de Calidad de Código
7. **User Story #10**: Formulario de Habitaciones Mejorado y Optimización de Página Pública

---

## 📝 Casos de Prueba Detallados

### 🏠 TC001: Header Component
**Historia de Usuario**: #1 - Header Component
**Objetivo**: Verificar funcionalidad completa del componente Header

#### Casos de Prueba:
1. **TC001.1 - Navegación Principal**
   - **Descripción**: Verificar que el header se muestre correctamente en todas las páginas
   - **Pasos**:
     1. Navegar a http://localhost:5173
     2. Verificar presencia del logo HotelFlow
     3. Verificar menú de navegación
     4. Verificar selector de idioma
   - **Resultado Esperado**: Header visible con todos los elementos
   - **Estado**: ✅ PASS

2. **TC001.2 - Cambio de Idioma**
   - **Descripción**: Verificar funcionalidad del selector de idioma
   - **Pasos**:
     1. Hacer clic en selector de idioma
     2. Cambiar de Español a Inglés
     3. Verificar que el contenido cambie de idioma
   - **Resultado Esperado**: Interfaz cambia completamente al idioma seleccionado
   - **Estado**: ✅ PASS

3. **TC001.3 - Responsividad**
   - **Descripción**: Verificar que el header sea responsive
   - **Pasos**:
     1. Redimensionar ventana a móvil (< 768px)
     2. Verificar que el header se adapte
     3. Probar en tablet (768px - 1024px)
   - **Resultado Esperado**: Header se adapta correctamente a diferentes tamaños
   - **Estado**: ✅ PASS

### 🦶 TC002: Footer Component
**Historia de Usuario**: #7 - Footer Component
**Objetivo**: Verificar funcionalidad del componente Footer

#### Casos de Prueba:
1. **TC002.1 - Contenido del Footer**
   - **Descripción**: Verificar elementos del footer
   - **Pasos**:
     1. Scroll hasta el final de cualquier página
     2. Verificar presencia del logo
     3. Verificar copyright con año actual
     4. Verificar tagline "Seamless stays, endless possibilities"
   - **Resultado Esperado**: Todos los elementos presentes y correctos
   - **Estado**: ✅ PASS

2. **TC002.2 - Posicionamiento**
   - **Descripción**: Verificar que el footer esté en la parte inferior
   - **Pasos**:
     1. Navegar a diferentes páginas
     2. Verificar que el footer siempre esté al final
   - **Resultado Esperado**: Footer siempre en la parte inferior
   - **Estado**: ✅ PASS

### 🏨 TC003: Panel de Administración
**Historia de Usuario**: #8 - Optimización de Interfaz de Gestión
**Objetivo**: Verificar funcionalidad del panel administrativo

#### Casos de Prueba:
1. **TC003.1 - Acceso al Panel Admin**
   - **Descripción**: Verificar acceso al panel de administración
   - **Pasos**:
     1. Navegar a http://localhost:5173/admin
     2. Verificar carga del dashboard
     3. Verificar sidebar con navegación
   - **Resultado Esperado**: Panel admin carga correctamente
   - **Estado**: ✅ PASS

2. **TC003.2 - Navegación del Sidebar**
   - **Descripción**: Verificar navegación entre secciones
   - **Pasos**:
     1. Hacer clic en "Habitaciones"
     2. Hacer clic en "Reservas"
     3. Hacer clic en "Analíticas"
     4. Verificar que cada sección cargue
   - **Resultado Esperado**: Navegación fluida entre secciones
   - **Estado**: ✅ PASS

3. **TC003.3 - Persistencia del Sidebar**
   - **Descripción**: Verificar que el estado del sidebar se mantenga
   - **Pasos**:
     1. Colapsar/expandir sidebar
     2. Navegar a otra sección
     3. Recargar página
     4. Verificar estado del sidebar
   - **Resultado Esperado**: Estado del sidebar se mantiene
   - **Estado**: ✅ PASS

### 📝 TC004: Formulario de Habitaciones Mejorado
**Historia de Usuario**: #10 - Formulario Completo
**Objetivo**: Verificar funcionalidad del formulario expandido

#### Casos de Prueba:
1. **TC004.1 - Campos del Formulario**
   - **Descripción**: Verificar presencia de todos los campos (25+)
   - **Pasos**:
     1. Navegar a /admin/rooms
     2. Hacer clic en "Agregar Habitación"
     3. Verificar secciones: Información Básica, Hotel, Ubicación, Características, Amenidades
   - **Resultado Esperado**: Formulario con 25+ campos organizados en secciones
   - **Estado**: ✅ PASS

2. **TC004.2 - Componente Checkbox**
   - **Descripción**: Verificar funcionamiento del nuevo componente Checkbox
   - **Pasos**:
     1. En el formulario, ir a sección "Amenidades"
     2. Seleccionar/deseleccionar checkboxes
     3. Verificar estado visual
   - **Resultado Esperado**: Checkboxes funcionan correctamente con estilos apropiados
   - **Estado**: ✅ PASS

3. **TC004.3 - Validación del Formulario**
   - **Descripción**: Verificar validaciones de campos requeridos
   - **Pasos**:
     1. Intentar enviar formulario vacío
     2. Verificar mensajes de error
     3. Completar campos requeridos
     4. Enviar formulario
   - **Resultado Esperado**: Validaciones funcionan, mensajes claros
   - **Estado**: ✅ PASS

4. **TC004.4 - Sistema de Notificaciones Toast**
   - **Descripción**: Verificar notificaciones de éxito/error
   - **Pasos**:
     1. Crear una habitación exitosamente
     2. Verificar toast de éxito
     3. Intentar crear habitación con error
     4. Verificar toast de error
   - **Resultado Esperado**: Toasts aparecen con mensajes apropiados
   - **Estado**: ✅ PASS

### 🏠 TC005: Página Pública de Habitaciones
**Historia de Usuario**: #10 - Optimización de Página Pública
**Objetivo**: Verificar optimizaciones en la página pública

#### Casos de Prueba:
1. **TC005.1 - Paginación Corregida**
   - **Descripción**: Verificar que la paginación inicie en página 1
   - **Pasos**:
     1. Navegar a http://localhost:5173/rooms
     2. Verificar que muestre "Página 1 de X"
     3. Verificar que muestre las primeras habitaciones
   - **Resultado Esperado**: Paginación inicia correctamente en página 1
   - **Estado**: ✅ PASS

2. **TC005.2 - Tamaño de Paginación**
   - **Descripción**: Verificar que muestre 10 habitaciones por página
   - **Pasos**:
     1. En página de habitaciones
     2. Contar habitaciones mostradas
     3. Verificar que sean 10 (o menos si hay menos disponibles)
   - **Resultado Esperado**: Muestra 10 habitaciones por página
   - **Estado**: ✅ PASS

3. **TC005.3 - Filtros Ocultos**
   - **Descripción**: Verificar que los filtros estén temporalmente ocultos
   - **Pasos**:
     1. Navegar a página de habitaciones
     2. Verificar que no se muestren filtros de búsqueda
     3. Verificar que las habitaciones se muestren directamente
   - **Resultado Esperado**: Filtros no visibles, habitaciones se muestran directamente
   - **Estado**: ✅ PASS

### 🌐 TC006: Internacionalización
**Objetivo**: Verificar sistema completo de traducción

#### Casos de Prueba:
1. **TC006.1 - Cobertura de Traducción**
   - **Descripción**: Verificar que todas las claves estén traducidas
   - **Pasos**:
     1. Cambiar idioma a Español
     2. Navegar por todas las secciones
     3. Cambiar a Inglés
     4. Repetir navegación
   - **Resultado Esperado**: 250+ claves traducidas, sin texto sin traducir
   - **Estado**: ✅ PASS

2. **TC006.2 - Persistencia de Idioma**
   - **Descripción**: Verificar que el idioma se mantenga al recargar
   - **Pasos**:
     1. Cambiar idioma a Inglés
     2. Recargar página
     3. Verificar idioma mantenido
   - **Resultado Esperado**: Idioma se mantiene después de recargar
   - **Estado**: ✅ PASS

### 📱 TC007: Responsividad y Mobile
**Objetivo**: Verificar diseño responsive y soporte móvil

#### Casos de Prueba:
1. **TC007.1 - Detección de Dispositivo**
   - **Descripción**: Verificar detección de dispositivos móviles
   - **Pasos**:
     1. Abrir DevTools
     2. Cambiar a vista móvil
     3. Navegar a /admin
     4. Verificar mensaje de "no soportado en móvil"
   - **Resultado Esperado**: Mensaje apropiado en dispositivos móviles para admin
   - **Estado**: ✅ PASS

2. **TC007.2 - Responsive Design**
   - **Descripción**: Verificar adaptación a diferentes tamaños
   - **Pasos**:
     1. Probar en móvil (< 768px)
     2. Probar en tablet (768px - 1024px)
     3. Probar en desktop (> 1024px)
   - **Resultado Esperado**: Diseño se adapta correctamente
   - **Estado**: ✅ PASS

### 🗂️ TC008: Categorías (Admin y API)
**Objetivo**: Verificar creación/edición/listado y manejo de errores de Categorías incluyendo `imageUrl`.

#### Casos de Prueba API
1. **TC008.1 - Crear Categoría con imageUrl**
   - Pasos: `POST /api/categories` con `{ name, slug, description, imageUrl }`
   - Esperado: `201 Created`, respuesta incluye `imageUrl` y `isActive=true` por defecto
2. **TC008.2 - Actualizar imageUrl de Categoría**
   - Pasos: `PUT /api/categories/{id}` con `{ imageUrl }`
   - Esperado: `200 OK`, `imageUrl` actualizado
3. **TC008.3 - Listar Categorías incluye imageUrl**
   - Pasos: `GET /api/categories`
   - Esperado: `200 OK`, cada item contiene `imageUrl` (puede ser null si no definido)
4. **TC008.4 - Toggle Active**
   - Pasos: `PATCH /api/categories/{id}/toggle-active`
   - Esperado: `200 OK`, `isActive` alterna su valor
5. **TC008.5 - Error por slug duplicado**
   - Pasos: `POST /api/categories` con `slug` existente
   - Esperado: `409 Conflict`, mensaje "Duplicate Category"
6. **TC008.6 - No encontrado por slug**
   - Pasos: `GET /api/categories/slug/{slug}` inexistente
   - Esperado: `404 Not Found`, mensaje "Category Not Found"

#### Casos de Prueba Frontend Admin
1. **TC008.7 - Formulario muestra campo imageUrl**
   - Pasos: `Admin > Categories > Add Category`
   - Esperado: campo `Image URL` visible con i18n EN/ES
2. **TC008.8 - Crear categoría desde UI**
   - Pasos: completar y guardar
   - Esperado: aparece en la tabla con datos completos
3. **TC008.9 - Editar categoría (imageUrl)**
   - Pasos: abrir edición, cambiar `imageUrl`, guardar
   - Esperado: persistencia y reflejo en listado

#### Datos y Semilla
- Verificar `data.sql` inicializa `image_url` para categorías sembradas.
- **TC006.2 - Persistencia de Idioma**
   - **Descripción**: Verificar que el idioma se mantenga al recargar
   - **Pasos**:
     1. Cambiar idioma a Inglés
     2. Recargar página
     3. Verificar idioma mantenido
   - **Resultado Esperado**: Idioma se mantiene después de recargar
   - **Estado**: ✅ PASS

### Funcionalidades Críticas Verificadas
- ✅ **Navegación**: Funcional en todas las páginas
- ✅ **Internacionalización**: 250+ claves traducidas
- ✅ **Formularios**: Validación y notificaciones funcionando
- ✅ **Paginación**: Corregida y optimizada
- ✅ **Responsive**: Adaptación correcta a dispositivos
- ✅ **Admin Panel**: Funcional con sidebar persistente

---

## 🎯 Conclusiones

### ✅ Aspectos Positivos
1. **100% de casos de prueba exitosos**
2. **Funcionalidades implementadas según especificaciones**
3. **Cumplimiento de estándares técnicos**:
   - Código 100% en inglés
   - 0 console.logs en producción
   - Principios SOLID mantenidos
   - Clean Architecture aplicada
4. **Experiencia de usuario mejorada**:
   - Paginación corregida
   - Formulario más completo
   - Notificaciones claras

### 🔄 Próximos Pasos Recomendados
1. **Testing Automatizado**: Implementar Jest/React Testing Library
2. **Performance Testing**: Verificar tiempos de carga
3. **Accessibility Testing**: Verificar cumplimiento WCAG
4. **Cross-browser Testing**: Probar en diferentes navegadores

---

## 📝 Notas de Ejecución

**Entorno de Pruebas**:
- Frontend: http://localhost:5173
- Backend: http://localhost:8082
- Base de datos: H2 en memoria

**Herramientas Utilizadas**:
- Navegador: Chrome DevTools
- Responsive Testing: DevTools Device Simulation
- Manual Testing: Navegación directa

**Fecha de Ejecución**: 27/12/2024
**Ejecutado por**: Equipo de Desarrollo
**Estado Final**: ✅ TODAS LAS PRUEBAS EXITOSAS