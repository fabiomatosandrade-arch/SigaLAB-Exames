
import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExamList from './components/ExamList';
import Reports from './components/Reports';
import Profile from './components/Profile';
import { User, LabExam } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [exams, setExams] = useState<LabExam[]>([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isReady, setIsReady] = useState(false);

  // Carregamento inicial resiliente
  useEffect(() => {
    const hydrate = () => {
      console.log('App: Iniciando hidratação de dados...');
      try {
        const savedUser = localStorage.getItem('sigalab_user');
        const savedExams = localStorage.getItem('sigalab_exams');
        
        if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && typeof parsedUser === 'object') {
            setUser(parsedUser);
            console.log('App: Usuário recuperado.');
          }
        }
        
        if (savedExams && savedExams !== 'undefined' && savedExams !== 'null') {
          const parsedExams = JSON.parse(savedExams);
          if (Array.isArray(parsedExams)) {
            setExams(parsedExams);
            console.log('App: Exames recuperados:', parsedExams.length);
          }
        }
      } catch (error) {
        console.warn("App: LocalStorage indisponível.", error);
      } finally {
        setIsReady(true);
        console.log('App: Pronto para renderizar.');
      }
    };

    // Pequeno delay para garantir estabilidade do DOM
    const timer = setTimeout(hydrate, 50);
    return () => clearTimeout(timer);
  }, []);

  // Persistência automática
  useEffect(() => {
    if (!isReady) return;
    try {
      if (user) {
        localStorage.setItem('sigalab_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('sigalab_user');
      }
      localStorage.setItem('sigalab_exams', JSON.stringify(exams));
    } catch (error) {
      console.warn("App: Falha ao salvar dados.", error);
    }
  }, [user, exams, isReady]);

  const handleLogin = (u: User) => setUser(u);
  
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
    try { localStorage.removeItem('sigalab_user'); } catch (e) {}
  };

  const addExam = (examData: Omit<LabExam, 'id' | 'userId'>) => {
    if (!user) return;
    const newExam: LabExam = {
      ...examData,
      id: Math.random().toString(36).substring(2, 11),
      userId: user.id
    };
    setExams(prev => [...prev, newExam]);
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Sincronizando registros...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard exams={exams} />;
      case 'exams': return <ExamList exams={exams} onAddExam={addExam} onDeleteExam={deleteExam} />;
      case 'reports': return <Reports exams={exams} user={user} />;
      case 'profile': return <Profile user={user} />;
      default: return <Dashboard exams={exams} />;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onNavigate={setCurrentPage}
      currentPage={currentPage}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
