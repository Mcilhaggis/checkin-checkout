import React, { useEffect, useContext } from 'react';
import { GlobalState, DatabaseRequest } from '../utils/GlobalContext';
import axios from 'axios';

function GetUsers() {

    const globalState = useContext(GlobalState);
    const databaseContext = useContext(DatabaseRequest);  

    useEffect(() => {
        if (globalState.validate || globalState.socketValidate) {
            databaseContext.getUsers();
            globalState.updateState({ validate: false, socketValidate: false });
        }
    }, [globalState.validate, globalState.socketValidate]);

    const handleDelete = (id) => {
        let validated = false;
        
        axios.delete(`/delete/${id}`)
        .then((res) => {
            validated = true;
            globalState.updateState({ validate: true });
            databaseContext.getUpdate(validated, (data => null));
        })                
        .catch(err => console.log(err))
    };

    databaseContext.getUpdate(null, (data) => {
        globalState.updateState({ socketValidate: data });
    });

  return (
    <div className='data-container'>      
        {globalState.users && globalState.users.map((data, index) => {
            return (
                
                <div
                    key={index}
                    // className="grid-container"
                    className={!data.asset ? 'grid-container' : 'grid-container-2'}
                >
                    <div
                        className='grid-item'
                    >
                        {data.course}
                    </div>
                    <div
                        className='grid-item'
                    >
                        {data.la}
                    </div>
                    {data.asset ? 
                    <div
                        className='grid-item'
                    >
                        {data.asset}
                    </div> : null}
                    <div
                        className='grid-item'
                    >
                        {data.user}
                    </div>
                    <div
                        className='grid-item'
                    >
                        <button
                            onClick={() => handleDelete(data._id)}
                        >
                            check-out
                        </button>
                    </div>
                </div>
            )
        })}

    </div>
  )
}

export default GetUsers;