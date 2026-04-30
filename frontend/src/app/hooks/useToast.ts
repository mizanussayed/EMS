import { useState, useCallback } from 'react';
import type { ToastData, ToastType } from '../components/ui/Toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg: string) => show(msg, 'success'), [show]);
  const error = useCallback((msg: string) => show(msg, 'error'), [show]);
  const warning = useCallback((msg: string) => show(msg, 'warning'), [show]);
  const info = useCallback((msg: string) => show(msg, 'info'), [show]);

  return { toasts, remove, success, error, warning, info };
}

export function useConfirm() {
  const [state, setState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    title: 'Are you sure?',
    message: '',
    confirmLabel: 'Confirm',
    resolve: null,
  });

  const confirm = useCallback(
    (message: string, title = 'Are you sure?', confirmLabel = 'Delete'): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({ isOpen: true, title, message, confirmLabel, resolve });
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((s) => ({ ...s, isOpen: false, resolve: null }));
  }, [state]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState((s) => ({ ...s, isOpen: false, resolve: null }));
  }, [state]);

  return {
    confirmState: state,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
