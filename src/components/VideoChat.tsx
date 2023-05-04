import { useState, useCallback, useEffect, ChangeEvent } from 'react'
import Video, { Room, createLocalTracks } from 'twilio-video'
import { Room as RoomTwilio } from './Room'
import { Lobby } from './Lobby'

export const VideoChat = () => {
  const [username, setUsername] = useState('')
  const [roomName, setRoomName] = useState('')
  const [room, setRoom] = useState<Room | null>(null)
  const [connecting, setConnecting] = useState(false)

  //* Sirve para el input de nombre de usuario
  const handleUsernameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value)
    },
    []
  )

  //* Sirve para el input de nombre de sala
  const handleRoomNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRoomName(event.target.value)
    },
    []
  )

  //* Genero la conexion a la sala
  const handleSubmit = useCallback(
    async (event: SubmitEvent) => {
      event.preventDefault()
      setConnecting(true)
      const data = await fetch(
        'https://twilio-video-api.vercel.app/api/users/',
        {
          method: 'POST',
          body: JSON.stringify({
            identity: username,
            room: roomName,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => res.json())

      // Video.connect(data.token, {
      //   name: roomName,
      //   audio: true,
      //   video: true,
      // })
      //   .then((room: any) => {
      //     setConnecting(false)
      //     setRoom(room)
      //   })
      //   .catch((err: any) => {
      //     console.error(err)
      //     setConnecting(false)
      //   })
      createLocalTracks({
        audio: true,
        video: { width: 640 },
      })
        .then((localTracks) => {
          return Video.connect(data.token, {
            name: roomName,
            tracks: localTracks,
          })
        })
        .then((room: Room) => {
          console.log(`Connected to Room: ${room.name}`)
          setConnecting(false)
          setRoom(room)
        })
    },
    [roomName, username]
  )

  const handleLogout = useCallback(() => {
    setRoom((prevRoom: any) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub: any) => {
          trackPub.track.stop()
        })
        prevRoom.disconnect()
      }
      return null
    })
  }, [])

  useEffect(() => {
    if (room) {
      const tidyUp = (event: any) => {
        if (event.persisted) {
          return
        }
        if (room) {
          handleLogout()
        }
      }
      window.addEventListener('pagehide', tidyUp)
      window.addEventListener('beforeunload', tidyUp)
      return () => {
        window.removeEventListener('pagehide', tidyUp)
        window.removeEventListener('beforeunload', tidyUp)
      }
    }
  }, [room, handleLogout])

  return (
    <>
      {room ? (
        <RoomTwilio
          roomName={roomName}
          room={room}
          handleLogout={handleLogout}
        />
      ) : (
        <Lobby
          username={username}
          roomName={roomName}
          handleUsernameChange={handleUsernameChange}
          handleRoomNameChange={handleRoomNameChange}
          handleSubmit={handleSubmit}
          connecting={connecting}
        />
      )}
    </>
  )
}
