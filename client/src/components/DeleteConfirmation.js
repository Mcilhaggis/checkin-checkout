import React, { useContext } from 'react';
import { GlobalState, DatabaseRequest } from '../utils/GlobalContext';
import axios from 'axios';

function DeleteConfirmation() {

    const globalState = useContext(GlobalState);
    const databaseContext = useContext(DatabaseRequest);  

    const handleModal = () => {
        globalState.updateState({ showModal: false, modalData: {} });
        document.body.classList.remove('active-modal');
    };

    const handleDelete = (data) => {
        let validated = false;
        let deleted = data;
        
        axios.delete(`/delete/${data._id}`)
        .then((res) => {
            validated = true;
            globalState.updateState({ validate: true });
            databaseContext.getUpdate(validated, (data => null));            
            databaseContext.deleteUpdate(deleted, (data => null))
            globalState.updateState({ showModal: false, modalData: {} });
            document.body.classList.remove('active-modal');
        })                
        .catch(err => console.log(err))
    };

    databaseContext.deleteUpdate(null, (data) => {
        if (data._id) {
            globalState.updateState({ oldUser: data });
        }
    });

  return (
    <div className='modal'>
        <div 
            className='modal-overlay' 
            onClick={() => handleModal()}
        />
        <div className='modal-content'>
            {globalState.modalData.asset ? 
                <div>
                    <p>{`${globalState.modalData.user}, please confirm you want to check-out:`}</p>
                    <p>{`Course: ${globalState.modalData.course}`}</p>
                    <p>{`LA: ${globalState.modalData.la}`}</p>
                    <p>{`Asset: ${globalState.modalData.asset}`}</p>
                </div> :
                <div>
                    <p>{`${globalState.modalData.user}, please confirm you want to check-out:`}</p>
                    <p>{`Course: ${globalState.modalData.course}`}</p>
                    <p>{`LA: ${globalState.modalData.la}`}</p>
                </div>
            } 
            <button onClick={() => handleDelete(globalState.modalData)}>CONFIRM</button>           
            <button onClick={() => handleModal()}>CANCEL</button>           
        </div>
    </div>
  )
}

export default DeleteConfirmation;