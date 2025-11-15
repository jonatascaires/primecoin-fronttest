import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const REFERRAL_KEY = 'primecoin_referral';

export const useReferral = () => {
  const location = useLocation();
  const [savedReferral, setSavedReferral] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se há parâmetro ref na URL
    const params = new URLSearchParams(location.search);
    const refParam = params.get('ref');

    if (refParam) {
      // Se tem referral na URL, salvar no localStorage
      const address = refParam.toLowerCase();
      localStorage.setItem(REFERRAL_KEY, address);
      setSavedReferral(address);
      console.log('Referral salvo no localStorage:', address);
    } else {
      // Se não tem na URL, tentar carregar do localStorage
      const stored = localStorage.getItem(REFERRAL_KEY);
      if (stored) {
        setSavedReferral(stored);
        console.log('Referral carregado do localStorage:', stored);
      }
    }
  }, [location]);

  const getReferral = (): string | null => {
    return localStorage.getItem(REFERRAL_KEY);
  };

  const clearReferral = () => {
    localStorage.removeItem(REFERRAL_KEY);
    setSavedReferral(null);
  };

  const hasReferral = (): boolean => {
    return !!localStorage.getItem(REFERRAL_KEY);
  };

  return {
    savedReferral,
    getReferral,
    clearReferral,
    hasReferral,
  };
};
