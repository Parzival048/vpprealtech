import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Loader from './components/ui/Loader';
import WhatsAppFloat from './components/ui/WhatsAppFloat';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Contexts
import { ComparisonProvider } from './contexts/ComparisonContext';

// Analytics
import { initGA, trackPageView } from './utils/analytics';

// Pages
import Home from './pages/Home';
import Buyers from './pages/Buyers';
import Developers from './pages/Developers';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/Projects';
import AdminBlogs from './pages/admin/Blogs';
import AdminLeads from './pages/admin/Leads';

// Styles
import './styles/index.css';

// Scroll to top on route change + track page views
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Track page view in Google Analytics
    trackPageView(pathname, document.title);
  }, [pathname]);

  return null;
}

// Layout wrapper for public pages
function PublicLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

// Layout wrapper for admin pages
function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  // Initialize Google Analytics
  useEffect(() => {
    // Add your GA4 Measurement ID here
    const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (GA_MEASUREMENT_ID) {
      initGA(GA_MEASUREMENT_ID);
    }
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <ComparisonProvider>
          <BrowserRouter>
            {isLoading && <Loader onLoadComplete={handleLoadComplete} />}
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/buyers" element={<PublicLayout><Buyers /></PublicLayout>} />
              <Route path="/developers" element={<PublicLayout><Developers /></PublicLayout>} />
              <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
              <Route path="/projects/:slug" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
              <Route path="/blogs" element={<PublicLayout><Blogs /></PublicLayout>} />
              <Route path="/blogs/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
              <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout><AdminLogin /></AdminLayout>} />
              <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/projects" element={<AdminLayout><AdminProjects /></AdminLayout>} />
              <Route path="/admin/blogs" element={<AdminLayout><AdminBlogs /></AdminLayout>} />
              <Route path="/admin/leads" element={<AdminLayout><AdminLeads /></AdminLayout>} />

              {/* 404 Catch-all */}
              <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
          </BrowserRouter>
        </ComparisonProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;

