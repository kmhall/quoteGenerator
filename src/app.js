//Validate that all fields are filled
var checkoutTotal = [false, false, false, false, false];


var quoteTemplate = {
    name: "",
    unitPrice: "",
    adjPrice: "",
    quantity: "",
    location: "",
    insurancePlan: "",
}

//Check for a change in the selected item
$("#product-names").change(function () {
    //If the selected item is not the first item
    if (this.value != 'Select an Item') {
        //Find a product with a matching id from the product list
        for (var i = 0; i < productList.length; i++) {
            if (productList[i].name == this.value) {
                quoteTemplate.name = productList[i].name;
                quoteTemplate.unitPrice = productList[i].price;

                //Populate the Base Price field with the appropriate value
                checkoutTotal[0] = true;
                $("#product-price").attr("placeholder", `$${Number(productList[i].price).toFixed(2)}`);
            }
        }
    } else if (this.value == 'Select an Item') {
        checkoutTotal[0] = false;
        $("#product-price").attr("placeholder", "")
    }
    testCheckout(checkoutTotal)
});

$("#quantity").change(function () {
    //If the selected item is not the first item
    if (this.value != '') {
        quoteTemplate.quantity = this.value;
        checkoutTotal[1] = true;
    }
    else if (this.value == '') {
        checkoutTotal[1] = false;

    }
    testCheckout(checkoutTotal)
});

//Check for a change in the selected item
$("#location-names").change(function () {
    //If the selected item is not the first item
    if (this.value != 'Select a Location') {
        checkoutTotal[2] = true;
        quoteTemplate.location = this.value;
    }
    else if (this.value == 'Select a Location') {
        checkoutTotal[2] = false;

    }
    testCheckout(checkoutTotal)
});

$("#insurance-names").change(function () {
    //If the selected item is not the first item
    if (this.value != 'Select a Plan') {
        quoteTemplate.insurancePlan = this.value;
        checkoutTotal[3] = true;

    }
    else if (this.value == 'Select a Plan') {
        checkoutTotal[3] = false;

    }
    testCheckout(checkoutTotal)
});

$("#adj-price").change(function () {
    //If the selected item is not the first item
    if (this.value != '') {
        quoteTemplate.adjPrice = this.value;

        checkoutTotal[4] = true;
    }
    else if (this.value == '') {
        checkoutTotal[4] = false;

    }

    testCheckout(checkoutTotal)
});

$("#adj-price").blur(function () {
    x = $("#adj-price").val()

    if (x.includes("$")) {

    }
    else {
        $("#adj-price").val(`$${Number(x).toFixed(2)}`)
    }

});



//If checkout is true, change the button to have an active class and return JSON tree of user inputs.
function testCheckout(checkoutTotal) {
    if (checkoutTotal[0] == true && checkoutTotal[1] == true && checkoutTotal[2] == true && checkoutTotal[3] == true) {
        $("#getQuote").attr("class", "active");
        $("#getQuote").attr("onclick", "displayForm()");
    }
    else {
        $("#getQuote").removeAttr("class", "active");
        $("#getQuote").removeAttr("onclick", "displayForm()");

    }

}

function submitPDF() {
    var myIframe = document.getElementById("myFrame");
    window.ShowpadLib.getShowpadApi((dat) => { myIframe.contentWindow.postMessage(dat, '*') });
    window.setTimeout(() => { myIframe.contentWindow.postMessage('submit', '*') }, 1000);
}

function removeModal() {
    $("#quoteGoesHere").removeAttr("class", "active");
    $("#edit").removeAttr("class", "active");
    $("#submit").removeAttr("class", "active");
    $("#colorOverlay").removeAttr("class", "active");
    $("#myFrame").remove();
}


function displayForm() {
    var b64 = btoa(JSON.stringify(quoteTemplate));
    $("#quoteGoesHere").attr("class", "active");
    $("#edit").attr("class", "active");
    $("#submit").attr("class", "active");
    $("#colorOverlay").attr("class", "active");

    $("#myFrame").remove();
    $('<iframe>', {
        src: `firstPDF.html#${b64}`,
        id: 'myFrame',
        width: "677",
        height: "760",
        frameborder: 5,
        scrolling: 'no'
    }).appendTo('#quoteGoesHere');
}


//Functions to display modal that allows users to add products

var newProduct = [false, false];

function addProduct() {
    $("#colorOverlay").attr("class", "active");
    $(".loadBox").css("display", "block");

}

$("#productName").change(function () {
    //If the selected item is not the first item
    if (this.value != '') {
        newProduct[0] = true;
    }
    else if (this.value == '') {
        newProduct[0] = false;

    }

    testProduct(checkoutTotal)
});

$("#productPrice").change(function () {
    //If the selected item is not the first item
    if (!isNaN(this.value.trim())) {
        newProduct[1] = true;
        $("#productPrice").val(`$${Number(this.value).toFixed(2)}`)
    }
    else {
        newProduct[1] = false;
    }

    testProduct(checkoutTotal)
});

function testProduct(checkoutTotal) {
    if (newProduct[0] == true && newProduct[1] == true) {
        $("#pushProduct").attr("class", "active");
        $("#pushProduct").attr("onclick", "pushProduct()");
    }
    else {
        $("#pushProduct").removeAttr("class", "active");
        $("#pushProduct").removeAttr("onclick", "pushProduct()");
    }
}


function pushProduct() {
    productName = $("#productName").val()
    productPrice = $("#productPrice").val().slice(1)

    productName = productName.charAt(0).toUpperCase() + productName.slice(1);


    firebase.database().ref(`products/${productName}`).update({
        name: productName,
        price: productPrice
    });

    //Reset to non active state
    productName = $("#productName").val("")
    productPrice = $("#productPrice").val("")

    $("#pushProduct").removeAttr("class", "active");
    $("#pushProduct").removeAttr("onclick", "pushProduct()");

    location.reload();
}

function back() {
    $("#colorOverlay").removeAttr("class", "active");
    $(".loadBox").css("display", "none");

}

