console.log('dashboard')
var auth = firebase.auth();
var firestore = firebase.firestore();
var nameDiv = document.querySelector(".name h3")
//fetching uid from url
var uid = location.hash.substring(1,location.hash.length)
console.log(uid)

//fetching data through uid 
var fetchingUserData = async (uid) => {
    try {
        var userInfo = await firestore.collection("users").doc(uid).get();
        // var dateOfCreation = userInfo.data().createdAt.toDate().toISOString().split("T")[0]
        // console.log(dateOfCreation)
        return userInfo.data()
    } catch (error) {
        console.log(error.message)
    }
}
fetchingUserData(uid);
auth.onAuthStateChanged( async (user) => {
    try {
        if (user) {
            var {uid} = user
            var userInfo = await fetchingUserData(uid);
            //setting user info
            //name
            nameDiv.textContent = userInfo.fullName
        } else {
            console.log("logged out")
        }
    } catch (error) {
        console.log(error.message)
    }
})