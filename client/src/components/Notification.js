import React, { useContext, useEffect, useState } from 'react';
import { GlobalState  } from "../utils/GlobalContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Notification() {

    const newUserContext = useContext(GlobalState);

    const [message, setMessage] = useState("");

    useEffect(() => {

        console.log("notification user: ",newUserContext.newUser)

        if(newUserContext.newUser.user) {
            console.log("user saved")
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
        }
    };

  return (
    <div>
        {notify()}
    </div>
  )
}

export default Notification;