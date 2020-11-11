// Global variables
"use strict";
var firstTimeGuard = true;
var dialogueNext = false;
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

/**
 * Helper function that waits for the player to click next on the guard dialogue
 */
async function nextButton() {
    return new Promise((resolve) => {
        var wait = setInterval(function() {
            if (dialogueNext) {
                clearInterval(wait);
                resolve();
            }
        }, 20);
    });
}

/**
 * This function is called when guard is selected.
 * If guard has not been selected before, a dialogue appears.
 */
async function guard() {
    if (firstTimeGuard) {
        firstTimeGuard = false;
        setUI(false,'action_select', 'd-flex flex-column')
        setUI(true,'dialogue_ui_container')
        setUI(true, 'dialogue_guard')
        await nextButton();
    }
    alert('guard!')
}

// JQuery, handles onclick events of various elemetns
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
    $('div#guard').click(function(){
        dialogueNext = false;
        guard();
    });
    
    $('div#item').click(function(){
        toggleUI('item_select', 'd-flex flex-column')
        toggleUI('back_button')
    });
    $('div#escape').click(function(){
        setUI(false,'action_select', 'd-flex flex-column')
        setUI(true,'dialogue_ui_container')
        setUI(true, 'dialogue_escape')
    });
    $('div#dialogue_next_button').click(function(){
        dialogueNext = true;
        setUI(true,'action_select', 'd-flex flex-column')
        setUI(false, 'dialogue_ui_container')
        setUI(false, 'dialogue_guard')
        setUI(false, 'dialogue_escape')
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
 