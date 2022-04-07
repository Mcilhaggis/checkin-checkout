import React, { useEffect, useContext } from 'react';
import { UserContext, DatabaseRequest, ValidateContext} from '../utils/GlobalContext';
import axios from 'axios';

function GetUsers() {

    const userContext = useContext(UserContext);
    const validateContext = useContext(ValidateContext);
    const databaseContext = useContext(DatabaseRequest);  
    
    useEffect(() => {
        if (validateContext.validate) {
            databaseContext.getUsers();
            validateContext.setValidate(false);
        }
    }, [validateContext.validate])

    const handleDelete = (id) => {        
        axios.delete(`/delete/${id}`)
        .then((res) => validateContext.setValidate(true))                 
        .catch(err => console.log(err))
    }

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