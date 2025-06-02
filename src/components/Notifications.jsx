const Notification = ({ message, type }) => {
  if (message === null) return null;

  const notificationStyle = {
    color: type === "error" ? "red" : "green",
    background: "#f0f0f0",
    fontSize: 20,
    border: `2px solid ${type === "error" ? "red" : "green"}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
