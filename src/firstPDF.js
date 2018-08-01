
let pdfName;
let dat = JSON.parse(atob(window.location.href.split("#")[1]));
loadDat();


window.onmessage = function (e) {
    if (e.data == 'submit') {
   
        pdfName = dat.name + "." + $("#quoteNumber").html()

        console.log("Uploading file to myFiles...")
        createPdf();
        $(".loader").addClass("active")
        $(".loadBox").addClass("active")
        $(".loadText").addClass("active")

    } else {
        onShowpadApiConfig(e.data);
    }
};

function loadDat() {
    let date = new Date();
    $('#quoteCreated').html(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`);
    date.setDate(date.getDate() + 30);
    $('#quoteExpires').html(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`);
    $('.productName').html(dat.name);
    $("#quoteNumber").html(Math.floor(Math.random() * 1000) + 1);

    $("#from").html("Chicago");
    $("#to").html(dat.location);
    $("#insurance").html(dat.insurancePlan);

    $("#basePrice").html("$" + Number(dat.unitPrice).toFixed(2));
    if (dat.adjPrice) {
        $('#adjustedPrice').html("$" + Number(dat.adjPrice).toFixed(2));
    }
    $("#quantity").html(dat.quantity + " units");
    $("#grandTotal").html(`$${((dat.adjPrice ? Number(dat.adjPrice) : dat.unitPrice) * Number(dat.quantity)).toFixed(2)}`);

}



'use strict';
let pdfDocBlob = null;
let apiConfig = null;

function onShowpadApiConfig(config) {
    apiConfig = config;
    console.log(apiConfig)
}
//WORKING CONDITIONS: Showpad will only allow the upload of a quote as a .png through the Showpad Javascript Api, using the PDF uploader. The file can be shared and viewed as a .png through Showpad, but cannot be downloaded 
//                    and viewed as a png... However, if the downloaded file's extension is changed to a .pdf, it is viewable on your local machine. This pdf can be uploaded into cloud storage (ie. Google Drive)
//                    and can be viewed as a .pdf. What this leads us to beleive is that Showpad's uploader is super strict about what generates a PDF. For example, we have used our exact same code to upload a downloadable/viewable pdf
//                    that simply contains text, but when the contents of our pdf is an image the uploader thinks the file extension should be a .png.
function createPdf() {
    if (pdfDocBlob == null) {
        html2canvas(document.html).then(canvas => {
            //Canvas converted into a .png
            dataUrl = canvas.toDataURL(),
                imageFoo = document.createElement('img');
            imageFoo.src = dataUrl;

            var doc = new jsPDF("p", "mm", "a4");

            var width = doc.internal.pageSize.width;
            var height = doc.internal.pageSize.height;


            doc.addImage(imageFoo, 'PDF', 0, 0, width, height);

            pdfDocBlob = doc.output('blob');
            console.log(pdfDocBlob);

            // doc.save(`${pdfName}.pdf`);

            uploadPdf();
        });
    }
}

function uploadPdf() {
    const url = `${apiConfig.url}/api/v3/divisions/mine/assets.json`;
    const formData = new FormData();

    // The third argument needs to have the correct file-extension!
    formData.append('file', pdfDocBlob, `${pdfName}.png`);
    formData.append('isPersonal', 'true');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${apiConfig.accessToken}`);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            const json = JSON.parse(xhr.responseText);
            if (json.response && json.response.resourcetype === 'Ticket') {
                console.log(json.response.id)

                pollTicket(json.response.id);
            }
            //END LOADING VISUALIZATION, POP UP SAYING UPLOAD COMPLETE
            $(".loader").removeAttr("class","active")
            $("svg").css("display","block");
            $(".loadText").html("Upload Complete")
            console.log("Upload Complete");
          
        }
    };

    xhr.send(formData);
}

function pollTicket(id) {
    const url = `${apiConfig.url}/api/v3/tickets/${id}.json`;
    const config = {
        headers: {
            'Authorization': `Bearer ${apiConfig.accessToken}`
        }
    };

    fetch(url, config)
        .then(response => response.json())
        .then(json => {
            if (json.response.status) {
                switch (json.response.status) {
                    case 'completed':
                        // File was processed
                        if (json.response.asset && json.response.asset.id) {
                            const assetId = json.response.asset.id;
                            console.log("file processed with asset id: " + assetId);
                            // File was processed
                        }
                        else {
                            // Something else failed
                        }
                        break;
                    case 'queued':
                    case 'processing':
                        // Still processing, poll again in 2 seconds
                        setTimeout(() => {
                            pollTicket(id);
                        }, 2000);
                        break;
                    case 'failed':
                        // File processing failed..
                        break;
                }
            }
        });
}