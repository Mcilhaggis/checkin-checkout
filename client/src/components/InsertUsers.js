import React, {useState, useEffect, useContext, useRef} from 'react';
import { DatabaseRequest, GlobalState } from '../utils/GlobalContext';
import CourseInfo from '../data/courseinfo.json';
import axios from 'axios';
import Logo from '../images/logo_v2.svg';
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
            };
        };
    }, [course]);

    const addDecimal = (e) => {
        if (e.target.value.length === 2) {
            e.target.value = e.target.value + "."
        } else if (e.target.value.length === 3 && e.code === "Backspace") {
            e.target.value = e.target.value.slice(0, -1)
        };
    };

    const handleCourseAndAssets = (e) => {
        let toRenderOptionsOrNot = e.target.value;
        setCourse(e.target.value.toUpperCase());

        if (toRenderOptionsOrNot.length === 0) {
            setRender(false);
        } else {
            setRender(true);
            setLa("ILO");
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newUser = {
            course: course,
            la: la,
            asset: asset,
            user: user
        };
        
        if (la !== "ILO" && la !== "LD" && la !== "AT") {
            newUser.asset = "";
        };

        if (course === "101") {
            newUser.la = "";
        };

        if (!course && !user) {
            setNewErrorMessage("please fill out the required fields");
        } else if (course && !user) {
            setNewErrorMessage("please insert a wpa name");
        } else if (!course && user) {
            setNewErrorMessage("please insert a course name");
        } else if ((la === "ILO" || la === "LD" || la === "AT") && !asset) {
            setNewErrorMessage(`please insert ${la} asset number`);
        } else if ((la === "ILO" || la === "LD" || la === "AT") && course !== "101" && asset.length !== 5) {
            setNewErrorMessage(`Please insert a 4 digit asset number`);
        } else if ( course !== "101" && (la === "ILO" || la === "LD" || la === "AT") && (asset.match(/[a-zA-Z!@#$%^&*()_+\-=[\]{};':"\\|,<>/?]/g) || asset.charAt(0) === "." || asset.charAt(1) === "." || asset.charAt(3) === "." || asset.charAt(4) === ".")) {
            setNewErrorMessage(`please insert asset numbers and not letters or special characters`);
        } else if (globalState.users.length > 0) {

            for (let j = 0; j < globalState.users.length; j++) {
                if (course === "101" && asset === globalState.users[j].asset) {
                    setNewErrorMessage(`${globalState.users[j].user} is currently in ${globalState.users[j].course} ${globalState.users[j].asset}`);
                    break;
                } else if (course === globalState.users[j].course && la === globalState.users[j].la && la !== "ILO" && la !== "LD" && la !== "AT") {
                    setNewErrorMessage(`${globalState.users[j].user} is currently in ${globalState.users[j].course} ${globalState.users[j].la}`);
                    break;
                } else if (course === globalState.users[j].course && la === globalState.users[j].la && asset === globalState.users[j].asset && asset !== "N/A") {
                    setNewErrorMessage(`${globalState.users[j].user} is currently in ${globalState.users[j].course} ${globalState.users[j].la} ${globalState.users[j].asset}`);
                    break;
                } else if (course === globalState.users[j].course && la === "All LAs" && globalState.users[j].la.includes("LA")) {
                    setNewErrorMessage(`WPAs are currently in ${globalState.users[j].course} LAs`)
                    break;
                } else if (course === globalState.users[j].course && la.includes("LA") && globalState.users[j].la.includes("All LAs")) {
                    setNewErrorMessage(`${globalState.users[j].user} is currently in all ${globalState.users[j].course} LAs`)
                    break;
                } else if (course === globalState.users[j].course && la === "All TGs" && globalState.users[j].la.includes("TG")) {
                    setNewErrorMessage(`WPAs are currently in ${globalState.users[j].course} TGs`)
                    break;
                } else if (course === globalState.users[j].course && la.includes("TG") && globalState.users[j].la.includes("All TGs")) {
                    setNewErrorMessage(`${globalState.users[j].user} is currently in all ${globalState.users[j].course} TGs`)
                    break;
                } else if (course === globalState.users[j].course && la === "All ILOs" && globalState.users[j].la.includes("ILO")) {
                    setNewErrorMessage(`WPAs are currently in ${globalState.users[j].course} ILOs`)
                    break;
                } else if (course === globalState.users[j].course && la.includes("ILO") && globalState.users[j].la.includes("All ILOs")) {
                    setNewErrorMessage(`${globalState.users[j].user} is currently in all ${globalState.users[j].course} ILOs`)
                    break;
                } else if (course === globalState.users[j].course && la === "All LDs" && globalState.users[j].la.includes("LD")) {
                    setNewErrorMessage(`WPAs are currently in ${globalState.users[j].course} LDs`)
                    break;
                } else if (course === globalState.users[j].course && la.includes("LD") && globalState.users[j].la.includes("All LDs")) {
                    setNewErrorMessage(`${globalState.users[j].user} is currently in all ${globalState.users[j].course} LDs`)
                    break;
                } else if (course === globalState.users[j].course && la === "All ATs" && globalState.users[j].la.includes("AT")) {
                    setNewErrorMessage(`WPAs are currently in ${globalState.users[j].course} ATs`)
                    break;
                } else if (course === globalState.users[j].course && la.includes("AT") && globalState.users[j].la.includes("All ATs")) {
                    setNewErrorMessage(`${globalState.users[j].user} is currently in all ${globalState.users[j].course} ATs`)
                    break;
                } else if (j === globalState.users.length - 1) {

                    for (let i = 0; i < CourseInfo.length; i++) {
                        if (i === CourseInfo.length -1 && course !== CourseInfo[i].course) {
                            setNewErrorMessage("invalid course name");
                        };

                        if (course === CourseInfo[i].course) {
                            let validated = true;

                            axios.post('/newuser', newUser)
                            .then((res) => {
                                globalState.updateState({ validate: true, selected: course });
                                databaseContext.getUpdate(validated, (data => null));
                                databaseContext.saveUpdate(newUser, (data => null));

                                setCourse("");
                                setLa("LA0");
                                setAsset("");
                                setUser("");
                                setRender(false);
                            })                 
                            .catch(err => console.log(err))
                            break;
                        }; 
                    };
                }; 
            };                               
        } else {
            for (let i = 0; i < CourseInfo.length; i++) {
                
                if (i === CourseInfo.length -1 && course !== CourseInfo[i].course) {
                    setNewErrorMessage("invalid course name");
                };

                if (course === CourseInfo[i].course) {
                    let validated = true;

                    axios.post('/newuser', newUser)
                    .then((res) => {
                        globalState.updateState({ validate: true, selected: course });
                        databaseContext.getUpdate(validated, (data => null));
                        databaseContext.saveUpdate(newUser, (data => null));

                        setCourse("");
                        setLa("LA0");
                        setAsset("");
                        setUser("");
                        setRender(false);
                    })                  
                    .catch(err => console.log(err))
                    break;
                };                  
            }; 
        };        
    };

    databaseContext.saveUpdate(null, (data) => {
        if (!data._id) {
            return globalState.updateState({ newUser: data });
        };
    });

    toast.configure();

    const newNotify = () => {
        if(newErrorMessage) {
            toast.error(newErrorMessage, {
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                newestOnTop: true
            });
            audioRef.current.load();
            audioRef.current.play();
            setNewErrorMessage("");
        };
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
                autoComplete='on'
            >
                <input
                    name="course"
                    placeholder="course"                
                    value={course}
                    onChange={(e) => handleCourseAndAssets(e)}
                    tabIndex={globalState.showModal ? '-1' : '0'}
                />
                <select 
                    name="la"
                    onChange={(e) => setLa(e.target.value)}
                    autoComplete='off'
                    tabIndex={globalState.showModal ? '-1' : '0'}
                    disabled={course === "101" ? true : false}
                >        

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

                        <option
                            name="AT"
                            value="AT"
                            >
                            AT
                        </option> 

                        <option
                            name="ACK"
                            value="ACK"
                            >
                            ACK
                        </option> 

                        <option
                            name="All LAs"
                            value="All LAs"
                            >
                            All LAs
                        </option> 

                        <option
                            name="All TGs"
                            value="All TGs"
                            >
                            All TGs
                        </option>  

                        <option
                            name="All ILOs"
                            value="All ILOs"
                            >
                            All ILOs
                        </option>  

                        <option
                            name="All LDs"
                            value="All LDs"
                            >
                            All LDs
                        </option>  

                        <option
                            name="All ATs"
                            value="All ATs"
                            >
                            All ATs
                        </option>  
                    </>                    
                    : null}
   
                </select>
                <input 
                    name="asset" 
                    placeholder='asset#'
                    maxLength={course === "101" ? 30 : 5}
                    value={asset}
                    onKeyDown={course === "101" ? null : (e) => addDecimal(e)}
                    onChange={(e) => setAsset(e.target.value)}
                    disabled={(la !== "ILO" && la !== "LD" && la !== "AT" && true) || !course}
                />

                <input 
                    name="user" 
                    placeholder='wpa'
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    tabIndex={globalState.showModal ? '-1' : '0'}
                />

                <button                    
                    type="submit"
                    className='parent-check-in-btn'
                    aria-label='check-in'
                    tabIndex='1'
                    disabled={globalState.showModal ? true : false}
                >
                    <span 
                        className='check-in-btn'
                        title='check-in'
                        tabIndex={globalState.showModal ? '-1' : '0'}
                    />
                </button>

            </form>            
        </div>
    </div>  
  )
};

export default InsertUsers;