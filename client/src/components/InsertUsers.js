import React, {useState, useEffect} from 'react';
import CourseInfo from '../data/courseinfo.json';
import axios from 'axios';

function InsertUsers() {

    const [course, setCourse] = useState("");
    const [la, setLa] = useState("LA1");
    const [user, setUser] = useState("");

    const [numberOfLearningActivites, setNumberOfLearningActivities] = useState(0)

    useEffect(() => {
        for (let i = 0; i < CourseInfo.length; i++) {
            if (course === CourseInfo[i].course) {
                // console.log("matched")
                setNumberOfLearningActivities(CourseInfo[i].las)
                break;
            } else {
                // console.log("no match")
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

        axios.post('/newuser', newUser);
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
                // ref={nameRef}
            />

            <button                    
                type="submit"
            >
                check-in
            </button>

            {/* {display && (
                <div onMouseLeave={hideCourses}>
                    {data.filter(({course}) => course.indexOf(search.toUpperCase()) > -1 ).map((value, index) => {
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
            )} */}
        </form>            
    </div>
</div>  
  )
};
;
export default InsertUsers;