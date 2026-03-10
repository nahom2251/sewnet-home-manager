import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '@/components/SplashScreen';

const Index = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  const handleComplete = useCallback(() => {
    setShowSplash(false);
    navigate('/dashboard');
  }, [navigate]);

  if (showSplash) {
    return <SplashScreen onComplete={handleComplete} />;
  }

  return null;
};

export default Index;
