import { create } from "zustand";

export interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface NotificationsState {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],

  addNotification: (notification) =>
    set((state) => ({ notifications: [...state.notifications, notification] })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
