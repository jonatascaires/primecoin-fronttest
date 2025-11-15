import React from 'react';

export const Loading: React.FC<{ message?: string }> = ({ message = 'Carregando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ 
  message, 
  onRetry 
}) => {
  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 text-center">
      <div className="text-red-600 text-5xl mb-4">⚠️</div>
      <h3 className="text-xl font-bold text-red-800 mb-2">Erro</h3>
      <p className="text-red-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
};

export const EmptyState: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}> = ({ icon, title, description }) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};
