console.log("connected");
// console.log(firebase)
var auth = firebase.auth();
var firestore = firebase.firestore();
var signinForm = document.querySelector(".signinFormArea");
var signupForm = document.querySelector(".signupFormArea");
var googleBtn = document.querySelector(".googleSignin");
// console.log(signinForm)
// console.log(signupForm)

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
      console.log(userInfo);
      await firestore.collection("users").doc(uid).set(userInfo);
      console.log("done");
      // Redirect todashboard page
      // "/dashboard.html#{uid}"
    } else {
      console.log("welcome");
    //redirect to next page
    location.assign(`./dashboard.html#${uid}`)
    }
  } catch (error) {
    console.log(error.message);
  }
};

var signinWork = async (e) => {
  e.preventDefault();
  try {
    var email = document.querySelector(".singinEmail").value;
    var password = document.querySelector(".singinPassword").value;
    // console.log(email, password)
    //signin in
    if (email && password) {
      var {
        user: { uid },
      } = await auth.signInWithEmailAndPassword(email, password);
      console.log(uid);
    }
    //verification
    var signed = await firestore.collection("users").doc(uid).get();
    console.log(signed.data());

    //redirect to next page
    location.assign(`./dashboard.html#${uid}`)
  } catch (error) {
    console.log(error.message);
  }
};

var signupWork = async (e) => {
  e.preventDefault();
  try {
    var fullName = document.querySelector(".signupName").value;
    var email = document.querySelector(".signupEmail").value;
    var password = document.querySelector(".signupPassword").value;
    // console.log(email, password, FullName)
    //signing up
    if (fullName && email && password) {
      var {
        user: { uid },
      } = await auth.createUserWithEmailAndPassword(email, password);
      console.log(uid);
    }
    //send userInfo to database
    var userInfo = {
      fullName, //fullName = fullName
      email,
      createdAt: new Date(),
    };
    console.log("in process");
    await firestore.collection("users").doc(uid).set(userInfo);
    console.log(userInfo);
    //open the dashboard page

    //redirect to next page
    location.assign(`./dashboard.html#${uid}`)
  } catch (error) {
    console.log(error.message);
  }
};

signinForm.addEventListener("submit", (e) => signinWork(e)); 
signupForm.addEventListener("submit", (e) => signupWork(e));
googleBtn.addEventListener("click", signinWithGoogle);

// //ARRAY / OBECT DESTRUCTURING
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
