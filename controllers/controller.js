const {User, Profile, Classroom, Task, TaskCheckpoint, TaskStudent} = require("../models");
const {Op} = require("sequelize");
const timeAgo = require("../helpers/helper");

class Controller
{
    static renderMentor(req,res)
    {
        Classroom.findAll({
            include:{
                model: User
            },
            where:{
                MentorId: req.session.userid
            }
        })
        .then(data=>{
            res.render("mentor",{data})
        })
        .catch(err=>{
            res.send(err);
        })
    }

    static renderAddClass(req,res)
    {
        const errors = req.query.errors;
        res.render("add-classroom",{errors});
    }
    
    static postAddClass(req,res)
    {
        const {className} = req.body
        Classroom.create({className, MentorId: req.session.userid})
        .then(()=>{
            res.redirect("/mentors");
        })
        .catch(err=>{
            if(err.name = "SequelizeValidationError")
            {
                let dataErr = err.errors.map(er =>{
                    return er.message;
                })
                res.send(dataErr);
            }
           else
           {
                res.send(err);
           }
        })
    }


    static renderAddClassStudent(req,res)
    {
        let data;
        let dataAv;
        let dataUn;

        Classroom.findOne({
            include:{
                model: Profile
            },
            where:{
                id: +req.params.id
            }
        })
        .then(dataClass=>{
            data = dataClass;
            return User.findAll({
                include: {
                    model: Profile,
                    where: {
                        ClassroomId: null
                    }
                },
                where:
                {
                   role: "student" 
                }
            })
        })
        .then(dataSt =>{
            dataAv = dataSt;
            return User.findAll({
                include: {
                    model: Profile,
                    where: {
                        ClassroomId: +req.params.id
                    }
                },
                where:
                {
                   role: "student" 
                }
            })
        })
        .then(dataSt2 =>{
            dataUn = dataSt2;
            console.log(dataAv);
            res.render('classroom-student',{data, dataAv, dataUn});
        })
        .catch(err=>{
            res.send(err);
        })
    }

    static addStudent(req,res)
    {
        Profile.update({
            ClassroomId: +req.params.id,
        }, { where: {
            UserId: +req.params.idStudent
          }
        })
        .then(()=>{
            res.redirect(`/mentors/classrooms/addstudents/${+req.params.id}`);
        })
        .catch(err=>{
            res.send(err);
        })
    }
    
    static removeStudent(req,res)
    {
        Profile.update({
            ClassroomId: null
        }, { where: {
            UserId: +req.params.idStudent
          }
        })
        .then(()=>{
            res.redirect(`/mentors/classrooms/addstudents/${+req.params.id}`);
        })
        .catch(err=>{
            res.send(err);
        })
    }



    static deleteClass(req,res)
    {
        Profile.update({
            ClassroomId: null
        }, { where: {
            ClassroomId: +req.params.id
          }
        })
        .then(()=>{
        return Classroom.destroy({
            where: {
              id: +req.params.id
            }
          })
        })
        .then(()=>{
            res.redirect('/mentors')
        })
        .catch(err=>{
            res.send(err);
        })
    }

    static renderTask(req,res)
    {
        let param = {
            include:{
                model: User
            },
            where:{
                UserId: req.session.userid
            }
        }

        let search = req.query.search
        const errors = req.query.errors;
        if(search)
        {
            param.where = {
                name: {
                    [Op.iLike]: `%${search}%`
                },
            }
        }

        Task.findAll(param)
        .then(data=>{
            res.render("task",{data,errors})
        })
        .catch(err=>{
            res.send(err);
        })
    }

    static addTask(req,res)
    {
        const errors = req.params.errors;
        Classroom.findAll({
            include:{
                model: User
            },
            where:{
                MentorId: req.session.userid
            }
        })
        .then(data=>{
            res.render("task-add",{data,errors})
        })
        .catch(err=>{
            res.send(err);
        })
    }

    static postTask(req,res)
    {
        const {name, ClassroomId, deadline, checkpoint} = req.body
        Task.create({name, ClassroomId, deadline, checkpoint, UserId: req.session.userid})
        .then(()=>{
            res.redirect("/mentors");
        })
        .catch(err=>{
            if(err.name = "SequelizeValidationError")
            {
                let dataErr = err.errors.map(er =>{
                    return er.message;
                })
                res.redirect(`/mentors/tasks?errors=${dataErr}`);
            }
           else
           {
                res.send(err);
           }
        })
    }

