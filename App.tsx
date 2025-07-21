

import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Dictionary from './components/Dictionary';
import Quiz from './components/Quiz';
import MemoryGame from './components/MemoryGame';
import Certification from './components/Certification';
import GamesHub from './components/GamesHub';
import FillInTheBlankGame from './components/FillInTheBlankGame';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Contact from './components/Contact';
import ScrabbleGame from './components/ScrabbleGame';
import Guide from './components/Guide';
import { View } from './types';
import { useTheme } from './hooks/useTheme';
import { UserProvider, useUser } from './hooks/useUser';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [initialLetter, setInitialLetter] = useState('');
  const [theme, setTheme] = useTheme();
  const { user } = useUser();

  const navigate = useCallback((view: View, letter: string = '') => {
    setInitialLetter(letter || '');
    
    if (view === 'admin' && user?.role !== 'admin') {
      setCurrentView('login');
    } else if (view === 'user-dashboard' && !user) {
      setCurrentView('login');
    } else {
      setCurrentView(view);
    }
  }, [user]);
  
  // Reset initialLetter when navigating away from dictionary to avoid stale state
  useEffect(() => {
    if(currentView !== 'dictionary') {
        setInitialLetter('');
    }
  }, [currentView]);

  const renderView = useCallback(() => {
    switch (currentView) {
      case 'home':
        return <Home setView={navigate} />;
      case 'dictionary':
        return <Dictionary setView={navigate} initialLetter={initialLetter} />;
      case 'guide-touristique':
        return <Guide setView={navigate} />;
      case 'quiz':
        return <Quiz setView={navigate} />;
      case 'games':
        return <GamesHub setView={navigate} />;
      case 'memory-game':
        return <MemoryGame setView={navigate} />;
      case 'fill-in-the-blank':
        return <FillInTheBlankGame setView={navigate} />;
      case 'certification':
        return <Certification setView={navigate} />;
      case 'login':
        return <Login setView={navigate} />;
      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard /> : <Login setView={navigate} />;
      case 'user-dashboard':
        return user?.role === 'user' ? <UserDashboard setView={navigate} /> : <Login setView={navigate} />;
      case 'contact':
        return <Contact />;
      case 'scrabble-game':
        return <ScrabbleGame setView={navigate} />;
      default:
        return <Home setView={navigate} />;
    }
  }, [currentView, user, navigate, initialLetter]);

  const appBg = theme === 'classic' 
      ? 'theme-body-bg' 
      : 'bg-gradient-to-tr from-cyan-50 via-blue-100 to-cyan-100 dark:from-slate-900 dark:to-blue-900';

  return (
    <div className={`flex flex-col min-h-screen ${appBg} text-slate-800 dark:text-slate-200`}>
      <div className="fixed inset-0 w-full h-full background-pattern -z-10"></div>
      <Header currentView={currentView} setView={navigate} theme={theme} setTheme={setTheme} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div key={currentView} className="w-full max-w-7xl mx-auto animate-fade-in-up">
          {renderView()}
        </div>
      </main>
      <Footer setView={navigate} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
