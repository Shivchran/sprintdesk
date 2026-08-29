import { useToastStore } from "../stores/toastStore";

export function useToast() {
  const showToast = useToastStore(
    (state) => state.showToast
  );

  const removeToast = useToastStore(
    (state) => state.removeToast
  );

  return {
    showToast,
    removeToast,
  };
}