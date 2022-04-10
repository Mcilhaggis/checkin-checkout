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
        newUser: {},
        oldUser: {},

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
        getUpdate: function(validate, cb) {
            socket.on('getUser', data => cb(data));
    
            // only if validate is set to true then emit
            if (validate === true) {
                socket.emit('event', validate);
            }
        },
        saveUpdate: function(newUser, cb) {
            socket.on('saveUser', data => cb(data));

            if (newUser) {
                socket.emit('event', newUser);
            }
        },
        deleteUpdate: function(oldUser, cb) {
            socket.on('deleteUser', data => cb(data));

            if (oldUser) {
                socket.emit('event', oldUser);
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
