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

export { fetchNotifications };
