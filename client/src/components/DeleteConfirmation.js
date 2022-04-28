import React, { useContext } from 'react';
import { GlobalState, DatabaseRequest } from '../utils/GlobalContext';
import axios from 'axios';

function DeleteConfirmation() {

    const globalState = useContext(GlobalState);
    const databaseContext = useContext(DatabaseRequest);  

    const handleModal = (e) => {
        if (e.key === 'Enter' || e.code === 'Space' || e.type === 'click') {
            globalState.updateState({ showModal: false, modalData: {} });
            document.body.classList.remove('active-modal');
        };
    };

    const handleDelete = (e, data) => {
        if (e.key === 'Enter' || e.code === 'Space' || e.type === 'click') {
            let validated = true;
            
            axios.delete(`/delete/${data._id}`)
            .then((res) => {
                globalState.updateState({ validate: true, showModal: false, modalData: {} });
                databaseContext.getUpdate(validated, (data => null));            
                databaseContext.deleteUpdate(data, (data => null));
                document.body.classList.remove('active-modal');
            })                
            .catch(err => console.log(err));
        };
    };

  return (
    <div className='modal'>
        <div 
            className='modal-overlay' 
            onClick={(e) => handleModal(e)}
        />
        <div className='modal-content'>
            {!globalState.modalData.la ? 
                <div>
                    <p>{`${globalState.modalData.user}, please confirm you want to check-out:`}</p>
                    <p>{`Course: ${globalState.modalData.course}`}</p>
                    <p>{`File: ${globalState.modalData.asset}`}</p>
                </div>
                : globalState.modalData.asset && globalState.modalData.la !== "N/A" ?
                <div>
                    <p>{`${globalState.modalData.user}, please confirm you want to check-out:`}</p>
                    <p>{`Course: ${globalState.modalData.course}`}</p>
                    <p>{`Asset: ${globalState.modalData.la}`}</p>
                    <p>{`Asset#: ${globalState.modalData.asset}`}</p>
                </div> :                
                <div>
                    <p>{`${globalState.modalData.user}, please confirm you want to check-out:`}</p>
                    <p>{`Course: ${globalState.modalData.course}`}</p>
                    <p>{`${globalState.modalData.la.includes("TG") || globalState.modalData.la.includes("LA") ? "LA" : "Asset"}: ${globalState.modalData.la}`}</p>
                </div>
            }
            
            <i 
                className='cancel-btn' 
                title='cancel'
                onClick={(e) => handleModal(e)}
                onKeyDown={(e) => handleModal(e)}
                tabIndex='0'
            />
            <i 
                className='confirm-btn' 
                title='confirm'
                onClick={(e) => handleDelete(e, globalState.modalData)}
                onKeyDown={(e) => handleDelete(e, globalState.modalData)}
                tabIndex='0'
            />
        </div>
    </div>
  )
};

export default DeleteConfirmation;