export default function QuestionBox({ question }) {
  return (
    <div style={{
      padding: 20,
      borderRadius: 10,
      background: "#111",
      color: "white"
    }}>
      <h2>🤖 AI Question</h2>
      <p>{question}</p>
    </div>
  );
}