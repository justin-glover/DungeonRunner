var remote = require('electron').remote;
var dialog = require('electron').remote.dialog;

//Load up monsterDatabase
var Datastore = require('nedb');
var saveDirectory = remote.app.getPath('documents') + "\\DungeonRunner\\";
var monsterDBName = saveDirectory + "monsterDB";

var spellDBName = saveDirectory + "spellDB";
var CCDBName = saveDirectory + "CCDB";
var characterDBName = saveDirectory + "characterDB";
var itemDBName = saveDirectory + "itemDB";

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


//Loads and saves the bestiary info
var monster = {
    name: '',
    size: '',
    type: '',
    alignment: '',
    ac: '',
    hp: '',
    speed: '',
    str: '',
    dex: '',
    con: '',
    int: '',
    wis: '',
    cha: '',
    saves: '',
    skills: '',
    vulnerable: '',
    resist: '',
    immune: '',
    conditionImmune: '',
    senses: '',
    passive: '',
    languages: '',
    cr: '',
    traits: [],
    actions: [],
    legendaries: []
};

function loadXMLMonsterFile(){
    var path = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'All Files', extensions: ['*']}
        ]
    });

    $.ajax({
    type: "GET",
    url: path,
    dataType: "xml",
    success: function (xml){

        $(xml).find('monster').each(function () {
            var cloneMonster = $.extend({}, monster);
            cloneMonster.name = $(this).children('name').text();
            cloneMonster.size = $(this).children('size').text();

            //Split manual type out
            var typeManual = $(this).children('type').text();
            var type = typeManual.split(',');
            cloneMonster.type = type;
            cloneMonster.alignment = $(this).children('alignment').text();
            cloneMonster.ac = $(this).children('ac').text();
            cloneMonster.hp = $(this).children('hp').text();
            cloneMonster.speed = $(this).children('speed').text();

            //Stats
            cloneMonster.str = $(this).children('str').text();
            cloneMonster.dex = $(this).children('dex').text();
            cloneMonster.con = $(this).children('con').text();
            cloneMonster.int = $(this).children('int').text();
            cloneMonster.wis = $(this).children('wis').text();
            cloneMonster.cha = $(this).children('cha').text();

            //Detailed Info
            cloneMonster.saves = $(this).children('save').text();
            cloneMonster.skills = $(this).children('skill').text();
            cloneMonster.vulnerable = $(this).children('vulnerable').text();
            cloneMonster.resist = $(this).children('resist').text();
            cloneMonster.immune = $(this).children('immune').text();
            cloneMonster.conditionImmune = $(this).children('conditionImmune').text();
            cloneMonster.senses = $(this).children('senses').text();
            cloneMonster.passive = $(this).children('passive').text();
            cloneMonster.languages = $(this).children('languages').text();
            cloneMonster.cr = $(this).children('cr').text();
            cloneMonster.traits = $.extend([], []);
            cloneMonster.actions = $.extend([], []);
            cloneMonster.legendaries = $.extend([], []);

            //Get and populate traits
            if($(this).children('trait').length != 0){
                $(this).children('trait').each(function(){
                    var traitInfo = $.extend({}, {name: '', text: ''});
                    traitInfo.name = $(this).children('name').text();

                    var text = $.extend([], []);
                    $(this).children('text').each(function(){
                        text.push($(this).text());
                    });
                    traitInfo.text = text;

                    cloneMonster.traits.push(traitInfo);
                });
            }

            //Get and populate actions
            $(this).children('action').each(function(){
                var actionInfo = $.extend({}, {name: '', text: ''});
                actionInfo.name = $(this).children('name').text();
                actionInfo.text = $(this).children('text').text();

                cloneMonster.actions.push(actionInfo);
            });

            //Get and populate Legendary Actions
            if( $(this).children('legendary').length != 0) {
                $(this).children('legendary').each(function () {
                    var legendaryInfo = $.extend({}, {name: '', text: ''});
                    legendaryInfo.name = $(this).children('name').text();
                    legendaryInfo.text = $(this).children('text').text();

                    cloneMonster.legendaries.push(legendaryInfo);
                });
            }

            //Insert into Monster Database
            monsterDB.insert(cloneMonster, function(err, doc){
                console.log("Inserted", doc.name, 'with ID', doc._id);
            });
        });
        reloadMonsters();
        }
    });
}


