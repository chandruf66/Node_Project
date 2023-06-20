import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import path from 'path'
import { log } from 'console'
import * as fs from 'fs';


const LOG_DIRECTORY = 'logs';
const LOG_FILE_PREFIX = 'log_';
const LOG_FILE_EXTENSION = '.txt';
const LOG_FILE_DURATION = 5 * 60 * 100; // 5 minutes in milliseconds
const LOG_FILE_DELETE_DURATION = 30 * 100 * 100; // 30 minutes in milliseconds

function createLogFile() {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const logFilename = `${LOG_FILE_PREFIX}${LOG_FILE_EXTENSION}`;
    const logFilePath = path.join(LOG_DIRECTORY, logFilename);
    
    fs.writeFileSync(logFilePath, '');
    
    return logFilePath;
  }

  function deleteOldLogs() {
    const files = fs.readdirSync(LOG_DIRECTORY);
    const currentTime = Date.now();
    
    for (const file of files) {
      const filePath = path.join(LOG_DIRECTORY, file);
      const { birthtimeMs } = fs.statSync(filePath);
      
      if (currentTime - birthtimeMs > LOG_FILE_DELETE_DURATION) {
        fs.unlinkSync(filePath);
      }
    }
  }
  function deletelogs(){
    deleteOldLogs();
    setTimeout(deletelogs, 5000);
}


deletelogs();



  const logFilePath = createLogFile();
  if (!fs.existsSync(LOG_DIRECTORY)) {
    fs.mkdirSync(LOG_DIRECTORY);
  }
  function writeToLog(logFilePath, message) {
    const logEntry = `${new Date().toISOString()}: ${message} \n`;
    
    fs.appendFileSync(logFilePath, logEntry);
  }
 
  function getRecentLogs() {
    const files = fs.readdirSync(LOG_DIRECTORY);
    const currentTime = Date.now();
    const recentLogs = [];
    
    for (const file of files) {
      const filePath = path.join(LOG_DIRECTORY, file);
      const { birthtimeMs } = fs.statSync(filePath);
      
      if (currentTime - birthtimeMs <= LOG_FILE_DURATION) {
        const logContent = fs.readFileSync(filePath, 'utf8');
        recentLogs.push(logContent);
      }
    }
    
    return recentLogs;
  }

const app = express();
app.use(cors(
    {
        origin: ["http://localhost:5173"],
        methods: ["POST", "GET", "PUT","DELETE"],
        credentials: true
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "user_feed"
})


con.connect(function(err) {
    if(err) {
        console.log("Error in Connection!!");
    } else {
        console.log("Connected");
    }
})

app.get('/getEmployee', (req, res) => {
    const sql = "SELECT user.id,user.name,user.email,user.role,feed.id,feed.name,feed.url,feed.description FROM user,feed where user.id=feed.id";
    con.query(sql, (err, result) => {
        if(err){
            console.log(err);
            return res.json({Error: "Get user error in sql"});
        } 
        else{
            let res2="admin list accessed";
            writeToLog(logFilePath,res2);
            console.log(result);
            return res.json({Status: "Success", Result: result})
        }       
    })
})

app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT user.id,user.name,user.email,user.role,feed.id,feed.name,feed.url,feed.description FROM user,feed where user.id=? and NOT role='Super Admin'";
   // const sql = "SELECT * FROM user where id = ? and NOT role='Super Admin'";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: err});
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/getu/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM user where id = ? and NOT role='Super Admin' and NOT role='admin'";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/getlog', (req, res) => {
    const recentLogs = getRecentLogs();
    console.log(recentLogs); 
    return res.json({log:recentLogs})
})

app.put('/update/:id', (req, res) => {
    console.log(req.body);
    
    const id=req.params.id;
    const sql = "UPDATE user set name=?, role = ?, email=?, password=? WHERE id = ?";
    con.query(sql, [ req.body.name,req.body.role, req.body.email,req.body.password,id], (err, result) => {
        if(err){
            console.log(err);
            return res.json({Error: "update employee error in sql"});
        } 
        else{
            let res2=id+" upadted by "+req.body.name;
            writeToLog(logFilePath,res2);
            return res.json({Status: "Success"})
        }    
    })
})


app.put('/update_u/:id', (req, res) => {
   // console.log(req.body);
    const id=req.params.id;
    const sql = "UPDATE user set name=?, role = ?, email=?, password=? WHERE id = ?";
    const sql1 = "UPDATE feed set name=?, url = ?, description=? WHERE id = ?";
    con.query(sql, [ req.body.name,req.body.role, req.body.email,req.body.password,id], (err, result) => {
        if(err){
            console.log(err);
            return res.json({Error: "update employee error in sql"});
        } 
        else{
            let res2=id+" upadted by "+req.body.name;
            writeToLog(logFilePath,res2);
            con.query(sql1, [req.body.name,req.body.url, req.body.description,id], (err, result) => {
                if(err){
                    console.log(err);
                }
                else{
                    console.log(result);
                }
            })
            return res.json({Status: "Success"})
        }    
    })
})

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
   // console.log(id);
    const sql = "Delete FROM user WHERE id = ? and NOT role='Super Admin'";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "delete employee error in sql"});
        else{
            let res2=id+" deleted";
            writeToLog(logFilePath,res2);
            return res.json({Status: "Success"})
        }
       
    })
})

