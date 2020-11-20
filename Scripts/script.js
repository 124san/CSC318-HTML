// Global variables
"use strict";
var firstTimeGuard = true;
var dialogueNext = false;
var usingSkill = false;
var bladeBashCost = 50;
var normalAttackCost = 30;
var maxHP = 100;
let numTurn = 1;
const enemyHPTag = "enemy_hp_bar";
const enemyMPTag = "enemy_mp_bar";
const playerHPTag = "player_hp_bar";
const playerMPTag = "player_mp_bar";

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
        setUI(false, 'option_banner')
        await nextButton();
    }
    thisPlayer.guard = true;
    setUI(false,'action_select', 'd-flex flex-column')
    setUI(false, 'option_banner')
    setTimeout(() => {
        switchTurns(enemy.name, () => {
            guardSound.play();
            alert(`${thisPlayer.name} is guarding the incoming attack!`);
            thisPlayer.guard = true;
        })
        setTimeout(() => {
            enemy.doAttack(thisPlayer, "Normal Attack", playerHPTag, enemyMPTag);
            resetUI();
            numTurn += 1
            document.getElementById("turn_counter_2").innerHTML = `Turn ${numTurn}`
        }, 1500);
        
    }, 1500);
}

// Reset UI to original state
function resetUI() {
    setUI(false,'skill_select', 'd-flex flex-column')
    setUI(false,'target_select', 'd-flex flex-column')
    setUI(false,'item_select', 'd-flex flex-column')
    setUI(true,'action_select', 'd-flex flex-column')
    setUI(false, 'target_select')
    setUI(false, 'back_button')
    setUI(true, 'option_banner')
    usingSkill = false;
}

