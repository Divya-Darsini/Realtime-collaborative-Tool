import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SERVER = import.meta.env.VITE_SERVER || 'http://localhost:4000'

export default function Editor({ roomId, name }) {
  const socketRef = useRef(null)
  const [content, setContent] = useState('')
  const [users, setUsers] = useState([])
  const timeoutRef = useRef(null)

  useEffect(() => {
    // connect
    const socket = io(SERVER);
    socketRef.current = socket;

    socket.on('connect', () => console.log('connected', socket.id));

    // when roomId or name changes, rejoin
    socket.emit('join-room', { roomId, userName: name });

    socket.on('doc-init', ({ content: serverContent }) => {
      setContent(serverContent || '')
    });

    socket.on('doc-update', ({ content: serverContent }) => {
      setContent(serverContent)
    });

    socket.on('presence', (users) => {
      setUsers(users)
    });

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [roomId, name])

  // send updates (debounced)
  const sendUpdate = (newContent) => {
    if (!socketRef.current) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      socketRef.current.emit('doc-update', { roomId, content: newContent })
    }, 300)
  }

  const handleChange = (e) => {
    const val = e.target.value
    setContent(val)
    sendUpdate(val)
  }

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <textarea
          value={content}
          onChange={handleChange}
          style={{ width: '100%', height: '60vh', padding: 12, fontSize: 16 }}
        />
      </div>
      <div style={{ width: 220 }}>
        <h4>Presence</h4>
        <ul>
          {users.map(u => (
            <li key={u.id}>{u.name}{u.id === (socketRef.current && socketRef.current.id) ? ' (you)' : ''}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}