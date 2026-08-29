import { useEffect, useRef } from "react";
import { fetchNotifications } from "../services/api/notificationApi";
import { useNotificationStore } from "../stores/notificationStore";

const POLLING_INTERVAL = 5000;

export function useNotifications() {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const notifications = useNotificationStore(
    (state) => state.notifications
  );

  const isPanelOpen = useNotificationStore(
    (state) => state.isPanelOpen
  );

  const knownIds = useRef<Set<number>>(
    new Set()
  );

  // =========================================================
  // KEEP KNOWN IDS SYNCHRONIZED
  // =========================================================

  useEffect(() => {
    knownIds.current = new Set(
      notifications.map(
        (notification) => notification.id
      )
    );
  }, [notifications]);

  // =========================================================
  // TOAST
  // =========================================================

  const showNotificationToast = (
    title: string,
    message: string
  ) => {
    window.dispatchEvent(
      new CustomEvent(
        "sprintdesk:notification-toast",
        {
          detail: {
            title,
            message,
          },
        }
      )
    );
  };

  // =========================================================
  // POLLING
  // =========================================================

  useEffect(() => {
    let intervalId:
      | ReturnType<typeof setInterval>
      | null = null;

    const pollNotifications = async () => {
      // Don't poll when browser tab is hidden
      if (document.hidden) {
        return;
      }

      try {
        const posts =
          await fetchNotifications();

        posts.forEach((post) => {
          // Already known
          if (knownIds.current.has(post.id)) {
            return;
          }

          // Remember notification ID
          knownIds.current.add(post.id);

          const notification = {
            id: post.id,
            title: post.title,
            message: post.body,
            createdAt:
              new Date().toISOString(),
            read: false,
          };

          // Add notification to Zustand
          addNotification(notification);

          // =================================================
          // SHOW TOAST ONLY WHEN PANEL IS CLOSED
          // =================================================

          if (!isPanelOpen) {
            showNotificationToast(
              post.title,
              post.body
            );
          }
        });
      } catch (error) {
        console.error(
          "Notification polling failed:",
          error
        );
      }
    };

    // =======================================================
    // START POLLING
    // =======================================================

    const startPolling = () => {
      if (intervalId !== null) {
        return;
      }

      // Fetch immediately
      void pollNotifications();

      // Continue every 5 seconds
      intervalId = setInterval(() => {
        void pollNotifications();
      }, POLLING_INTERVAL);
    };

    // =======================================================
    // STOP POLLING
    // =======================================================

    const stopPolling = () => {
      if (intervalId === null) {
        return;
      }

      clearInterval(intervalId);
      intervalId = null;
    };

    // =======================================================
    // VISIBILITY
    // =======================================================

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    startPolling();

    // =======================================================
    // CLEANUP
    // =======================================================

    return () => {
      stopPolling();

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [addNotification, isPanelOpen]);
}