    static gradeTask(req,res)
    {
        const id = +req.params.id
        Task.findOne({
            include:{
                model: TaskStudent,
                include:[{
                    model:User,
                    include: {
                        model: Profile
                    }
                },
                {
                    model: TaskCheckpoint
                }
            ]
            },
            where:{
                id: id
            }
        })
        .then(data=>{
            res.render("grade",{data})
        })
        .catch(err=>{
            res.send(err);
        })
    }

    static gradeTaskPost(req,res)
    {
        const id = +req.params.id
        let {idTS, StudentId, grade} = req.body
        
        if(typeof StudentId === "object")
        
        {

        const dataGrade = StudentId.map((elem,index)=>{
            return {id:idTS[index], StudentId: elem, grade: grade[index], TaskId: id}
        })

        TaskStudent.bulkCreate(dataGrade,
            {
              updateOnDuplicate: ["grade"]
            })
            .then(data=>{
                res.redirect(`/mentors/tasks`)
            })
            .catch(err=>{
                res.send(err);
            })
        }
        else
        {
            TaskStudent.update({ grade },
                {
                    where: {
                        StudentId: StudentId,
                        TaskId: id
                    }
                }
                )
            .then(data=>{
                res.redirect(`/mentors/tasks`)
            })
            .catch(err=>{
                res.send(err);
            })
        }
    }


    static deleteTask(req,res)
    {
        Task.destroy({
            where: {
              id: +req.params.id
            }
          })
          .then(data=>{
            res.redirect(`/mentors/tasks`)
        })
        .catch(err=>{
            res.send(err);
        })
    }

 ////////////////////////////////STUDENTS////////////////////////////////////////////

    static renderStudent(req,res)
    {

        Profile.findOne({
            where:{
                UserId: req.session.userid
            }
        })
        .then(dataProf=>{
            return Task.findAll({
                where:{
                    ClassroomId: dataProf.ClassroomId
                }
            })
        })
        .then(data=>{
            const idStudent = +req.session.userid;
            res.render("student",{data, timeAgo, idStudent})
        })
        .catch(err=>{
            res.send(err);
        })
    }

    static renderTaskStudent(req,res)
    {
        const idTask = req.params.id;
        const idStudent = req.params.idStudent;
        let dataTask;
        TaskStudent.checkCreate(idTask,idStudent)
        .then(task=>{
        if(task)
        {
            dataTask = task;
            return dataTask;
        }
        else
        {
            return TaskStudent.create({StudentId: idStudent, TaskId: idTask, grade:0})
        }
       })
       .then(data=>{
        res.redirect(`/students/CP/${data.id}`);
        })
        .catch(err=>{
            res.send(err);
        })
    }

    static renderStudentCP(req,res)
    {
        const idTS = +req.params.id;
        let detailTask;

        TaskStudent.findOne({
            include:[{
                model: Task
            },
            {
                model: TaskCheckpoint
            }
            ],
            
            where:{
                id: idTS
            }
        })
        .then(TS => {
          
            detailTask = TS.Task;

            if (TS.TaskCheckpoints.length !== 0)
            {
                return TaskCheckpoint.findAll({
                    where:{
                        TaskStudentId: idTS
                    }
                })
            }
            else
            {
                let cp = TS.Task.arrCP().map(el=>{
                    return {TaskStudentId:idTS, cp:el, status:false}
                })
               
                return TaskCheckpoint.bulkCreate(cp)
            }
        })
        .then(data=>{
            res.render("student-checkpoint",{data, detailTask});
        })
        .catch(err=>{
            res.send(err);
        })

    }

    static StudentCPDone(req,res)
    {
        TaskCheckpoint.update({
            status: true,
        }, { where: {
            id: +req.params.id
          },
          returning: true
        })
        .then(data =>{
            // console.log(data[1][0].TaskStudentId);
            res.redirect(`/students/CP/${data[1][0].TaskStudentId}`);
        })
        .catch(err=>{
            res.send(err);
        })
    }
    
    static progressStudent(req,res)
    {
        TaskStudent.findAll({
            include:{
                model : Task
            },
            where:{
                StudentId : req.session.userid
            }
        })
        .then(data=>{
            res.render('progress',{data});
        })
        .catch(err=>{
            res.send(err);
        })
        
    }
}

module.exports = Controller