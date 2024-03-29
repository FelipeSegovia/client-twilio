import { useEffect, useState } from 'react'
import { Participant } from './Participant'
import { ImPhoneHangUp } from 'react-icons/im'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'

export const Room = ({ roomName, room, handleLogout }: any) => {
  const [participants, setParticipants] = useState<any[]>([])
  const [mute, setMute] = useState(false)

  useEffect(() => {
    const participantConnected = (participant: any) => {
      setParticipants((prevParticipants: any) => [
        ...prevParticipants,
        participant,
      ])
    }

    const participantDisconnected = (participant: any) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      )
    }

    room.on('participantConnected', participantConnected)
    room.on('participantDisconnected', participantDisconnected)
    room.participants.forEach(participantConnected)
    return () => {
      room.off('participantConnected', participantConnected)
      room.off('participantDisconnected', participantDisconnected)
    }
  }, [room])

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ))

  return (
    <div className="room">
      <h2>Sala: {roomName}</h2>
      <div className="local-participant">
        {room ? (
          <>
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#333e5a',
              }}
            >
              <button
                onClick={() => setMute(!mute)}
                style={{
                  backgroundColor: 'gray',
                  borderRadius: 50,
                  padding: '5px 15px',
                  margin: '0 10px',
                }}
              >
                {mute ? (
                  <FaMicrophoneSlash size={24} />
                ) : (
                  <FaMicrophone size={24} />
                )}
              </button>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'red',
                  borderRadius: 50,
                  padding: '5px 25px',
                }}
              >
                <ImPhoneHangUp size={24} />
              </button>
            </div>
          </>
        ) : (
          ''
        )}
      </div>
      <h3>Participante</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  )
}
