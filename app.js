const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');


app.use(express.static('public'));
mongoose.connect("mongodb://localhost:27017/attendenceDB",{useNewUrlParser:true});








//SUBJECT SCHEMA
const subjSchema = new mongoose.Schema({
    subjName:String,
    TeacherId:String,
    totalOccured:Number,
    totalAttended:Number
});




// STUDENT DETAILS SCHEMA FOR TEACHER

const studentForTeacherSchema = new mongoose.Schema({
    Department:String,
    Year:String,
    Subject:String
});



//TEACHER SCHEMA
const teacherSchema = new mongoose.Schema({
    fname:String,
    lname:String,
    collegeId:String,
    mobile:String,
    userId:String,
    password:String,
    dept:String,
    stu:[studentForTeacherSchema]
}) ;



//STUDENT SCHEMA
const studentSchema= new mongoose.Schema({
    fname:String,
    lname:String,
    roll:String,
    mobile:String,
    userId:String,
    password:String,
    dept:String,
    sem:String,
    year:String,
    subjs:[subjSchema]

});


//STUDENT LOGIN SCHEMA
const studentLogInSchema=new mongoose.Schema({
    userId:String,
    password:String,
    year:String,
    department:String
});




//STUDENT DETAILS SCHEMA FOR TEACHER model 
const SforT= mongoose.model("SforT",studentForTeacherSchema);




//TEACHER MODEL
const Teacher = mongoose.model("Teacher",teacherSchema);

//subject model
const Subject = mongoose.model("Subject",subjSchema);



//CSE STUDENTS MODEL 
const Cs1Student = mongoose.model("Cs1Student",studentSchema);
const Cs2Student = mongoose.model("Cs2Student",studentSchema);
const Cs3Student = mongoose.model("Cs3Student",studentSchema);
const Cs4Student = mongoose.model("Cs4Student",studentSchema);


// IT STUDENTS MODEL OR DATABASE
const It1Student = mongoose.model("It1Student",studentSchema);
const It2Student = mongoose.model("It2Student",studentSchema);
const It3Student = mongoose.model("It3Student",studentSchema);
const It4Student = mongoose.model("It4Student",studentSchema);

//ECE STUDENTS MODEL OR DATABASES
const ECE1Student = mongoose.model("ECE1Student",studentSchema);
const ECE2Student = mongoose.model("ECE2Student",studentSchema);
const ECE3Student = mongoose.model("ECE3Student",studentSchema);
const ECE4Student = mongoose.model("ECE4Student",studentSchema);

//ME STUDENTS MODEL OR DATABASE 
const Me1Student = mongoose.model("Me1Student",studentSchema);
const Me2Student = mongoose.model("Me2Student",studentSchema);
const Me3Student = mongoose.model("Me3Student",studentSchema);
const Me4Student = mongoose.model("Me4Student",studentSchema);

// EE studens Model or databases
const Ee1Student = mongoose.model("Ee1Student",studentSchema);
const Ee2Student = mongoose.model("Ee2Student",studentSchema);
const Ee3Student = mongoose.model("Ee3Student",studentSchema);
const Ee4Student = mongoose.model("Ee4Student",studentSchema);

//STUDENT LOGIN MODEL
const StudentLogin = mongoose.model("Studentlogin",studentLogInSchema);







//GET CALL FOR HOME
app.get("/",function(req,res){
    res.render("home");
});


//POST CALL FOR HOME


