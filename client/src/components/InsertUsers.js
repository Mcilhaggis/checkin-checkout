import React, {useState, useEffect, useContext, useRef} from 'react';
import { DatabaseRequest, GlobalState } from '../utils/GlobalContext';
import CourseInfo from '../data/courseinfo.json';
import axios from 'axios';
import Logo from '../images/logo.svg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import error from '../sounds/error.mp3';

function InsertUsers() {

    const globalState = useContext(GlobalState);
    const databaseContext = useContext(DatabaseRequest);

    const audioRef = useRef(null);

    const [course, setCourse] = useState("");
    const [la, setLa] = useState("LA0");
    const [asset, setAsset] = useState("");
    const [user, setUser] = useState("");
    const [render, setRender] = useState(false);
    const [newErrorMessage, setNewErrorMessage] = useState("");
    const [numberOfLearningActivites, setNumberOfLearningActivities] = useState(0);

    useEffect(() => {
        for (let i = 0; i < CourseInfo.length; i++) {
            if (course === CourseInfo[i].course) {
                setNumberOfLearningActivities(CourseInfo[i].las);
                break;
            } else {
                setNumberOfLearningActivities(0);
            }
        }
    }, [course]);

    const handleCourseAndAssets = (e) => {
        let toRenderOptionsOrNot = e.target.value;
        setCourse(e.target.value.toUpperCase());

        if (toRenderOptionsOrNot.length === 0) {
            setRender(false);
        } else {
            setRender(true);
            setLa("ILO");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newUser = {
            course: course,
            la: la,
            asset: asset,
            user: user
        };
        
        if (la !== "ILO" && la !== "LD") {
            newUser.asset = "";
        }

        if (!course && !user) {
            setNewErrorMessage("you must fill in the required fields");
        } else if (course && !user) {
            setNewErrorMessage("please insert a wpa name");
        } else if (!course && user) {
            setNewErrorMessage("please insert a course name");
        } else if ((la === "ILO" || la === "LD") && !asset) {
            if (la === "ILO") {
                setNewErrorMessage("please insert ILO asset number(s)");
            } else {
                setNewErrorMessage("please insert LD asset number(s)");
            }
        } 
        
        else if (globalState.users.length > 0) {

            for (let j = 0; j < globalState.users.length; j++) {
                
                if (course === globalState.users[j].course && la === globalState.users[j].la && la !== "ILO" && la !== "LD") {
                    setNewErrorMessage(`${globalState.users[j].user} is currently in ${globalState.users[j].course} ${globalState.users[j].la}`);
                    break;
                } else if (j === globalState.users.length - 1) {

                    for (let i = 0; i < CourseInfo.length; i++) {
                        if (i === CourseInfo.length -1 && course !== CourseInfo[i].course) {
                            setNewErrorMessage("invalid course name");
                        }

                        if (course === CourseInfo[i].course) {
                            let validated = false;

                            axios.post('/newuser', newUser)
                            .then((res) => {
                                validated = true;
                                globalState.updateState({ validate: true });
                                databaseContext.getUpdate(validated, (data => null));
                                databaseContext.saveUpdate(newUser, (data => null));
                            })                 
                            .catch(err => console.log(err))
                            break;
                        } 

                    }
                } 
            }                               
        } else {
            for (let i = 0; i < CourseInfo.length; i++) {
                
                if (i === CourseInfo.length -1 && course !== CourseInfo[i].course) {
                    setNewErrorMessage("invalid course name");
                }

                if (course === CourseInfo[i].course) {
                    let validated = false;

                    axios.post('/newuser', newUser)
                    .then((res) => {
                        validated = true;
                        globalState.updateState({ validate: true });
                        databaseContext.getUpdate(validated, (data => null));
                        databaseContext.saveUpdate(newUser, (data => null));
                    })                  
                    .catch(err => console.log(err))
                    break;
                }                   
            } 
        }        
        
        setCourse("");
        setLa("LA0");
        setAsset("");
        setUser("");
        setRender(false);
    };

    databaseContext.saveUpdate(null, (data) => {
        if (!data._id) {
            globalState.updateState({ newUser: data });
        }
    });

    toast.configure();

    const newNotify = () => {
        if(newErrorMessage) {
            toast.error(newErrorMessage, {
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                newestOnTop: true
            })
            audioRef.current.load();
            audioRef.current.play();
            setNewErrorMessage("");
        }
    };

  return (
    <div className='insert-users-background'>
        {newNotify()}
        <audio      
            ref={audioRef}        
        >
            <source src={error} />
        </audio>
        <img className='logo' src={Logo} alt='logo' />
        <h1>
            <span className='check-in'>
                Check-in
            </span> 
            <span className='divider'>
                /
            </span> 
            <span className='check-out'>
                Check-out
            </span>
        </h1>
        <div>
            <form
                onSubmit={handleSubmit}
                >
                <input
                    name="course"
                    placeholder="course name"                
                    value={course}
                    onChange={(e) => handleCourseAndAssets(e)}
                />
                <select 
                    name="la"
                    onChange={(e) => setLa(e.target.value)}
                >              
                    {numberOfLearningActivites > 0 ? [...Array(numberOfLearningActivites)].map((value, index) => {
                        return (
                            <option 
                                key={index} 
                                name="la"
                                value={`LA${index + 1}`}
                            >
                                {`LA${index + 1}`}
                            </option>
                        )
                    }):null}     
                    {numberOfLearningActivites > 0 ? [...Array(numberOfLearningActivites)].map((value, index) => {
                        return (
                            <option 
                                key={index} 
                                name="tg"
                                value={`TG${index + 1}`}
                            >
                                {`TG${index + 1}`}
                            </option>
                        )
                    }): null}

                    {!render ? 
                    <>
                        <option
                            name="LA0"
                            value="LA0"
                            >
                            LA0
                        </option>     
                    </>                    
                    : null}

                    {render ? 
                    <>
                        <option
                            name="ILO"
                            value="ILO"
                            >
                            ILO
                        </option>     
                        <option
                            name="LD"
                            value="LD"
                            >
                            LD
                        </option> 
                    </>                    
                    : null}
   
                </select>
                <input 
                    name="asset" 
                    placeholder='asset#'
                    value={asset}
                    onChange={(e) => setAsset(e.target.value)}
                    disabled={(la !== "ILO" && la !== "LD" && true) || !course}
                />

                <input 
                    name="user" 
                    placeholder='wpa name'
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />

                <button                    
                    type="submit"
                    className='parent-check-in-btn'
                    aria-label='check-in'
                    tabIndex='1'
                >
                    <span 
                        className='check-in-btn'
                        title='check-in'
                        tabIndex='0'
                    />
                </button>

            </form>            
        </div>
    </div>  
  )
};

export default InsertUsers;