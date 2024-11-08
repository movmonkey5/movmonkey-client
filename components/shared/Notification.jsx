import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { fetchNotifications } from "@/lib/hooks/notificationService";
import Loading from "@/components/shared/Loading"; // Or create a SkeletonLoader component

export default function NotificationComponent({ handleNotificationClick }) {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false); // For tracking the loading state
  const [showAll, setShowAll] = useState(false); // To toggle "See more" functionality
  const maxNotifications = 2; // Maximum number of notifications to display initially

  // Fetch notifications function
  const fetchAndSetNotifications = async () => {
    setLoading(true); // Start loading
    const notificationsData = await fetchNotifications();
    setNotifications(notificationsData);
    const unreadCount = notificationsData.filter((n) => n.is_unread).length;
    setNotificationCount(unreadCount);
    setLoading(false); // End loading
  };

  useEffect(() => {
    // Fetch notifications when the component mounts
    fetchAndSetNotifications();
  }, []);

  // Trigger refetch on bell icon click
  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    fetchAndSetNotifications(); // Refetch notifications on bell click
  };

  // Display either all notifications or the limited amount
  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, maxNotifications);

  return (
    <div className="relative flex items-center gap-4">
      <div
        onClick={handleBellClick} // Refetch and toggle notifications on bell click
        className="relative cursor-pointer"
      >
        <Bell className="h-6 w-6 text-black" />
        {notificationCount > 0 && (
          <span className="absolute right-[-6px] top-[-8px] flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white">
            {notificationCount}
          </span>
        )}
      </div>

      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        ></div>
      )}

      {showNotifications && (
        <div
          className={`absolute right-0 top-6 z-50 mt-2 max-h-96 w-72  overflow-y-auto rounded-md bg-[#FFA620] text-black shadow-lg`}
        >
          {/* Show loading state */}
          {loading ? (
            <div className="rounded-md">
              {/* Skeleton loader for loading state */}
              <div className="flex animate-pulse flex-col bg-gray-300 p-2 py-4">
                <div className="mb-2 h-4 w-3/4 rounded-md bg-gray-400"></div>
                <div className="h-4 w-2/4 rounded-md bg-gray-400"></div>
                <div className="mt-2 h-3 w-1/3 rounded-md bg-gray-400"></div>
              </div>
              <div className="flex animate-pulse flex-col bg-gray-300 p-2 py-4">
                <div className="mb-2 h-4 w-3/4 rounded-md bg-gray-400"></div>
                <div className="h-4 w-2/4 rounded-md bg-gray-400"></div>
                <div className="mt-2 h-3 w-1/3 rounded-md bg-gray-400"></div>
              </div>
            </div>
          ) : notifications.length > 0 ? (
            <div>
              {displayedNotifications.map((notification) => (
                <div
                  key={notification.uid}
                  onClick={() => handleNotificationClick(notification)}
                  className={`cursor-pointer rounded-md p-2 hover:bg-[#f6c884] ${
                    notification.is_unread ? "" : "bg-[#f6c884]"
                  }`}
                >
                  <p className="my-2 text-xs">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              ))}

              {/* "See more" button */}
              {notifications.length > maxNotifications && !showAll && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAll(true)}
                    className="w-full p-2 text-xs  hover:underline"
                  >
                    See more
                  </button>
                </div>
              )}

              {/* "See less" button to collapse notifications */}
              {showAll && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAll(false)}
                    className="w-full p-2 text-xs hover:underline"
                  >
                    See less
                  </button>
                </div>
              )}
            </div>
          ) : (
            // No notifications available
            <div className="p-4 text-center text-xs text-gray-600">
              No notifications available.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
