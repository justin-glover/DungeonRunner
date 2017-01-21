var remote = require('electron').remote;
var Datastore = require('nedb');
var Promise = require('promise');
var await = require('await');



//Get Save Directory
var saveDirectory = remote.app.getPath('documents') + "\\DungeonRunner\\";
var monsterDBName = saveDirectory +"monsterDB";
var spellDBName = saveDirectory + "spellDB";
var CCDBName = saveDirectory + "CCDB";
var characterDBName = saveDirectory + "characterDB";
var itemDBName = saveDirectory + "itemDB";
var encounterDBName = saveDirectory + "encounterDB";

monsterDB = new Datastore({
   filename: monsterDBName
});

spellDB = new Datastore({
    filename: spellDBName
});

CCDB = new Datastore({
    filename: CCDBName
});

characterDB = new Datastore({
    filename: characterDBName
});

itemDB = new Datastore({
    filename: itemDBName
});

encounterDB = new Datastore({
    filename: encounterDBName
});

var monsters = [];
var spells = [];
var items = [];
var characters = [];
var classes = [];
var races = [];
var encounters = [];
var backgrounds = [];

var getAllInfo = '';
//Minimize, maximize, close
function minimizeApp(){
    var window = remote.getCurrentWindow();
    window.minimize();
}

function maximizeToggle(){
    var window = remote.getCurrentWindow();
    if (!window.isMaximized()){
        window.maximize();
    }
    else{
        window.unmaximize();
    }
}
function closeApp(){
    var window = remote.getCurrentWindow();
    window.close();
}

var subClassReference = {
    "Barbarian": [
        {"subID":"Path of the Berserker", "sub": "Path of the Berserker"},
        {"subID":"Path of the Totem Warrior", "sub": "Path of the Totem Warrior"}
        ],
    "Bard": [
        {"subID":"College of Lore", "sub": "College of Lore"},
        {"subID":"College of Valor", "sub": "College of Valor"},
        {"subID":"College of Swords", "sub": "College of Swords"},
        {"subID":"College of Satire", "sub": "College of Satire"}
        ],
    "Cleric": {
        "Arcana Domain": "(Arcana)",
        "Knowledge Domain": "(Knowledge)",
        "Life Domain": "(Life)",
        "Light Domain": "(Light)",
        "Nature Domain": "(Nature)",
        "Temptest Domain": "(Tempest)",
        "Trickery Domain": "(Trickery)",
        "War Domain": "(War)"
    },
    "Druid": [
        {"subID":"Circle of the Land", "sub": "Circle of the Land"},
        {"subID":"Circle of the Moon", "sub": "Circle of the Moon"}
    ],
    "Fighter": {
        "Battle Master":"(Battle Master)",
        "Champion":"(Champion)",
        "Eldritch Knight": "(Eldritch Knight)"
    },
    "Monk": {
        "Way of Shadow": "Way of Shadow",
        "Way of the Four Elements": "Way of the Four Elements",
        "Way of the Open Hand": "Way of the Open Hand",
        "Way of the Sun Soul": "Way of the Sun Soul"
    }
    ,
    "Paladin": [
        {"subID":"(Devotion)", "sub": "Oath of Devotion"},
        {"subID":"(Vengeance)", "sub": "Oath of Vengeance"},
        {"subID":"(Ancients", "sub": "Oath of the Ancients"}
    ],
    "Ranger": [
        {"subID":"Beast Master","sub": "Beast Master"},
        {"subID":"Hunter", "sub": "Hunter"}
    ],
    "Rogue": {
        "Arcane Trickster": "Arcane Trickster",
        "Assassin": "Assassin",
        "Thief": "Thief"
    },
    "Sorcerer": [
        {"subID":"Draconic Ancestry","sub": "Draconic Ancestry"},
        {"subID":"Wild Magic", "sub": "Wild Magic"}
    ],
    "Warlock": [
        {"subID":"The Archfey", "sub": "The Archfey"},
        {"subID":"The Fiend", "sub": "The Fiend"},
        {"subID":"The Great Old One", "sub": "The Great Old One"}
    ],
    "Wizard": [
        {"subID": "(Abjuration)", "sub": "School of Abjuration"},
        {"subID": "(Conjuration)", "sub": "School of Conjuration"},
        {"subID": "(Divination)", "sub":"School of Divination"},
        {"subID": "(Enchantment)", "sub": "School of Enchantment"},
        {"subID": "(Evocation)", "sub": "School of Evocation"},
        {"subID": "(Illusion)", "sub": "School of Illusion"},
        {"subID": "(Necromancy)", "sub": "School of Necromancy"},
        {"subID": "(Transmutation)", "sub": "School of Transmutation"}
    ]
};

