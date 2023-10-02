document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const img = document.getElementById("");
    const close = document.getElementById("close");

    img.addEventListener("click", function () {
        modal.style.display = "block";
    });

    close.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
