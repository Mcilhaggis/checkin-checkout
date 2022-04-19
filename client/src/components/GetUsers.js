import React, { useEffect, useContext, useState } from 'react';
import { GlobalState, DatabaseRequest } from '../utils/GlobalContext';
import axios from 'axios';

function GetUsers() {

    const globalState = useContext(GlobalState);
    const databaseContext = useContext(DatabaseRequest);  

    const [courseNames, setCourseNames] = useState([]);

    useEffect(() => {
        if (globalState.validate || globalState.socketValidate) {
            databaseContext.getUsers();
            globalState.updateState({ validate: false, socketValidate: false });
        }
    }, [globalState, databaseContext]);

    useEffect(() => {
        if (globalState.users) {
            let allCourses = [];

            for (let i = 0; i < globalState.users.length; i++) {
                allCourses.push(globalState.users[i].course);
                allCourses.sort();
            }
    
            setCourseNames(Array.from(new Set(allCourses)));
        }
    }, [globalState.users]);

    const handleDelete = (id, data) => {
        let validated = false;
        let deleted = data;
        
        axios.delete(`/delete/${id}`)
        .then((res) => {
            validated = true;
            globalState.updateState({ validate: true });
            databaseContext.getUpdate(validated, (data => null));            
            databaseContext.deleteUpdate(deleted, (data => null))
        })                
        .catch(err => console.log(err))
    };

    databaseContext.getUpdate(null, (data) => {
        if (data === true) {
            globalState.updateState({ socketValidate: data });
        }
    });

    databaseContext.deleteUpdate(null, (data) => {
        if (data._id) {
            globalState.updateState({ oldUser: data });
        }
    });

  return (
    <div className='data-container'> 

        {courseNames && courseNames.map((course, index) =>         
        
            <div 
                key={index}
                className='data-item' 
            >

                <table style={{width: "100%"}}>
                    <thead>
                        <tr>
                            <th className='data-item-heading'>{course}</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className='data-item-titles'>LA</td>
                            <td className='data-item-titles'>Asset</td>
                            <td className='data-item-titles'>User</td>
                            <td className='data-item-titles'>Check-out</td>
                        </tr>

                        {globalState.users && globalState.users.sort((a, b) => a.la.localeCompare(b.la)).map((data, index) => {
                            return (
                                course === data.course && 
                                <>
                                    <tr 
                                        key={index}
                                        className='data-item-contents'
                                    >
                                        <td>{data.la}</td>
                                        <td>{data.asset ? data.asset : "N/A"}</td>
                                        <td>{data.user}</td> 
                                        <td>
                                            <i 
                                                className='check-out-btn' 
                                                title='check-out'
                                                onClick={() => handleDelete(data._id, data)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td 
                                            colSpan="4"                                        
                                        >
                                            <hr style={{maxWidth: '90%'}}/>
                                        </td>
                                    </tr>
                                </>                           
                            )
                        })}
                    </tbody>

                </table>
            </div>            
        )}
    </div>
  )
}

export default GetUsers;