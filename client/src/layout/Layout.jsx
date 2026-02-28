import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // ✅ default open on desktop

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(prev => !prev)} />

      <div className="app-layout">
        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        <main
          className="app-content"
          onClick={() => setSidebarOpen(false)}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
