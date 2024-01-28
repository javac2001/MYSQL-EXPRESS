const express = require("express");
const app = express();
const path = require("path");
// const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid'); //uuidv4();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));


// MYSQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'user_details',
    password: '19@debian#62'
});

// Listen Port
const port = 8080;
app.listen(port, (req, res) => {
    console.log(`Listening port ${port}`);
});

// Home Route
app.get('/', (req, res) => {
    res.render("home.ejs");
});
// Create Route
app.get("/userdata/create-user", (req, res) => {
    res.render("create.ejs");
});
app.post("/userdata/create-user", (req, res) => {
    let id = uuidv4();
    let { username: formUser, email: formEmail, password: formPassword } = req.body;
    let q = `insert into user (id, username, email, password) values ("${id}","${formUser}","${formEmail}","${formPassword}")`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log("Added user");
            res.redirect("/userdata");
        });
    } catch (error) {
        console.log("ERROR")
        console.log(error);
        res.send("ERROR")
    }
});
// Read Route
app.get("/userdata", (req, res) => {
    let q = `select * from user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let usersLength = result.length;
            res.render("read.ejs", { result, usersLength });

        });
    } catch (error) {
        console.log("ERROR")
        console.log(error);
        res.send("ERROR")
    }
})
// Update Route'
app.get("/userdata/update/:id", (req, res) => {
    let { id } = req.params;
    let q = `select * from user where id = "${id}"`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("update.ejs", { user });
            console.log(user);
        });
    } catch (error) {
        console.log("ERROR")
        console.log(error);
        res.send("ERROR");
    }
});
app.patch("/userdata/:id", (req, res) => {
    let { id } = req.params;
    let qOne = `select * from user where id = "${id}"`;
    let { pasword: previousPassword, new: newPassword } = req.body;
    try {
        connection.query(qOne,(err, result)=>{
            if(err) throw err;
            let qTwo = `update user set password ="${newPassword}" where id="${id}"`;
            let userPw = result[0].password;
            if(userPw !== previousPassword){
                res.send("ERROR");
            }else{
                connection.query(qTwo,(err, result)=>{
                    if(err) throw err;
                    res.redirect("/userdata");
                    console.log("UPDATED");
                    console.log(result);
                });
            }
        });
    } catch (error) {
        console.log("ERROR")
        console.log(error);
        res.send("ERROR");
    }
});
// Delete Route
app.get("/userdata/delete-user/:id", (req, res) => {
    let { id } = req.params;
    let q = `select * from user where id = "${id}"`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("delete.ejs", { user });
            console.log(user);
        });
    } catch (error) {
        console.log("ERROR")
        console.log(error);
        res.send("ERROR")
    }
});
app.delete("/userdata/:id", (req, res) => {
    let { id } = req.params;
    let qOne = `select * from user where id = "${id}"`;
    try {
        connection.query(qOne, (err, result) => {
            if (err) throw err;
            let user = result[0];
            let { password } = req.body;
            if (password !== user.password) {
                res.send("Error");
            } else {
                let qTwo = `delete from user where password = "${user.password}"`;
                connection.query(qTwo, (err, result) => {
                    if (err) throw err;
                    console.log("deleted");
                    res.redirect("/userdata");
                });
            }
        });
    } catch (error) {
        console.log("ERROR")
        console.log(error);
        res.send("ERROR")
    }
});








//   ---------------------------------- Inserting Data in MySql ----------------------------------

// let createRandomUser = () =>{
//     return [
//         faker.string.uuid(),
//         faker.internet.userName(),
//         faker.internet.email(),
//         faker.internet.password()
//     ];
// }

// let queryInsert = `insert into user (id, username, email, password) values ?`;

// let userData = [];
// for(let i=0; i<10; i++){
//     userData.push(createRandomUser());
// };

// connection.query(queryInsert,[userData],(err, result)=>{
//     if(err) throw err;

// });
// connection.end()