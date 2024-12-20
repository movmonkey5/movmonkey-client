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
          className={`absolute right-0 top-12 z-50 mt-2 max-h-96 w-72  overflow-y-auto rounded-md bg-gray-200 text-white shadow-xl`}
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
            <div className="flex flex-col gap-2.5 p-2">
              {displayedNotifications.map((notification) => (
                <div
                  key={notification.uid}
                  onClick={() => handleNotificationClick(notification)}
                  className={`cursor-pointer rounded-md p-2 hover:scale-95 transition-all duration-300 ease-in-out ${
                    notification.is_unread ? "bg-gray-500" : "bg-white"
                  }`}
                >
                  <p className={`my-2 text-xs font-medium ${notification.is_unread ? 'text-white' : 'text-black'}`}>{notification.message}</p>
                  <p className={`text-xs  ${notification.is_unread ? "text-white" : "text-gray-600"}`}>
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              ))}

              {/* "See more" button */}
              {notifications.length > maxNotifications && !showAll && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAll(true)}
                    className="w-full p-2 text-xs bg-green-600 rounded-lg hover:bg-green-700"
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
                    className="w-full p-2 text-xs bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    See less
                  </button>
                </div>
              )}
            </div>
          ) : (
            // No notifications available
            <div className="p-4 text-center text-xs text-gray-700">
              No notifications available.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
