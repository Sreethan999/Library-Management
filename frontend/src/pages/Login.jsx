import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("username", username);

            alert("Login Successful");

            navigate("/dashboard");

        }
        
        else {
            alert(data.error || "Invalid username or password");
        }
    };

    return (
        <div className="container mt-5">

            <div className="card p-4 shadow mx-auto" style={{maxWidth:"450px"}}>

                <h2 className="text-center mb-4">Sign In</h2>

                <form onSubmit={handleLogin}>

                    <input
                        className="form-control mb-3"
                        placeholder="Username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />

                    <button className="btn btn-primary w-100">
                        Login
                    </button>

                </form>

                <p className="mt-3 text-center">
                    Don't have an account?{" "}
                    <Link to="/register">Register</Link>
                </p>

            </div>

        </div>
    );
}

export default Login;