import { EmailConversation } from "@/renderer/types/emailTypes";

export const mockEmailConversations: EmailConversation[] = [
  {
    contactName: "김하늘",
    emailAddress: "sky.kim@example.com",
    totalEmails: 4,
    messages: [
      {
        subject: "회의 일정 조율",
        body: "이번 주 금요일 오후 3시에 회의 가능한가요?",
        timestamp: "2025-04-15T10:12:00Z",
        fromMe: false,
      },
      {
        subject: "회의 일정 조율",
        body: "네, 가능합니다. 회의실은 A동 302호로 예약해두겠습니다.",
        timestamp: "2025-04-15T10:18:00Z",
        fromMe: true,
      },
      {
        subject: "회의 자료 첨부",
        body: "회의 자료 파일을 첨부합니다. 검토 부탁드립니다.",
        timestamp: "2025-04-17T08:05:00Z",
        fromMe: false,
      },
      {
        subject: "회의 자료 첨부",
        body: "확인했습니다. 수고 많으셨어요.",
        timestamp: "2025-04-17T08:15:00Z",
        fromMe: true,
      },
    ],
  },
  {
    contactName: "이성준",
    emailAddress: "sungjoon.lee@example.com",
    totalEmails: 2,
    messages: [
      {
        subject: "스터디 자료 공유",
        body: "React 19 관련 자료 공유드립니다.",
        timestamp: "2025-04-10T14:20:00Z",
        fromMe: false,
      },
      {
        subject: "스터디 자료 공유",
        body: "감사합니다! 주말에 정리해서 다시 공유드릴게요.",
        timestamp: "2025-04-10T14:25:00Z",
        fromMe: true,
      },
    ],
  },
  {
    contactName: "박서연",
    emailAddress: "seo.park@example.com",
    totalEmails: 3,
    messages: [
      {
        subject: "인터뷰 일정",
        body: "인터뷰는 4월 22일(월) 오전 10시로 확정되었습니다.",
        timestamp: "2025-04-13T09:00:00Z",
        fromMe: false,
      },
      {
        subject: "인터뷰 일정",
        body: "네, 일정 확인했습니다. 감사합니다.",
        timestamp: "2025-04-13T09:12:00Z",
        fromMe: true,
      },
      {
        subject: "인터뷰 자료",
        body: "참고용 이력서와 포트폴리오 첨부해드립니다.",
        timestamp: "2025-04-14T15:50:00Z",
        fromMe: false,
      },
    ],
  },
  {
    contactName: "정민수",
    emailAddress: "minsoo.jung@example.com",
    totalEmails: 1,
    messages: [
      {
        subject: "세금 계산서 문의",
        body: "3월 거래에 대한 세금 계산서 요청드립니다.",
        timestamp: "2025-04-12T11:25:00Z",
        fromMe: false,
      },
    ],
  },
  {
    contactName: "홍지은",
    emailAddress: "jieun.hong@example.com",
    totalEmails: 5,
    messages: [
      {
        subject: "디자인 초안",
        body: "Figma에 초안 올려뒀어요. 피드백 부탁드려요.",
        timestamp: "2025-04-16T18:45:00Z",
        fromMe: false,
      },
      {
        subject: "디자인 초안",
        body: "봤어요! 깔끔하네요. 몇 가지 제안사항 정리해서 보내드릴게요.",
        timestamp: "2025-04-16T19:10:00Z",
        fromMe: true,
      },
      {
        subject: "디자인 수정안",
        body: "의견 반영해서 수정했어요. 다시 확인 부탁드려요.",
        timestamp: "2025-04-17T07:50:00Z",
        fromMe: false,
      },
      {
        subject: "디자인 수정안",
        body: "좋습니다! 이대로 진행하셔도 될 것 같아요.",
        timestamp: "2025-04-17T08:03:00Z",
        fromMe: true,
      },
      {
        subject: "최종본 전달",
        body: "최종본 전달드려요. 확인 후 문제 없으면 전달 부탁드려요.",
        timestamp: "2025-04-17T18:00:00Z",
        fromMe: false,
      },
    ],
  },
];