//Spell DB layout
var spell = {
    name: '',
    level: '',
    school: '',
    ritual: '',
    time: '',
    range: '',
    components: '',
    duration: '',
    classes: '',
    text: [],
    roll: []
};

function loadXMLSpellsFile(){
    var path = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'All Files', extensions: ['*']}
        ]
    });

    $.ajax({
        type: "GET",
        url: path,
        dataType: "xml",
        success: function (xml) {

            $(xml).find('spell').each(function () {
                var cloneSpell = $.extend({}, spell);

                cloneSpell.name = $(this).children('name').text();
                cloneSpell.level = $(this).children('level').text();
                cloneSpell.school = $(this).children('school').text();
                cloneSpell.ritual = $(this).children('ritual').text();
                cloneSpell.time = $(this).children('time').text();
                cloneSpell.range = $(this).children('range').text();
                cloneSpell.components = $(this).children('components').text();
                cloneSpell.duration = $(this).children('duration').text();
                cloneSpell.classes = $(this).children('classes').text();

                var spellText = $.extend([], []);
                $(this).children('text').each(function () {
                    spellText.push($(this).text());
                });
                cloneSpell.text = spellText;

                var spellRolls = $.extend([], []);
                $(this).children('roll').each(function () {
                    spellRolls.push($(this).text());
                });
                cloneSpell.roll = spellRolls;

                console.log("Clonespell: ", cloneSpell);
                //Insert into Spell Database
                spellDB.insert(cloneSpell, function (err, doc) {
                    console.log("Inserted", doc.name, 'with ID', doc._id);
                });

            });
            reloadSpells();
        }
    });
}


//Upload the races to the CCDB
var raceStructure = {
    name: '',
    type: 'race',
    size: '',
    speed: '',
    ability: '',
    proficiency: '',
    traits: []
};

function uploadRaces(){
    var path = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'All Files', extensions: ['*']}
        ]
    });

     $.ajax({
         type: "GET",
         url: path,
         dataType: "xml",
         success: function (xml) {
             $(xml).find('race').each(function(){
                var cloneRace = $.extend({}, raceStructure);
                cloneRace.name = $(this).children('name').text();
                cloneRace.size = $(this).children('size').text();
                cloneRace.speed = $(this).children('speed').text();
                cloneRace.ability = $(this).children('ability').text();
                cloneRace.proficiency = $(this).children('proficiency').text();

                var raceTraits = $.extend([], []);
                $(this).children('trait').each(function () {
                    var trait = $.extend({}, {name: '', text: ''});
                    trait.name = $(this).children('name').text();
                    trait.text = $(this).children('text').text();
                    raceTraits.push(trait);
                });
                cloneRace.traits = raceTraits;

                 //Insert into Character Creation Database
                CCDB.insert(cloneRace, function (err, doc) {
                    console.log("Inserted", doc.name, 'with ID', doc._id);
                });
             });
            reloadCCDB();
         }
     });
}

//Upload Classes to the CCDB
var classStructure ={
    name: '',
    type: 'class',
    hd: '',
    proficiency: '',
    spellAbility: '',
    spellSlotLevels: {},
    features: {},
    itemSlots: {},
};

