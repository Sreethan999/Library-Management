import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleRegister = async(e)=>{

        e.preventDefault();

        const response = await fetch("http://127.0.0.1:8000/api/register/",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                username,
                email,
                password
            })

        });

        const data = await response.json();

        if(response.ok){

            alert("Registration Successful");

            navigate("/");

        }

        else{

            alert(JSON.stringify(data));

        }

    }

    return(

        <div className="container mt-5">

            <div className="card p-4 shadow mx-auto" style={{maxWidth:"450px"}}>

                <h2 className="text-center mb-4">
                    Create Account
                </h2>

                <form onSubmit={handleRegister}>

                    <input
                        className="form-control mb-3"
                        placeholder="Username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    />

                    <input
                        type="email"
                        className="form-control mb-3"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />

                    <button className="btn btn-success w-100">
                        Register
                    </button>

                </form>

                <p className="mt-3 text-center">
                    Already have an account?{" "}
                    <Link to="/">Login</Link>
                </p>

            </div>

        </div>

    );

}

export default Register;