/*
-------------------------------------------
-render page data 
    > render user info 
    > render trasactions
-add transaction via transaction form
-------------------------------------------

*/

//global variables
console.log("dashboard");
var auth = firebase.auth();
var firestore = firebase.firestore();
var nameDiv = document.querySelector(".name p");
var signoutBtn = document.querySelector(".signoutBtn");
var transactionForm = document.querySelector(".transactionForm");
var transactionList = document.querySelector(".transactionList");
var sortBy = document.querySelector(".sortBy");
var deleteBtn = document.querySelector(".deleteTransaction")
var arrayToSort = []
var uid = null;



// ----------------------- helper Functions -------------------------------------
//signout
var userSignOut = async () => {
  await auth.signOut();
};

var deleteTransaction = async (id) => {
  console.log("hi")
  console.log(id)
  await firestore.collection("transactions").doc(id).delete()
  renderTransaction(uid)


}

//Sorting transactionsArr on 2 basis Cost & Date
var sorting = (e) => {
console.log(e.target.value)
 
arrayToSort.forEach(arr => console.log(arr.transactionAt.toDate()))
  if(e.target.value === 'costDowngrade')
    arrayToSort = arrayToSort.sort((a, b) =>  parseFloat(b.cost) - parseFloat(a.cost));
  else if(e.target.value === 'costUpgrade')
    arrayToSort = arrayToSort.sort((a, b) =>  parseFloat(a.cost) - parseFloat(b.cost));
  else if(sortBy.value === "dateDowngrade")
    arrayToSort = arrayToSort.sort((a, b) =>  b.transactionAt.toDate() - a.transactionAt.toDate());
  else if(sortBy.value === "dateUpgrade")
    arrayToSort = arrayToSort.sort((a, b) =>  a.transactionAt.toDate() - b.transactionAt.toDate());
  setupUi(arrayToSort)
} 

//capitalize first charater of transactionTitle
var capitalize = (title) => {
  return title.charAt(0).toUpperCase() + title.slice(1)
}


//convert higher values into "k"
var converIntoK = (num) => {
  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

// convert numeric date into month name
var dateModelling = (date) => {
  var day = date.toDate().getDate()
  day = day < 9 ? "0"+day : day;
  var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.toDate().getMonth()];
  month = month.substring(0,3)
  date =`${day} ${month} ${date.toDate().getFullYear()}`;
  return date
}


//fetching data through uid
var fetchingUserData = async (uid) => {
  try {
    var userInfo = await firestore.collection("users").doc(uid).get();
    // console.log({userInfo : {uid} })
    return userInfo.data();
  } catch (error) {
    console.log(error.message);
  }
};


//RENDER FUNCTION
//render user info
//fetch user ino from his/her uid
// display user info in navbar
var renderUserInfo = async (uid) => {
  var userInfo = await fetchingUserData(uid);
  //setting user info
  var username = userInfo.fullName
  //truncating long usernames
  nameDiv.textContent = username.length > 15 ? username.substr(0, 15-1) + '...' : username;
};


//fetching transactions
var fetchingTransaction = async (uid) => {
  var transactions = [];
  var query = await firestore
    .collection("transactions")
    .where("transactionBy", "==", uid)
    .orderBy("transactionAt", "desc") //SORTING ("kis cheez ke reference se", "order")
    .get();
  query.forEach((doc) => {
    var element = doc.data();
    element.transactionId = doc.id;
    transactions.push(element);
  });
  arrayToSort = transactions
  return transactions;
};


