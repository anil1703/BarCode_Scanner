import Cookies from "js-cookie"
import Header from "../Header/Header"
import "./Home.css"
const Home = () => {
    const check = Cookies.get("user")
    if (check==="Admin"){
        return <div className="arrangeHeadBody">
        <Header/>
        <div className="bodyPart">
            <h1>Dashboard</h1>
            <div className="body-part-dashboard">

            <h1>Welcome Admin</h1>
            <br/>
            <p>No Updates</p>
            </div>
            

        </div>
        
        </div>
    }
    else{
        return <div className="arrangeHeadBody">
        <Header/>
        <div className="bodyPart">
            <h1>Dashboard</h1>
            <div className="body-part-dashboard">

            <h1>Welcome User</h1>
            <br/>
            <p>No Updates</p>
            </div>
            

        </div>
        
        </div>
    }
    
}

export default Home