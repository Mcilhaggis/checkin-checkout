import React, { useContext, useEffect, useState, useRef } from 'react';
import { GlobalState } from "../utils/GlobalContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import saved from '../sounds/saved.mp3'

function NewNotification() {

    const userControlContext = useContext(GlobalState);

    const audioRef = useRef(null);

    const [newUserMessage, setNewUserMessage] = useState("");

    useEffect(() => {
        if(userControlContext.newUser.user) {
            if (!userControlContext.newUser.asset) {
                setNewUserMessage(`${userControlContext.newUser.user} has entered ${userControlContext.newUser.course} ${userControlContext.newUser.la}`);
            } else if (userControlContext.newUser.asset) {
                setNewUserMessage(`${userControlContext.newUser.user} has entered ${userControlContext.newUser.course} ${userControlContext.newUser.la} ${userControlContext.newUser.asset}`);
            }
        }
    }, [userControlContext.newUser, newUserMessage])

    toast.configure();

    const newNotify = () => {
        if(newUserMessage) {
            toast.success(newUserMessage, {
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                newestOnTop: true
            })
            audioRef.current.load();
            audioRef.current.play();
            setNewUserMessage("");
        }
    };

  return (
    <div>
        {newNotify()}
        <audio      
            ref={audioRef}        
        >
            <source src={saved} />
        </audio>
    </div>
  )
}

export default NewNotification;