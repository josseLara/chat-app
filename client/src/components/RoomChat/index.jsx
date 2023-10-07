import { Avatar, Input, user } from '@nextui-org/react';
import autoprefixer from 'autoprefixer';
import { useEffect, useState } from 'react';
import { GrSend } from 'react-icons/gr';
import ScrollToBottom from "react-scroll-to-bottom";

function RoomChat( { socket, username, room } ) {
     const [currentMessage, setCurrentMessage] = useState( "" );
     const [messageList, setMessageList] = useState( [] );

     const sendMessage = async () => {
          if ( currentMessage !== "" ) {
               const messageData = {
                    room: room,
                    author: username,
                    message: currentMessage,
                    time:
                         new Date( Date.now() ).getHours() +
                         ":" +
                         new Date( Date.now() ).getMinutes(),
               };

               await socket.emit( "send_message", messageData );
               setMessageList( ( list ) => [...list, messageData] );
               setCurrentMessage( "" );
          }
     };

     useEffect( () => {
          const handleMessage = ( data ) => {
               setMessageList( ( list ) => [...list, data] );
          };

          socket.on( "receive_message", handleMessage );

          return () => {
               socket.off( "receive_message", handleMessage );
          };
     }, [socket] );

     return (
          <div className="p-10 rounded-3xl flex flex-col w-[90vh] gap-3  bg-gradient-to-br from-white to-gray-200">
               <div className='flex gap-2 items-center'>
                    <Avatar isBordered radius="sm" src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                    <h2 className='text-black font-semibold font-[poppins]'>{username}</h2>
               </div>
               <div className='bg-gray-100 h-[50vh] w-60% text-black'>
                    <ScrollToBottom className='h-[100%] overflow-auto '>

                         {messageList.map( ( messageContent, index ) => {
                              return (
                                   <div key={index}
                                        className={`flex flex-col w-full font-[poppins] ${username === messageContent.author ? "items-end" : ""} mt-2`} >

                                        <div className='w-fit'>
                                             <p className='w-full font-semibold text-sm text-gray-600 flex items-center gap-3 justify-between'>{messageContent.time} hs <span className='text-orange-600  font-semibold text-[.7rem]'>( {messageContent.author} )</span></p>
                                             <p className={`w-full font-base text-lg text-white  px-5 py-2  bg-gradient-to-r
                                             ${username === messageContent.author ? "from-sky-500 to-indigo-500 rounded-s-lg " : "from-gray-500 to-gray-400 rounded-e-lg "}`}>{messageContent.message}</p>
                                        </div>

                                   </div>
                              );
                         } )}
                    </ScrollToBottom>
               </div>
               <div className="flex items-center gap-4 w-full">
                    <Input
                         type="text"
                         className="w-full p-2 rounded-md text-black"
                         value={currentMessage}
                         placeholder="Mensaje..."
                         onChange={( event ) => {
                              setCurrentMessage( event.target.value );
                         }}
                         onKeyPress={( event ) => {
                              event.key === "Enter" && sendMessage();
                         }}
                         label="Mensaje"
                         variant="bordered"
                         endContent={<button className="w-fit  p-3 mb-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 " onClick={sendMessage}><GrSend /></button>}
                    />

               </div>
          </div>
     );
}

export default RoomChat;