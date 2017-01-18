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

//Dictionaries
var mainAbilites = {'Strength': 0, 'Dexterity': 1, 'Constitution': 2, 'Intelligence': 3, 'Wisdom': 4, 'Charisma': 5};

var abilityReference = [['Athletics'],
                        ['Acrobatics', 'Sleight of Hand', 'Stealth'],
                        [],
                        ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'],
                        ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'],
                        ['Deception', 'Intimidation', 'Performance', 'Persuasion']];

var sizeDictionary = {'T': "tiny", 'S': "small", 'M': "medium", 'L': "large", 'H': "huge", 'G': "gigantic"};
var crDictionary = {
    '0': '10',
    '1/8': '25',
    '1/4': '50',
    '1/2': '100',
    '1': '200',
    '2': '450',
    '3': '700',
    '4': '1100',
    '5': '1,800',
    '6': '2,300',
    '7': '2,900',
    '8': '3,900',
    '9': '5,000',
    '10': '5,900',
    '11': '7,200',
    '12': '8,400',
    '13': '10,000',
    '14': '11,500',
    '15': '13,000',
    '16': '15,000',
    '17': '18,000',
    '18': '20,000',
    '19': '22,000',
    '20': '25,000',
    '21': '33,000',
    '22': '41,000',
    '23': '50,000',
    '24': '62,000',
    '30': '155,000'};

var spellSchoolDictionary = {
    "A": "Abjuration",
    "C": "Conjuration",
    "D": "Divination",
    "EN": "Enchantment",
    "EV": "Evocation",
    "I": "Illusion",
    "N": "Necromancy",
    "T": "Transmutation"
};

var spellLevelDictionary = {
    "0": "Cantrip",
    "1": "1st",
    "2": "2nd",
    "3": "3rd",
    "4": "4th",
    "5": "5th",
    "6": "6th",
    "7": "7th",
    "8": "8th",
    "9": "9th",
    "10": "10th"
};

var monsters = [];
var spells = [];
var items = [];
var characters = [];
var classes = [];
var races = [];
var encounters = [];
var backgrounds = [];

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


//Load the monster database up.
function monsterDBLoad(){
    monsterDB.loadDatabase(function(err){

    });

    monsterDB.find({}).sort({name: 1}).exec(function(err, docs){
        docs.forEach(function(monster){
            monsters.push(monster);
        });
        console.log("Monsters: ", monsters);
        getAllInfo.keep('monsters', monsters);
    });
}

function spellDBLoad() {
    spellDB.loadDatabase(function(err){
    });

    spellDB.find({}).sort({name: 1}).exec(function (err, docs) {
        docs.forEach(function (spell) {
            spells.push(spell);
        });
        console.log("Spells: ", spells);
        getAllInfo.keep('spells', spells);
    });
}

function CCDBLoad(){
    CCDB.loadDatabase(function(err){
    });

    CCDB.find({type: 'class'}).exec(function(err, docs){
       docs.forEach(function (foundClass){
           // console.log("Class: ", foundClass);
           classes.push(foundClass);
       });
       console.log("Classes: ", classes);
       getAllInfo.keep('classes', classes);
    });

    CCDB.find({type: 'race'}).exec(function(err, docs){
       docs.forEach(function (foundRace){
           // console.log("Race: ", foundRace);
           races.push(foundRace);
       });
       console.log("Races: ", races);
       getAllInfo.keep('races', races);
    });

     CCDB.find({type: 'background'}).sort({name: 1}).exec(function (err, docs) {
        docs.forEach(function (foundBackground){
            backgrounds.push(foundBackground);
        });

        console.log("backgrounds: ", backgrounds);
        getAllInfo.keep('backgrounds', backgrounds);
     });
}

function characterDBLoad(){
    characterDB.loadDatabase(function(err){
    });

    characterDB.find({}).sort({name: 1}).exec(function (err, docs) {
        docs.forEach(function (character) {
                characters.push(character);
            });
        getAllInfo.keep('characters', characters);
        console.log("Characters: ", characters);
        });
}

function itemDBLoad(){
    itemDB.loadDatabase(function(err){});
    itemDB.find({}).sort({name: 1}).exec(function (err, docs) {
        docs.forEach(function (item) {
            items.push(item);
        });
        console.log("Items: ", items);
        getAllInfo.keep('items', items);
    });
}

function encounterDBLoad(){
    encounterDB.loadDatabase(function(err){});
    encounterDB.find({}).sort({name: 1}).exec(function (err, docs) {
        docs.forEach(function (encounter) {
            encounters.push(encounter);
        });
        console.log("Encounters: ", encounters);
        getAllInfo.keep('encounters', encounters);
    });
}

//Populate dropdowns
function populateDropdowns(){
    var listItems = "";
    for(var i=0; i < backgrounds.length; i++){
        listItems += '<option>' + backgrounds[i].name + '</option>';
    }
    $('#charNewBackground').html(listItems);
}


