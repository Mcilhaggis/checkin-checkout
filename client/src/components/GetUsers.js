import React, { useEffect, useContext, useState, useRef } from 'react';
import { GlobalState, DatabaseRequest } from '../utils/GlobalContext';
import DeleteConfirmation from './DeleteConfirmation';
import Chevron from '../images/chevron.svg';

function GetUsers() {

    const globalState = useContext(GlobalState);
    const databaseContext = useContext(DatabaseRequest);  

    const chevronRef = useRef([]);

    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [lastAccordionEl, setLastAccordionEl] = useState('');
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
            };
    
            setCourseNames(Array.from(new Set(allCourses)));
        };
    }, [globalState.users]);

    databaseContext.getUpdate(null, (data) => {
        if (data === true) {
            return globalState.updateState({ socketValidate: data });
        };
    });

    const toggleEnterChevron = (e) => {
        for (let i = 0; i < chevronRef.current.filter(Boolean).length; i++) {
            if (e.target.dataset.id === chevronRef.current[i].dataset.id) {
                if (isAccordionOpen === true && chevronRef.current[i].dataset.id === lastAccordionEl.dataset.id) {
                    chevronRef.current[i].className = 'data-item-chevron-close';
                } else if (isAccordionOpen === true && chevronRef.current[i].dataset.id !== lastAccordionEl.dataset.id) {
                    chevronRef.current[i].className = 'data-item-chevron-open';
                } else {
                    chevronRef.current[i].className = 'data-item-chevron-open';
                };
            };
        };
    };

    const toggleLeaveChevron = (e) => {        
        for (let i = 0; i < chevronRef.current.filter(Boolean).length; i++) {
            if (e.target.dataset.id === chevronRef.current[i].dataset.id) {
                if (isAccordionOpen === true && chevronRef.current[i].dataset.id === lastAccordionEl.dataset.id) {
                    chevronRef.current[i].className = 'data-item-chevron-open';
                } else if (isAccordionOpen === true && chevronRef.current[i].dataset.id !== lastAccordionEl.dataset.id) {
                    chevronRef.current[i].className = 'data-item-chevron-close';
                } else {
                    chevronRef.current[i].className = 'data-item-chevron-close';
                };
            };
        };
    };

    const toggle = (e, course) => {
        if (e.key === 'Enter' || e.code === 'Space' || e.type === 'click') {

            for (let i = 0; i < chevronRef.current.filter(Boolean).length; i++) {
                if (e.target.dataset.id === chevronRef.current[i].dataset.id) {
                     if (globalState.selected === course) {
                        setIsAccordionOpen(false);
                        chevronRef.current[i].className = 'data-item-chevron-close';
                        return globalState.updateState({ selected: null });
                    };

                    if (lastAccordionEl) {
                        lastAccordionEl.classList = 'data-item-chevron-close';
                    };

                    setLastAccordionEl(chevronRef.current[i]);
                    setIsAccordionOpen(true);
                    globalState.updateState({ selected: course });
                    chevronRef.current[i].className = 'data-item-chevron-open';
                };
            };
        };
    };

    const handleModal = (e, data) => {
        if (e.key === 'Enter' || e.code === 'Space' || e.type === 'click') {
            globalState.updateState({ showModal: true, modalData: data });
            document.body.classList.add('active-modal');
        };
    };

    databaseContext.deleteUpdate(null, (data) => {
        if (data._id) {
            globalState.updateState({ oldUser: data });
        };
    });

  return (
    <div 
        className='data-container'                     
    > 
        {courseNames && courseNames.map((course, index) =>                 
            <div 
                key={index}
                className='data-item' 
            >                
                <div 
                    className='data-item-heading-parent'
                    onClick={(e) => toggle(e, course)}
                    onKeyDown={(e) => toggle(e, course)}
                    tabIndex={globalState.showModal ? '-1' : '0'}
                    onMouseEnter={(e) => toggleEnterChevron(e)}
                    onFocus={(e) => toggleEnterChevron(e)}
                    onMouseLeave={(e) => toggleLeaveChevron(e)}
                    onBlur={(e) => toggleLeaveChevron(e)}
                    data-id={index}
                >
                    <h2 
                        className='data-item-heading'
                        data-id={index}
                    >
                        {course}
                    </h2>
                    <img                         
                        src={Chevron} 
                        alt='chevron icon'
                        className='data-item-chevron-close'
                        data-id={index}
                        ref={el => chevronRef.current[index] = el}
                    />
                </div>

                <table 
                    className={globalState.selected === course ? 'data-item-table-open' : 'data-item-table-close'}
                >
                    <thead>
                        <tr>
                            <td className='data-item-table-titles'>LA</td>
                            <td className='data-item-table-titles'>Asset</td>
                            <td className='data-item-table-titles'>WPA</td>
                        </tr>
                    </thead>                    

                        {globalState.users && globalState.users.sort((a, b) => /^[0-9]/.test(a.la) - /^[0-9]/.test(b.la) || a.la.localeCompare(b.la, undefined, { numeric: true })).map((data, index) => {
                            return (
                                course === data.course &&                                                                 
                                <tbody
                                    key={index}
                                >                                
                                    <tr                                         
                                        className='data-item-table-contents'
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
                                </tbody>
                            )
                        })}
                </table>
            </div>            
        )}
        {globalState.showModal && <DeleteConfirmation/>}
    </div>
  )
};

export default GetUsers;