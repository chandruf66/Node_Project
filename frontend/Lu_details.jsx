import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


function Lu_details() {
  const [data, setData] = useState([])

  useEffect(()=> {
    axios.get('http://localhost:8081/getLUser')
    .then(res => {
       console.log(res.data[0]);
      if(res.data.length>0) {
        setData(res.data);
      } else {
        alert("Error")
      }
    })
    .catch(err => console.log(err));
  }, [])

  const handleDelete = (id) => {
    axios.delete('http://localhost:8081/delete_l/'+id)
    .then(res => {
      if(res.data.Status === "Success") {
        window.location.reload(true);
      } else {
        alert("Error")
      }
    })
    .catch(err => console.log(err));
  }
  const navigate = useNavigate()
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
      {/* <Link to="/Create_user" className='btn btn-success'>User Details</Link> */}
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
                  {/* <td>
                    <Link to={`/LU_Edit/`+employee.id} className='btn btn-primary btn-sm me-2'>edit</Link>
                    <button onClick={e => handleDelete(employee.id)} className='btn btn-sm btn-danger'>delete</button>
                  </td>   */}
              </tr>
            })}
          </tbody>
        </table>
        <button onClick={e => handleLogout()} className='btn btn-sm btn-danger'>Log out</button>
      </div>
    </div>
  )
}

export default Lu_details