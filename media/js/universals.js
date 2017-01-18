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
    "Rogue": [
        {"subID":"(Arcane Trickster)", "sub": "Arcane Trickster"},
        {"subID":"Assassin", "sub": "Assassin"},
        {"subID":"Thief", "sub": "Thief"}
    ],
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