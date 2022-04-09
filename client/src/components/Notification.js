import React, { useContext, useEffect, useState, useRef } from 'react';
import { GlobalState  } from "../utils/GlobalContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import saved from '../sounds/saved.mp3'

function Notification() {

    const newUserContext = useContext(GlobalState);

    const audioRef = useRef(null);

    const [message, setMessage] = useState("");

    useEffect(() => {
        if(newUserContext.newUser.user) {
            if (!newUserContext.newUser.asset) {
                setMessage(`${newUserContext.newUser.user} has entered ${newUserContext.newUser.course} ${newUserContext.newUser.la}`);
            } else if (newUserContext.newUser.asset) {
                setMessage(`${newUserContext.newUser.user} has entered ${newUserContext.newUser.course} ${newUserContext.newUser.la} ${newUserContext.newUser.asset}`);
            }
        }

    }, [newUserContext.newUser, message])

    toast.configure()

    const notify = () => {
        if(message) {
            toast.info(message)
            setMessage("");
            audioRef.current.load();
            audioRef.current.play();
        }
    };

  return (
    <div>
        {notify()}
        <audio      
            ref={audioRef}        
        >
            <source src={saved} />
        </audio>
    </div>
  )
}

export default Notification;