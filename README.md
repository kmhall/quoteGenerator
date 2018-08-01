# Project Title

Quote Generator

## Getting Started

There are two ways too see the project fully working:

Follow the Showpad SDK Documentation for setup directions: https://kmhall.github.io/resume/projects/documentationExample/index.html


1.Uploaded the file "a.3.0.5.showpad" as an experience app through showpad

2.Add a ".showpadconfig.json" file to the src folder containing your credentials:


{
    "host": "",
    "client_id": "",
    "client_secret": "",
    "username": "",
    "password": ""
}

### Working Condition

Showpad will only allow the upload of a quote as a .png through Showpad's Javascript Api. Through Showpad, the file can be shared and viewed as a .png, but cannot be downloaded 
and viewed as a png. However, if the downloaded file's extension is changed to a .pdf it is viewable. This PDF can be uploaded into cloud storage (ie. Google Drive)
and can be viewed as a PDF. What this leads us to beleive is that Showpad's uploader is super strict about uploading a PDF. For example, we have used our exact same code to upload a downloadable/viewable PDF that contains only text. Issues arise When the contents of a PDF are beyond plain text. If the contents are an attached img(.png), then Showpad's uploader gets hungup and never uploads. 

### Dependencies

Firebase

jsPDF

html2canvas