function addMonsters(monsterList, elementID, encounter, monsterReference, turn){
    //Populate Monsters
    for (var m = 0; m < monsterList.length; m++) {
        var name = monsterList[m].name;
        var size = monsterList[m].size;
        var type = monsterList[m].type;
        var alignment = monsterList[m].alignment;
        var ac = monsterList[m].ac;
        var hp = monsterList[m].hp;
        var speed = monsterList[m].speed;

        //Stats
        var strength = monsterList[m].str;
        var dex = monsterList[m].dex;
        var con = monsterList[m].con;
        var intelligence = monsterList[m].int;
        var wis = monsterList[m].wis;
        var cha = monsterList[m].cha;

        //Detailed Info
        var saves = monsterList[m].saves;
        var skills = monsterList[m].skills;
        var vulnerable = monsterList[m].vulnerable;
        var resist = monsterList[m].resist;
        var immune = monsterList[m].immune;
        var conImmune = monsterList[m].conditionImmune;
        var senses = monsterList[m].senses;
        var passivePerception = monsterList[m].passive;
        var languages = monsterList[m].languages;
        var challenge = monsterList[m].cr;

        //List sections
        var traits = monsterList[m].traits;
        var actions = monsterList[m].actions;
        var legendaries = monsterList[m].legendaries;

        var referenceName = name.replace(/\s|[()]/g, '');


        //Get and populate traits
        var traitsHTML = '';
        if (traits.length != 0) {
            traitsHTML += '<h2>Traits</h2>';
            for (var i = 0; i < traits.length; i++) {

                var traitName = traits[i].name;
                var traitDescription = traits[i].text;

                var traitStylingHTML = '';

                for (var k = 0; k < traitDescription.length; k++) {
                    if (traitDescription[k].includes('•')) {
                        var spellCleanup = traitDescription[k].split("):");
                        var popupHTML = '';
                        if (spellCleanup.length > 1) {
                            //Add back the splitout ):
                            spellCleanup[0] += '): ';
                            var spellListHTML = '';
                            var spellSplit = spellCleanup[1].split(',');
                            spellSplit.forEach(function (spell) {

                                //Cleanup spell for reference
                                var spellReferenceName = spell.replace(/\s|\(.*?\)|[()]|\'|\*|\./g, '');

                                //Add it all together!
                                spellListHTML += '<a class="spellLink" href="#" data-toggle="modal" data-target="#' + spellReferenceName + '">' + spell + ',</a>';

                            });
                        }
                        traitStylingHTML += spellCleanup[0] + spellListHTML + '<br /> <br />';
                    }
                    else {
                        traitStylingHTML += traitDescription[k] + '<br />';
                    }
                }

                traitsHTML = traitsHTML +
                    '<div class="monsterTrait">' +
                    '<h4>' + traitName + '</h4>' +
                    '<hr>' +
                    traitStylingHTML +
                    '</div>';
            }
        }


        //Get and populate Actions
        var actionsHTML = '';

        for (var i = 0; i < actions.length; i++) {

            var actionName = actions[i].name;
            var actionDescription = actions[i].text;
            var splitActionDescription = actionDescription.split("Hit:");

            if (splitActionDescription[1]) {
                actionsHTML = actionsHTML +
                    '<div class="monsterAction">' +
                    '<h4>' + actionName + '</h4>' +
                    splitActionDescription[0] +
                    '</br>' +
                    '<b>Hit:</b> ' + splitActionDescription[1] +
                    '</div>'
            }
            else {
                actionsHTML = actionsHTML +
                    '<div class="monsterAction">' +
                    '<h4>' + actionName + '</h4>' +
                    splitActionDescription[0] +
                    '</div>'
            }
        }

        //Get and populate Legendary Actions
        var legendaryHTML = '';
        if (legendaries.length != 0) {
            legendaryHTML = legendaryHTML + '<h2>Legendary Actions</h2>'
            for (var i = 0; i < legendaries.length; i++) {
                var legendaryName = legendaries[i].name;
                var legendaryDescription = legendaries[i].text;
                legendaryHTML = legendaryHTML +
                    '<div class="monsterLegendary">' +
                    '<h4>' + legendaryName + '</h4>' +
                    legendaryDescription +
                    '</div>';
            }
        }


        var encounterClose = '';
        var encounterCounter = '';
        var panelHeaderHTML = '';
        var liHTML = '<li>';
        if(encounter == true){
            referenceName += 'encounter';
            var counterReference = name.replace(/\s|[()]/g, '') + 'counter';

            encounterCounter += '<div class="counter innnerInfo">' +
                                    '<button type="button" class="increment" onclick="increment(\'#' + counterReference + '\');">' +
                                        '<span class="glyphicon glyphicon-triangle-top"></span>' +
                                    '</button>' +
                                    '<input type="number" id="' + counterReference + '" value="1" />' +
                                    '<button type="button" class="decrement" onclick="decrement(\'#' + counterReference + '\');">' +
                                        '<span class="glyphicon glyphicon-triangle-bottom"></span>' +
                                    '</button>' +
                                '</div>';
            encounterClose += '<button type="button" class="close" onclick="removeParticipant(\'#' + referenceName + '\');">&times;</button>'
        }
        else if(encounter == "running"){
            liHTML = '<li data-turn="' + turn + '">';
            var number = Number(monsterReference.split('_')[1]) + 1;
            name += ' #' + String(number);

            var totalHP = hp.split('(')[0];
            referenceName = monsterReference.replace(/\s|[()]/g, '');
            panelHeaderHTML = '' +
                    '<div class="panel-heading">' +
                        encounterCounter +
                        '<div class="headerInfo innerInfo">' +
                            '<a data-toggle="collapse" href="#' + referenceName + '">' +
                                encounterClose +
                                '<div class="monsterName">' +
                                    '<h2>' + name + '</h2>' +
                                    '<input type="text" value="' + monsterReference + '" class="dbName"/>' +
                                    '<div class="monsterStatHeader">' +
                                        '<div class="monsterQuickAC">' +
                                            '<h3>AC:  </h3>' +
                                            ac +
                                        '</div>' +
                                        '<div class="monsterQuickHealth">' +
                                            '<h3>HP: </h3>' +
                                            '<div class="monsterCurrentHealth">' +
                                                ' ' +
                                            '</div>' +
                                            ' / ' +
                                            '<div class="monsterTotalHealth">' +
                                                totalHP +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="monsterQuickInfo">' +
                                    sizeDictionary[size] + ' ' +
                                    type[0] + ' - ' +
                                    alignment +
                                '</div>' +
                            '</a>' +
                        '</div>' +
                    '</div>';
        }
        
        if(encounter != "running"){
            panelHeaderHTML = '<div class="panel-heading">' +
                                encounterCounter +
                                '<div class="headerInfo innerInfo">' +
                                    '<a data-toggle="collapse" href="#' + referenceName + '">' +
                                        encounterClose +
                                        '<div class="monsterName">' +
                                            '<h2>' + name + '</h2>' +
                                        '</div>' +
                                        '<div class="monsterQuickInfo">' +
                                            sizeDictionary[size] + ' ' +
                                            type[0] + ' - ' +
                                            alignment +
                                        '</div>' +
                                    '</a>' +
                                '</div>' +
                            '</div>';

        }
        var monsterHTML = '' +
            liHTML +
                '<div class="monster panel panel-default">' +
                    panelHeaderHTML +
                    '<div id="' + referenceName + '" class="panel-collapse collapse monsterID">' +
                        '<div class="panel-body">' +
                            '<div class="monsterStats">' +
                                '<div class="monsterQuickStats">' +
                                    '<div class="monsterAC">' +
                                        '<h4>Armor Class: </h4>' + ' ' +
                                            ac +
                                    '</div>' +
                                    '<div class="monsterHP">' +
                                        '<h4>HP: </h4>' + ' ' +
                                            hp +
                                    '</div>' +
                                    '<div class="monsterSpeed">' +
                                        '<h4>Speed: </h4>' + ' ' +
                                        speed +
                                    '</div>' +
                                '</div>' +
                                '<hr>' +
                                '<div class="monsterAbilities">' +
                                    '<div class="monsterSTR">' +
                                        '<h5>STR</h5>' + strength + '(' + calculateModifierString(Number(strength)) + ')' +
                                    '</div>' +
                                    '<div class="monsterDEX">' +
                                        '<h5>DEX</h5>' + dex + '(' + calculateModifierString(Number(dex)) + ')' +
                                    '</div>' +
                                    '<div class="monsterCON">' +
                                        '<h5>CON</h5>' + con + '(' + calculateModifierString(Number(con)) + ')' +
                                    '</div>' +
                                    '<div class="monsterINT">' +
                                        '<h5>INT</h5>' + intelligence + '(' + calculateModifierString(Number(intelligence)) + ')' +
                                    '</div>' +
                                    '<div class="monsterWIS">' +
                                        '<h5>WIS</h5>' + wis + '(' + calculateModifierString(Number(wis)) + ')' +
                                    '</div>' +
                                    '<div class="monsterCHA">' +
                                        '<h5>CHA</h5>' + cha + '(' + calculateModifierString(Number(cha)) + ')' +
                                    '</div>' +
                                '</div>' +
                                '<hr>' +
                                '<div class="monsterDetailBlock">' +
                                    '<div class="monsterSaves">' +
                                      '<h5>Saving Throws: </h5>' + saves +
                                    '</div>' +
                                    '<div class="monsterSkills">' +
                                        '<h5>Skills: </h5>' + skills +
                                    '</div>' +
                                    '<div class="monsterVulners">' +
                                        '<h5>Damage Vulnerabilities: </h5>' + vulnerable +
                                    '</div>' +
                                    '<div class="monsterResists">' +
                                        '<h5>Damage Resistances: </h5>' + resist +
                                    '</div>' +
                                    '<div class="monsterImmune">' +
                                        '<h5>Damage Immunities: </h5>' + immune +
                                    '</div>' +
                                    '<div class="monsterConditionImmune">' +
                                        '<h5>Condition Immunities: </h5>' + conImmune +
                                    '</div>' +
                                    '<div class="monsterSenses">' +
                                        '<h5>Senses: </h5>' + senses +
                                    '</div>' +
                                    '<div class="monsterPassivePerception">' +
                                        '<h5>Passive Perception: </h5>' + passivePerception +
                                    '</div>' +
                                    '<div class="monsterLanguage">' +
                                        '<h5>Languages: </h5>' + languages +
                                    '</div>' +
                                    '<div class="monsterCR">' +
                                        '<h5>Challenge: </h5>' + challenge + '(' + crDictionary[challenge] + 'xp)' +
                                    '</div>' +
                                '</div>' +
                                '<hr>' +
                            '</div>' +
                            '<div class="monsterTraits">' +
                                traitsHTML +
                            '</div>' +
                            '<div class="monsterActions">' +
                                '<h2>Actions</h2>' +
                                actionsHTML +
                            '</div>' +
                            '<div class="monsterLegendaries">' +
                                legendaryHTML +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</li>';
        $(elementID).append(monsterHTML);
    }
}

function addCharacters(characterList, elementID, encounter, turn){
    for (var c = 0; c < characterList.length; c++) {
        var character = characterList[c];
        var referenceName = character.name.replace(/\s|[()]|\'|\*|\.|\/|\+|\,/g, '');
        var abilities = character.abilities.split(',');
        var race = character.race;
        var level = character.level;
        var characterClass = character.class;
        var raceReference = {};
        var classReference = {};
        var characterSubClass = characterClass + character.subclass;
        console.log("Subclass: ", characterSubClass);
        //Handling for wonky saving from Fightclub.
        switch (character.race) {
            case 'Hill Dwarf':
                race = 'Dwarf (Hill)';
                break;
        }

        var liHTML = '<li>';
        if(encounter == true){
            referenceName += 'encounter';
        }
        else if(encounter == 'running'){
            liHTML = '<li data-turn="' + turn + '">';
            referenceName += 'running';
        }

        //Set proficiency Bonus
        character.profBonus = profBonusDict[level];

        //Piece together the items list.
        var itemsHTML = '';
        for (var i = 0; i < character.items.length; i++) {
            var itemReferenceName = character.items[i].name.replace(/\s|[()]|\'|\*|\.|\/|\+|\,/g, '');
            itemReferenceName = itemReferenceName.toLowerCase();

            var itemsTextHTML = character.items[i].name + ' (' + character.items[i].quantity + ')';
            var commaHTML = ', </a>';

            if (i == character.items.length - 1) {
                commaHTML = '</a>';
            }

            itemsHTML += '<a class="spellLink" href="#" data-toggle="modal" data-target="#' + itemReferenceName + '">' + itemsTextHTML + commaHTML;
        }

        //Get Racial Traits for character
        var traitsHTML = '<div class="traits panel panel-defaukt">' +
                            '<div class="panel-heading">' +
                                '<a data-toggle="collapse" href="#' + referenceName + 'traits">' +
                                    '<h2>Traits</h2>' +
                                '</a>' +
                            '</div>' +
                            '<div id="' + referenceName + 'traits" class="panel-collapse collapse">' +
                                '<div class="panel-body">';

        //Load Character Info Database
        //awaits
        // var getCharacterInfo = await('raceInfo', 'classInfo', 'spellList');
        var raceMatch = $.grep(races, function(e){ return e.name == race});
        var raceTraits = [];
        for(var rCount = 0; rCount < raceMatch.length; rCount++) {
            //TraitsHTML setup.
            raceReference.speed = raceMatch[rCount].speed;
            raceReference.size = sizeDictionary[raceMatch[rCount].size];
            raceReference.abilities = [];

            var tempAbilities = raceMatch[rCount].ability.split(',');

            for(i=0; i < tempAbilities.length;i++){
                var splitAbilityInfo = tempAbilities[i].split(' ');

                var upper = '';
                if(splitAbilityInfo[0] == ""){
                    var upper = splitAbilityInfo[1].toUpperCase();
                    var index = shortAbility.indexOf(upper);
                    raceReference.abilities.push({'name': shortAbility[index], 'mod': splitAbilityInfo[2]});
                }
                else{
                    var upper = splitAbilityInfo[0].toUpperCase();
                    var index = shortAbility.indexOf(upper);
                    raceReference.abilities.push({'name': shortAbility[index], 'mod': splitAbilityInfo[1]});
                }
            }

            console.log("Abilities: ", raceReference.abilities);
            for (var i = 0; i < raceMatch[rCount].traits.length; i++) {
                raceTraits.push(raceMatch[rCount].traits[i]);
            }

            //Sort Traits alphabetically
            raceTraits.sort(function (a, b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
            });

            for (i = 0; i < raceTraits.length; i++) {
                traitsHTML += '<div class="characterTrait">' +
                    '<h4>' + raceTraits[i].name + '</h4>' +
                    '<hr>' +
                    raceTraits[i].text +
                    '</div>';
            }

        }
        traitsHTML += '</div></div></div>';

        // getCharacterInfo.keep('raceInfo', traitsHTML);

        //Gather class information for display.
        var featureHTML = '<div class="features panel panel-defaukt">' +
                            '<div class="panel-heading">' +
                                '<a data-toggle="collapse" href="#' + referenceName + 'features">' +
                                    '<h2>Features</h2>' +
                                '</a>' +
                            '</div>' +
                            '<div id="' + referenceName + 'features" class="panel-collapse collapse">' +
                                '<div class="panel-body">';

        var classMatch = $.grep(classes, function(e){ return e.name == characterClass});
        var classFeatures = [];

        for(rCount=0; rCount < classMatch.length; rCount++){
            classReference.name = classMatch[rCount].name;
            classReference.hd = classMatch[rCount].hd;
            classReference.proficiency = classMatch[rCount].proficiency;

            for (i = 0; i < classMatch[rCount].features.length; i++) {
                var classFeature = $.extend({}, {});

                var featName = classMatch[rCount].features[i].name;

                //Watch for optionals
                if (classMatch[rCount].features[i].optional == "YES") {
                    for (key in subClassReference[characterClass]) {
                        if (subClassReference[characterClass][key] == character.subclass) {
                            // console.log("Feat Name: ", featName);
                            if (featName.includes(key)) {
                                classFeature.level  = classMatch[rCount].features[i].level;
                                classFeature.name  = classMatch[rCount].features[i].name;
                                classFeature.text = classMatch[rCount].features[i].text;
                            }
                        }
                    }
                }
                else {
                    if (Number(classMatch[rCount].features[i].level) <= Number(level)) {
                        classFeature.level  = classMatch[rCount].features[i].level;
                        classFeature.name  = classMatch[rCount].features[i].name;
                        classFeature.text = classMatch[rCount].features[i].text;
                    }
                    else {
                        break;
                    }
                }

                //Check if the dictionary is empty or not. Only push if it has data.
                if(Object.keys(classFeature).length != 0 && classFeature.constructor == Object){
                  classFeatures.push(classFeature);
                }
            }
        }

        //Sort the features by level, then alphabetically.

        classFeatures.sort(function (a, b) {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
        });

        var sortedFeatures = {};
        for (var i = 0; i < classFeatures.length; i++) {
            level = classFeatures[i].level;
            if (level in sortedFeatures) {
                sortedFeatures[level].push(classFeatures[i])
            }
            else {
                sortedFeatures[level] = [classFeatures[i]];
            }
        }

        //Set html for features
        for (level in sortedFeatures) {
            featureHTML += '<h3>Level ' + level + '</h3>';

            for (i = 0; i < sortedFeatures[level].length; i++) {
                var featureTextHTML = '';

                for (k = 0; k < sortedFeatures[level][i].text.length; k++) {
                    featureTextHTML += sortedFeatures[level][i].text[k] + "<br />";
                }

                featureHTML += '<div class="characterFeature">' +
                                '<h4>' + sortedFeatures[level][i].name + '</h4>' +
                                featureTextHTML +
                                '</div>';
            }
        }

        featureHTML += '</div></div></div>';

        // getCharacterInfo.keep('classInfo', featureHTML);

        var knownSpellsHTML = '<h2>Known Spells</h2>';

        var spellMatches = $.grep(spells, function(e){ return e.classes.includes(characterClass)});

        var knownSpells = [];
        for(var count = 0; count < spellMatches.length; count++){
            var spell = spellMatches[count];
            var spellClasses = spell.classes.split(',');
            var relevantClasses = false;
            var subClassClean = characterSubClass.replace(/\s/g, '');
            //Clean up spell Classes
            for (var i = 0; i < spellClasses.length; i++) {
                if (spellClasses[i].includes(characterClass)) {
                    var spellClassClean = spellClasses[i].replace(/\s/g, '');

                    if (spellClassClean == characterClass || spellClassClean == subClassClean) {
                        relevantClasses = true;
                    }
                }
            }

            //Clean up to get subclass. Some classes have access to ALL spells, so we display all for known (namely Cleric & Sorcerer).
            if (characterClass != "Cleric") {
                if (spell.level == 0 && character.spells.indexOf(spell.name) >= 0) {
                    knownSpells.push(spell);
                }
                else if (character.spellSlots[spell.level] != "0" && relevantClasses && character.spells.indexOf(spell.name) >= 0) {
                    knownSpells.push(spell);
                }
            }
            else {
                if (spell.level == 0) {
                    knownSpells.push(spell);
                }
                else if (character.spellSlots[spell.level] != "0" && relevantClasses) {
                    knownSpells.push(spell);
                }
            }
        }

        knownSpells.sort(function (a, b) {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
        });

        var sortedSpells = {};
        for (i = 0; i < knownSpells.length; i++) {
            level = knownSpells[i].level;
            if (level in sortedSpells) {
                sortedSpells[level].push(knownSpells[i])
            }
            else {
                sortedSpells[level] = [knownSpells[i]];
            }
        }

        for (level in sortedSpells) {
            if (level == "0") {
                knownSpellsHTML += '•' + spellLevelDictionary[level] + " (at will): ";
            }
            else {
                knownSpellsHTML += '•' + spellLevelDictionary[level] + " level: ";
            }

            for (i = 0; i < sortedSpells[level].length; i++) {
                var spellReferenceName = sortedSpells[level][i].name.replace(/\s|\(.*?\)|[()]|\'|\*|\.|\//g, '');
                spellReferenceName = spellReferenceName.toLowerCase();

                knownSpellsHTML += '<a class="spellLink" href="#" data-toggle="modal" data-target="#' + spellReferenceName + '">' + sortedSpells[level][i].name + ', </a>';
            }
            knownSpellsHTML += '<br /> <br />';
        }
        // getCharacterInfo.keep('spellList', knownSpellsHTML);

        //****************Ability Scores**********************
        //Going to need to put in proficiency checking.
        var minorAbilitiesHTML = '';
        var minorAbilities = [];
        var majorAbilities = [];
        var majorAbilitiesHTML = '';
        var proficient = classReference.proficiency.split(',');
        var proficientAbilities = [];

        for(i=0; i < abilities.length; i++){
            if(abilities[i] == ""){
                continue;
            }

            proficientAbilities.push(0);
            for(k=0;k < proficient.length; k++){
                var profReference = proficient[k].replace(/\s/g, '');
                if(mainAbilites[profReference] == i){
                    proficientAbilities[i] = 1;
                }
            }
        }

        console.log("Ability Scores: ", abilities);
        for(i=0; i < abilities.length; i++){
            var profMarker = '';
            //Handle for weird import from character xml
            var abilityValue = abilities[i];
            if(abilities[i] == ""){
                continue;
            }
            if(proficientAbilities[i] == 1){
                profMarker = '*';
            }
            for(k=0; k < raceReference.abilities.length; k++){
                if(shortAbility[i] == raceReference.abilities[k].name){
                    var newAbilityValue = Number(abilities[i]) + Number(raceReference.abilities[k].mod);
                    abilities[i] = String(newAbilityValue);
                }
            }
            majorAbilitiesHTML +=  '<div class="stat">' +
                                        '<h5>' + shortAbility[i] + profMarker + '</h5>' +  abilities[i] + ' (' + calculateModifierString(Number(abilities[i])) + ')' +
                                    '</div>';
            for(k=0; k < abilityReference[i].length; k++){
                minorAbilities.push({'name': abilityReference[i][k], 'mod': calculateModifierString(Number(abilities[i]))});
            }
        }

        //Sort abilities alphabetically
        minorAbilities.sort(function (a, b) {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
        });

        for(i=0; i < minorAbilities.length; i++){
            profMarker = '';

            if(character.proficiencies.indexOf(minorAbilities[i].name) >= 0){
                profMarker = '*';
                var modNumber = Number(minorAbilities[i].mod);
                minorAbilities[i].mod = '+' + String(modNumber + character.profBonus);
            }
            minorAbilitiesHTML += '<div class="stat">' +
                                        '<h5>' + minorAbilities[i].name + profMarker + '</h5>' + minorAbilities[i].mod +
                                    '</div>';
        }

        var passivePerception = 10 + calculateModifier(Number(abilities[4]));

        //Load into Character List
        var characterListHTML = '' +
            liHTML +
            '<div class="character panel panel-default">' +
            '<div class="panel-heading">' +
            '<a data-toggle="collapse" href="#' + referenceName + '">' +
            '<div class="characterName">' +
            '<h2>' + character.name + ' - Level ' + character.level + ' ' + character.class + ' ' + character.subclass + '</h2>' +
            '</div>' +
            '<div class="monsterQuickInfo">' +
            raceReference.size + ' ' +
            character.race +
            ' (' + character.xp + 'xp)' +
            '</div>' +
            '</a>' +
            '</div>' +
            '<div id="' + referenceName + '" class="panel-collapse collapse">' +
            '<div class="panel-body">' +
            '<div class="monsterStats">' +
                '<div class="monsterQuickStats">' +
                    '<div class="monsterAC">' +
                        '<h4>Armor Class: </h4>' + ' ' +
                        '15' +
                    '</div>' +
                    '<div class="monsterHP">' +
                        '<h4>HP: </h4>' + ' ' +
                            character.hpCurrent + '/' + character.hpMax +
                    '</div>' +
                    '<div class="monsterSpeed">' +
                        '<h4>Speed: </h4>' + ' ' +
                        raceReference.speed +
                    '</div>' +
                    '<div class="charInit">' +
                        '<h4>Initiative: </h4>' +
                        calculateModifierString(Number(abilities[1])) +
                    '</div>' +
                '</div>' +
                '<hr>' +
            '<div class="monsterAbilities">' +
                majorAbilitiesHTML +
            '</div>' +
            '<hr>' +
            '<div class="monsterAbilities">' +
                minorAbilitiesHTML +
            '</div>' +
            '<hr>' +
            '<div class="monsterDetailBlock">' +
                '<div class=characterHitDie>' +
                    '<h5>Hit Die: </h5> 1d' + classReference.hd +
                '</div>' +
                '<div class="monsterSaves">' +
                    '<h5>Saving Throws: </h5>' + classReference.proficiency +
                '</div>' +
                '<div class="monsterPassivePerception">' +
                    '<h5>Passive Perception: </h5>' +
                    passivePerception +
                '</div>' +
                '<div class="charProfBonus">' +
                    '<h5>Proficiency Bonus: </h5>' +
                    '+' + character.profBonus +
                '</div>' +
            '</div>' +
            '<hr>' +
            '</div>' +
            '<div class="characterSpells">' +
            knownSpellsHTML +
            '</div>' +
            '<div class="characterTraits">' +
            traitsHTML +
            '</div>' +
            '<div class="characterFeatures">' +
            featureHTML +
            '</div>' +
            '<div class="characterItems">' +
            '<h2>Items</h2>' +
            itemsHTML +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</li>';

        $(elementID).append(characterListHTML);
    }
}

function addEncounters(){
    for (var i = 0; i < encounters.length; i++) {
        var referenceName = encounters[i].name.replace(/\s|[()]|\'|\*|\.|\/|\+|\,/g, '');
        var tempXP = 0;

        for(var k=0; k < encounters[i].participants.length; k++){
            tempXP += Number(encounters[i].participants[k].xp);
        }

        var totalXP = numberWithCommas(tempXP);

        var encountersListHTML = '' +
                '<li>' +
                    '<div id="' + referenceName + '">' +
                        '<div class="encounterListInfo">' +
                            '<div class="encounterListName">' +
                                encounters[i].name + ' - ' + totalXP + 'xp' +
                            '</div>' +
                            '<div class="encounterButtons">' +
                                '<button class="btn btn-success btn-sm" type="button" onclick="populateEncounter(\'' + encounters[i].name + '\')"><span class="glyphicon glyphicon-play"></span></button>' +
                                '<button class="btn btn-info btn-sm" type="button" data-target="#encounterCreator" data-toggle="modal" onclick="editEncounter(\'' + encounters[i].name + '\')"><span class="glyphicon glyphicon-pencil"></span></button>' +
                                '<button class="btn btn-danger btn-sm" type="button" onclick="deleteEncounter(\'#' + referenceName + '\',\'' + encounters[i].name + '\')"><span class="glyphicon glyphicon-remove"></span></button>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</li>';

        $('#encountersList').append(encountersListHTML);
    }
}

function addSpells(){
    //Populate Spells
    console.log("Spells Length: ", spells.length);
    for (var s = 0; s < spells.length; s++) {
        //Load into Spell Tab
        var spellReferenceName = spells[s].name.replace(/\s|\(.*?\)|[()]|\'|\*|\.|\//g, '');
        spellReferenceName = spellReferenceName.toLowerCase();

        var spellListReference = '_' + spellReferenceName;

        var spellText = spells[s].text;

        if (spells[s].level == "0") {
            var spellLevelText = spellLevelDictionary[spells[s].level];
        }
        else {
            var spellLevelText = spellLevelDictionary[spells[s].level] + '-level';
        }


        var spellTextHTML = '';

        for (var i = 0; i < spellText.length; i++) {
            spellTextHTML += '<div class="spellText">' +
                spellText[i] + '<br />' +
                '</div>';
        }

        //Declare popup HTML
        if ($("#" + spellReferenceName).length == 0) {
            var spellHTML = '<div class="modal fade" id="' + spellReferenceName + '" role="dialog">' +
                '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                spells[s].name +
                '<h5>' + spellLevelText + ' ' + spellSchoolDictionary[spells[s].school] + '  (' + spells[s].classes + ')</h5>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div class="spellInfo">' +
                '<div class="spellTime">' +
                '<h5>Casting Time: </h5>' + spells[s].time +
                '</div>' +
                '<div class="spellRange">' +
                '<h5>Range: </h5>' + spells[s].range +
                '</div>' +
                '<div class="spellComponents">' +
                '<h5>Components: </h5>' + spells[s].components +
                '</div>' +
                '<div class="spellDuration">' +
                '<h5>Duration: </h5>' + spells[s].duration +
                '</div>' +
                '</div>' +
                '<div class="spellDescription">' +
                spellTextHTML +
                '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        $("#spellModList").append(spellHTML);

        //Load into Spell List
        var spellListHTML = '' +
            '<li>' +
            '<div class="spell panel panel-default">' +
            '<div class="panel-heading">' +
            '<a data-toggle="collapse" href="#' + spellListReference + '">' +
            '<div class="spellName">' +
            '<h2>' + spells[s].name + '</h2>' +
            '<h5>' + spellLevelText + ' ' + spellSchoolDictionary[spells[s].school] + '  (' + spells[s].classes + ')</h5>' +
            '</div>' +
            '</a>' +
            '</div>' +
            '<div id="' + spellListReference + '" class="panel-collapse collapse">' +
            '<div class="panel-body">' +
            '<div class="spellInfo">' +
            '<div class="spellTime">' +
            '<h5>Casting Time: </h5>' + spells[s].time +
            '</div>' +
            '<div class="spellRange">' +
            '<h5>Range: </h5>' + spells[s].range +
            '</div>' +
            '<div class="spellComponents">' +
            '<h5>Components: </h5>' + spells[s].components +
            '</div>' +
            '<div class="spellDuration">' +
            '<h5>Duration: </h5>' + spells[s].duration +
            '</div>' +
            '</div>' +
            '<div class="spellDescription">' +
            spellTextHTML +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</li>';

        $("#spellList").append(spellListHTML);
    }
}
function prepApp() {

    //Add Monsters
    addMonsters(monsters,'#monsterList', false, 0);
    addSpells();

    //Populate Items
    console.log("Items Length: ", items.length);
    for (var a = 0; a < items.length; a++) {

        var itemReferenceName = items[a].name.replace(/\s|[()]|\'|\*|\.|\/|\+|\,/g, '');
        itemReferenceName = itemReferenceName.toLowerCase();
        var itemReference = '_' + itemReferenceName;
        var itemText = items[a].description;


        var itemTextHTML = '';

        for (var i = 0; i < itemText.length; i++) {
            itemTextHTML += '<div class="itemText">' +
                itemText[i] + '<br />' +
                '</div>';
        }

        //Load Item Modals for use across program.
        if ($("#" + itemReferenceName).length == 0) {
            var itemHTML = '<div class="modal fade" id="' + itemReferenceName + '" role="dialog">' +
                '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                items[a].name +
                '<h5>' + items[a].type + ' (' + items[a].weight + 'lbs.)</h5>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div class="itemInfo">' +
                '<div class="itemAC">' +
                '<h5>AC: </h5>' + items[a].ac +
                '</div>' +
                '<div class="itemStrength">' +
                '<h5>Strength: </h5>' + items[a].strength +
                '</div>' +
                '<div class="itemStealth">' +
                '<h5>Stealth: </h5>' + items[a].stealth +
                '</div>' +
                '</div>' +
                '<div class="itemDescription">' +
                itemTextHTML +
                '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        $("#itemModList").append(itemHTML);

        //Load into Item List
        var itemListHTML = '' +
            '<li>' +
            '<div class="item panel panel-default">' +
            '<div class="panel-heading">' +
            '<a data-toggle="collapse" href="#' + itemReference + '">' +
            '<div class="itemName">' +
            '<h2>' + items[a].name + '</h2>' +
            '<h5>' + items[a].type + ' (' + items[a].weight + 'lbs.)</h5>' +
            '</div>' +
            '</a>' +
            '</div>' +
            '<div id="' + itemReference + '" class="panel-collapse collapse">' +
            '<div class="panel-body">' +
            '<div class="itemInfo">' +
            '<div class="itemAC">' +
            '<h5>AC: </h5>' + items[a].ac +
            '</div>' +
            '<div class="itemStrength">' +
            '<h5>Strength: </h5>' + items[a].strength +
            '</div>' +
            '<div class="itemStealth">' +
            '<h5>Stealth: </h5>' + items[a].stealth +
            '</div>' +
            '</div>' +
            '<div class="itemDescription">' +
            itemTextHTML +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</li>';

        $("#itemList").append(itemListHTML);
    }

    //***************Populate Characters****************************
    addCharacters(characters, '#characterList', false, 0);

    //****************Populate Encounters****************************
    addEncounters();
}

//Load DBS
var getAllInfo = await('monsters', 'spells', 'items', 'characters', 'classes', 'races', 'encounters', 'backgrounds');
monsterDBLoad();
spellDBLoad();
CCDBLoad();
characterDBLoad();
itemDBLoad();
encounterDBLoad();

console.log("Waiting for the then...");
getAllInfo.then(function (got){
    console.log("Here we goooo");

    //Populate all info.
    prepApp();
    populateDropdowns();
    loadEncounterTypes();
});


//For populating things that need to exist first.
$(document).ready(function(){
    //Monster Search
    $("#monsterSearch").on("keyup", function() {
        var g = $(this).val().toLowerCase();
        $(".monsterName").each(function() {
            var s = $(this).text().toLowerCase();
            $(this).closest('.monster')[ s.indexOf(g) !== -1 ? 'show' : 'hide' ]();
        });
    });

    //Spell Search
    $("#spellSearch").on("keyup", function() {
        var g = $(this).val().toLowerCase();
        $(".spellName").each(function() {
            var s = $(this).text().toLowerCase();
            $(this).closest('.spell')[ s.indexOf(g) !== -1 ? 'show' : 'hide' ]();
        });
    });

    //Item Search
    $("#itemSearch").on("keyup", function() {
        var g = $(this).val().toLowerCase();
        $(".itemName").each(function() {
            var s = $(this).text().toLowerCase();
            $(this).closest('.item')[ s.indexOf(g) !== -1 ? 'show' : 'hide' ]();
        });
    });
});