var LoggedInTeacherDetails;
var  LoggedInStudentDetails;
app.post("/",function(req,res)
{
    var userType=req.body.user_type;
    var UserId = req.body.user_id;
    console.log(UserId);
    var pass_word = req.body.Password;

    if(userType=="Admin")
    {
        if(UserId="admin@cemk.ac.in")
        {
            if(pass_word=="admin@123")
            {
                res.redirect("/Admin");
            }else{
                res.render("Error");
            }
           
        }else{
            res.render("Error");
        }
    }
    else if(userType==="Teacher")
    {
        var teacherDetails;
    
        async function fun(){
            teacherDetails = await Teacher.findOne({userId:UserId});
           
            if(teacherDetails.password==pass_word)
         {
            LoggedInTeacherDetails= teacherDetails;
             res.redirect("/TeacherHome");

         }
         else{
            res.render("Error")
         }
            //console.log(password);
        }
        fun();
        
          
          // console.log(pass_word)
         
    }
    else{
        var studentDetails;
        
        async function fun1(){
            studentDetails = await StudentLogin.findOne({userId:UserId});
           // password= await teacherDetails.password;
           // console.log(teacherDetails);
           // console.log(teacherDetails.password);
            if(studentDetails.password===pass_word)
         {
            console.log("Inside Student");
            LoggedInStudentDetails= studentDetails;
             res.redirect("/StudentHome");

         }
         else{
            res.render("Error")
         }
            //console.log(password);
        }
        fun1();
        

    }
        
  

});



//GET CALL FOR ADMIN PAGE
app.get("/Admin",function(req,res){
    res.render("Admin");
});








//ADDING NEW TEACHER GET REQUEST
app.get("/Admin/addTeacher",function(req,res){
   var Teacherlist;
   async function fun(){
       Teacherlist= await Teacher.find({});
       res.render("addTeacher",{newTeachers:Teacherlist});
   }
   fun();
   
});

//ADDING NEW TEACHER POST REQUEST
app.post("/Admin/addTeacher",function(req,res){
    const Fname=_.lowerCase(req.body.firstName);
    console.log(Fname);
     const Lname=_.lowerCase(req.body.lastName);
     const mob=_.lowerCase(req.body.Mobile);
     const depar =_.lowerCase(req.body.Department);
     const collId = req.body.college_Id;
     const uId = req.body.usrId;
     const passrd = req.body.Password;
 
   
     const teacher = new Teacher({
         fname:Fname,
         lname:Lname,
         collegeId:collId,
         mobile:mob,
         userId:uId ,
         password:passrd,
         dept:depar,
     });
     
     async function fun5(){
         await teacher.save();
     }
     fun5();
     res.redirect("/Admin/addTeacher");
});


app.post("/Admin/addTeacher/delete",function(req,res){
    const teacherDelId = req.body.button;

    async function fun(){
        await Teacher.deleteOne({_id:teacherDelId });
    }

    fun();
    res.redirect("/Admin/addTeacher");
})





// SELECTION YEAR AND TOTAL SUBJECT FOR ASSIGNING TEACHER

app.get("/Admin/assignTeacher",function(req,res){
    res.render("assignTeacher");
});


var YEAR;
var DEPARTMENT;
var TOTAL_SUBJECTS;
var SEMESTER;

app.post("/Admin/assignTeacher",function(req,res){

    YEAR = req.body.year;
    DEPARTMENT=req.body.Department;
    TOTAL_SUBJECTS= req.body.totalSubjs;
    SEMESTER = req.body.Semester;
   
    res.redirect("/Admin/assignTeacher/teacherAssigningPage");
    
   
});





//    *****&&&&&& TEACHER ASSIGNING PAGE FOR STUDENT   &&&&&******
app.get("/Admin/assignTeacher/teacherAssigningPage",function(req,res){
   // console.log(YEAR);
   // console.log(DEPARTMENT);
   // console.log(SEMESTER);

    if(DEPARTMENT==="cse")
    {
        switch(YEAR)
        {
            case "first":
                var Slist;
                var Tlist;
                async function fun1(){
                    Slist= await Cs1Student.find({});
                    Tlist= await Teacher.find({"dept":"cse"});

                    res.render("teacherAssigningPage",{newStudentsList:Slist,newTeachersList:Tlist,yr:YEAR,depar:DEPARTMENT,totalSub:TOTAL_SUBJECTS,seme:SEMESTER});
                }
                fun1();
                break;

            case "second":
                var Slist;
                var Tlist;
                async function fun2(){
                    Slist= await Cs2Student.find({});
                    Tlist= await Teacher.find({"dept":"cse"});

                    res.render("teacherAssigningPage",{newStudentsList:Slist,newTeachersList:Tlist,yr:YEAR,depar:DEPARTMENT,totalSub:TOTAL_SUBJECTS,seme:SEMESTER});
                }
                fun2();
                break;

            case "third":
                var Slist;
                var Tlist;
                async function fun3(){
                    Slist= await Cs3Student.find({});
                    Tlist= await Teacher.find({"dept":"cse"});

                    res.render("teacherAssigningPage",{newStudentsList:Slist,newTeachersList:Tlist,yr:YEAR,depar:DEPARTMENT,totalSub:TOTAL_SUBJECTS,seme:SEMESTER});
                }
                fun3();
                break;

            case "fourth":
                var Slist;
                var Tlist;
                async function fun4(){
                    Slist= await Cs4Student.find({});
                    Tlist= await Teacher.find({"dept":"cse"});

                    res.render("teacherAssigningPage",{newStudentsList:Slist,newTeachersList:Tlist,yr:YEAR,depar:DEPARTMENT,totalSub:TOTAL_SUBJECTS,seme:SEMESTER});
                }
                fun4();
                break;
        }
    }
    
});



