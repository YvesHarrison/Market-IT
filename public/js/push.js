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
                $("#comment-table").append(comment);
            }
        }
    });

});

$('#commentSubmit').click(function () {

    var commBy = $('#commentByID').val();
    var commBody = $('#commentBodyID').val();

    //console.log("commBy", commBy);
    //console.log("commBody", commBody);
    var productid = document.getElementById('commentSubmit').value;
    $.ajax({
        url: productid + '/detail/comments',
        type: 'POST',
        data: {
            commentBody: commBody,
            commentBy: commBy
        },
        success: function (data) {
            //console.log("data",data);
            const comment=`<tr><td>${data.commentBy}</td><td>${data.commentBody}</td><td>${data.createdAt}</td></tr>`;
            $("#comment-table").append(comment);
            // Add it to the comments section
            // var template = $('template').html();
            // var HBlock = template.replace(/{cB1}/g, data.commentBy,/{cB2}/g, data.commBody,/{cB3}/g, data.createdAt);
            // $('.comments-section').prepend(HBlock);
            // var HBlock = template.replace(/{cB2}/g, data.commBody);
            // $('.comments-section').prepend(HBlock);
            // var HBlock = template.replace(/{cB3}/g, data.createdAt);
            // $('.comments-section').prepend(HBlock);
        }
    });


});