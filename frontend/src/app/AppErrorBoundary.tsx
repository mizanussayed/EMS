import type { ErrorInfo, ReactNode } from 'react';
import React from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error boundary caught an error:', error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 text-white">
          <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">Application Error</p>
            <h1 className="mt-4 text-3xl font-black">Something went wrong</h1>
            <p className="mt-4 text-sm text-white/70">
              {this.state.error?.message || 'An unexpected error occurred while loading the application.'}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-8 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Reload app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