// TEACHER ASSIGNING PAGE POST REQUEST
app.post("/Admin/assignTeacher/teacherAssigningPage",function(req,res){
console.log(req.body); 
//console.log(req.body.sub+1);
//console.log(req.body['sub' + 1]);

//console.log(req.body.teacher1);


if(DEPARTMENT==="cse")
{
    switch(YEAR)
    {
        case "first":
            var subjectArray=[]; // subject array
            var stuArray =[];  //student details array for teacher schema
            for(var i=1;i<=TOTAL_SUBJECTS;i++)
            {
                var subject=_.lowerCase(req.body['sub'+i]);
                var teacher_id = req.body['teacher'+i];

                const sub_ject = new Subject({
                    subjName:subject,
                    TeacherId:teacher_id,
                    totalOccured:0,
                    totalAttended:0
                });


                 //console.log(sub_ject);
                async function fun8()
                {
                    await sub_ject.save();
                   
                }
                
                fun8()
                subjectArray.push(sub_ject);
                
              

                const S_for_T = new SforT({
                    Department:"cse",
                     Year:"first",
                    Subject:subject
                });

                async function fun9(){
                    await S_for_T.save();
                    
                }
                
                fun9();
                stuArray.push(S_for_T);
                async function fun1(){
                    await Teacher.updateOne({collegeId:teacher_id},{stu:stuArray});
                }

                fun1();

                
            }
            
            async function fun3(){
                await Cs1Student.updateMany({}, { subjs:subjectArray});
            }
            fun3();

            
            break;
        

       
           
    }
    
}









    res.redirect("/Admin/assignTeacher/teacherAssigningPage/success");
});





// ******           SUCCESS PAGE FOR TEACHER ASSIGNING    ******* ////
app.get("/Admin/assignTeacher/teacherAssigningPage/success",function(req,res){
    res.render("successAssign");
})




//GET CALL FOR ADDSTUDENT PAGE UNDER ADMIN
app.get("/Admin/addStudent",function(req,res){
    res.render("addStudent");
});



//GET CALL FOR CSE DEPARTMENT under admin [choose department ]
app.get("/Admin/addStudent/cse",function(req,res){
    res.render("cse");
});



// [choose department]  IT
app.get("/Admin/addStudent/it",function(req,res){
    res.render("it");
});


// [choose department]  ECE
app.get("/Admin/addStudent/ece",function(req,res){
    res.render("ece");
});


// [choose department]  ECE
app.get("/Admin/addStudent/me",function(req,res){
    res.render("me");
})

app.get("/Admin/addStudent/aeie",function(req,res){
    res.render("aeie");
});




 ////    ******* STUDENT CREATING PAGE FOR CSE *******************

