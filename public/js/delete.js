$(document).ready(function () {
    $('.student_delete').on('click', function (e) {
        $target = $(e.target);
        var id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/student/'+id,
            success: function(response){
                alert('deleting student');
                window.location.href ='/student';
            },
            error: function (err) {
                console.log(err);
            }
        });

    });
});