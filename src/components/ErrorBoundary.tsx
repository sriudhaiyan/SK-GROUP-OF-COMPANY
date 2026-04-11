import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let errorDetails = this.state.error?.message;

      try {
        if (errorDetails) {
          const parsedError = JSON.parse(errorDetails);
          if (parsedError.operationType) {
            errorMessage = "A database error occurred. Please check your permissions or try again later.";
            errorDetails = parsedError.error || "Unknown database error";
          }
        }
      } catch (e) {
        // Not a JSON error string
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white font-sans">
          <div className="max-w-md w-full bg-gray-900 border border-red-500/30 rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(255,0,0,0.1)]">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              {errorMessage}
            </p>
            {errorDetails && (
              <div className="bg-black/50 p-4 rounded-lg border border-gray-800 text-left mb-6 overflow-auto max-h-40">
                <code className="text-xs text-red-400 font-mono">
                  {errorDetails}
                </code>
              </div>
            )}
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors font-medium w-full"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
