import React, { useEffect, useContext, useState } from 'react';
import { GlobalState, DatabaseRequest } from '../utils/GlobalContext';
import DeleteConfirmation from './DeleteConfirmation';

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

    databaseContext.getUpdate(null, (data) => {
        if (data === true) {
            globalState.updateState({ socketValidate: data });
        }
    });

    const handleModal = (data) => {
        globalState.updateState({ showModal: true, modalData: data })
        document.body.classList.add('active-modal')
    };

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
                            <td className='data-item-titles'>WPA</td>
                            <td className='data-item-titles'>Check-out</td>
                        </tr>

                        {globalState.users && globalState.users.sort((a, b) => /^[0-9]/.test(a.la) - /^[0-9]/.test(b.la) || a.la.localeCompare(b.la, undefined, { numeric: true })).map((data, index) => {
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
                                                onClick={() => handleModal(data)}
                                                tabIndex={globalState.showModal ? '-1' : '0'}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td 
                                            colSpan="4"                                        
                                        >
                                            <hr className='data-item-line' />
                                        </td>
                                    </tr>
                                </>                           
                            )
                        })}
                    </tbody>
                </table>
            </div>            
        )}
        {globalState.showModal && <DeleteConfirmation/>}
    </div>
  )
}

export default GetUsers;