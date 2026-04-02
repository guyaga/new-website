import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ReactLenis } from 'lenis/react';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import HomePage from './pages/HomePage';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import PortfolioDetail from './pages/PortfolioDetail';
import Webinar from './pages/Webinar';
import ThoughtsPage from './pages/ThoughtsPage';
import SeedancePage from './pages/SeedancePage';
import SeedanceWebinar from './pages/SeedanceWebinar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import BlogListAdmin from './pages/admin/BlogListAdmin';
import BlogEditor from './pages/admin/BlogEditor';
import PortfolioListAdmin from './pages/admin/PortfolioListAdmin';
import PortfolioEditor from './pages/admin/PortfolioEditor';
import LeadsAdmin from './pages/admin/LeadsAdmin';
import CoursePage from './pages/CoursePage';
import CourseHub from './pages/CourseHub';
import CourseAdmin from './pages/admin/CourseAdmin';
import CourseMembersAdmin from './pages/admin/CourseMembersAdmin';

gsap.registerPlugin(ScrollTrigger);

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function PublicLayout() {
  const [booted, setBooted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    setIsDesktop(window.matchMedia('(pointer: fine)').matches);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const content = (
    <div className={`architectural-grid bg-off-white min-h-screen text-black font-sans relative ${!booted ? 'h-screen overflow-hidden' : ''}`}>
      {!booted && <Preloader onComplete={() => setBooted(true)} />}
      {isDesktop && <CustomCursor />}
      <Navbar />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
        <Route path="/thoughts" element={<ThoughtsPage />} />
        <Route path="/seedance" element={<SeedancePage />} />
        <Route path="/seedance-webinar" element={<SeedanceWebinar />} />
        <Route path="/webinar" element={<Webinar />} />
        <Route path="/course/10-days-10-skills" element={<CoursePage />} />
      </Routes>
      <Footer />
    </div>
  );

  if (isHome) {
    return <ReactLenis root>{content}</ReactLenis>;
  }

  return content;
}

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isCourseHub = location.pathname === '/course/hub';

  if (isCourseHub) {
    return (
      <Routes>
        <Route path="/course/hub" element={<CourseHub />} />
      </Routes>
    );
  }

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="blog" element={<BlogListAdmin />} />
          <Route path="blog/new" element={<BlogEditor />} />
          <Route path="blog/:id" element={<BlogEditor />} />
          <Route path="portfolio" element={<PortfolioListAdmin />} />
          <Route path="portfolio/new" element={<PortfolioEditor />} />
          <Route path="portfolio/:id" element={<PortfolioEditor />} />
          <Route path="leads" element={<LeadsAdmin />} />
          <Route path="course" element={<CourseAdmin />} />
          <Route path="course/members" element={<CourseMembersAdmin />} />
        </Route>
      </Routes>
    );
  }

  return <PublicLayout />;
}

export default App;
