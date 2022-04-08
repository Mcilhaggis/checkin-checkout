import React, {useState, useEffect, useContext} from 'react';
import { UserContext, DatabaseRequest, ValidateContext } from '../utils/GlobalContext';
import CourseInfo from '../data/courseinfo.json';
import axios from 'axios';

function InsertUsers() {

    const userContext = useContext(UserContext);
    const validateContext = useContext(ValidateContext);
    const databaseContext = useContext(DatabaseRequest);

    const [display, setDisplay] = useState(false);

    const [course, setCourse] = useState("");
    const [la, setLa] = useState("LA1");
    const [user, setUser] = useState("");

    const [numberOfLearningActivites, setNumberOfLearningActivities] = useState(0)

    useEffect(() => {
        for (let i = 0; i < CourseInfo.length; i++) {
            if (course === CourseInfo[i].course) {
                setNumberOfLearningActivities(CourseInfo[i].las)
                break;
            } else {
                setNumberOfLearningActivities(0)
            }
        }
    }, [course]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newUser = {
            course: course,
            la: la,
            user: user
        }

        if (!course && !user) {
            alert("you must fill in the required fields")
        } else if (course && !user) {
            alert("please insert a wpa name")
        } else if (!course && user) {
            alert("please insert a course name")
        } else if (userContext.users.length > 0) {

            for (let j = 0; j < userContext.users.length; j++) {
                if (course === userContext.users[j].course && la === userContext.users[j].la) {
                    alert(`${userContext.users[j].user} is currently in ${userContext.users[j].course} ${userContext.users[j].la}`)
                    break;
                } else if (j === userContext.users.length - 1) {

                    for (let i = 0; i < CourseInfo.length; i++) {
                        if (i === CourseInfo.length -1 && course !== CourseInfo[i].course) {
                            alert("invalid course name")
                        }

                        if (course === CourseInfo[i].course) {
                            let validated = false;

                            axios.post('/newuser', newUser)
                            .then((res) => {
                                validateContext.setValidate(true)
                                validated = true;
                                databaseContext.sendUpdate(validated, null)
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
                    alert("invalid course name")
                }

                if (course === CourseInfo[i].course) {
                    let validated = false;

                    axios.post('/newuser', newUser)
                    .then((res) => {
                        validateContext.setValidate(true)
                        validated = true;
                        databaseContext.sendUpdate(validated, null)
                    })                  
                    .catch(err => console.log(err))
                    break;
                }                   
            } 
        }        
        
        setCourse("");
        setLa("LA1");
        setUser("");
        databaseContext.getUsers();
    }

    const setCourseName = course => {
        setCourse(course);
        setDisplay(false);
    }

    const hideCourses = () => {
        setDisplay(false)
    }


  return (
    <div>
    <h1>Check-in or Check-out</h1>

    <div>
        <form
            onSubmit={handleSubmit}
            >
            <input
                name="course"
                placeholder="course name"                
                value={course}
                // onClick={() => setDisplay(!display)}
                onChange={(e) => setCourse(e.target.value.toUpperCase())}
            />

            <select 
                name="la"
                onChange={(e) => setLa(e.target.value)}
            >              
                {numberOfLearningActivites === 0 ? <option name="la" value={la}>LA0</option> : [...Array(numberOfLearningActivites)].map((value, index) => {
                    return (
                        <option 
                            key={index} 
                            name="la"
                            value={`LA${index + 1}`}
                        >
                            {`LA${index + 1}`}
                        </option>
                    )
                })}     
            </select>

            <input 
                name="user" 
                placeholder='wpa name'
                value={user}
                onChange={(e) => setUser(e.target.value)}
            />

            <button                    
                type="submit"
            >
                check-in
            </button>

            {display && (
                <div onMouseLeave={hideCourses}>
                    {CourseInfo.filter(({course}) => course.indexOf(course.toUpperCase()) > -1 ).map((value, index) => {
                        return (
                        
                        <div 
                            key={index}
                            onClick={() => setCourseName(value.course)}
                            tabIndex="0"
                        >
                            <span>{value.course}</span>
                        </div>)
                    })}
                </div>
            )}
        </form>            
    </div>
</div>  
  )
};
;
export default InsertUsers;