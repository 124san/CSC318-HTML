function toggle_panel() {
    var x = document.getElementById("action_select");
    if (x.className === "d-none") {
        x.className = "d-flex flex-column";
    } else {
        x.className = "d-none"; 
    }
}