app.get("/Admin/addStudent/cse/:year",function(req,res){

    const yr = req.params.year;
    var editStudentDetails = req.query.editStudent;
    if(editStudentDetails===undefined)
    {
        console.log("yes it is undefined");
    }
    else{
       console.log(editStudentDetails);
    }
   
    console.log(yr);
    if(yr==="first")
    {
        
            async function fun(){
                 const foundlist= await Cs1Student.find({});
                 
                 res.render("cseCreateStudent",{newStudents:foundlist,Year:yr,editStudent:editStudentDetails});
             }
          fun();

    }

    else if(yr==="second")
    {
        console.log("yup");
        async function fun(){
            const foundlist= await Cs2Student.find({});
            
            res.render("cseCreateStudent",{newStudents:foundlist,Year:yr,editStudent:editStudentDetails});
        }
     fun();
    }

    else if(yr==="third")
    {
        async function fun(){
            const foundlist= await Cs3Student.find({});
            
            res.render("cseCreateStudent",{newStudents:foundlist,Year:yr,editStudent:editStudentDetails});
        }
     fun();
    }
   else if(yr==="fourth")
   {
        async function fun(){
                const foundlist= await Cs4Student.find({});
        
                 res.render("cseCreateStudent",{newStudents:foundlist,Year:yr,editStudent:editStudentDetails});
                  }
        fun();
   }
       
  
       
    
});



//CREATING STUDENT IN DATABASE IN CSE FIRST YEAR
app.post("/Admin/addStudent/cse/:year",function(req,res){
    
    const yr = req.params.year;
    console.log("Active post");
   // console.log(yr);
    const Fname=_.lowerCase(req.body.firstName);
   console.log(Fname);
    const Lname=_.lowerCase(req.body.lastName);
    const mob=_.lowerCase(req.body.Mobile);
   
    const semester =_.lowerCase(req.body.Semester);
    const rollNo = _.lowerCase(req.body.Roll);
    const dep="cse";
    const uId = req.body.usrId;
    const passrd = req.body.Password;

   
        //   *****   [FIRST YEAR  CSE ] ***
    if(yr==="first"){
        const Year = "first";
        async function fun3()
        {
            var temp = await Cs1Student.find({});
            console.log(temp.length);
            if(temp.length==0 || (temp.length>0 &&  typeof temp[0].subjs==="undefined")){
                const student = new Cs1Student({
                    fname:Fname,
                    lname:Lname,
                    roll:rollNo,

                    mobile:mob,
                    userId:uId ,
                    password:passrd,
                    dept:dep,
                    sem:semester,
                    year: Year,
            
                });
                console.log(student);
    
                await student.save();
            }
            else if(temp[0].subjs.length!=0){    // IT IS for copying subject details 
                const student = new Cs1Student({  //if new admission happean after class alread started
                    fname:Fname,
                    lname:Lname,
                    roll:rollNo,
                    mobile:mob,
                    userId:uId ,
                    password:passrd,
                    dept:dep,
                    sem:semester,
                    year: Year,
                    subjs:temp[0].subjs
            
                });
                await student.save();
            }
        }
    
      
        fun3();
    }

                 //    ******* [SECOND YEAR CSE]  ******
    else if(yr==="second")
    {
        const Year = "second";
        async function fun3()
        {
            var temp = await Cs2Student.find({});
            if(temp.length==0 || (temp.length>0 &&  typeof temp[0].subjs==="undefined") ){
                const student = new Cs2Student({
                    fname:Fname,
                    lname:Lname,
                    roll:rollNo,
                    mobile:mob,
                    userId:uId ,
                    password:passrd,
                    dept:dep,
                    sem:semester,
                    year: Year,
            
                });
    
                await student.save();
            }
            else if(temp[0].subjs.length!=0){    // IT IS for copying subject details 
                const student = new Cs2Student({  //if new admission happean after class alread started
                    fname:Fname,
                    lname:Lname,
                    roll:rollNo,
                    mobile:mob,
                    userId:uId ,
                    password:passrd,
                    dept:dep,
                    sem:semester,
                    year: Year,
                    subjs:temp[0].subjs
            
                });
                await student.save();
            }
        }
    
      
        fun3();
    }

                     //    ******* [THIRD YEAR CSE]  ******
   else if(yr==="third")
   {
    const Year = "third";
    async function fun3()
    {
        var temp = await Cs3Student.find({});
        if(temp.length==0 || (temp.length>0 &&  typeof temp[0].subjs==="undefined")){
            const student = new Cs3Student({
                fname:Fname,
                lname:Lname,
                roll:rollNo,
                mobile:mob,
                userId:uId ,
                password:passrd,
                dept:dep,
                sem:semester,
                year: Year,
        
            });

            await student.save();
        }
        else if(temp[0].subjs.length!=0){    // IT IS for copying subject details 
            const student = new Cs3Student({  //if new admission happean after class alread started
                fname:Fname,
                lname:Lname,
                roll:rollNo,
                mobile:mob,
                userId:uId ,
                password:passrd,
                dept:dep,
                sem:semester,
                year: Year,
                subjs:temp[0].subjs
        
            });
            await student.save();
        }
    }

  
    fun3();
   }
                     //    ******* [4TH YEAR CSE]  ******
   else if(yr==="fourth")
   {
    const Year = "third";
    async function fun3()
    {
        var temp = await Cs4Student.find({});
        if(temp.length==0 || (temp.length>0 &&  typeof temp[0].subjs==="undefined")){
            const student = new Cs4Student({
                fname:Fname,
                lname:Lname,
                roll:rollNo,
                mobile:mob,
                userId:uId ,
                password:passrd,
                dept:dep,
                sem:semester,
                year: Year,
        
            });

            await student.save();
        }
        else if(temp[0].subjs.length!=0){    // IT IS for copying subject details 
            const student = new Cs4Student({  //if new admission happean after class alread started
                fname:Fname,
                lname:Lname,
                roll:rollNo,
                mobile:mob,
                userId:uId ,
                password:passrd,
                dept:dep,
                sem:semester,
                year: Year,
                subjs:temp[0].subjs
        
            });
            await student.save();
        }
    }

  
    fun3();
   }
 
  
   
    const slogin = new StudentLogin({
     userId:uId ,
    password:passrd,
    year:yr,
    department:dep
    
    });
    async function fun2(){
        await slogin.save();
    }
    fun2();
    
    
     
       
  
    res.redirect("/Admin/addStudent/cse/"+yr);


});



