$(function () {
    $("#scrape").on("click", function (e) {
        e.preventDefault();
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function () {
            location.reload();
        });
    });

    $("#delete").on("click", function (e) {
        console.log("test delete");
        $.ajax({
            type: "DELETE",
            url: "/delete"
        }).then(function () {
            console.log("Articles Deleted");
            location.reload();
        });
    });

    $("#save").on("click", function () {
        let id = $(this).attr("value");
        console.log(id);
        $.ajax({
            type: "PUT",
            url: "/savedArticles" + id
        }).then(function () {
            console.log("Saved article");
            location.reload();
        });
    });
});