import { useNotificationStore } from "../../stores/notificationStore";

function NotificationBell() {
  const notifications = useNotificationStore(
    (state) => state.notifications
  );

  const isPanelOpen = useNotificationStore(
    (state) => state.isPanelOpen
  );

  const setPanelOpen = useNotificationStore(
    (state) => state.setPanelOpen
  );

  const markAsRead = useNotificationStore(
    (state) => state.markAsRead
  );

  const markAllAsRead = useNotificationStore(
    (state) => state.markAllAsRead
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const togglePanel = () => {
    setPanelOpen(!isPanelOpen);
  };

  return (
    <div className="relative">
      {/* =====================================================
          BELL BUTTON
      ====================================================== */}

      <button
        type="button"
        aria-label={`Notifications${
          unreadCount > 0
            ? `, ${unreadCount} unread`
            : ""
        }`}
        aria-expanded={isPanelOpen}
        aria-haspopup="true"
        onClick={togglePanel}
        className="
          relative
          rounded-lg
          border
          border-slate-300
          bg-white
          p-2
          text-slate-700
          transition
          hover:bg-slate-100
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500

          dark:border-slate-600
          dark:bg-slate-800
          dark:text-slate-200
          dark:hover:bg-slate-700
        "
      >
        {/* Bell Icon */}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.5-2.25A6.5 6.5 0 0 1 17.5 11V9a5.5 5.5 0 0 0-11 0v2a6.5 6.5 0 0 1-1 3.75L4 17h5"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17a3 3 0 0 0 6 0"
          />
        </svg>

        {/* ===================================================
            UNREAD COUNT
        ==================================================== */}

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-red-600
              px-1
              text-[10px]
              font-bold
              text-white
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* =====================================================
          NOTIFICATION PANEL
      ====================================================== */}

      {isPanelOpen && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="
            absolute
            right-0
            top-12
            z-50
            w-[calc(100vw-2rem)]
            max-w-sm
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-xl

            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          {/* =================================================
              HEADER
          ================================================== */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-slate-200
              px-4
              py-3

              dark:border-slate-700
            "
          >
            <div>
              <h2
                className="
                  text-sm
                  font-semibold
                  text-slate-900

                  dark:text-slate-100
                "
              >
                Notifications
              </h2>

              <p
                className="
                  text-xs
                  text-slate-500

                  dark:text-slate-400
                "
              >
                {unreadCount} unread
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="
                  text-xs
                  font-medium
                  text-blue-600
                  hover:text-blue-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500

                  dark:text-blue-400
                  dark:hover:text-blue-300
                "
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* =================================================
              NOTIFICATIONS LIST
          ================================================== */}

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p
                  className="
                    text-sm
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  onClick={() =>
                    markAsRead(notification.id)
                  }
                  className={`
                    w-full
                    border-b
                    border-slate-200
                    px-4
                    py-3
                    text-left
                    transition
                    hover:bg-slate-50
                    focus:outline-none
                    focus:ring-2
                    focus:ring-inset
                    focus:ring-blue-500

                    dark:border-slate-700
                    dark:hover:bg-slate-800

                    ${
                      notification.read
                        ? "bg-white dark:bg-slate-900"
                        : "bg-blue-50/60 dark:bg-blue-950/40"
                    }
                  `}
                >
                  <div className="flex gap-3">
                    {/* Unread Indicator */}

                    <span
                      className={`
                        mt-1.5
                        h-2
                        w-2
                        shrink-0
                        rounded-full

                        ${
                          notification.read
                            ? "bg-slate-300 dark:bg-slate-600"
                            : "bg-blue-600 dark:bg-blue-400"
                        }
                      `}
                      aria-hidden="true"
                    />

                    <div className="min-w-0 flex-1">
                      {/* Title */}

                      <p
                        className={`
                          text-sm
                          font-medium

                          ${
                            notification.read
                              ? "text-slate-700 dark:text-slate-300"
                              : "text-slate-900 dark:text-slate-100"
                          }
                        `}
                      >
                        {notification.title}
                      </p>

                      {/* Message */}

                      <p
                        className="
                          mt-1
                          line-clamp-2
                          text-xs
                          leading-5
                          text-slate-500

                          dark:text-slate-400
                        "
                      >
                        {notification.message}
                      </p>

                      {/* Time */}

                      <p
                        className="
                          mt-2
                          text-[11px]
                          text-slate-400

                          dark:text-slate-500
                        "
                      >
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;