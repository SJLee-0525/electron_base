type EmailConversation = {
  contactName: string;
  emailAddress: string;
  totalEmails: number;
  messages: { subject: string; body: string; timestamp: string }[];
};

const InfoPanel = ({ conversation }: { conversation: EmailConversation }) => {
  return (
    <div
      style={{
        position: "absolute",
        padding: "1rem",
        height: "100%",
        background: "#f9f9f9",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>{conversation.contactName}</h2>
      <p style={{ color: "gray" }}>{conversation.emailAddress}</p>
      <p>Total Emails: {conversation.totalEmails}</p>
      <hr style={{ margin: "1rem 0" }} />
      <ul style={{ maxHeight: "calc(100% - 140px)", overflowY: "auto" }}>
        {conversation.messages.map((m, i) => (
          <li key={i} style={{ marginBottom: "0.5rem" }}>
            <strong>{m.subject}</strong>
            <br />
            <span style={{ fontSize: "0.85rem" }}>{m.body}</span>
            <br />
            <span style={{ fontSize: "0.75rem", color: "#888" }}>{m.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfoPanel;
