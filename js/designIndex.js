console.log('connected')
var signupBtn = document.querySelector('#signupBtn')
var signinBtn = document.querySelector("#signinBtn")


var flipFunction = (e) => {
    var container = document.querySelector('#containerid')
    var formsInner = document.querySelector('#formsInnerid')
    e.preventDefault()
    if(e.target.id === "signupBtn"){ 
        formsInner.style.transform = "rotateY(180deg)"
    }
    else if(e.target.id === "signinBtn"){
        formsInner.style.transform = "rotateY(0deg)"
    }
}


signupBtn.addEventListener('click', flipFunction)
signinBtn.addEventListener('click', flipFunction)