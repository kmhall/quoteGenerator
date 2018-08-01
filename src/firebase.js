

var productList = [];
var locationList = [];
var insuranceList = [];
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAkGluxBGtgTiwXN6tEehL7gU46-LPgh9s",
    authDomain: "project-potato-71b02.firebaseapp.com",
    databaseURL: "https://project-potato-71b02.firebaseio.com",
    projectId: "project-potato-71b02",
    storageBucket: "project-potato-71b02.appspot.com",
    messagingSenderId: "44453984095"
};

firebase.initializeApp(config);
firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
});
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        console.log("Sign in sucessful")
        var database = firebase.database();

        //Add product information to form
        firebase.database().ref('/products/').once('value').then(function (snapshot) {
            snapshot.forEach(function (child) {
                productList.push(child.val());
            });
            let items = $("#product-names");
            for (var i = 0; i < productList.length; i++) {
                let option = $("<option>").html(productList[i].name).attr('value',productList[i].id);
                items.append(option);
            }
        });
        
        //Add location information to form
        firebase.database().ref('/locations/').once('value').then(function (snapshot) {
            snapshot.forEach(function (child) {
                locationList.push(child.val());
            });
            let items = $("#location-names");
            for (var i = 0; i < locationList.length; i++) {
                let option = $("<option>").html(locationList[i].name);
                items.append(option);
            }
        });

        //Add insurance information to form
         firebase.database().ref('/insurancePlan/').once('value').then(function (snapshot) {
            snapshot.forEach(function (child) {
                insuranceList.push(child.val());
            });
            let items = $("#insurance-names");
            for (var i = 0; i < insuranceList.length; i++) {
                let option = $("<option>").html(insuranceList[i].name);
                items.append(option);
            }
        });

    } else {
        console.log("Sign in unsuccessful")

    }
});

