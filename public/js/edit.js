function show_error(contain){
    $("#error").show();
    $("#error").html(contain);
}

function validationForm1(ele_id) {
   try{
    var productname = document.getElementById('eproductup-name').value;
    var tag = document.getElementById('eproductup-tag').value;
    var price = document.getElementById('eproductup-price').value;
    var quantity = document.getElementById('eproductup-quantity').value;
    var description = document.getElementById('edescription').value;
    var moreinformation = document.getElementById('emoreinfo').value;
    //check empty fields
    console.log("tag");
    if (productname == "") {
        throw "Product Name cannnot be empty";
    }

    if (tag == "") {
        throw "Tag cannnot be empty";
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
        return;
    }
    $.ajax({
        method: 'post',
        url: 'http://localhost:3000/products/edit/' + ele_id,
        data:{
            ep_name: productname,
            ep_description: description,
            etags: tag,
            eprice: price,
            equantity:quantity
        },
        success: function () {
            console.log('success');
            window.location.replace("http://localhost:3000/products");
            debugger;
        },
        error: function (e) {
            throw e;
console.log("error");
        }
    });
   }catch(e){
    const message = typeof e === "string" ? e : e.message;
    show_error(e);
   }


}