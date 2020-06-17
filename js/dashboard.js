console.log("dashboard");
var auth = firebase.auth();
var firestore = firebase.firestore();
var nameDiv = document.querySelector(".name h3");
var signoutBtn = document.querySelector(".signoutBtn");
var transactionForm = document.querySelector(".transactionForm");
var transactionList = document.querySelector(".transactionList");

//fetching uid from url
// var uid = location.hash.substring(1,location.hash.length)
var uid = null;
// console.log(uid)

//formSubmission
var formSubmission = async (e) => {
  e.preventDefault();
  try {
    // ()
    var title = document.querySelector(".title").value;
    var cost = document.querySelector(".cost").value;
    var transactionType = document.querySelector(".transactionType").value;
    var transactionAt = document.querySelector(".transactionAt").value;
    if (title && cost && transactionType && transactionAt) {
      var transactionObj = {
        title,
        cost,
        transactionType,
        transactionAt: new Date(transactionAt),
        transactionBy: uid,
      };
    }
    await firestore.collection("transactions").add(transactionObj);

    // RENDER fresh transaction
    //fetch user transactions
    var transactions = await fetchingTransaction(uid);
    //   render process
    renderTransaction(transactions);
  } catch (error) {
    console.log(error.message);
  }
};

//signout
var userSignOut = async () => {
  await auth.signOut();
};

//fetching data through uid
var fetchingUserData = async (uid) => {
  try {
    var userInfo = await firestore.collection("users").doc(uid).get();
    // var dateOfCreation = userInfo.data().createdAt.toDate().toISOString().split("T")[0]
    return userInfo.data();
  } catch (error) {
    console.log(error.message);
  }
};

//rendering transactions
var renderTransaction = (transactionArr) => {
    transactionList.innerHTML = ""
  transactionArr.forEach((transaction, index) => {
    var {
      title,
      cost,
      transactionType,
      transactionId,
      transactionAt,
    } = transaction;
    transactionList.insertAdjacentHTML(
      "beforeend",
      `<div class="transactionListItems">
        <div class="renderIndex renderItems">
          <h1>${++index}</h1>
        </div>
        <div class="renderTitle renderItems">
          <h1>${title}</h1>
        </div>
        <div class="renderCost renderItems">
          <h1>${cost}</h1>
        </div>
        <div class="renderTransactionAt renderItems">
          <h1>${transactionAt.toDate().toISOString().split("T")[0]}</h1>
        </div>
        <div class="renderTransactionAt renderItems">
          <h1><a href='./transaction.html#${transactionId}'> <button>view</button></h1></a>
        </div>
      </div>`
    );
  });
};

//fetching transactions
var fetchingTransaction = async (uid) => {
  var transactions = [];
  var query = await firestore
    .collection("transactions")
    .where("transactionBy", "==", uid)
    .orderBy("transactionAt","desc")        //SORTING ("kis cheez ke reference se", "order")
    .get();
  // console.log(query);
  query.forEach((doc) => {
    var element = doc.data();
    element.transactionId = doc.id;
    transactions.push(element);     
  });
  return transactions;
};

// fetchingUserData(uid);
auth.onAuthStateChanged(async (user) => {
  try {
    if (user) {
      uid = user.uid;
      var userInfo = await fetchingUserData(uid);
      //setting user info
      //name
      nameDiv.textContent = userInfo.fullName;
      // RENDER transaction
      //fetch user transactions
      var transactions = await fetchingTransaction(uid);
      //   render process
      renderTransaction(transactions);
    } else {
      // console.log("logged out")
      location.assign("./index.html");
    }
  } catch (error) {
    console.log(error.message);
  }
});

signoutBtn.addEventListener("click", userSignOut);
transactionForm.addEventListener("submit", (e) => formSubmission(e));
