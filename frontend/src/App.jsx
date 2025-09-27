import { useState } from 'react'

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">🏨 HotelBooking</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-primary-600 transition-colors">Hoteles</a>
              <a href="#" className="text-gray-700 hover:text-primary-600 transition-colors">Mis Reservas</a>
              <a href="#" className="text-gray-700 hover:text-primary-600 transition-colors">Contacto</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="btn-secondary">Iniciar Sesión</button>
              <button className="btn-primary">Registrarse</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Encuentra tu hotel perfecto
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Miles de hoteles al mejor precio, reserva fácil y rápido
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="¿A dónde quieres ir?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                />
              </div>
              <button className="btn-primary px-8 py-3 text-lg">
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Hoteles Destacados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((hotel) => (
              <div key={hotel} className="card">
                <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Imagen del Hotel {hotel}</span>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Hotel Ejemplo {hotel}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Una descripción breve del hotel con sus principales características y ubicación.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary-600">$120/noche</span>
                    <button className="btn-primary">Ver Detalles</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 HotelBooking - Digital House. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
