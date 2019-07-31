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
        // console.log("PLEASE WORK");
        $.ajax({
            type: "DELETE",
            url: "/delete"
        }).then(function () {
            console.log("Deleted");
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
            console.log("Saved");
            location.reload();
        });
    });
    // });

    // $(function () {
    $("#removeFromSave").on("click", function (e) {
        e.preventDefault();
        let id = $(this).attr("value");
        $.ajax({
            type: "PUT",
            url: "/removeFromSaved/" + id
        }).then(function () {
            console.log("Removed");
            location.reload();
        });
    });

    $("#saveNote").on("click", function (event) {
        event.preventDefault();
        let id = $(this).attr("value");
        let note = { body: $("#newNote").val() };
        console.log(note);
        $.ajax({
            type: "POST",
            url: "/saveNote/" + id,
            data: note
        }).then(function () {
            console.log("Added Note");
            location.reload();
        });
    });

    $(document).on("click", "#notes", function (e) {
        // empty the notes from the note section
        $(".list-group").empty();
        // save the id from the button
        let id = $(this).attr("value");
        console.log(id);

        // GET call for the article
        $.ajax({
            method: "GET",
            url: "/getNotes/" + id
        }).then(function (data) {
            console.log(data);
            $(".list-group").append("<h2>" + data.title + "</h2>");
            $(".list-group").append(`<li class="list-group-item">${data.body}
            <button class="btn btn-danger" value=${data._id} id="deleteNote"> x </button>
            </li>`);
            // if theres a note in the article
            if (data.note) {
                // place the title of the note in the title input
                $("#modalTitle").text("Notes For Article: " + id);
                // place the body of the note in the body textarea
                $(".list-group-item").attr("value", id);
                // $("#saveNote").attr("value", id);
            }

        });
    });

    $(document).on("click", "#deleteNote", function (e) {
        e.preventDefault();
        let noteID = $(this).attr("value");

        $.ajax({
            type: "DELETE",
            url: "/deleteNote/" + noteID
        }).then(function () {
            console.log("Deleted");
            location.reload();
        });
    });
});
