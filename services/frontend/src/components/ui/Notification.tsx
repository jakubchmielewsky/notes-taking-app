import CheckmarkIcon from "@/assets/icons/icon-checkmark.svg?react";
import CrossIcon from "@/assets/icons/icon-cross.svg?react";
import { useNotificationsStore, type Notification } from "@/stores/notificationsStore";
import { useEffect } from "react";

interface Props {
  notification: Notification;
  duration: number;
}

const iconClass: Record<Notification["type"], string> = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-blue-500",
};

const NotificationItem: React.FC<Props> = ({ notification, duration }) => {
  const { removeNotification } = useNotificationsStore();

  useEffect(() => {
    const timer = setTimeout(
      () => removeNotification(notification.id),
      duration - 100
    );
    return () => clearTimeout(timer);
  }, [notification.id, duration, removeNotification]);

  return (
    <div
      className="flex justify-between bg-neutral-0 mt-100 border-neutral-200 dark:bg-neutral-800 rounded-8 border dark:border-neutral-700 py-100 px-100"
      style={{ animation: `notificationAnimation ${duration / 1000}s linear` }}
    >
      <div className="flex gap-100">
        {notification.type === "error" ? (
          <CrossIcon className={`shrink-0 ${iconClass.error}`} />
        ) : (
          <CheckmarkIcon className={`shrink-0 ${iconClass[notification.type]}`} />
        )}
        <p className="text-neutral-950 dark:text-white text-[14px]">
          {notification.message}
        </p>
      </div>
      <button onClick={() => removeNotification(notification.id)}>
        <CrossIcon className="text-neutral-400" />
      </button>
    </div>
  );
};

export default NotificationItem;
