import React, { useState, useEffect } from "react";

import EmailNetwork from "@pages/network/EmailNetwork";
import InfoPanel from "@pages/galaxy/InfoPanel";

import { useGetConversations } from "@hooks/useGetConservations";

import useConversationsStore from "@stores/conservationsStore";

import type { EmailConversation } from "@renderer/types/emailTypes";

const NetworkPage: React.FC = () => {
  // 대화 데이터 불러오기
  useGetConversations("1");
  const { conversations } = useConversationsStore();

  // 로컬 상태로 복사하여 병합 시 업데이트
  const [local, setLocal] = useState<EmailConversation[]>([]);
  useEffect(() => setLocal(conversations), [conversations]);

  // 선택된 노드 인덱스
  const [selected, setSelected] = useState<number | null>(null);

  // 대화 병합 로직: sourceId 노드를 targetId로 합치기
  function handleMerge(sourceId: string, targetId: string) {
    setLocal((prev) => {
      const src = prev.find((c) => c.emailAddress === sourceId);
      const tgt = prev.find((c) => c.emailAddress === targetId);
      if (!src || !tgt) return prev;

      // 메시지 시간순 정렬 후 병합
      const mergedMsgs = [...src.messages, ...tgt.messages].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      // 병합된 대화 객체 생성
      const merged: EmailConversation = {
        ...tgt,
        totalEmails: src.totalEmails + tgt.totalEmails,
        messages: mergedMsgs,
      };

      // source 제외, target 교체
      return prev.filter((c) => c.emailAddress !== sourceId).map((c) => (c.emailAddress === targetId ? merged : c));
    });
    setSelected(null); // 병합 후 선택 해제
  }

  return (
    <div className="flex h-screen">
      <div className={`${selected != null ? "w-[40vw]" : "w-[100vw]"} bg-gray-100`}>
        <EmailNetwork conversations={local} onSelect={setSelected} onMerge={handleMerge} />
      </div>
      <div className={`${selected != null ? "w-[60vw]" : "w-0"} bg-white overflow-auto`}>
        {selected != null && <InfoPanel conversation={local[selected]} />}
      </div>
    </div>
  );
};

export default NetworkPage;
