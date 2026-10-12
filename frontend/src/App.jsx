import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import EditTransaction from './pages/EditTransaction';
import NotFound from './pages/NotFound';
import { getCurrentMonthString } from './utils/dates';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString());
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="main-wrapper">
          <Topbar
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />

          <main className="page-content">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    selectedMonth={selectedMonth}
                    showToast={showToast}
                  />
                }
              />
              <Route
                path="/transactions"
                element={<Transactions showToast={showToast} />}
              />
              <Route
                path="/add"
                element={<AddTransaction showToast={showToast} />}
              />
              <Route
                path="/edit/:id"
                element={<EditTransaction showToast={showToast} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>

        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </BrowserRouter>
  );
}

export default App;
