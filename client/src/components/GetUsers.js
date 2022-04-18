import React, { useEffect, useContext, useState } from 'react';
import { GlobalState, DatabaseRequest } from '../utils/GlobalContext';
import axios from 'axios';
import CourseInfo from '../data/courseinfo.json';

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
            check();
        }
    }, [globalState.users])

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

    const check = () => {
        let allCourses = [];

        for (let i = 0; i < globalState.users.length; i++) {
            allCourses.push(globalState.users[i].course)
        }

        setCourseNames(Array.from(new Set(allCourses)))
    }

  return (
    <div className='data-container'> 

        {courseNames && courseNames.map((course, index) =>         
        
            <div className='data-item'>
                <h2>{course}</h2>
                
                {globalState.users && globalState.users.map((data, index) => {
                    return (
                        course === data.course ? 
                        <>
                        <p>{data.la}</p>
                        <p>{data.asset ? data.asset : "N/A"}</p>
                        <p>{data.user}</p> 
                        <button
                            onClick={() => handleDelete(data._id, data)}
                        >
                            check-out
                        </button>                        
                        </>
                        : null
                    )
                })}
            </div>            
        )}

        {/* {globalState.users && globalState.users.map((data, index) => {
            return (
                
                <div
                    key={index}
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
                            onClick={() => handleDelete(data._id, data)}
                        >
                            check-out
                        </button>
                    </div>
                </div>
            )
        })} */}

    </div>
  )
}

export default GetUsers;