// JQuery, handles onclick events of various elemetns
$(document).ready(function(){
    $('div#back_button').click(function(){
        resetUI()
    });
    $('div#attack').click(function(){
        toggleUI('skill_select', 'd-flex flex-column')
        toggleUI('back_button')
        setUI(false, 'option_banner')
    });
    $('div#normal_skill').click(() => {
        if (thisPlayer.mp < normalAttackCost) {
            alert("You don't have enough SP!");
        }
        else {
            setUI(true, 'target_select')
            setUI(true, 'select_enemy_text')
            setUI(true, 'select_enemy')
            setUI(false, 'select_player')
            setUI(false, 'select_player_text')
            setUI(false,'action_select', 'd-flex flex-column')
            setUI(false,'skill_select', 'd-flex flex-column')
            setUI(true, 'back_button')
            setUI(false, 'option_banner')
        }
    })
    $('div#blade_bash').click(function(){
        if (thisPlayer.mp < bladeBashCost) {
            alert("You don't have enough SP!");
        }
        else {
            setUI(true, 'target_select')
            setUI(true, 'select_enemy_text')
            setUI(true, 'select_enemy')
            setUI(false, 'select_player')
            setUI(false, 'select_player_text')
            setUI(false,'action_select', 'd-flex flex-column')
            setUI(false,'skill_select', 'd-flex flex-column')
            setUI(true, 'back_button')
            setUI(false, 'option_banner')
            usingSkill = true;
        }
    });
    $('div#guard').click(function(){
        dialogueNext = false;
        guard();
    });

    $('div#select_enemy').click(function(){
        setUI(false, 'target_select')
        var attackName = "Normal Attack"
        if (usingSkill) {
            attackName = "Blade Bash";
        }

        setTimeout(() => {
            attackSound.play();
            thisPlayer.doAttack(enemy, attackName, enemyHPTag, playerMPTag);
            if (enemy.hp <= 0) {
                // Player wins. Show result window and remove other windows
                setUI(false,'skill_select', 'd-flex flex-column')
                setUI(false,'target_select', 'd-flex flex-column')
                setUI(false,'item_select', 'd-flex flex-column')
                setUI(false,'action_select', 'd-flex flex-column')
                setUI(false, 'target_select')
                setUI(false, 'back_button')
                setUI(false, 'p1')
                setUI(false, 'turn_counter')
                setUI(true, "battle_result")
                bgm.stop();
                victorySound.play();
            }
            else {
                setTimeout(() => {
                    enemy.doAttack(thisPlayer, "Normal Attack", playerHPTag, enemyMPTag);
                    resetUI();
                    numTurn += 1
                    document.getElementById("turn_counter_2").innerHTML = `Turn ${numTurn}`
                }, 1500);
            }
            
        }, 1500);

    });
    
    $('div#item').click(function(){
        toggleUI('item_select', 'd-flex flex-column')
        toggleUI('back_button')
        setUI(false, 'option_banner')
    });
    $('div#potion').click(function(){
        setUI(true, 'target_select')
        setUI(false, 'select_enemy_text')
        setUI(false, 'select_enemy')
        setUI(true, 'select_player')
        setUI(true, 'select_player_text')
        setUI(false,'action_select', 'd-flex flex-column')
        setUI(false,'item_select', 'd-flex flex-column')
        setUI(true, 'back_button')
    });
    $('div#select_player').click(function(){
        setUI(false, 'target_select')

        setTimeout(() => {
            switchTurns(enemy.name, () => {
                healSound.play();
                alert(`${thisPlayer.name} uses potion on ${thisPlayer.name}! ${thisPlayer.name} is healed for 80HP!`);
                thisPlayer.hp = Math.min(thisPlayer.hp+80, maxHP);
            })
            setTimeout(() => {
                attackSound.play();
                enemy.doAttack(thisPlayer, "Normal Attack", playerHPTag, null);
                resetUI();
                setUI(false, "potion")
                setUI(true, "no_item", "p-2");
                numTurn += 1
                document.getElementById("turn_counter_2").innerHTML = `Turn ${numTurn}`
            }, 1500);
            
        }, 1500);

    });
    $('div#escape').click(function(){
        setUI(false,'action_select', 'd-flex flex-column')
        setUI(true,'dialogue_ui_container')
        setUI(true, 'dialogue_escape')
        setUI(false, 'option_banner')
    });
    $('div#dialogue_next_button').click(function(){
        dialogueNext = true;
        setUI(true,'action_select', 'd-flex flex-column')
        setUI(false, 'dialogue_ui_container')
        setUI(false, 'dialogue_guard')
        setUI(false, 'dialogue_escape')
        setUI(true, 'option_banner')
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
    let newBanner = (topBanner === "Your turn!")? `${opponentName}'s turn!`: "Your turn!";
    document.getElementById("turn_counter").innerHTML = newBanner;
    if(newBanner === "Your turn!") {
        thisPlayer.guard = false;
    }
    updateBars()
}

/**
 * Update player and enemy's HP,MP bar
 */
function updateBars() {
    $('#enemy_hp_bar').css('width', enemy.hp+'%').attr('aria-valuenow', enemy.hp)
    $('#player_hp_bar').css('width', thisPlayer.hp+'%').attr('aria-valuenow', thisPlayer.hp)
    $('#enemy_mp_bar').css('width', enemy.mp+'%').attr('aria-valuenow', enemy.mp)
    $('#player_mp_bar').css('width', thisPlayer.mp+'%').attr('aria-valuenow', thisPlayer.mp)
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
     * @param {int} effect Effect of the item on player HP
     */
    constructor(name, type, effect){
        this.name = name;
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
        this.guard = false;
        this.attackArray = attackArray;
        this.itemArray = itemArray;
    }

    /**
     * Implements the attack functionality for both players. 
     * Takes the amount of attack HP to subtract from opponent 
     * and the amount of MP to subtract from you.
     * Also updates the UI, and switches turns. 
     */
    doAttack(opponent, attackName, hptag, mptag){
        const attack = this.attackArray.filter(attack => attack.name == attackName)[0];
        this.mp -= attack.cost;
        var damage = attack.damage;
        if (opponent.guard) damage /= 2;
        opponent.hp -= damage;
        document.getElementById(hptag).innerHTML = `HP:${opponent.hp}/100`;
        if (mptag !== null){ document.getElementById(mptag).innerHTML = `SP:${this.mp}/100`;};
        switchTurns(opponent.name,() => {
            alert(`${this.name} attacked ${opponent.name} using ${attackName}! ${opponent.name} takes ${damage} damage!`);
            console.log(opponent);
        });
    }
}

// Sound constructor
class sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function () {
            this.sound.play();
        };
        this.stop = function () {
            this.sound.pause();
        };
    }
}


// Define player and enemy
var thisPlayer = new Player("Player", maxHP, 100, [new Attack("Normal Attack", normalAttackCost, 40), new Attack("Blade Bash", bladeBashCost, 60)], [new Item("Potion", 80)]);
var enemy = new Player("Troublesome Guy", maxHP, 100, [new Attack("Normal Attack", normalAttackCost, 50)], []);

// sound objects
var attackSound = new sound("./Audio/Sword3.ogg");
var guardSound = new sound("./Audio/Guard.ogg");
var healSound = new sound("./Audio/Heal3.ogg");
var victorySound = new sound("./Audio/Victory1.ogg");
var bgm = new sound("./Audio/bgm.ogg");
bgm.play();