app.delete('/delete_l/:id', (req, res) => {
    const id = req.params.id;
   // console.log(id);
    const sql = "Delete FROM user WHERE id = ? and NOT role='Super Admin' and NOT role='admin'";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "delete employee error in sql"});
        else{
            let res2=id+" deleted";
            writeToLog(logFilePath,res2);
            return res.json({Status: "Success"})
        }
        
    })
})
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({Error: "You are no Authenticated"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) return res.json({Error: "Token wrong"});
            req.role = decoded.role;
            req.id = decoded.id;
            next();
        } )
    }
}

app.get('/dashboard',verifyUser, (req, res) => {
    return res.json({Status: "Success", role: req.role, id: req.id})
})



app.get('/getUser', (req, res) => {
   // console.log("getuser");
    const sql = "SELECT user.id,user.name,user.email,user.role,feed.id,feed.name,feed.url,feed.description FROM user,feed where NOT role='Super Admin' and NOT role='admin' and user.id=feed.id";
   // const sql = "Select * from user where NOT role='Super Admin'";
    con.query(sql, (err, result) => {
        if(err){
            console.log(err);
            return res.json({Error: "Error in runnig query"});
        } 
        else{
          //  console.log(result);
         
            return res.json(result);
        }
       
    })
})

app.get('/getLUser', (req, res) => {
    // console.log("getuser");
    const sql = "SELECT user.id,user.name,user.email,user.role,feed.id,feed.name,feed.url,feed.description FROM user,feed where NOT role='Super Admin' and NOT role='admin' and user.id=feed.id";
  //  const sql = "Select * from user where NOT role='Super Admin' and NOT role='admin'";
     con.query(sql, (err, result) => {
         if(err){
             console.log(err);
             return res.json({Error: "Error in runnig query"});
         } 
         else{
           //  console.log(result);
           let res2=" user list accessed";
           writeToLog(logFilePath, res2);
             return res.json(result);
         }
        
     })
 })
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM user Where name = ? AND  password = ?";
    con.query(sql, [req.body.name, req.body.password], (err, result) => {
        if(err) return res.json({Status: "Error", Error: "Error in runnig query"});
        if(result.length > 0) {
         let res1=result[0].role;
         let res2=result[0].name+" logged in";
         writeToLog(logFilePath, res2);
         if(result[0].role=="Super Admin"){
            const token = jwt.sign({role: "Super Admin"}, "jwt-secret-key", {expiresIn: '1d'});
            res.cookie('token', token);
            console.log(token);

         }
         else if(result[0].role=="admin"){
            const token = jwt.sign({role: "admin"}, "jwt-secret-key", {expiresIn: '1d'});
            res.cookie('token', token);
         }
        else if(result[0].role=="user"){
            const token = jwt.sign({role: "user"}, "jwt-secret-key", {expiresIn: '1d'});
            res.cookie('token', token);
        }
        return res.json({Status:res1})

        } 
        else {
            return res.json({Status: "Error", Error: "Wrong Email or Password"});
        }
    })
})

app.post('/create',(req, res) => {
     console.log(req.body);
    // console.log(req.body[0].role);
    const sql = "INSERT INTO user (`name`,`role`,`email`,`password`) VALUES (?)";
    const sql1 = "INSERT INTO feed (`name`,`url`,`description`) VALUES (?)";
    const values = [
        req.body[0].name,
        req.body[0].role,
        req.body[0].email,
        req.body[0].password
    ]
    const val1=[
        req.body[0].name,
        req.body[0].url,
        req.body[0].description
    ]
   // console.log(values);
    con.query(sql, [values], (err, result) => {
        if(err){
            console.log(err);
            return res.json({Error: "Inside singup query"});
        } 
        else{
           // console.log(res);
            con.query(sql1,[val1],(err1,result1)=>{
                if(err1){
                        console.log(err1);
                }
                else{
                    console.log("success");
                }
            })
            let res2=req.body[0].name+" created";
            writeToLog(logFilePath, res2);
            return res.json({Status: "Success"});
        }
        
    })
       
})

app.post('/employeelogin', (req, res) => {
    const sql = "SELECT * FROM employee Where email = ?";
    con.query(sql, [req.body.email], (err, result) => {
        if(err) return res.json({Status: "Error", Error: "Error in runnig query"});
        if(result.length > 0) {
            bcrypt.compare(req.body.password.toString(), result[0].password, (err, response)=> {
                if(err) return res.json({Error: "password error"});
                if(response) {
                    const token = jwt.sign({role: "employee", id: result[0].id}, "jwt-secret-key", {expiresIn: '1d'});
                    res.cookie('token', token);
                    return res.json({Status: "Success", id: result[0].id})
                } else {
                    return res.json({Status: "Error", Error: "Wrong Email or Password"});
                }
                
            })
            
        } else {
            return res.json({Status: "Error", Error: "Wrong Email or Password"});
        }
    })
})



app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})

app.listen(8081, ()=> {
    console.log("Running");
})