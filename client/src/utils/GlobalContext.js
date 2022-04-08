import React, { createContext, useState } from 'react';
import socketIOClient from "socket.io-client";
const socket = socketIOClient.connect()

export const UserContext = createContext();
export const ValidateContext = createContext();
export const SocketValidateContext = createContext();
export const DatabaseRequest = createContext();

export const GlobalContext = (props) => {

    const [users, setUsers] = useState([]);
    const [validate, setValidate] = useState(true);
    const [socketValidate, setSocketValidate] = useState(false);

    const databaseRequest = {
        getUsers: () => {
            fetch('/users').then(res => {
                if(res.ok) {
                return res.json()
                }
            }).then(jsonRes => setUsers(jsonRes))
            .catch(err => console.log(err));
        },
        sendUpdate: function(validate, cb) {
            socket.on('savedBook', data => cb(data))
    
            // only if validate is set to true then emit
            if (validate === true) {
                socket.emit('event', validate)
            }
        }
    }

  return (
    <UserContext.Provider value={{users, setUsers}}>
        <ValidateContext.Provider value={{validate, setValidate}}>
            <SocketValidateContext.Provider value={{socketValidate, setSocketValidate}}>
                <DatabaseRequest.Provider value={databaseRequest}>
                    {props.children}                
                </DatabaseRequest.Provider>
            </SocketValidateContext.Provider>
        </ValidateContext.Provider>
    </UserContext.Provider>
  )
}
