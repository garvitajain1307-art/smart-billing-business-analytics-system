import { createSlice } from "@reduxjs/toolkit";


const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setNotificationLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    setNotificationError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearNotificationError: (state) => {
      state.error = null;
    },

    setNotifications: (state, action) => {
      state.loading = false;
       state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
    },
    markAllNotificationsRead: (state, action) => {
      state.loading = false;
      state.notifications.forEach((notification) => {
        notification.isRead = true;
      });

      state.unreadCount = 0;
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n._id === action.payload,
      );

      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount--;
      }
    },
  },
});

export const {setNotificationLoading,setNotificationError,clearNotificationError,setNotifications,markAllNotificationsRead,markNotificationRead}=notificationSlice.actions;
export default notificationSlice.reducer;