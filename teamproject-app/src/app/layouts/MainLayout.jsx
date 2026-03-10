import { Outlet } from 'react-router-dom';
import Navbar from '../../shared/components/Navbar';
import Footer from '../../shared/components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor:'var(--background-color)'}}>
      <Navbar />
      <main className="flex-1 pt-[70px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
