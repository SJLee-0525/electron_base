import React from "react";
import { EmailConversation } from "@renderer/types/emailTypes";

interface InfoPanelProps {
  conversation: EmailConversation;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ conversation }) => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-2">{conversation.contactName}</h2>
    <p>
      <strong>Email:</strong> {conversation.emailAddress}
    </p>
    <p>
      <strong>Total Emails:</strong> {conversation.totalEmails}
    </p>
    <h3 className="mt-4 font-semibold">Recent Messages</h3>
    <ul className="list-disc pl-5">
      {conversation.messages.slice(-5).map((m, i) => (
        <li key={i} className="mt-1">
          <span className="font-medium">{m.fromMe ? "Me →" : "→ Me"}</span> <em>{m.subject}</em>{" "}
          <small>({new Date(m.timestamp).toLocaleDateString()})</small>
        </li>
      ))}
    </ul>
  </div>
);

export default InfoPanel;
