/**
 * Toggle the visibility of an element given ID
 * @param {*} elementID id of the element
 * @param {*} className class name of the element, default is empty
 */
function toggleUI(elementID, className="") {
    var x = document.getElementById(elementID);
    if (x.className === "d-none") {
        x.className = className;
    } else {
        x.className = "d-none"; 
    }
}