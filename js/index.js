console.log("connected");

//global variables
var auth = firebase.auth();
var firestore = firebase.firestore();
var signinForm = document.querySelector(".signinFormArea");
var signupForm = document.querySelector(".signupFormArea");
var googleBtn = document.querySelector(".googleSignin");

//WHAT WE DO HERE
/*
-------------------------------------
-collecting user info from form 
-sending info to firebase auth
-using fn 'createUserWithEmailAndPassword', 'signInWithEmailAndPassword' & 'signInWithPopup'
-if new user then storing info to db
    >create user obj
    >firestore query to set userinfo
-if old user then redirect to  next page along with uid in url   
-onAuthStateChange is important  
-------------------------------------
*/

//global functions
// -----------------------------------------------------------------------------------------
// -fetching info from form
// -signUpWithEmailAndPassword 
// -get uid
// -create user obj
// -set to db

var signupWork = async (e) => {
  e.preventDefault();
  try {
    var fullName = document.querySelector(".signupName").value;
    var email = document.querySelector(".signupEmail").value;
    var password = document.querySelector(".signupPassword").value;

    //signing up
    if (fullName && email && password) {
      //ye change kiya he 
      //send userInfo to database
      var userInfo = {
            fullName, //fullName = fullName
            email,
            createdAt: new Date(),
          };
          console.log(userInfo)
          var {
            user: { uid },
          } = await auth.createUserWithEmailAndPassword(email, password);
          await firestore.collection("users").doc(uid).set(userInfo);
    }
  } catch (error) {
    console.log(error);
  }
};


// -singnin with google auth uing GoogleAuthProvider
// -if new user
//      >using .... 'signInWithPopUp'
//      >using... 'isNewUser' we get displaName, uid and email
//- if old user
//      >nothing.... simply redirect to next page with uid in url
var signinWithGoogle = async () => {
  try {
    var googleProvider = new firebase.auth.GoogleAuthProvider();
    var {
      additionalUserInfo: { isNewUser },
      user: { displayName, uid, email },
    } = await firebase.auth().signInWithPopup(googleProvider);
    //agar new user then store details in firestore
    if (isNewUser) {
      //send userInfo to database
      var userInfo = {
        fullName: displayName,
        email,
        createdAt: new Date(),
      };
      await firestore.collection("users").doc(uid).set(userInfo);
    }
  } catch (error) {
    console.log(error.message);
  }
};


// -fetch values from form 
// -get uid from authsetion rom the object 'user >>> uid'
// -using 'signInWithEmailAndPassword' 
// -fetch info from firestore 
// -redirect to next page with uid in url
var signinWork = async (e) => {
  e.preventDefault();
  try {
    var email = document.querySelector(".singinEmail").value;
    var password = document.querySelector(".singinPassword").value;

    //signin in
    if (email && password) {
      var {
        user: { uid },
      } = await auth.signInWithEmailAndPassword(email, password);
    }

  } catch (error) {
    console.log(error.message);
  }
};


//LI S T E N E R S
signinForm.addEventListener("submit", (e) => signinWork(e)); 
signupForm.addEventListener("submit", (e) => signupWork(e));
googleBtn.addEventListener("click", signinWithGoogle);


// AUTH LISTENER 
// -this listener with trigger on ollowin conditions
//      > when page reloads
//      > On sign In  i.e. auth state change
//      > on Sign Out i.e. auth state change

auth.onAuthStateChanged(async (user) => {
  try {
    if (user) {
     var {uid} = user;
     setTimeout(() => {
        location.assign(`./dashboard.html#${uid}`) 
     }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
});

// //ARRAY / OBJECT DESTRUCTURING
// var [n4,n5,n6] = [4,5,6]
// console.log(n4,n5,n6)

// //obect
// var student = {
//     name:'Ali',
//     age: 44,
//     courses: {
//         subOne: 'Maths',
//         subTwo: "Isl."
//     }
// }

// var {name, age, courses: {subOne,subTwo}} = student
// var{name, agr, courses} = student
// console.log(courses)
// console.log(name,age,subOne,subTwo)
