import React, { createContext, useState } from 'react';
import socketIOClient from "socket.io-client";
const socket = socketIOClient.connect();

export const GlobalState = createContext();
export const DatabaseRequest = createContext();

export const GlobalContext = (props) => {

    const globalState = {
        users: [],
        validate: true,
        socketValidate: false,

        updateState: (stateUpdates) => {
            setStateInfo(currentStateInfo => ({ ...currentStateInfo, ...stateUpdates}));
        }
    };

    const [stateInfo, setStateInfo] = useState(globalState);

    const databaseRequest = {
        getUsers: () => {
            fetch('/users').then(res => {
                if(res.ok) {
                return res.json();
                }
            }).then(jsonRes => globalState.updateState({ users: jsonRes }))
            .catch(err => console.log(err));
        },
        sendUpdate: function(validate, cb) {
            socket.on('savedUser', data => cb(data));
    
            // only if validate is set to true then emit
            if (validate === true) {
                socket.emit('event', validate);
            }
        }
    }

  return (
    <GlobalState.Provider value={stateInfo}>
        <DatabaseRequest.Provider value={databaseRequest}>
            {props.children}                
        </DatabaseRequest.Provider>
    </GlobalState.Provider>
  )
}
