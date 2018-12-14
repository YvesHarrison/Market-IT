function show_error(contain) {
    $("#error").show();
    $("#error").html(contain);
    
}

function validationForm1(ele_id) {
    
        var productname = document.getElementById('eproductup-name').value;
        var tag = document.getElementById('eproductup-tag').value;
        var price = document.getElementById('eproductup-price').value;
        var quantity = document.getElementById('eproductup-quantity').value;
        var description = document.getElementById('edescription').value;
        //check empty fields
        console.log("tag");
        if (productname == "") {
            alert("Description cannnot be empty");
            show_error("Product Name cannnot be empty");
            return false;
        }

        if (tag == "") {
            alert("Description cannnot be empty");
            show_error("Tag Cannot be empty");
            return false;
        }

        if (price == "") {
            throw "Price cannnot be empty";
        }

        if (quantity == "" && quantity == /[0,9]/g) {
            throw "quantity cannnot be empty";
        }

        //correct username 
        var str = productname.slice(0, 1);
        if (productname.slice(0, 1) == "_" || productname.slice(0, 1) == "@" || str.match(/[0,9]/g) != null) {
            throw "Invalid Product Name";
            return false;
        }
    


}