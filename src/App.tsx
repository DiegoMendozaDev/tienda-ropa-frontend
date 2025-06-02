import './App.css'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import Inicio from './pages/Inicio.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Carrito from './pages/Carrito.tsx';
import Admin from './pages/Admin.tsx';
import Genero from './pages/Genero';
import Categoria from './pages/Categoria.tsx';
function App() {

  return (
    <div className="Aplicacion">
      <Routes>
        <Route path="/" element={ <Inicio /> } />
        {/* Ruta dinámica para chicos/chicas */}
        <Route path="tienda/:genero" element={<Genero />} />
        <Route path="categoria/:id" element={<Categoria />} />
        <Route path="login" element={ <Login /> } />
        <Route path="register" element={ <Register /> } />
        <Route path="carrito" element= {<Carrito/>} />
        <Route path="admin" element = { < Admin />} />
      </Routes>
    </div>
  )
}

export default App
