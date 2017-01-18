var remote = require('electron').remote;
var dialog = require('electron').remote.dialog;


var raceSubrace = {
    "Aasimar": [
        "Protector",
        "Sourge",
        "Fallen"
        ],
    "Bugbear": [],
    "Dragonborn": [],
    "Dwarf": [
        "Hill",
        "Mountain"
        ],
    "Elf": [
        "Dark (Drow)",
        "High",
        "Wood"
        ],
    "Firbolg": [""],
    "Genasi": [
        "Air",
        "Earth",
        "Fire",
        "Water"
        ],
    "Gnome": [
        "Forest",
        "Rock"
        ],
    "Goblin": [],
    "Goliath": [],
    "Half-Elf": [],
    "Half-Orc": [],
    "Halfling": [
        "Lightfoot",
        "Stout"
    ],
    "Hobgoblin": [],
    "Human": [],
    "Kenku": [],
    "Kobold": [],
    "Lizardfolk": [],
    "Orc": [],
    "Tabaxi": [],
    "Tiefling": [],
    "Triton": [],
    "Yuan-Ti": []
};

var classSubLabel = {
    "Barbarian": "Primal Path",
    "Bard":"Bard College",
    "Cleric": "Divine Domain",
    "Druid": "Druid Circle",
    "Fighter": "Martial Archetype",
    "Monk": "Monastic Tradition",
    "Paladin": "Sacred Oath",
    "Ranger": "Ranger Archetype",
    "Rogue": "Roguish Archetype",
    "Sorcerer": "Subclass",
    "Warlock": "Otherwordly Patrons",
    "Wizard": "Arcane Tradition"
};

var classSubclass = {
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
    "Cleric": [
        {"subID":"(Arcana)", "sub": "Arcana Domain"},
        {"subID":"(Knowledge)", "sub": "Knowledge Domain"},
        {"subID":"(Life)", "sub": "Life Domain"},
        {"subID":"(Light)", "sub": "Light Domain"},
        {"subID":"(Nature)", "sub": "Nature Domain"},
        {"subID":"(Tempest)", "sub": "Temptest Domain"},
        {"subID":"(Trickery)", "sub": "Trickery Domain"},
        {"subID":"(War)", "sub": "War Domain"}
        ],
    "Druid": [
        {"subID":"Circle of the Land", "sub": "Circle of the Land"},
        {"subID":"Circle of the Moon", "sub": "Circle of the Moon"}
    ],
    "Fighter": [
        {"subID":"Battle Master", "sub": "Battle Master"},
        {"subID":"Champion", "sub": "Champion"},
        {"subID":"(Eldritch Knight)", "sub": "Eldritch Knight"}
    ],
    "Monk": [
        {"subID":"Way of Shadow", "sub": "Way of Shadow"},
        {"subID":"Way of the Four Elements", "sub": "Way of the Four Elements"},
        {"subID":"Way of the Open Hand", "sub": "Way of the Open Hand"}
    ],
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

$(document).ready(function(){
    //Set up subrace choices
   $('#charNewRace').on('change', function(){
        var selectedRace = $(this).val();
        var listItems = "";
        for(var i=0; i < raceSubrace[selectedRace].length; i++){
            listItems += "<option>" + raceSubrace[selectedRace][i] + "</option>";
        }
        $("#charNewSubrace").html(listItems);
    });
    $('#charNewRace').trigger('change');

    //Set up subclass choices.
    $('#charNewClass').on('change', function(){
        var selectedClass = $(this).val();
        $('#labelNewSubclass').html(classSubLabel[selectedClass]);
        var listItems = "";
        for(var i=0; i < classSubclass[selectedClass].length; i++){
            listItems += "<option value='" + classSubclass[selectedClass][i].subID +"'>" + classSubclass[selectedClass][i].sub + "</option>";
        }
        $("#charNewSubclass").html(listItems);
    });

    $('#charNewClass').trigger('change');
});


//Save the new character to the  database
function saveNewCharacter(){

}