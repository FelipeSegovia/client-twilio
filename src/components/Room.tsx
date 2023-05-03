import { useEffect, useState } from "react";
import {Participant} from "./Participant";

export const Room = ({ roomName, room, handleLogout }: any) => {
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    const participantConnected = (participant: any) => {
      setParticipants((prevParticipants: any) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant: any) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <div className="room">
      <h2>Sala: {roomName}</h2>
      <button onClick={handleLogout}>Salir</button>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ""
        )}
      </div>
      <h3>Participante</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};
