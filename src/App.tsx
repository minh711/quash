import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/main-layout';
import QuizPage from './pages/quiz';
import QuizBundlePage from './pages/quiz-bundle';
// import AppLayout from './layout/AppLayout';
// import HomePage from './pages/HomePage';
// import QuizzesPage from './pages/QuizzesPage';
// import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => (
  <Router>
    <MainLayout>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz-bundle" element={<QuizBundlePage />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </MainLayout>
  </Router>
);

export default App;