function uploadClasses(){
    var path = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'All Files', extensions: ['*']}
        ]
    });

     $.ajax({
         type: "GET",
         url: path,
         dataType: "xml",
         success: function (xml) {
             $(xml).find('class').each(function(){
                var cloneClass = $.extend({}, classStructure);
                cloneClass.name = $(this).children('name').text();
                cloneClass.hd = $(this).children('hd').text();
                cloneClass.proficiency = $(this).children('proficiency').text();
                cloneClass.spellAbility = $(this).children('proficiency').text();

                //Handling for spell slots and features
                var slotList = $.extend([],[]);
                var features = $.extend([], []);

                $(this).children('autolevel').each(function(){
                    var level = $(this).attr('level');

                    if($(this).children('slots').length > 0){
                        var spellSlots = $.extend({}, {});
                        spellSlots.level = level;
                        spellSlots.slots = $(this).children('slots').text();
                        slotList.push(spellSlots);
                    }

                    if($(this).children('feature').length > 0){

                        $(this).children('feature').each(function(){
                            var featureDict = $.extend({}, {});
                            featureDict.level = level;
                            featureDict.optional = $(this).attr('optional');
                            featureDict.name = $(this).children('name').text();

                            var text = $.extend([], []);
                            $(this).children('text').each(function(){
                                text.push($(this).text());
                            });
                            featureDict.text= text;

                            if($(this).children('modifier').length > 0) {
                                featureDict.modifier = {
                                    modifier: $(this).children('modifier').text(),
                                    category: $(this).children('modifier').attr('category')
                                };
                            }
                            features.push(featureDict);
                        });
                    }
                });
                cloneClass.spellSlotLevels = slotList;
                cloneClass.features = features;

                //Insert into Character Creation Database
                CCDB.insert(cloneClass, function (err, doc) {
                    console.log("Inserted", doc.name, 'with ID', doc._id);
                });
             });

             reloadCCDB();
         }
     });
}

//Load and save Background XML to DB
var backgroundStructure = {
    name: '',
    type: 'background',
    proficiency: '',
    trait: []
};

function uploadBackgrounds() {
    var path = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'All Files', extensions: ['*']}
        ]
    });

    $.ajax({
        type: "GET",
        url: path,
        dataType: "xml",
        success: function (xml) {
            $(xml).find('background').each(function () {
                var cloneBG = $.extend({}, backgroundStructure);
                var traits = $.extend([], []);

                cloneBG.name = $(this).children('name').text();
                cloneBG.proficiency = $(this).children('proficiency').text();

                $(this).children('trait').each(function(){
                   var trait = $.extend({}, {});

                   trait.name = $(this).children('name').text();

                   var text = $.extend([], []);
                   $(this).children('text').each(function(){
                        text.push($(this).text());
                   });

                    trait.text = text;
                    traits.push(trait);
                });

                cloneBG.trait = traits;

                //Insert into Character Creation Database
                CCDB.insert(cloneBG, function (err, doc) {
                    console.log("Inserted", doc.name, 'with ID', doc._id);
                });
            });

            reloadCCDB();
        }
    });
}

//Load and save Feats to CCDB
var featStructure = {
    name: '',
    type: 'feat',
    description: [],
    modifier: {}
};

function uploadFeats() {
    var path = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'All Files', extensions: ['*']}
        ]
    });

    $.ajax({
        type: "GET",
        url: path,
        dataType: "xml",
        success: function (xml) {
            $(xml).find('feat').each(function () {
                var cloneFeat = $.extend({}, featStructure);
                cloneFeat.description = $.extend([],[]);
                cloneFeat.name = $(this).children('name').text();
                cloneFeat.modifier = $.extend({}, {});

                $(this).children('text').each(function(){
                   cloneFeat.description.push($(this).text());
                });

                var level = $(this).attr('level');
                cloneFeat.modifier.category = $(this).children('modifier').attr('category');
                cloneFeat.modifier.text = $(this).children('modifier').text();

                //Insert into Character Creation Database
                CCDB.insert(cloneFeat, function (err, doc) {
                    console.log("Inserted", doc.name, 'with ID', doc._id);
                });
            });

            CCDBLoad();
        }
    });
}

//Load and save Character Sheet
var characterStructure = {
    name:'',
    race: '', //{source, name, speed, feats, mods}
    class: '', //{source, id, name, level, hd, hdCurrent, spellAbility, slots, slotsCurrent, spells []}
    subclass: '',
    level: '',
    background: '',
    xp: '',
    abilities: '', //Str, int, etc
    proficiencies: '', //medicine, acrobatics, etc.
    hpMax: '',
    hpCurrent: '',
    hpTemp: '',
    items: [],
    spellSlots: [],
    spellSlotsCurrent: [],
    spells: []
};

