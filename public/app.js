$(function () {
    // Scrape on-click event
    $("#scrape").on("click", function (event) {
        event.preventDefault();
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function () {
            location.reload();
        });
    });

    // Delete on-click event
    $("#delete").on("click", function (event) {
        console.log("PLEASE WORK");
        $.ajax({
            type: "DELETE",
            url: "/delete"
        }).then(function () {
            console.log("Deleted articles");
            location.reload();
        });
    });

    // Save on-click event
    $("#save").on("click", function (event) {
        let id = $(this).attr("value");
        console.log(id);
        $.ajax({
            type: "PUT",
            url: "/saveArticle/" + id
        }).then(function () {
            console.log("Saved article");
            location.reload();
        });
    });
});

$(function () {
    $("#removeFromSave").on("click", function (e) {
        e.preventDefault();
        let id = $(this).attr("value");
        $.ajax({
            type: "PUT",
            url: "/removeFromSaved/" + id
        }).then(function () {
            console.log("Removed article from saved.");
            location.reload();
        });
    });

    $("#saveComment").on("click", function (event) {
        event.preventDefault();
        let id = $(this).attr("value");
        let note = { body: $("#newComment").val() };
        console.log(note);
        $.ajax({
            type: "POST",
            url: "/saveComment/" + id,
            data: note
        }).then(function () {
            console.log("Added comment to article");
            location.reload();
        });
    });

    $(document).on("click", "#comments", function (e) {
        let id = $(this).attr("value");
        console.log(id);
        $(".list-group").empty();
        $.ajax({
            type: "GET",
            url: "/getComments/" + id
        }).then(function (data) {
            // console.log(data);
            // console.log(data.notes);
            data.notes.forEach((element, index) => {
                $(".list-group").append(`
                <li class="list-group-item">
                ${element.body}
                <button class="btn btn-danger" value=${element._id} id="deleteComment"> x </button>
            </li> 
                `);
            });
            console.log("test");
            $("#modalTitle").text("Comments for Article: " + id);
            $("#saveComment").attr("value", id);
            //location.reload();
        });
        // $("#commentsModal").modal("show");
    });

    $(document).on("click", "#deleteComment", function (e) {
        e.preventDefault();
        let noteID = $(this).attr("value");

        $.ajax({
            type: "DELETE",
            url: "/deleteComment/" + noteID
        }).then(function () {
            console.log("Deleted comment");
            location.reload();
        });
    });
});
