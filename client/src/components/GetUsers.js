import React, { useEffect, useContext} from 'react';
import { UserContext, DatabaseRequest, ValidateContext} from '../utils/GlobalContext';

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
                            // onClick={() => handleDelete(data._id)}
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