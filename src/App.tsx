import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Landing viene de components
import Landing from './components/Temp';

// Propiedades y admin vienen de pages (respetando tus minúsculas)
import Catalogo from './pages/propiedades';
import Admin from './pages/admin';
// Veo que tenés un Login preparado! Lo importamos para después
import Login from './pages/Login'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/propiedades" element={<Catalogo />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}