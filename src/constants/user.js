// src/services/userService.js
import axiosAPI from "@/authentication/axiosApi";
import { API_URL_getdetailuser } from "@/constants";

export const fetchUserDetails = async () => {
  try {
    const response = await axiosAPI.get(API_URL_getdetailuser);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};
