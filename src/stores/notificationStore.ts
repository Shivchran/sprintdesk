import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationState {
  notifications: AppNotification[];

  // UI state
  isPanelOpen: boolean;

  // Notification actions
  addNotification: (
    notification: AppNotification
  ) => void;

  markAsRead: (id: number) => void;

  markAllAsRead: () => void;

  clearNotifications: () => void;

  // Panel actions
  setPanelOpen: (open: boolean) => void;
}

export const useNotificationStore =
  create<NotificationState>()(
    persist(
      (set) => ({
        // =====================================================
        // INITIAL STATE
        // =====================================================

        notifications: [],

        isPanelOpen: false,

        // =====================================================
        // PANEL
        // =====================================================

        setPanelOpen: (open) => {
          set({
            isPanelOpen: open,
          });
        },

        // =====================================================
        // ADD NOTIFICATION
        // =====================================================

        addNotification: (notification) => {
          set((state) => {
            // Prevent duplicate notifications
            const alreadyExists =
              state.notifications.some(
                (item) =>
                  item.id === notification.id
              );

            if (alreadyExists) {
              return state;
            }

            return {
              notifications: [
                notification,
                ...state.notifications,
              ].slice(0, 20),
            };
          });
        },

        // =====================================================
        // MARK SINGLE AS READ
        // =====================================================

        markAsRead: (id) => {
          set((state) => ({
            notifications:
              state.notifications.map(
                (notification) =>
                  notification.id === id
                    ? {
                        ...notification,
                        read: true,
                      }
                    : notification
              ),
          }));
        },

        // =====================================================
        // MARK ALL AS READ
        // =====================================================

        markAllAsRead: () => {
          set((state) => ({
            notifications:
              state.notifications.map(
                (notification) => ({
                  ...notification,
                  read: true,
                })
              ),
          }));
        },

        // =====================================================
        // CLEAR
        // =====================================================

        clearNotifications: () => {
          set({
            notifications: [],
          });
        },
      }),

      // =======================================================
      // PERSISTENCE
      // =======================================================

      {
        name: "sprintdesk-notifications",

        // Persist notifications,
        // but don't persist panel open/close state.
        partialize: (state) => ({
          notifications: state.notifications,
        }),
      }
    )
  );