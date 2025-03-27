import './App.css'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import Inicio from './pages/Inicio.tsx';
import Chico from './pages/Chico.tsx';

function App() {

  return (
    <div className="Aplicacion">
      <Routes>
        <Route path="/" element={ <Inicio /> } />
        <Route path="tienda-chicos" element={ <Chico /> } />
      </Routes>
    </div>
  )
}

export default App
