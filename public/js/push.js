$(function () {
    var productid = document.getElementById('commentSubmit').value;
    console.log(productid);
    //Populate the comments section!
    $.ajax({
        url: productid + '/detail/comment',
        type: 'POST',
        data:{pro_id:productid},
        success: function (data) {
            //console.log("refresh",data);
            // // Quick and dirty custom jQuery templating
            // var template = $('template').html();
            // $.each(data, function (index, value) {
            //     var HBlock = template.replace(/{cB}/g, value.commentBody);
            //     $('.comments-section').prepend(HBlock);

            // });
            for(let i=0;i<data.length;++i){
                var comment=`<tr><td>${data[i].commentBy}</td><td>${data[i].commentBody}</td><td>${data[i].createdAt}</td></tr>`;
                var comment2= `<div class="col-sm-12"><div class="panel panel-default"><div class="panel-heading"><strong>${data[i].commentBy}</strong> <span class="text-muted">commented on ${data[i].createdAt}</span></div><div class="panel-body">${data[i].commentBody}</div></div></div>`
                $("#comment-table").append(comment2);
            }
        }
    });

});

$('#commentSubmit').click(function () {

    
    var commBody = $('#commentBodyID').val();

    //console.log("commBy", commBy);
    //console.log("commBody", commBody);
    var productid = document.getElementById('commentSubmit').value;
    $.ajax({
        url: productid + '/detail/comments',
        type: 'POST',
        data: {
            commentBody: commBody
        },
        success: function (data) {
            if(data.commentBy){

                var comment2= `<div class="col-sm-12"><div class="panel panel-default"><div class="panel-heading"><strong>${data.commentBy}</strong> <span class="text-muted">commented on ${data.createdAt}</span></div><div class="panel-body">${data.commentBody}</div></div></div>`
                const comment=`<tr><td>${data.commentBy}</td><td>${data.commentBody}</td><td>${data.createdAt}</td></tr>`;
                $("#comment-table").append(comment2);
            }
            else{
                $("#error").show();
                $("#error").html("Please login before make a comment!");
                $('#commentBodyID').focus();
            }
        }
    });


});