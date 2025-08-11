import React, { useState } from 'react'
import Editor from './components/Editor'

export default function App() {
  const [roomId, setRoomId] = useState('room-1');
  const [name, setName] = useState('User' + Math.floor(Math.random()*1000));

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Realtime Collaborative Editor</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Room: </label>
        <input value={roomId} onChange={e => setRoomId(e.target.value)} />
        <label style={{ marginLeft: 12 }}>Name: </label>
        <input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <Editor roomId={roomId} name={name} />
    </div>
  )
}