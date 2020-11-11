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

/**
 * Set UI visibility
 * @param {*} on turn the UI visibility on or off
 * @param {*} elementID id of the element
 * @param {*} className class name of the element, default is empty
 */
function setUI(on, elementID, className="") {
    var x = document.getElementById(elementID);
    if (on) {
        x.className = className;
    } else {
        x.className = "d-none"; 
    }
}

// JQuery
$(document).ready(function(){
    $('div#back_button').click(function(){
        setUI(false,'skill_select', 'd-flex flex-column')
        setUI(false,'item_select', 'd-flex flex-column')
        setUI(true,'action_select', 'd-flex flex-column')
        setUI(false, 'back_button')
    });
    $('div#attack').click(function(){
        alert("attack!");
    });
    $('div#skill').click(function(){
        toggleUI('skill_select', 'd-flex flex-column')
        toggleUI('back_button')
    });
    $('div#item').click(function(){
        toggleUI('item_select', 'd-flex flex-column')
        toggleUI('back_button')
    });
});


/**
 * Mechanism to switch turns. 
 * Takes a callback to execute other things whenever the 
 * turn is supposed to switch.
 */

 function switchTurns(opponentName, callback){
     let topBanner = document.getElementById("turn_counter").innerHTML;
     let newBanner = (topBanner == "Your turn!")? `${opponentName}'s turn!`: "Your turn!";
     document.getElementById("turn_counter").innerHTML = newBanner;
     callback();
 }
 