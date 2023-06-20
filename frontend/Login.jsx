import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {

    const [values, setValues] = useState({
        name: '',
        password: ''
    })
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    const [error, setError] = useState('')
    const handleSubmit = (event) => {
        event.preventDefault();
       // console.log(values);
        axios.post('http://localhost:8081/login', values)
        .then(res => { 
            //console.log(res.data.Status);
           // const id = result[0].id;
           
             if(res.data.Status === 'Super Admin') {
               navigate('/Dashboard');
             } 
             else if (res.data.Status==="admin"){
                 navigate('/User_details');
             }  
             else if(res.data.Status==="user"){
                navigate('/Lu_details');
             } 
             else{
                alert("username or password is incorrect")
             }
        })
        .catch(err => console.log(err));
    }

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="text"><strong>Name</strong></label>
                        <input type="text" placeholder='Enter Name' name='name' 
                          onChange={e => setValues({...values, name: e.target.value})} className='form-control rounded-0' autoComplete='off'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name='password'
                        onChange={e => setValues({...values, password: e.target.value})} className='form-control rounded-0' />
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'> Log in</button>
                    
                </form>
            </div>
        </div>
    )
}

export default Login