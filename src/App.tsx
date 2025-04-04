import './App.css'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import Inicio from './pages/Inicio.tsx';
import Chico from './pages/Chico.tsx';
import Chica from './pages/Chica.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
function App() {

  return (
    <div className="Aplicacion">
      <Routes>
        <Route path="/" element={ <Inicio /> } />
        <Route path="tienda-chicos" element={ <Chico /> } />
        <Route path="tienda-chicas" element={ <Chica /> } />
        <Route path="login" element={ <Login /> } />
        <Route path="register" element={ <Register /> } />
      </Routes>
    </div>
  )
}

export default App
