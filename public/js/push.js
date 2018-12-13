$(function () {

    // Populate the comments section!
    $.ajax({
        url: '/detail',
        type: 'GET',
        success: function (data) {
            // Quick and dirty custom jQuery templating
            var template = $('template').html();
            $.each(data, function (index, value) {
                var HBlock = template.replace(/{cB}/g, value.commentBody);
                $('.comments-section').prepend(HBlock);

            });

        }
    });

});

$('#commentSubmit').click(function () {

    var commBy = $('#commentByID').val();
    var commBody = $('#commentBodyID').val();

    console.log("commBy", commBy);
    console.log("commBody", commBody);
    var productid = document.getElementById('commentSubmit').value;
    $.ajax({
        url: productid + '/detail/comments',
        type: 'POST',
        data: {
            commentBody: commBody,
            commentBy: commBy
        },
        success: function (data) {

            // Add it to the comments section
            var template = $('template').html();
            var HBlock = template.replace(/{cB}/g, commBody);
            $('.comments-section').prepend(HBlock);
        }
    });


});