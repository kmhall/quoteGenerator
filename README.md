# Project Title

Quote Generator

## Getting Started

To get the quote generator to a fully functioning state, it must be uploaded to Showpad as an experinece app. 

Showpad SDK Documentation: https://kmhall.github.io/resume/projects/documentationExample/index.html

### Working Condition

Showpad will only allow the upload of a quote as a .png through Showpad's Javascript Api. Through Showpad, the file can be shared and viewed as a .png, but cannot be downloaded 
and viewed as a png. However, if the downloaded file's extension is changed to a .pdf it is viewable. This PDF can be uploaded into cloud storage (ie. Google Drive)
and can be viewed as a PDF. What this leads us to beleive is that Showpad's uploader is super strict about uploading a PDF. For example, we have used our exact same code to upload a downloadable/viewable PDF that contains only text. Issues arise When the contents of a PDF are beyond plain text. If the contents are an attached img(.png), then Showpad's uploader gets hungup and never uploads. 

### Dependencies

Firebase

jsPDF

html2canvas
