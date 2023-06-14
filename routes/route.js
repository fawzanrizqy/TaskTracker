const express = require("express");
const UserController = require("../controllers/UserController");
const Controller = require("../controllers/controller");
const router = express.Router();

const ceklogin = function (req,res,next)
{
if(req.session.userid)
{
    res.redirect('/home');
}
else
{
    next();
}
}

router.get('/', (req,res)=>{
    res.redirect('/login');
});

router.get('/login',ceklogin, UserController.renderLogin)
router.post('/login', UserController.postLogin)
router.get('/register',ceklogin, UserController.renderRegister)
router.post('/register', UserController.postRegister)


router.use((req, res, next) => {
    if(!req.session.userid)
    {
        res.redirect("/login?errors=Please Login First!")
    }
    else
    {
        next()
    }
  })

  router.get('/logout', (req,res)=>{
    if (req.session) {
        req.session.destroy();
        res.redirect('/login');
      }
  })

  router.get('/home', (req,res)=>{
    if(req.session.role === "mentor")
    {
        res.redirect('/mentors');
    }
    else
    {
        res.redirect('/students');
    }
})


const cekStudent = function (req,res,next)
{
if(req.session.role === "mentor")
{
    res.redirect('/home');
}
else
{
    next();
}
}

const cekMentor = function (req,res,next)
{
if(req.session.role === "student")
{
    res.redirect('/home');
}
else
{
    next();
}
}

router.get('/mentors',cekMentor, Controller.renderMentor)
router.get('/mentors/classrooms/add',cekMentor, Controller.renderAddClass)
router.post('/mentors/classrooms/add', Controller.postAddClass)
router.get('/mentors/classrooms/addstudents/:id',cekMentor, Controller.renderAddClassStudent)
router.get('/mentors/classrooms/addstudents/:id/add/:idStudent',cekMentor, Controller.addStudent)
router.get('/mentors/classrooms/addstudents/:id/remove/:idStudent',cekMentor, Controller.removeStudent)
router.get('/mentors/classrooms/addstudents/:id/delete',cekMentor, Controller.deleteClass)
router.get('/mentors/tasks',cekMentor, Controller.renderTask)
router.get('/mentors/tasks/add',cekMentor, Controller.addTask)
router.post('/mentors/tasks/add', Controller.postTask)
router.get('/mentors/tasks/grade/:id',cekMentor, Controller.gradeTask)
router.post('/mentors/tasks/grade/:id', Controller.gradeTaskPost)
router.get('/mentors/tasks/delete/:id',cekMentor, Controller.deleteTask)
///////////////////////////route students///////////////////////////
router.get('/students',cekStudent, Controller.renderStudent)
router.get('/students/progress',cekStudent, Controller.progressStudent)
router.get('/students/assign/:id/:idStudent',cekStudent, Controller.renderTaskStudent)
router.get('/students/CP/:id',cekStudent, Controller.renderStudentCP)
router.get('/students/CP/:id/done',cekStudent, Controller.StudentCPDone)

module.exports = router;