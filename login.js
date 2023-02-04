
const express=require("express")
const mysql=require("mysql")
const path=require("path")
const dotenv=require("dotenv")
const app=express();
const bodyParser=require("body-parser");
const connection=mysql.createConnection({
  host:"localhost",
 port:1324,
  database:"login_db",
  password:"20july",
  user:"root"
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//on the signup page
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"login.html"));
})

//getting user input from sign up page
app.post("/signup",(req,res)=>{
 
var email=req.body.email
var username=req.body.username
var image=req.body.image
var password=req.body.password
//storing them in the database and going to login page
connection.query('INSERT INTO user_table (username,useremail,userpassword,image) values(?,?,?,?)',[username,email,password,image],(error)=>{
    if (error) {
        console.error(error)
        res.status(500).send('An error occurred, please try again later.')
        return
    }
    res.sendFile(path.join(__dirname,"nodejs-login.html"));
})
 })
//getting the loginpage
 app.get("/signup",(req,res)=>{
    res.sendFile(path.join(__dirname,"nodejs_login.html"));
})


//get input from login page
 app.post("/login",(req,res)=>{
    let email=req.body.email;
    let password=req.body.password;
    console.log(email,password)
//compare them with the data in database
    connection.query('SELECT * FROM user_table where useremail= ? and userpassword= ?',[email,password],(err,result)=>{
        if(err){
          console.error(err);
          res.status(500).send('An error occurred, please try again later.');
          return;
        }
       else if(result.length > 0){
        console.log(result);
          for(i=0; i<result.length; i++){
            
            if(result[i].useremail === email && result[i].userpassword === password){
              res.redirect("/welcome");
              console.log(result[i].useremail)
            }
          }
        } else {
            res.write("not exist")
          res.sendFile(path.join(__dirname,"./nodejs-login.html"));
        }
      });
          
       //after loging in page to update data
    })
    app.get('/welcome',(req,res) => {
      res.sendFile(path.join(__dirname,"./update.html"))
     })
         app.post("/welcome",(req,res)=>{
           let usernewname=req.body.username
         let username=req.body.usernam
         let email=req.body.email;
         let password=req.body.password;
         console.log(email,password)
     
     connection.query(`UPDATE user_table SET useremail="${email}",userpassword="${password}",username="${usernewname}"  WHERE username="${username}"`)
     res.redirect("/delete");
         })
     
     
//delleting account
    app.get("/delete",(req,res)=>{
        res.sendFile(path.join(__dirname,"/home.html"))
    })
app.post('/delete',(req,res)=>{
  let username=req.body.usernam
  connection.query( `DELETE FROM user_table WHERE username="${username}"`)
  res.redirect("/afterDeletion")
})
app.get('/afterDeletion',(req,res)=>{
  res.sendFile(path.join(__dirname,"/delete.html"))
})
//back to sign up page after deleting
app.post("/afterDeletion",(req,res)=>{
  res.sendFile(path.join(__dirname,"./login.html"))
})



app.listen(9000,()=>{
    console.log("server is listening on 3007");
})



