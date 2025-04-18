import instance from "./instance";

import { EmailConversation } from "@renderer/types/emailTypes";

const { VITE_DEV_SERVER_URL } = import.meta.env;

export const getUserRecordList = async (userId: string): Promise<EmailConversation[]> => {
  try {
    const response = await instance.get(`/record/users/${userId}`);
    console.log(`${VITE_DEV_SERVER_URL}/record/users/${userId}`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
