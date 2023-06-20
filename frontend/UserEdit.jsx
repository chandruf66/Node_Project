import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function UserEdit() {
	const [data, setData] = useState({
		name: '',
		email: '',
		role: '',
		password: '',
        url:'',
        description:''
	})
	const navigate = useNavigate()
	
	const {id} = useParams();

	useEffect(()=> {
		axios.get('http://localhost:8081/get/'+id)
		.then(res => {
            console.log(res);
            if(res.data.Result.length<=0){ 
                alert("super admin cant be modified ");
                navigate("/Dashboard");
                //next();
            }
			setData({...data, name: res.data.Result[0].name,
				email: res.data.Result[0].email,
				address: res.data.Result[0].password,
				role: res.data.Result[0].role,
                url:res.data.Result[0].url,
                description:res.data.Result[0].description
			})
		})
		.catch(err =>console.log(err));
	}, [])

	const handleSubmit = (event) => {
		event.preventDefault();
		axios.put('http://localhost:8081/update/'+id, data)
		.then(res => {
			if(res.data.Status === "Success") {
				navigate('/Dashboard')
			}
		})
		.catch(err => console.log(err));
	}
  return (
    <div className='d-flex flex-column align-items-center pt-4'>
			<h2>Update User</h2>
			<form class="row g-3 w-50" onSubmit={handleSubmit}>
			<div class="col-12">
					<label for="inputName" class="form-label">Name</label>
					<input type="text" class="form-control" id="inputName" placeholder='Enter Name' autoComplete='off'
					onChange={e => setData({...data, name: e.target.value})} value={data.name}/>
				</div>
                <div class="col-12">
					<label for="inputSalary" class="form-label">Role</label>
					<input type="text" class="form-control" id="inputSalary" placeholder="Enter Role" autoComplete='off'
					onChange={e => setData({...data, role: e.target.value})} value={data.role}/>
				</div>
				<div class="col-12">
					<label for="inputEmail4" class="form-label">Email</label>
					<input type="email" class="form-control" id="inputEmail4" placeholder='Enter Email' autoComplete='off'
					onChange={e => setData({...data, email: e.target.value})} value={data.email}/>
				</div>
				<div class="col-12">
					<label for="inputAddress" class="form-label">Password</label>
					<input type="password" class="form-control" id="inputAddress" placeholder="1234 Main St" autoComplete='off'
					onChange={e => setData({...data, password: e.target.value})} />
				</div>
                <div class="col-12">
					<label for="inputSalary" class="form-label">Url</label>
					<input type="text" class="form-control" id="inputSalary" placeholder="Enter Url" autoComplete='off'
					onChange={e => setData({...data, url: e.target.value})} value={data.url}/>
				</div>
                <div class="col-12">
					<label for="inputSalary" class="form-label">Description</label>
					<input type="text" class="form-control" id="inputSalary" placeholder="Enter Description" autoComplete='off'
					onChange={e => setData({...data, description: e.target.value})} value={data.description}/>
				</div>
				<div class="col-12">
					<button type="submit" class="btn btn-primary">Update</button>
				</div>
			</form>
		</div>
  )
}

export default UserEdit