// ****    Deleting student details of CSE department **** 
app.post("/Admin/addStudent/cse/:yr/delete",function(req,res){

const del_id = req.body.button;
let year = req.params.yr;
console.log("Inside delete" +year);

if(yr=="first")
{
    async function fun3(){
        await Cs1Student.deleteOne({ _id: del_id});
        }
        fun3();
        
        res.redirect("/Admin/addStudent/cse/first"); 
}
else if(yr==="second")
{
    async function fun3(){
        await Cs2Student.deleteOne({ _id: del_id});
        }
        fun3();
        
        res.redirect("/Admin/addStudent/cse/second"); 
}
else if(yr=="third")
{
    async function fun3(){
        await Cs3Student.deleteOne({ _id: del_id});
        }
        fun3();
        
        res.redirect("/Admin/addStudent/cse/third"); 
}
else{
    async function fun3(){
        await Cs4Student.deleteOne({ _id: del_id});
        }
        fun3();
        
        res.redirect("/Admin/addStudent/cse/fourth"); 
}

});




app.post("/Admin/addStudent/cse/first/edit",function(req,res){
    const del_id = req.body.button;
    async function fun3(){
    const foundStudent = await Cs1Student.findById({ _id: del_id});
    await Cs1Student.deleteOne({ _id: del_id});

    res.redirect(`/Admin/addStudent/cse/first/?editStudent=${foundStudent}`)
}
fun3();
})





      // ***@@@@@####### IT STUDENT CREATION PAGE  $$$$$@@@@@********
       // GET REQUEST 
