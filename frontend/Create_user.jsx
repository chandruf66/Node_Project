import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Create_user() {
	const [data, setData] = useState({
		name: '',
        role:'user',
		email: '',
		password: '',
        url:'',
        description:''
	})
   // console.log(data.name);
	const navigate = useNavigate()

	const handleSubmit = (event) => {
		event.preventDefault();
        var formdata=[];
        formdata.push({"name":data.name,
                        "role":data.role,
                       "email":data.email,
                       "password":data.password,
                       "url":data.url,
                       "description":data.description
           });

		// const formdata = new FormData();
        console.log(formdata);
		// formdata.append("name", data.name);
        // formdata.append("role", data.role);
		// formdata.append("email", data.email);
		// formdata.append("password", data.password);

		//console.log(formdata);
		axios.post('http://localhost:8081/create', formdata)
		.then(res => {
			navigate('/User_details')
		})
		.catch(err => console.log(err));
	}
	return (
		<div className='d-flex flex-column align-items-center pt-4'>
			<h2>Add User</h2>
			<form class="row g-3 w-50" onSubmit={handleSubmit}>
			<div class="col-12">
					<label for="inputName" class="form-label">Name</label>
					<input type="text" class="form-control" id="inputName" placeholder='Enter Name' autoComplete='off'
					onChange={e => setData({...data, name: e.target.value})}/>
				</div>
                {/* <div class="col-12">
					<label for="inputSalary" class="form-label">Role</label>
					<input type="text" class="form-control" id="inputSalary" placeholder="Enter Role" autoComplete='off'
					onChange={e => setData({...data, role: e.target.value})}/>
				</div> */}
				<div class="col-12">
					<label for="inputEmail4" class="form-label">Email</label>
					<input type="email" class="form-control" id="inputEmail4" placeholder='Enter Email' autoComplete='off'
					onChange={e => setData({...data, email: e.target.value})}/>
				</div>
				<div class="col-12">
					<label for="inputPassword4" class="form-label">Password</label>
					<input type="password" class="form-control" id="inputPassword4" placeholder='Enter Password'
					 onChange={e => setData({...data, password: e.target.value})}/>
				</div>
                <div class="col-12">
					<label for="inputName" class="form-label">Url</label>
					<input type="text" class="form-control" id="inputUrl" placeholder='Enter Url' autoComplete='off'
					onChange={e => setData({...data, url: e.target.value})}/>
				</div>
                <div class="col-12">
					<label for="inputName" class="form-label">Description</label>
					<input type="text" class="form-control" id="inputUrl" placeholder='Enter Description' autoComplete='off'
					onChange={e => setData({...data, description: e.target.value})}/>
				</div>
				
				
				<div class="col-12">
					<button type="submit" class="btn btn-primary">Create</button>
				</div>
			</form>
		</div>

	)
}

export default Create_user