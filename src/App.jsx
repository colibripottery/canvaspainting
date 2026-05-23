import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ClassDetail from './pages/ClassDetail';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classes/:acuityClassId" element={<ClassDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
