import { create } from "zustand";

export interface Toast {
  id: number;
  title: string;
  message: string;
}

interface ToastState {
  toasts: Toast[];

  showToast: (
    title: string,
    message: string
  ) => void;

  removeToast: (id: number) => void;
}

export const useToastStore = create<ToastState>(
  (set) => ({
    toasts: [],

    showToast: (title, message) => {
      const id = Date.now();

      set((state) => ({
        toasts: [
          ...state.toasts,
          {
            id,
            title,
            message,
          },
        ],
      }));

      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter(
            (toast) => toast.id !== id
          ),
        }));
      }, 4000);
    },

    removeToast: (id) => {
      set((state) => ({
        toasts: state.toasts.filter(
          (toast) => toast.id !== id
        ),
      }));
    },
  })
);