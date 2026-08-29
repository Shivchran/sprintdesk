import { useToastStore } from "../../stores/toastStore";

function ToastContainer() {
  const toasts = useToastStore(
    (state) => state.toasts
  );

  const removeToast = useToastStore(
    (state) => state.removeToast
  );

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed right-4 top-4 z-[100] w-[calc(100vw-2rem)] max-w-sm space-y-3"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
          role="status"
        >
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              🔔
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {toast.title}
              </p>

              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                removeToast(toast.id)
              }
              aria-label="Close notification"
              className="text-slate-400 hover:text-slate-700"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;