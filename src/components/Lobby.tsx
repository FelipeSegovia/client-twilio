export const Lobby = ({
  username,
  handleUsernameChange,
  roomName,
  handleRoomNameChange,
  handleSubmit,
  connecting,
}: any) => {
  return (
    <form onSubmit={handleSubmit}>
      <h2>Ingresar</h2>
      <div>
        <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="field"
          value={username}
          onChange={handleUsernameChange}
          readOnly={connecting}
          required
        />
      </div>

      <div>
        <label htmlFor="room">Nombre Sala:</label>
        <input
          type="text"
          id="room"
          value={roomName}
          onChange={handleRoomNameChange}
          readOnly={connecting}
          required
        />
      </div>

      <button type="submit" disabled={connecting}>
        {connecting ? "Conectando" : "Entrar"}
      </button>
    </form>
  );
};

