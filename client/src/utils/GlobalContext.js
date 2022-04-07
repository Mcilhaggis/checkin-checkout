import React, { createContext, useState } from 'react';

export const UserContext = createContext();
export const ValidateContext = createContext();
export const DatabaseRequest = createContext();

export const GlobalContext = (props) => {

    const [users, setUsers] = useState([]);
    const [validate, setValidate] = useState(true);

    const databaseRequest = {
        getUsers: () => {
            fetch('/users').then(res => {
                if(res.ok) {
                return res.json()
                }
            }).then(jsonRes => setUsers(jsonRes))
            .catch(err => console.log(err));
        }
    }

  return (
    <UserContext.Provider value={{users, setUsers}}>
        <ValidateContext.Provider value={{validate, setValidate}}>
            <DatabaseRequest.Provider value={databaseRequest}>
                {props.children}                
            </DatabaseRequest.Provider>
        </ValidateContext.Provider>
    </UserContext.Provider>
  )
}
