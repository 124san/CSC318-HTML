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
 * Takes opponent's name and a callback to execute other things whenever the 
 * turn is supposed to switch.
 */

function switchTurns(opponentName, callback){
    callback();
    let topBanner = document.getElementById("turn_counter").innerHTML;
    let newBanner = (topBanner == "Your turn!")? `${opponentName}'s turn!`: "Your turn!";
    document.getElementById("turn_counter").innerHTML = newBanner;
}

class Attack {
    /**
     * A class representing an attack
     * @param {String} name name of the attack
     * @param {int} cost MP cost of the attack
     * @param {int} damage HP damage done to opposing player
     */
    constructor(name, cost, damage){
        this.name = name;
        this.cost = cost;
        this.damage = damage;
    }
}

class Item {
    /**
     * A class to manage all items for a given person.
     * @param {String} name Name of the item.
     * @param {String} type Type of the item.
     * @param {int} hpEffect Effect of the item on player HP
     * @param {int} mpEffect Effect of the item on player MP
     */
    constructor(name, type, hpEffect, mpEffect){
        this.name = name;
        this.type = type;
        this.effect = effect;
    }
}

class Player {
    /**
     * A class that would manage all the HP and MP transactions between combatants.
     * @param {String} name Name of the player
     * @param {int} hp Total health points of the player
     * @param {int} mp Total magic points of the player
     * @param {{Attack}} attackArray Array of valid attacks. 
     * @param {{Item}} itemArray Array of valid items of the player.
     */
    constructor(name, hp, mp, attackArray, itemArray){
        this.name = name;
        this.hp = hp;
        this.mp = mp;
        this.attackArray = attackArray;
        this.itemArray = itemArray;
    }

    /**
     * Implements the attack functionality for both players. 
     * Takes the amount of attack HP to subtract from opponent 
     * and the amount of MP to subtract from you.
     * Also updates the UI, and switches turns. 
     */
    doAttack(opponent, attackName){
        const attack = this.attackArray.filter(attack => attack.name == attackName)[0];
        this.mp -= attack.cost;
        opponent.hp -= attack.damage;
        switchTurns(opponent.name,() => {
            alert(`${this.name} attacked ${opponent.name} using ${attackName}!`);
        });
    }

    guardAttack(opponent, incomingAttack){
        const attack = opponent.attackArray.filter(att => att.name == incomingAttack)[0];
        this.mp -= attack.damage * 0.1;
        switchTurns(this.name, () => {
            alert(`${this.name} guarded against ${opponent.name}'s attack: ${incomingAttack}!`);
        });
    }
}
