import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Landing viene de components
import Landing from './components/Temp';

// Propiedades y admin vienen de pages (respetando tus minúsculas)
import Catalogo from './pages/propiedades';
import Admin from './pages/admin';
import Login from './pages/login';
import PropiedadDetalle from './pages/PropiedadDetalle';

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/propiedades" element={<Catalogo />} />
        <Route path="/propiedad/:id" element={<PropiedadDetalle />} />
        <Route path="/propiedades/:id" element={<PropiedadDetalle />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}