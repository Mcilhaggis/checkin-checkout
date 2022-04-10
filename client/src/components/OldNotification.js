import React, { useContext, useEffect, useState, useRef } from 'react';
import { GlobalState } from "../utils/GlobalContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import saved from '../sounds/saved.mp3'

function OldNotification() {

    const userControlContext = useContext(GlobalState);

    const audioRef = useRef(null);

    const [oldUserMessage, setOldUserMessage] = useState("");

    useEffect(() => {
        if(userControlContext.oldUser.user) {
            if (!userControlContext.oldUser.asset) {
                setOldUserMessage(`${userControlContext.oldUser.user} has exited ${userControlContext.oldUser.course} ${userControlContext.oldUser.la}`);
            } else if (userControlContext.oldUser.asset) {
                setOldUserMessage(`${userControlContext.oldUser.user} has exited ${userControlContext.oldUser.course} ${userControlContext.oldUser.la} ${userControlContext.oldUser.asset}`);
            }
        }

    }, [userControlContext.oldUser, oldUserMessage])

    toast.configure()

    const oldNotify = () => {
        if(oldUserMessage) {
            toast.info(oldUserMessage, {
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                newestOnTop: true
            })
            audioRef.current.load();
            audioRef.current.play();
            setOldUserMessage("");
        }
    };

  return (
    <div>
        {oldNotify()}
        <audio      
            ref={audioRef}        
        >
            <source src={saved} />
        </audio>
    </div>
  )
}

export default OldNotification;