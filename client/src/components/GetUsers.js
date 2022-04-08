import React, { useEffect, useContext } from 'react';
import { UserContext, DatabaseRequest, ValidateContext, SocketValidateContext} from '../utils/GlobalContext';
import axios from 'axios';

function GetUsers() {

    const userContext = useContext(UserContext);
    const validateContext = useContext(ValidateContext);
    const socketValidateContext = useContext(SocketValidateContext);
    const databaseContext = useContext(DatabaseRequest);  
    
    useEffect(() => {
        if (validateContext.validate || socketValidateContext.socketValidate) {
            databaseContext.getUsers();
            validateContext.setValidate(false);
            socketValidateContext.setSocketValidate(false)
        }
    }, [validateContext.validate, socketValidateContext.socketValidate])

    const handleDelete = (id) => {
        let validated = false;
        
        axios.delete(`/delete/${id}`)
        .then((res) => {
            validateContext.setValidate(true)
            validated = true;
            databaseContext.sendUpdate(validated, (data => console.log('received saved update: ', data)))
        })                
        .catch(err => console.log(err))
    }

    databaseContext.sendUpdate(null, (data) => {
        socketValidateContext.setSocketValidate(data);
    })

  return (
    <div>      
        {userContext.users && userContext.users.map((data, index) => {
            return (
                
                <div
                    key={index}
                    className="grid-container"
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