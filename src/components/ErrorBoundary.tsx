import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Error Boundary para manejar errores en el frontend
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}

// Componente funcional para usar con hooks
export const ErrorBoundaryWrapper: React.FC<{children: ReactNode}> = ({ children }) => {
  const navigate = useNavigate();

  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      setHasError(true);
      setError(event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(true);
      setError(new Error(`Unhandled promise rejection: ${event.reason}`));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return <ErrorFallback error={error} />;
  }

  return <>{children}</>;
};

const ErrorFallback: React.FC<{error?: Error; errorInfo?: ErrorInfo}> = ({ error, errorInfo }) => {
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-sans">
      <div className="max-w-md w-full mx-4 bg-[#0B0E14] border border-gray-800 rounded-2xl p-6 shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-red-600/20 rounded-2xl mb-4">
            <AlertTriangle className="text-red-400 h-12 w-12" />
          </div>
          
          <h1 className="text-2xl font-black text-white mb-2">Sistema Caído</h1>
          <p className="text-gray-400 text-sm mb-6">
            El sistema ha detectado un error crítico. No te preocupes, esto no afecta tus datos.
          </p>

          {error && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6 text-xs font-mono text-gray-300 overflow-auto max-h-32">
              <div className="font-bold text-red-400 mb-2">Error:</div>
              <div>{error.message}</div>
              {error.stack && (
                <div className="mt-2 pt-2 border-t border-gray-800">
                  <div className="font-bold text-gray-500 mb-1">Stack:</div>
                  <div className="text-gray-400">{error.stack}</div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleReload}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Reiniciar Sistema
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 py-3 px-4 bg-gray-800 rounded-xl font-bold text-white hover:bg-gray-700 transition-all flex items-center justify-center gap-2 border border-gray-700"
            >
              <Home size={16} /> Ir al Inicio
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Si el problema persiste, contacta al soporte técnico.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;