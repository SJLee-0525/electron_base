import React, { useRef, useMemo, useEffect } from "react";
import ForceGraph2D, { ForceGraphMethods, LinkObject, NodeObject } from "react-force-graph-2d";

import { EmailConversation } from "@renderer/types/emailTypes";

import defaultProfile from "@assets/image/defaultProfile.png";

// EmailNetwork 컴포넌트의 props 타입 정의
export interface EmailNetworkProps {
  conversations: EmailConversation[]; // 대화 목록 데이터
  width?: number; // 그래프 캔버스 너비
  height?: number; // 그래프 캔버스 높이
  onSelect: (index: number) => void; // 노드 클릭 시 선택 핸들러
  onMerge: (sourceId: string, targetId: string) => void; // 노드 병합 핸들러
}

// 그래프 노드 객체 타입 확장
interface NodeData extends NodeObject {
  id: string; // 노드 고유 ID (이메일 주소 혹은 'me')
  name: string; // 노드 레이블 (연락처 이름)
  group: number; // 그룹 구분 (0: 나, 1: 기타)
  total?: number; // 이메일 총 개수 (크기 계산용)
  idx?: number; // 원본 conversations 배열 내 인덱스
}

// 그래프 링크 객체 타입 확장
interface LinkData extends LinkObject {
  source: string; // 연결 시작 노드 ID
  target: string; // 연결 끝 노드 ID
  value: number; // 링크 두께(이메일 수 기반)
}

const EmailNetwork: React.FC<EmailNetworkProps> = ({
  conversations,
  width = window.innerWidth,
  height = window.innerHeight,
  onSelect,
  onMerge,
}) => {
  // ForceGraph 인스턴스 참조용 ref
  const fgRef = useRef<ForceGraphMethods<NodeData, LinkData>>(null!);

  // 프로필 이미지 한 번만 로드
  const avatarImg = useMemo(() => {
    const img = new Image();
    img.src = defaultProfile; // 기본 프로필 이미지 경로
    return img;
  }, []);

  // 노드 배열 구성: 'me' 노드 + 대화 상대 노드
  const nodes = useMemo<NodeData[]>(
    () => [
      { id: "me", name: "Me", group: 0, idx: undefined },
      ...conversations.map((c, i) => ({
        id: c.emailAddress,
        name: c.contactName,
        group: 1,
        total: c.totalEmails,
        idx: i,
      })),
    ],
    [conversations]
  );

  // 링크 배열 구성: 나와 각 연락처 간 연결
  const links = useMemo<LinkData[]>(
    () =>
      conversations.map((c) => ({
        source: "me",
        target: c.emailAddress,
        value: c.totalEmails,
      })),
    [conversations]
  );

  // 노드 반경 계산 함수: 이메일 수에 비례, 최소/최대 지정
  function getNodeRadius(node: NodeData) {
    return node.id === "me"
      ? 12 // 'me' 노드는 고정 크기
      : Math.max(Math.min((node.total ?? 1) * 4, 8), 8); // 8~12 사이
  }

  // conversations 변경 시 시뮬레이션 재가열하여 레이아웃 재배치
  useEffect(() => {
    fgRef.current?.d3ReheatSimulation();
  }, [nodes, links]);

  return (
    <ForceGraph2D<NodeData, LinkData>
      ref={fgRef}
      graphData={{ nodes, links }} // 노드/링크 데이터 바인딩
      width={width} // 캔버스 너비
      height={height} // 캔버스 높이
      linkWidth={(l) => 1 + Math.sqrt((l as LinkData).value)} // 링크 두께 계산
      nodeId="id" // 노드 식별자 키
      nodeLabel="name" // 툴팁용 라벨
      nodeVal={(n) => getNodeRadius(n as NodeData)} // 레이아웃 시 반경 값
      // 기본 드로잉을 완전히 대체
      nodeCanvasObjectMode={() => "replace"}
      // 포인터 이벤트를 위한 영역 정의
      nodePointerAreaPaint={(node, color, ctx) => {
        const r = getNodeRadius(node as NodeData);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, r, 0, 2 * Math.PI, false);
        ctx.fill();
      }}
      // 드래그 종료 시 호출: 다른 노드와 겹치면 병합
      onNodeDragEnd={(d) => {
        const dn = d as NodeData;
        if (dn.id === "me") return; // 'me' 노드는 병합 제외
        const threshold = getNodeRadius(dn) * 2; // 병합 기준 거리

        // 현재 노드 배열에서 가장 가까운 후보 찾기
        const target = nodes.find((n) => n.id !== dn.id && Math.hypot(n.x! - dn.x!, n.y! - dn.y!) < threshold);
        if (target) {
          onMerge(dn.id, target.id); // 병합 핸들러 호출
          fgRef.current?.d3ReheatSimulation(); // 레이아웃 재가열
        }
      }}
      // 노드 커스텀 드로잉: 배경, 마스크, 프로필, 라벨
      nodeCanvasObject={(node: NodeData, ctx, globalScale) => {
        const r = getNodeRadius(node); // 배경 반경
        const imgR = r * 0.9; // 프로필 반경

        // 1) 배경 원(색상: 나/#375, 기타/#3a5)
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.id === "me" ? "#375" : "#3a5";
        ctx.fill();

        // 2) 흰색 원(프로필 투명부 마스킹)
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, imgR, 0, 2 * Math.PI, false);
        ctx.fillStyle = "#fff";
        ctx.fill();

        // 3) 클립 후 프로필 이미지 그리기
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, imgR, 0, 2 * Math.PI, false);
        ctx.clip();
        ctx.drawImage(avatarImg, node.x! - imgR, node.y! - imgR, imgR * 2, imgR * 2);
        ctx.restore();

        // 4) 라벨 텍스트 (크기: 12/globalScale)
        ctx.font = `${12 / globalScale}px Sans-Serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000";
        ctx.fillText(node.name, node.x! + r + 4, node.y!);
      }}
      // 클릭 시 InfoPanel 업데이트
      onNodeClick={(n) => {
        const node = n as NodeData;
        if (node.idx !== undefined) onSelect(node.idx);
      }}
      cooldownTicks={100} // 시뮬레이션 쿨다운 틱 수
      enableNodeDrag={true} // 노드 드래그 활성화
    />
  );
};

export default EmailNetwork;