app.get("/Admin/addStudent/it/:year",function(req,res){

    const yr = req.params.year;
    var editStudentDetails = req.query.editStudent;
    if(editStudentDetails===undefined)
    {
        console.log("yes it is undefined");
    }
    else{
       console.log(editStudentDetails);
    }
   
    console.log(yr);
    if(yr==="first")
    {
        
            async function fun(){
                 const foundlist= await It1Student.find({});
                 
                 res.render("itCreateStudent",{newStudents:foundlist,Year:yr,editStudent:editStudentDetails});
             }
          fun();

    }

    else if(yr==="second")
    {
        console.log("yup");
        async function fun(){
            const foundlist= await It2Student.find({});
            
            res.render("itCreateStudent",{newStudents:foundlist,Year:yr,editStudent:editStudentDetails});
        }
     fun();
    }

    else if(yr==="third")
    {
        async function fun(){
            const foundlist= await It3Student.find({});
            
            res.render("itCreateStudent",{newStudents:foundlist,Year:yr,editStudent:editStudentDetails});
        }
     fun();
    }
   else if(yr==="fourth")
   {
        async function fun(){
                const foundlist= await It4Student.find({});
        
                 res.render("itCreateStudent",{newStudents:foundlist,Year:yr,editStudent:editStudentDetails});
                  }
        fun();
   }
       
  
       
    
});




// IT STUDENT 

//******* STUDENT CREATING PAGE FOR IT *******************

app.post("/Admin/addStudent/it/:year",function(req,res){
    
    const yr = req.params.year;
    console.log("Active post");
   // console.log(yr);
    const Fname=_.lowerCase(req.body.firstName);
   console.log(Fname);
    const Lname=_.lowerCase(req.body.lastName);
    const mob=_.lowerCase(req.body.Mobile);
   
    const semester =_.lowerCase(req.body.Semester);
    const rollNo = _.lowerCase(req.body.Roll);
    const dep="it";
    const uId = req.body.usrId;
    const passrd = req.body.Password;

   
        //   *****   [FIRST YEAR  IT ] ***
    if(yr==="first"){
        const Year = "first";
        async function fun3()
        {
            var temp = await It1Student.find({});
            console.log(temp.length);
            if(temp.length==0 || (temp.length>0 &&  typeof temp[0].subjs==="undefined")){
                const student = new It1Student({
                    fname:Fname,
                    lname:Lname,
                    roll:rollNo,

                    mobile:mob,
                    userId:uId ,
                    password:passrd,
                    dept:dep,
                    sem:semester,
                    year: Year,
            
                });
                console.log(student);
    
                await student.save();
            }
            else if(temp[0].subjs.length!=0){    // IT IS for copying subject details 
                const student = new It1Student({  //if new admission happean after class alread started
                    fname:Fname,
                    lname:Lname,
                    roll:rollNo,
                    mobile:mob,
                    userId:uId ,
                    password:passrd,
                    dept:dep,
                    sem:semester,
                    year: Year,
                    subjs:temp[0].subjs
            
                });
                await student.save();
            }
        }
    
      
        fun3();
    }

                 //    ******* [SECOND YEAR IT]  ******
    else if(yr==="second")
    {
        const Year = "second";
        async function fun3()
        {
            var temp = await It2Student.find({});
            if(temp.length==0 || (temp.length>0 &&  typeof temp[0].subjs==="undefined") ){
                const student = new It2Student({
                    fname:Fname,
                    lname:Lname,
                    roll:rollNo,
                    mobile:mob,
                    userId:uId ,
                    password:passrd,
                    dept:dep,
                    sem:semester,
                    year: Year,
            
                });
    
                await student.save();
            }
            else if(temp[0].subjs.length!=0){    // IT IS for copying subject details 
                const student = new It2Student({  //if new admission happean after class alread started
                    fname:Fname,
                    lname:Lname,
                    roll:rollNo,
                    mobile:mob,
                    userId:uId ,
                    password:passrd,
                    dept:dep,
                    sem:semester,
                    year: Year,
                    subjs:temp[0].subjs
            
                });
                await student.save();
            }
        }
    
      
        fun3();
    }

                     //    ******* [THIRD YEAR IT]  ******
   else if(yr==="third")
   {
    const Year = "third";
    async function fun3()
    {
        var temp = await It3Student.find({});
        if(temp.length==0 || (temp.length>0 &&  typeof temp[0].subjs==="undefined")){
            const student = new It3Student({
                fname:Fname,
                lname:Lname,
                roll:rollNo,
                mobile:mob,
                userId:uId ,
                password:passrd,
                dept:dep,
                sem:semester,
                year: Year,
        
            });

            await student.save();
        }
        else if(temp[0].subjs.length!=0){    // IT IS for copying subject details 
            const student = new It3Student({  //if new admission happean after class alread started
                fname:Fname,
                lname:Lname,
                roll:rollNo,
                mobile:mob,
                userId:uId ,
                password:passrd,
                dept:dep,
                sem:semester,
                year: Year,
                subjs:temp[0].subjs
        
            });
            await student.save();
        }
    }

  
    fun3();
   }
                     //    ******* [4TH YEAR IT]  ******
   else if(yr==="fourth")
   {
    const Year = "third";
    async function fun3()
    {
        var temp = await It4Student.find({});
        if(temp.length==0 || (temp.length>0 &&  typeof temp[0].subjs==="undefined")){
            const student = new It4Student({
                fname:Fname,
                lname:Lname,
                roll:rollNo,
                mobile:mob,
                userId:uId ,
                password:passrd,
                dept:dep,
                sem:semester,
                year: Year,
        
            });

            await student.save();
        }
        else if(temp[0].subjs.length!=0){    // IT IS for copying subject details 
            const student = new It4Student({  //if new admission happean after class alread started
                fname:Fname,
                lname:Lname,
                roll:rollNo,
                mobile:mob,
                userId:uId ,
                password:passrd,
                dept:dep,
                sem:semester,
                year: Year,
                subjs:temp[0].subjs
        
            });
            await student.save();
        }
    }

  
    fun3();
   }
 
  
   
    const slogin = new StudentLogin({
     userId:uId ,
    password:passrd,
    year:yr,
    department:dep
    
    });
    async function fun2(){
        await slogin.save();
    }
    fun2();
    
    
     
       
  
    res.redirect("/Admin/addStudent/it/"+yr);


});




        // ****&&&&& DELETING IT STUDENT DETAILs *******