function uploadCharacter(){
    var path = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'All Files', extensions: ['*']}
        ]
    });

    $.ajax({
        type: "GET",
        url: path,
        dataType: "xml",
        success: function (xml) {
            $(xml).find('character').each(function () {
                var cloneCharacter = $.extend({}, characterStructure);
                cloneCharacter.name = $(this).children('name').text();
                cloneCharacter.race = $(this).children('race').children('name').text();
                cloneCharacter.class = $(this).children('class').children('name').text();
                cloneCharacter.level = $(this).children('class').children('level').text();
                cloneCharacter.background = $(this).children('background').text();
                cloneCharacter.xp = $(this).children('xp').text();
                cloneCharacter.abilities = $(this).children('abilities').text();
                cloneCharacter.hpMax = $(this).children('hpMax').text();
                cloneCharacter.hpCurrent = $(this).children('hpCurrent').text();
                cloneCharacter.hpTemp = $(this).children('hpTemp').text();
                cloneCharacter.items = $.extend([], []);
                cloneCharacter.spellSlots = $(this).children('class').children('slots').text().split(',');
                cloneCharacter.spellSlotsCurrent = $(this).children('class').children('slotsCurrent').text().split(',');
                cloneCharacter.proficiencies = $.extend([], []);

                $(this).children('item').each(function(){
                    var itemInfo = $.extend({}, {});

                    itemInfo.name = $(this).children('name').text();

                    if($(this).children('quantity').length > 0){
                        itemInfo.quantity = $(this).children('quantity').text();
                    }
                    else{
                        itemInfo.quantity = '1';
                    }
                    cloneCharacter.items.push(itemInfo);
                });

                //Search for subclass by checking spells and feats.
                $(this).children('class').children('feat').each(function(){
                    var featName = $(this).children('name').text();
                    console.log("Feat Name: ", featName);
                    console.log("SubClassReference: ", subClassReference[cloneCharacter.class]);
                    for(var key in subClassReference[cloneCharacter.class]){
                        if(featName.includes(key)){
                            cloneCharacter.subclass = subClassReference[cloneCharacter.class][key];
                            console.log("Character Subclass: ", cloneCharacter.subclass);
                        }
                    }
                });

                $(this).children('class').children('spell').each(function(){
                    cloneCharacter.spells.push($(this).children('name').text());
                    $(this).children('sclass').each(function(){
                       for (var key in subClassReference[cloneCharacter.class]){
                           var spellClass = $(this).text();
                           if(spellClass.includes(key)){
                                cloneCharacter.subclass = subClassReference[cloneCharacter.class][key];
                                console.log("Character Subclass: ", cloneCharacter.subclass);
                           }
                       }
                    });
                });

                //Grab proficiencies from class, race, and class mods (maybe race mods in the future).
                $(this).children('class').children('proficiency').each(function(){
                        cloneCharacter.proficiencies.push(abilityImportDict[$(this).text()]);
                });

                $(this).children('race').children('proficiency').each(function(){
                        cloneCharacter.proficiencies.push(abilityImportDict[$(this).text()]);
                });

                console.log("Proficiencies: ",cloneCharacter.proficiencies);

                //Insert into Character Database
                characterDB.insert(cloneCharacter, function (err, doc) {
                    console.log("Inserted", doc.name, 'with ID', doc._id);
                });

            });
            reloadCharacters();
        }
    });
}

//Load and save Items to itemDB
var itemStructure = {
    name: '',
    type: '',
    weight: '',
    description: []
};

function uploadItems(){
    var path = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'All Files', extensions: ['*']}
        ]
    });

    $.ajax({
        type: "GET",
        url: path,
        dataType: "xml",
        success: function (xml) {
            $(xml).find('item').each(function () {
                var cloneItem = $.extend({}, itemStructure);

                cloneItem.name = $(this).children('name').text();
                cloneItem.type = $(this).children('type').text();
                cloneItem.weight = $(this).children('weight').text();
                cloneItem.description = $.extend([], []);

                if($(this).children('ac').length > 0){
                    cloneItem.ac = $(this).children('ac').text();
                }

                if($(this).children('strength').length > 0){
                    cloneItem.strength = $(this).children('strength').text();
                }

                if($(this).children('stealth').length > 0){
                    cloneItem.stealth = $(this).children('stealth').text();
                }

                $(this).children('text').each(function(){
                    cloneItem.description.push($(this).text());
                });

                // console.log("Item: ", cloneItem);
                //Insert into Character Database
                itemDB.insert(cloneItem, function (err, doc) {
                    console.log("Inserted", doc.name, 'with ID', doc._id);
                });
            });
            reloadItems();
        }
    });
}