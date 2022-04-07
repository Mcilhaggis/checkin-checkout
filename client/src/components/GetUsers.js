import React, {useState, useEffect} from 'react';

function GetUsers() {

    const [users, setUsers] = useState([
        {
          course: "",
          la: "",
          user: ""
        }
    ]);
    
    useEffect(() => {
        fetch('/users').then(res => {
            if(res.ok) {
            return res.json()
            }
        }).then(jsonRes => setUsers(jsonRes))
    })

  return (
    <div>      
        {users && users.map((data, index) => {
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