app.post("/Admin/addStudent/it/:yr/delete",function(req,res){

    const del_id = req.body.button;
    let year = req.params.yr;
    console.log("Inside delete" +year);
    
    if(yr=="first")
    {
        async function fun3(){
            await It1Student.deleteOne({ _id: del_id});
            }
            fun3();
            
            res.redirect("/Admin/addStudent/it/first"); 
    }
    else if(yr==="second")
    {
        async function fun3(){
            await It2Student.deleteOne({ _id: del_id});
            }
            fun3();
            
            res.redirect("/Admin/addStudent/it/second"); 
    }
    else if(yr=="third")
    {
        async function fun3(){
            await It3Student.deleteOne({ _id: del_id});
            }
            fun3();
            
            res.redirect("/Admin/addStudent/it/third"); 
    }
    else{
        async function fun3(){
            await It4Student.deleteOne({ _id: del_id});
            }
            fun3();
            
            res.redirect("/Admin/addStudent/it/fourth"); 
    }
    
    });
    
    
    
    
    app.post("/Admin/addStudent/cse/first/edit",function(req,res){
        const del_id = req.body.button;
        async function fun3(){
        const foundStudent = await Cs1Student.findById({ _id: del_id});
        await Cs1Student.deleteOne({ _id: del_id});
    
        res.redirect(`/Admin/addStudent/cse/first/?editStudent=${foundStudent}`)
    }
    fun3();
    })


















/// $$$$$$********   STARTING OF TEACHER LOG IN PAGE  *********$$$$$$$



//LOGDED IN TEACHER HOME PAGE GET REQUEST

app.get("/TeacherHome",function(req,res){
    //console.log(LoggedInTeacherDetails);
   res.render("TeacherHome");
})




//   *** STUDENT DEATAILS FOR TEACHER GET REQUEST
app.get("/TeacherHome/studentDetail",function(req,res){
    res.render("StudentDetailsForTeacher",{teacherDetails:LoggedInTeacherDetails});
});

app.post("/TeacherHome/studentDetail",function(req,res){
    const stuNo = req.body.button;
    res.redirect(`/TeacherHome/studentDetail/details/?name=${stuNo}`)
});


