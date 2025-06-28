// src/services/toast.service.ts
import { ref, reactive } from 'vue';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
  duration: number;
}

// State
let nextId = 0;
const toasts = reactive<Toast[]>([]);

// Methods
const addToast = (type: 'success' | 'error' | 'warning', message: string, duration = 5000) => {
  const id = nextId++;

  // Add toast to list
  toasts.push({ id, type, message, duration });

  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
};

const removeToast = (id: number) => {
  const index = toasts.findIndex(t => t.id === id);
  if (index !== -1) {
    toasts.splice(index, 1);
  }
};

export default {
  toasts,
  success: (message: string, duration = 5000) => addToast('success', message, duration),
  error: (message: string, duration = 5000) => addToast('error', message, duration),
  warning: (message: string, duration = 5000) => addToast('warning', message, duration),
  remove: removeToast
};