var profBonusDict = {
    "1": 2,
    "2": 2,
    "3": 2,
    "4": 2,
    "5": 3,
    "6": 3,
    "7": 3,
    "8": 3,
    "9": 4,
    "10": 4,
    "11": 4,
    "12": 4,
    "13": 5,
    "14": 5,
    "15": 5,
    "16": 5,
    "17": 6,
    "18": 6,
    "19": 6,
    "20": 6,
};

var abilityImportDict = {'0': "Strength",
                        '1': "Dexterity",
                        '2': "Constitution",
                        '3': 'Intelligence',
                        '4': 'Wisdom',
                        '5': 'Charisma',
                        '100': 'Acrobatics',
                        '101': "Animal Handling",
                        '102': "Arcana",
                        '103': "Athletics",
                        '104': "Deception",
                        '105': "History",
                        '106': "Insight",
                        '107': "Intimidation",
                        '108': "Investigation",
                        '109': "Medicine",
                        '110': "Nature",
                        '111': "Perception",
                        '112': "Performance",
                        '113': "Persuasion",
                        '114': "Religion",
                        '115': "Sleight of Hand",
                        '116': "Stealth",
                        '117': "Survival"};

var shortAbility = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

//Load/Reload App
function load(){
    //Load DBS
    getAllInfo = await('monsters', 'spells', 'items', 'characters', 'classes', 'races', 'encounters', 'backgrounds');
    monsterDBLoad(getAllInfo);
    spellDBLoad(getAllInfo);
    CCDBLoad(getAllInfo);
    characterDBLoad(getAllInfo);
    itemDBLoad(getAllInfo);
    encounterDBLoad(getAllInfo);

    getAllInfo.then(function (got){
        //Populate all info.
        prepApp();
        populateDropdowns();
        loadEncounterTypes();
    });
}

function reloadMonsters(){
    console.log("Reloading Monsters");
    var getMonstersInfo = await('monsters');
    monsterDBLoad(getMonstersInfo);
    getMonstersInfo.then(function(got){
        $('#monsterList').empty();
        addMonsters(monsters,'#monsterList', false, 0);
        loadEncounterTypes();
    });
}

function reloadSpells(){
    console.log("Reloading Spells");
    var getSpellInfo = await('spells');
    spellDBLoad(getSpellInfo);
    getSpellInfo.then(function(got){
        $('#spellList').empty();
        addSpells();
    });
}

function reloadCCDB(){
    console.log("Reloading CCDB");
    var getCCDBInfo = await('classes', 'races', 'backgrounds');
    CCDBLoad(getCCDBInfo);
    getCCDBInfo.then(function(got){
    });
}

function reloadCharacters(){
    console.log("Reloading Characters");
    var getCharacterInfo = await('characters');
    characterDBLoad(getCharacterInfo);
    getCharacterInfo.then(function(got){
        $('#characterList').empty();
        addCharacters(characters, '#characterList', false, 0);
        loadEncounterTypes();
    });
}

function reloadItems(){
    console.log("Reloading Items");
    var getItemInfo = await('items');
    itemDBLoad(getItemInfo);
    getItemInfo.then(function(got){
        $('#itemList').empty();
        addItems();
    });
}

function reloadEncounters(){
    var getEncountersInfo = await('encounters');
    encounterDBLoad(getEncountersInfo);
    getEncountersInfo.then(function(got){
        $('#encountersList').empty();
        addEncounters();
        loadEncounterTypes();
    });
}

//Utility functions
function calculateModifier(value){
    return Math.floor(value/2) - 5
}

function calculateModifierString(value){
    var value = Math.floor(value/2) -5
    if (value >= 0){
        var valueString = '+' + value.toString()
    }
    else{
        var valueString = value.toString();
    }

    return valueString
}

function setModalSize(modalID){
    var modalString = modalID + '.modal-body';
    $(modalString).css('overflow-y', 'auto');
    $(modalString).css('max-height', $(window).height() * 0.7);
}


function increment(elementID){
    $(elementID).val( +$(elementID).val() + 1 );
}

function decrement(elementID){
    $(elementID).val( +$(elementID).val() - 1 );
}

function numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Dice Roll function
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function rollDie(amount, type) {
    var totals = [];
    for(var i = 0; i < amount; i++){
      totals.push(getRandomInt(1, type));
    }
    var result = totals.reduce(add, 0);
    return result
}

function add(a,b){
    return a + b;
}