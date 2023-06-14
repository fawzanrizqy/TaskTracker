const {User, Profile} = require("../models")
const bcrypt = require('bcryptjs');

class UserController
{

    static renderLogin(req,res)
    {
        const errors = req.query.errors;
        res.render("login",{errors});
    }

    static postLogin(req,res)
    {
        const {username, password} = req.body
        User.findOne({
            where: {
                username: username
            }
        })
        .then(user=>{
            if(user)
            {
                const validPass = bcrypt.compareSync(password, user.password);

                if(validPass)
                {
                    req.session.userid = user.id;
                    req.session.username = user.username;
                    req.session.role = user.role;
                    res.redirect("/home");
                }
                else
                {
                    res.redirect("/login?errors=invalid username or password");
                }
            }
            else
            {
                res.redirect("/login?errors=invalid username or password");
            }
        })
        .catch(err=>{
            if(err.name = "SequelizeValidationError")
            {
                let dataErr = err.errors.map(er =>{
                    return er.message;
                })
                res.redirect(`/login?errors=${dataErr}`);
            }
           else
           {
                res.send(err);
           }
        })
    }
    
    static renderRegister(req,res)
    {
        const errors = req.query.errors;
        res.render("register", {errors});
    }

    static postRegister(req,res)
    {
        let data;
        const {username, password, name, role } = req.body;
        User.create({username, password, role })
        .then(dataUser=>{
            data = dataUser;
            return Profile.create({name, UserId: data.dataValues.id, ClassroomId: null})
        })
        .then(()=>{
            res.redirect("/");
        })
        .catch(err=>{
            if(err.name = "SequelizeValidationError")
            {
                let dataErr = err.errors.map(er =>{
                    return er.message;
                })
                res.redirect(`/register?errors=${dataErr}`);
            }
           else
           {
                res.send(err);
           }
        });

    }

    static renderHome(req,res)
    {
        console.log(req.session);
        res.send("MASHOK PAK EKO")
    }
}

module.exports = UserController;