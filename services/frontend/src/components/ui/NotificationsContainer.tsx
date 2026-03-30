import { useNotificationsStore } from "@/stores/notificationsStore";
import NotificationItem from "./Notification";

const NotificationsContainer = ({ duration = 4000 }: { duration?: number }) => {
  const { notifications } = useNotificationsStore();

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      className="fixed w-[274px] tablet:w-[390px] bottom-[80px] tablet:bottom-[100px] desktop:bottom-[50px] right-200 tablet:right-400 desktop:right-[50px] z-40"
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          duration={duration}
        />
      ))}
    </div>
  );
};

export default NotificationsContainer;
