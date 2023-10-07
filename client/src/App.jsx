import { useState } from "react";
import io from "socket.io-client";
import RoomChat from "./components/RoomChat";
import { Input } from "@nextui-org/react";

const socket = io.connect( "http://localhost:3001" );

function App() {
  const [username, setUsername] = useState( "" );
  const [room, setRoom] = useState( "" );
  const [showChat, setShowChat] = useState( false );

  const joinRoom = () => {
    if ( username !== "" && room !== "" ) {
      socket.emit( "join_room", room );
      setShowChat( true );
    }
  };
  return (
    <main className='bg-black h-screen text-white font-[poppins] flex justify-center items-center'>
      {!showChat ?
        <div className="p-10 rounded-3xl flex flex-col w-1/2 gap-3  bg-gradient-to-br from-gray-900 to-blue-900">
          <h3 className="text-xl text-center">Únase a un chat</h3>
          <Input
            color="primary"
            type="text"
            placeholder="Nombre..."
            className="text-white p-2 rounded-md "
            onChange={( event ) => {
              setUsername( event.target.value );
            }}
            label="Nombre"
            variant="bordered"

          />
          <Input
            color="primary"
            type="text"
            placeholder="ID de habitación..."
            className="text-white p-2 rounded-md "
            onChange={( event ) => {
              setRoom( event.target.value );
            }}
            label="ID de habitación"
            variant="bordered"
          />
          <button className="w-fit p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 " onClick={() => joinRoom()}>Unirse a una sala</button>
        </div>
        :
        <RoomChat socket={socket} username={username} room={room} />
      }
    </main>
  )
}

export default App
