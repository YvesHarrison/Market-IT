
function validationForm(){

    var productname = document.getElementById('eproductup-name').value;
    var tag = document.getElementById('eproductup-tag').value;
    var price = document.getElementById('eproductup-price').value;
    var  quantity = document.getElementById('eproductup-quantity').value;
    var  description = document.getElementById('edescription').value;
    var moreinformation = document.getElementById('emoreinfo').value;
    var image = document.getElementById('eproductimage').value;
    FileUploadPath = image.value;
    //check empty fields
    if(productname == "" )
    {
        alert("Product Name cannnot be empty");
        return;
    }

    if(tag == "" )
    {
        alert("Tag cannnot be empty");
        return;
    }

    if(price == "" )
    {
        alert("Price cannnot be empty");
        return;
    }

    if(quantity == "" && quantity == /[0,9]/g)
    {
        alert("quantity cannnot be empty");
        return;
    }

    if(description == "" )
    {
        alert("Description cannnot be empty");
        return;
    }

    //correct username 
    var str = productname.slice(0,1);
    if(productname.slice(0,1) == "_"|| productname.slice(0,1) == "@" || str.match(/[0,9]/g) != null);
    {
        alert("Invalid Product Name");
        return;
    } 
    }


    //validating image file
    if (FileUploadPath == '') {
        alert("Please upload an image");
    } 
    else {
        var Extension = FileUploadPath.substing(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
        if (Extension == "gif" || Extension == "png" || Extension == "bmp"
        || Extension == "jpeg" || Extension == "jpg") {
            if (image.files && image.files[0]) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    $('#check').attr('src', e.target.result);
                }

                reader.readAsDataURL(image.files[0]);
            }

        } 
        else {
            alert("Photo only allows file types of GIF, PNG, JPG, JPEG and BMP. ");

        }
    }
   

        const errContainer = document.getElementById("error");
        const errTextElement = errContainer.getElementsByClassName(
            "error"
          )[0];
                 

                   