app.get("/TeacherHome/studentDetail/details",function(req,res){
    let stuNo = parseInt(req.query.name);
    const depart =LoggedInTeacherDetails.stu[stuNo].Department;
    const yr =LoggedInTeacherDetails.stu[stuNo].Year;
    const subj =LoggedInTeacherDetails.stu[stuNo].Subject;
    if(depart=="cse")
    {
        switch(yr)
        {
            case "first":
                var foundlist;
                async function fun(){
                foundlist= await Cs1Student.find({});
                index = foundlist[0].subjs.findIndex(x => x.subjName ===subj);
                 res.render("StuDforTpage",{newStudents:foundlist,subject:subj,year:yr,Index:index});
                 }
                  fun();
   
        }
    }

})





app.get("/TeacherHome/ClassesForAttendence",function(req,res){
    res.render("ClassesForAttendence",{teacherDetails:LoggedInTeacherDetails});
})


app.post("/TeacherHome/ClassesForAttendence",function(req,res){
    const stuNo = req.body.button;
    res.redirect(`/TeacherHome/ClassesForAttendenc/TakeAttendence/?name=${stuNo}`)
});


app.get("/TeacherHome/ClassesForAttendenc/TakeAttendence",function(req,res){
    let stuNo = parseInt(req.query.name);
    //console.log(LoggedInTeacherDetails.stu[stuNo]);
    const depart =LoggedInTeacherDetails.stu[stuNo].Department;
    const yr =LoggedInTeacherDetails.stu[stuNo].Year;
    const subj =LoggedInTeacherDetails.stu[stuNo].Subject;

    if(depart=="cse")
    {
        switch(yr)
        {
            case "first":
                var foundlist;
                async function fun(){
                foundlist= await Cs1Student.find({});
                 res.render("TakeAttendence",{newStudents:foundlist,subject:subj,year:yr});
                 }
                  fun();
   
        }
    }
   
});

app.post("/TeacherHome/ClassesForAttendenc/TakeAttendence",function(req,res){
             var foundlist;
             var attendenceList = req.body;
            var Sub = req.body.sub;
            


           
                async function fun(){
                   
                    foundlist= await Cs1Student.find({});
                    //var id = foundlist[0]._id;
                    //console.log(id);
                    
                   // console.log(attendenceList);
                   // console.log(foundlist[0]._id in attendenceList);

                    for(var i=0;i<foundlist.length;i++)
                    {
                       
                       
                     
                        if(foundlist[i]._id in attendenceList)
                        {
                            console.log(i);
                            

                             await Cs1Student.findOneAndUpdate({_id:foundlist[i]._id,'subjs.subjName':Sub},{
                            
                      
                    
                                
                                $inc : {'subjs.$.totalAttended' : 1,'subjs.$.totalOccured' : 1},
                                
                            });


                           
                        }  

                        else{
                            console.log("It is Else");
                            await Cs1Student.findOneAndUpdate({_id:foundlist[i]._id,'subjs.subjName':Sub},{
                                $inc : {'subjs.$.totalOccured' : 1}
                              });
                        }

                       
                    }

                 

                 }
                  fun();


                  res.render("AttendenceSuccessful");
                  
});






 ///STUDENT LOGIN [STUDENT HOME PAGE]
var StudentTotalDetails;
 app.get("/StudentHome",function(req,res){
    
   // console.log(LoggedInStudentDetails);
    
    const usrId = LoggedInStudentDetails.userId;
 
    if(LoggedInStudentDetails.department==="cse")
    {
        switch(LoggedInStudentDetails.year)
        {
            case "first":
              
                async function fun1()
                {
                    const studentDetails = await Cs1Student.findOne({userId:usrId});
                    StudentTotalDetails=studentDetails;
                   res.render("StudentHome",{foundedStudent:studentDetails});
                }
                fun1();
        }
    }
 });

 app.get("/StudentHome/viewAttendence",function(req,res){

    res.render("viewAttendenceForStudent",{foundedStudent: StudentTotalDetails});
 })

app.listen(4000,function()
{
    console.log("Port is runnnig at 4000")
})