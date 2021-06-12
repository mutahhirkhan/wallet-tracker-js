/* 
-------------------------------------------
-fetch specific transaction
-fill form inital  values
-allow user to edit transaction or delete
-------------------------------------------

*/


//globals
console.log("transaction");
var auth = firebase.auth();
var firestore = firebase.firestore();

var transactionForm = document.querySelector(".transactionForm");
var transactionTitle = document.querySelector(".title");
var transactionCost = document.querySelector(".cost");
var transactionType = document.querySelector(".transactionType");
var transactionTime = document.querySelector(".transactionAt");
var DeleteBtn = document.querySelector(".DeleteBtn");

//fetching ID from url
var transactionID = location.hash.substring(1, location.hash.length);

//fetch speciic transaction
var fetchingTransaction = async (transactionID) => {
  var transaction = await firestore
    .collection("transactions")
    .doc(transactionID)
    .get();
  return transaction.data();
};

var settingUpInitialValues = ({
  title,
  cost,
  transactionType: transType,
  transactionAt: transAt,
}) => {
  var transTime = transAt.toDate().toISOString().split("T")[0];
  //setting initial values
  transactionTitle.value = title;
  transactionCost.value = cost;
  transactionType.value = transType;
  transactionTime.value = transTime;

}

//edit transaction
//collect data rom firestore 
//make transaction ob
//update details to firestore
//redirect to dashboard
var editFormHandler = async (e, transactionID) => {
  e.preventDefault();
  try {
    var updatedTitle = transactionTitle.value;
    var updatedCost = transactionCost.value;
    var updatedType = transactionType.value;
    var updatedTransactionAt = transactionTime.value;
    console.log(updatedCost, updatedTitle, updatedTransactionAt, updatedType);

    var updatedDoc = {
      title: updatedTitle,
      cost: parseInt(updatedCost),
      transactionType: updatedType,
      transactionAt: new Date(updatedTransactionAt),
    };
    await firestore
      .collection("transactions")
      .doc(transactionID)
      .update(updatedDoc);
    location.assign("./dashboard.html");
  } catch (error) {
    console.log(error);
  }
};

//delete transaction
//      B A Q I HE
var deleteTransaction = async (e, transactionID) => {
  e.preventDefault();
  try {
    await firestore.collection("transactions").doc(transactionID).delete();
    location.assign("./dashboard.html");
  } catch (error) {
    console.log(error);
  }
};

//listeners
transactionForm.addEventListener("submit", (e) => editFormHandler(e, transactionID));
DeleteBtn.addEventListener("click", (e) => deleteTransaction(e, transactionID));

// fetchingUserData(uid);
auth.onAuthStateChanged(async (user) => {
  try {
    if (user) {
      uid = user.uid;
      //form inital values handeling
      var transaction = await fetchingTransaction(transactionID);
       settingUpInitialValues(transaction)
    } else {
      location.assign("./index.html");
    }
  } catch (error) {
    console.log(error);
  }
});