//Current Balance
var currentBalance = (transArr) => {
  var amountDiv = document.querySelector(".amount h2");
  var currentAMount = 0;
  transArr.forEach((transaction) => {
    var { cost, transactionType } = transaction;
    if (transactionType === "income") {
      currentAMount += cost;
    } else {
      currentAMount -= cost;
    }
  });
  // console.log(currentAMount);
  //regex for comma separated amount after every three digits
  amountDiv.textContent = `PKR ${currentAMount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

//setting up transactions UI
var setupUi = (transactionArr) => {
    //current balacne
    currentBalance(transactionArr);
    //render transactions
    transactionList.innerHTML = "";
    transactionArr.forEach((transaction, index) => {
      var {
        title,
        cost,
        transactionType,
        transactionId,
        transactionAt,
      } = transaction;
      //convert long cost into k
      tempCost = converIntoK(cost)
      tempCost = transactionType === 'expanse' ? `-PKR ${tempCost}` : `PKR ${tempCost}`;
      //convert numeric date into month name
      transactionAt = dateModelling(transactionAt)
      //capitalize 
      title = capitalize(title)
      transactionList.insertAdjacentHTML(
        "beforeend",
        `<div class="transactionListItems">
          <div class="renderIndex renderItems">
            <h1><i class="fas index ${
            transactionType === "income" ? "fa-check" : "fa-times"}"></i></h1> 
          </div>
          <div class="renderTitle renderItems">
            <p><b>${title}</b></p>
          </div>
          <div class="renderCost renderItems">
            <p
            style="color: ${transactionType === "income" ? "green" : "red"}"
            >${tempCost}</p>
          </div>
          <div class="renderTransactionAt renderItems">
            <p>${transactionAt}</p> 
          </div>
          <div class="renderTransactionEdit renderItems">
            <!--- <h1><a href='./transaction.html#${transactionId}'> -->
                <button class="viewBtn">
                  <span class="viewBtnspan">&bullet;&bullet;&bullet;</span>
                  <div class="eidtMenuWrapper flex">
                    <a href='./transaction.html#${transactionId}'> <div class="editTransaction">edit</div> </a>
                    <div class="deleteBtn"><span onclick="deleteTransaction(id)" id=${transactionId}>delete</span></div>
                  </div>
                </button>
            <!-- </h1></a> -->
          </div>
        </div>`
      );
    });
}


// ------------------------------------ Main Functions Below -----------------------------------
//fetch user transactions
//calculate current amount on behlaf o transactions
//display current amount on navbar
//display transaction list
var renderTransaction = async (uid, transactionArr=[]) => {
  //fetch user transaction
    transactionArr = await fetchingTransaction(uid);
    setupUi(transactionArr)
  // console.log(transactionArr)

};

//add transaction function
//collect from data
// make transaction Object
// send transaction to firstore
//formSubmission
var formSubmission = async (e) => {
  e.preventDefault();
  try {
    // ()
    var title = document.querySelector(".title").value;
    var cost = document.querySelector(".cost").value;
    var transactionType = document.querySelector(".transactionType").value;
    var transactionAt = document.querySelector(".transactionAt").value;
    // console.log(transactionAt)
    if (title && cost && transactionType && transactionAt) {
      var transactionObj = {
        title,
        cost: parseInt(cost),
        transactionType,
        transactionAt: new Date(transactionAt),
        transactionBy: uid,
      };
    }
    await firestore.collection("transactions").add(transactionObj);
    var clearingFields = () => {
      var title = document.querySelector(".title");
      var cost = document.querySelector(".cost");
      var transactionType = document.querySelector(".transactionType");
      var transactionAt = document.querySelector(".transactionAt");
      title.value = "";
      cost.value = "";
      transactionType.value = "";
      transactionAt.value = "";
    };
    clearingFields();
    // RENDER fresh transaction
    renderTransaction(uid);
  } catch (error) {
    console.log(error.message);
  }
};

// fetchingUserData(uid);
//auth listener
auth.onAuthStateChanged(async (user) => {
  try {
    if (user) {
      uid = user.uid;
      //render user info
      renderUserInfo(uid);
      //   render process
      renderTransaction(uid);
    } else {
      // console.log("logged out")
      location.assign("./index.html");
    }
  } catch (error) {
    console.log(error);
  }
});

//listeners
signoutBtn.addEventListener("click", userSignOut);
transactionForm.addEventListener("submit", (e) => formSubmission(e));
sortBy.addEventListener("change", sorting)
// deleteBtn.addEventListener("click", deleteTransaction)