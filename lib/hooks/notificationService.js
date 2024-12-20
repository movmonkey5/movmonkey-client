// src/services/notificationService.js
import ApiKit from "@/common/ApiKit";

const fetchNotifications = async () => {
  try {
    const { data } = await ApiKit.me.getNotfications();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

const fetchNotificationDetails = async (uid) => {
  try {
    const { data } = await ApiKit.me.getNotificationDetails(uid);
    return data;
  } catch (error) {
    console.error("Error fetching notification details:", error);
    return error.message
  }
};

export { fetchNotifications, fetchNotificationDetails };
