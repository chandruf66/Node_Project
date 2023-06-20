import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [data, setData] = useState([])

  useEffect(()=> {
    axios.get('http://localhost:8081/getEmployee')
    .then(res => {
      if(res.data.Status === "Success") {
        setData(res.data.Result);
      } else {
        alert("Error")
      }
    })
    .catch(err => console.log(err));
  }, [])

  const handleDelete = (id) => {
    axios.delete('http://localhost:8081/delete/'+id)
    .then(res => {
      if(res.data.Status === "Success") {
        window.location.reload(true);
      } else {
        alert("Error")
      }
    })
    .catch(err => console.log(err));
  }
  const handleGet = (id) => {
    axios.get('http://localhost:8081/getlog/')
    .then(res => {
      if(res.data.log) {
       alert(res.data.log);
      } else {
        alert("Error")
      }
    })
    .catch(err => console.log(err));
  }

  const navigate = useNavigate()
  axios.defaults.withCredentials = true;
  useEffect(()=>{
      axios.get('http://localhost:8081/dashboard')
      .then(res => {
          if(res.data.Status === "Success") {
              if(res.data.role === "admin") {
                  navigate('/User_details');
              } else if(res.data.role=="Super Admin") {
                 // const id = res.data.id;
                  navigate('/Dashboard/')
              }
              else if(res.data.role=="user"){
                navigate('/Lu_details')
              }
          } else {
              navigate('/')
          }
      })
  }, [])

  const handleLogout = () => {
      axios.get('http://localhost:8081/logout')
      .then(res => {
          navigate('/')
      }).catch(err => console.log(err));
  }

  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>User Details</h3>
      </div>
      <Link to="/Create" className='btn btn-success'>Create Admin or User</Link>
      <button onClick={e => handleGet()} className='btn btn-sm btn-danger'>Get_Log_Details</button>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>role</th>
              <th>Email</th>
              <th>Url</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee, index) => {
              return <tr key={index}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.role}</td>
                  <td>{employee.email}</td>
                  <td>{employee.url}</td>
                  <td>{employee.description}</td>
                  <td>
                    <Link to={`/UserEdit/`+employee.id} className='btn btn-primary btn-sm me-2'>edit</Link>
                    <button onClick={e => handleDelete(employee.id)} className='btn btn-sm btn-danger'>delete</button>
                  </td>
              </tr>
            })}
          </tbody>
        </table>
        <button onClick={e => handleLogout()} className='btn btn-sm btn-danger'>Log out</button>
      </div>
    </div>
  )
}

export default Dashboard