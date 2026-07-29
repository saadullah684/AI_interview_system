export const createSocket = () => {
  return new WebSocket("ws://localhost:8000/ws/interview");
};