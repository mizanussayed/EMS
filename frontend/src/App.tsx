import AppProviders from './app/AppProviders';
import AppRouter from './app/AppRouter';
import AppErrorBoundary from './app/AppErrorBoundary';

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </AppErrorBoundary>
  );
}
