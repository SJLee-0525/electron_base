import { EmailConversation } from "@renderer/types/emailTypes";

const InfoPanel = ({ conversation }: { conversation: EmailConversation }) => {
  return (
    <div className="w-full h-full p-[8px] bg-[#ffffff] shadow-[rgba(0,0,0,0.1)_-2px_0px_8px] text-white">
      <h2 className="mb-2 text-xl font-semibold">{conversation.contactName}</h2>
      <p>{conversation.emailAddress}</p>
      <p>Total Emails: {conversation.totalEmails}</p>

      <hr className="my-4" />

      <ul className="max-h-[calc(100%-140px)] overflow-y-auto pr-2">
        {conversation.messages.map((m, i) => (
          <li key={i} className="mb-2">
            <strong>{m.subject}</strong>
            <br />
            <span className="text-sm">{m.body}</span>
            <br />
            <span className="text-xs text-white">{m.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfoPanel;
