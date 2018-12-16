function show_error(contain){
    $("#error").show();
    $("#error").html(contain);
}

function Validation() {
    var productname = document.getElementById('productup-name').value;
    var tag = document.getElementById('productup-tag').value;
    var price = document.getElementById('productup-price').value;
    var quantity = document.getElementById('productup-quantity').value;
    var description = document.getElementById('description').value;
    var image = document.getElementById('productimage').value;
    var FileUploadPath = image.value;
    //check empty fields
    if (productname == "") {
        alert("Product Name cannnot be empty");
        show_error("Product Name cannnot be empty");
        return false;
    }

    if (tag == "") {
        alert("Tag cannnot be empty");
        show_error("Tag cannnot be empty");
        return false;
    }

    if (price == "") {
        alert("Price cannnot be empty");
        show_error("Price cannnot be empty");
        return false;
    }

    if (quantity == "") {
        alert("quantity cannnot be empty");
        show_error("quantity cannnot be empty");
        return false;
    }

    if (description == "") {
        alert("Description cannnot be empty");
        show_error("Description cannnot be empty");
        return false;
    }

    //correct username 
    var str = productname.slice(0, 1);
    if (productname.slice(0, 1) == "_" || productname.slice(0, 1) == "@" || str.match(/[0,9]/g) != null) {
        alert("Invalid Product Name");
        show_error("Invalid Product Name");
        return false;
    }

    // Validating file
    if (FileUploadPath == '') {
        alert("Please upload an image");
        show_error("Please upload an image");
    } else {
        var Extension = FileUploadPath.substing(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
        if (Extension == "gif" || Extension == "png" || Extension == "bmp" ||
            Extension == "jpeg" || Extension == "jpg") {
            if (image.files && image.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#check').attr('src', e.target.result);
            }

            reader.readAsDataURL(image.files[0]);
        }

        } else {
            alert("Photo only allows file types of GIF, PNG, JPG, JPEG and BMP. ");
            show_error("Photo only allows file types of GIF, PNG, JPG, JPEG and BMP. ");
        }
    }
}



function deleteTab(ele_del, uid) {

    let ele_id = ele_del.value;
    // return ele_id;
    $.ajax({
        method: 'delete',
        url: 'http://localhost:3000/products/delete/' + ele_id,
        success: function () {
            console.log('success');
            window.location.reload();
            debugger;
        },
        error: function (e) {
            console.log('error' + e);

        }
    });
    window.location.reload();
}

