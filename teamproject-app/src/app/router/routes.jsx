import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../../pages/HomePage';
import LoginPage from '../../pages/LoginPage';
import JoinPage from '../../pages/JoinPage';
import TutorListPage from '../../pages/TutorListPage';
import TutorDetailPage from '../../pages/TutorDetailPage';
import MyPagePage from '../../pages/MyPagePage';
import MemberProfileEditPage from '../../pages/MemberProfileEditPage';
import TutorMyPagePage from '../../pages/TutorMyPagePage';
import TutorDashboardPage from '../../pages/TutorDashboardPage';
import TutorRegisterPage from '../../pages/TutorRegisterPage';
import TutorProfileEditPage from '../../pages/TutorProfileEditPage';
import ScheduleEditPage from '../../pages/ScheduleEditPage';
import AdminPage from '../../pages/AdminPage';
import GuidePage from '../../pages/GuidePage';
import FaqPage from '../../pages/FaqPage';
import ContactPage from '../../pages/ContactPage';
import AboutPage from '../../pages/AboutPage';
import PoliciesPage from '../../pages/PoliciesPage';
import LanguagePage from '../../pages/LanguagePage';
import PartnerPage from '../../pages/PartnerPage';
import JobsPage from '../../pages/JobsPage';
import GamePage from '../../pages/GamePage';
import PaymentSuccessPage from '../../pages/PaymentSuccessPage';
import PaymentFailPage from '../../pages/PaymentFailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'join', element: <JoinPage /> },

      { path: 'tutors', element: <TutorListPage /> },
      { path: 'tutors/:id', element: <TutorDetailPage /> },

      { path: 'mypage', element: <MyPagePage /> },
      { path: 'member/mypage', element: <MyPagePage /> },
      { path: 'member/profile-edit', element: <MemberProfileEditPage /> },

      { path: 'tutor/register', element: <TutorRegisterPage /> },
      { path: 'tutor/mypage', element: <TutorMyPagePage /> },
      { path: 'tutor/dashboard', element: <TutorDashboardPage /> },
      { path: 'tutor/profile-edit', element: <TutorProfileEditPage /> },
      { path: 'tutor/schedule-edit', element: <ScheduleEditPage /> },

      { path: 'admin', element: <AdminPage /> },

      { path: 'guide', element: <GuidePage /> },
      { path: 'guide/policies', element: <PoliciesPage /> },
      { path: 'guide/language', element: <LanguagePage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'partnership', element: <PartnerPage /> },
      { path: 'jobs', element: <JobsPage /> },

      { path: 'game/korean', element: <GamePage /> },

      { path: 'payments/toss/success', element: <PaymentSuccessPage /> },
      { path: 'payments/toss/fail', element: <PaymentFailPage /> },
    ],
  },
]);
