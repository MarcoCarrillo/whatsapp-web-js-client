import './App.css';
import io from 'socket.io-client';
import QRCode from "react-qr-code";
import { useEffect, useState } from 'react';
const socket = io.connect('http://localhost:3001', {});

function App() {
  const [session, setSession] = useState('');
  const [qrCode, setQrCode] = useState('');
  const createSessionForWhatsapp = () => {
    socket.emit('createSession', {
      id: session
    })
  };

  const [id, setId] = useState('');

  useEffect(() => {
    socket.emit('connected', 'Hello from client');
    socket.on('qr', (data) => {
      const { qr } = data;
      setQrCode(qr);
      console.log('QR Received');
    });

    socket.on('ready', (data) => {
      console.log(data);
      const { id } = data;
      setId(id);
    });

    socket.on('allChats', (data) => {
      console.log('all chaats', data);
    })
  }, []);

  const getAllChats = () => {
    socket.emit('getAllChats', { id })
  }
  return (
    <div className="App">
      <h1>Cliente Whatsapp</h1>
      <h2>Abre Whatsapp y escanea el codigo QR para iniciar sesion</h2>

      <div>
        <input
          type='text'
          value={session}
          onChange={(e) => {
            setSession(e.target.value);
          }}
          style={{
            marginBottom: '20px'
          }}
        />
        <button onClick={createSessionForWhatsapp}>Crear sesion</button>
      </div>
      <div
        style={{
          marginBottom: '20px'
        }}
      >
        {id !== null &&
          <button onClick={getAllChats}>Obtener chats</button>
        }
      </div>
      <QRCode value={qrCode} />

    </div>
  );
}

export default App;
