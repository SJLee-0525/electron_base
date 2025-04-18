import { http, HttpResponse } from "msw";

import { mockEmailConversations } from "@renderer/data/EMAIL_CONSERVATIONS";

const { VITE_DEV_SERVER_URL } = import.meta.env;

const handlers = [
  // 대화를 나눈 사용자 목록을 가져오는 API 핸들러
  http.get(VITE_DEV_SERVER_URL + "/record/users/:userId", () => {
    return HttpResponse.json(mockEmailConversations);
  }),
];

export default handlers;
