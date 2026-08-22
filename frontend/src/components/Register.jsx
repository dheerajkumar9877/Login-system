import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name , setName] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate() ;

  function handelName(e){
    setName(e.target.value);
  }

  function handelEmail(e) {
    setEmail(e.target.value);
  }

  function handelCode(e) {
    setCode(e.target.value);
  }

  function handelPassword(e) {
    setPassword(e.target.value);
  }

  function verifyCode() {
    // Example verification code
    if (code === "123456") {
      setIsVerified(true);
    } else {
      alert("Invalid Verification Code");
      setIsVerified(false);
    }
  }

  async function handelSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/register' , {
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify ({
          name:name,
          email:email,
          password:password
        })
      });

      const data =await response.json();

      console.log(data);

      if (response.ok) {
      alert(data.message);
      navigate("/login");
    } else {
      alert(data.message);
    }

    }catch(err){
      console.log(console.log(err));
      alert("Unable to connect to server");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Register</h1>

        <form onSubmit={handelSubmit} className="space-y-5">
          {/*Name */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handelName}
            value={name}
            required
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            name="email"
            onChange={handelEmail}
            required
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Verification Code */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Verification Code"
              value={code}
              name="code"
              onChange={handelCode}
              className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="button"
              onClick={verifyCode}
              className="bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700"
            >
              Verify
            </button>
          </div>

          {/* Password (shown after verification) */}
          {isVerified && (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                name="password"
                placeholder="Password"
                onChange={handelPassword}
                required
                className="w-full border rounded-xl px-4 py-3 pr-14 outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" > <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" /> </svg>) : ( <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" > <path d="M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z" /> </svg> )}
              </button>
            </div>
          )}

          {/* Register Button */}
          {isVerified && (
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700"
            >
              Register
            </button>
          )}
        </form>
        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Log in
          </button>
        </p>

      </div>
    </div>
  );
}

export default Register;