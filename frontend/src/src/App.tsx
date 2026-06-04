import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CompanyPage from './pages/CompanyPage';
import TimelinePage from './pages/TimelinePage';
import DashboardPage from './pages/DashboardPage';
import PitchDetailPage from './pages/PitchDetailPage';
import LoginPage from './pages/LoginPage';
import BillingPage from './pages/BillingPage';

function App() {
  return (
    <BrowserRouter basename="/PitchLink">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/company/:slug" element={<CompanyPage />} />
        <Route path="/company/:slug/timeline" element={<TimelinePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/pitch/:id" element={<PitchDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
