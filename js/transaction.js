console.log("transaction");
var auth = firebase.auth();
var firestore = firebase.firestore();

var transactionForm = document.querySelector(".transactionForm");
var transactionTitle = document.querySelector(".title");
var transactionCost = document.querySelector(".cost");
var transactionType = document.querySelector(".transactionType");
var transactionTime = document.querySelector(".transactionAt");
var DeleteBtn = document.querySelector(".DeleteBtn");

//fetching ID rom url
var transactionID = location.hash.substring(1, location.hash.length);

var fetchingTransaction = async (transactionID) => {
  var transaction = await firestore
    .collection("transactions")
    .doc(transactionID)
    .get();
  return transaction.data();
};


//edit transaction
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
      var {
        title,
        cost,
        transactionType: transType,
        transactionAt: transAt,
      } = await fetchingTransaction(transactionID);
      var transTime = transAt.toDate().toISOString().split("T")[0];
      //setting initial values
      transactionTitle.value = title;
      transactionCost.value = cost;
      transactionType.value = transType;
      transactionTime.value = transTime;
      console.log(title, cost, transTime, transType);
    } else {
      location.assign("./index.html");
    }
  } catch (error) {
    console.log(error);
  }
});
