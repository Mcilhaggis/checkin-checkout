import React, { useEffect, useContext, useState } from 'react';
import { GlobalState, DatabaseRequest } from '../utils/GlobalContext';
import DeleteConfirmation from './DeleteConfirmation';
import Chevron from '../images/chevron.svg';

function GetUsers() {

    const globalState = useContext(GlobalState);
    const databaseContext = useContext(DatabaseRequest);  

    const [selected, setSelected] = useState(null);
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

    const toggle = (index) => {
        if (selected === index) {
            return setSelected(null);
        }

        setSelected(index);
    };

    const handleModal = (e, data) => {
        if (e.key === 'Enter' || e.code === 'Space' || e.type === 'click') {
            globalState.updateState({ showModal: true, modalData: data })
            document.body.classList.add('active-modal')
        }
    };

  return (
    <div className='data-container'> 

        {courseNames && courseNames.map((course, index) =>         
        
            <div 
                key={index}
                className='data-item' 
            >                
                <div 
                    className='data-item-heading-parent'
                    onClick={() => toggle(index)}
                >
                    <h2 
                        className='data-item-heading'
                    >
                        {course}
                    </h2>
                    <img 
                        src={Chevron} 
                        alt='chevron icon'
                        className={selected === index ? 'data-item-chevron-open' : 'data-item-chevron-close'}
                    />
                </div>

                <table 
                    className={selected === index ? 'data-item-table-open' : 'data-item-table-close'}
                >
                    <thead>
                        <tr>
                            <td className='data-item-table-titles'>LA</td>
                            <td className='data-item-table-titles'>Asset</td>
                            <td className='data-item-table-titles'>WPA</td>
                        </tr>
                    </thead>
                    <tbody> 

                        {globalState.users && globalState.users.sort((a, b) => /^[0-9]/.test(a.la) - /^[0-9]/.test(b.la) || a.la.localeCompare(b.la, undefined, { numeric: true })).map((data, index) => {
                            return (
                                course === data.course &&                                                                 
                                <>                                
                                    <tr                                         
                                        className='data-item-table-contents'
                                        key={index}
                                    >
                                        <td>{data.la}</td>
                                        <td>{data.asset ? data.asset : "N/A"}</td>
                                        <td>{data.user}</td> 
                                        <td>
                                            <i 
                                                className='data-item-check-out-btn' 
                                                title='check-out'
                                                onClick={(e) => handleModal(e, data)}
                                                onKeyDown={(e) => handleModal(e, data)}
                                                tabIndex={globalState.showModal ? '-1' : '0'}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td 
                                            colSpan="4"                                        
                                        >
                                            <hr className='data-item-table-line' />
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