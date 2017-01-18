/**
 * Created by Tipster on 1/10/2017.
 */

function loadEncounterTypes(){
    console.log("Encounter stuff..");
    var monsterChoices = [];
    var characterChoices = [];

    for(var i=0; i < monsters.length; i++){
        monsterChoices += "<option>" + monsters[i].name + "</option>";
    }

    for(i=0; i < characters.length; i++){
        characterChoices += "<option>" + characters[i].name + "</option>";
    }

    $('#encounterType').on('change', function(){
        var selectedType = $(this).val();
        if(selectedType == "Character"){
           $('#encounterChoice').html(characterChoices);
        }
        else{
            $('#encounterChoice').html(monsterChoices);
        }
        $('#encounterChoice').selectpicker('refresh');
    });

    $('#encounterType').trigger('change');
}

function addParticipants(){
    var chosenParticipant = $('#encounterChoice').val();
    var selectedType = $('#encounterType').val();

    if(selectedType == "Character"){
        for(var i=0;i < chosenParticipant.length; i++){
            var match = $.grep(characters, function(e){ return e.name == chosenParticipant[i]});
            addCharacters(match, '#encounterNewOverview');
        }
    }
    else{
        for(var i=0;i < chosenParticipant.length; i++){
            var match = $.grep(monsters, function(e){ return e.name == chosenParticipant[i]});
            addMonsters(match, '#encounterNewOverview', true, '');
        }
    }
}

function removeParticipant(participantID){
    console.log("ID: ", participantID);
    $(participantID).parent().parent().remove();
}

//Saves new encounter Info
var encounter ={
    name: '',
    participants: []
};


function editEncounter(encounterName){
    setModalSize('#encounterCreator');
    var encounter = $.grep(encounters, function(e){ return e.name == encounterName});
    var participantList = [];
    $('#editEncounter').val(encounterName);
    $('#encounterNewName').val(encounterName);

    for(var i=0; i < encounter.length; i++){
        console.log("Checking Encounter: ", encounter[i].name);
        for(var k=0; k < encounter[i].participants.length; k++){
            console.log("Participants: ", encounter[i].participants[k].name);
            var properName = encounter[i].participants[k].name.split('_')[0];
            var counterReference = '#' + encounter[i].participants[k].name.split('_')[0].replace(/\s|[()]/g, '') + 'counter';
            console.log("Counter Reference: ", counterReference);

            if(participantList.indexOf(properName) >= 0){
                increment(counterReference);
            }
            else {
                participantList.push(properName);
                if (encounter[i].participants[k].type == "player") {
                    var match = $.grep(characters, function (e) {
                        return e.name == properName
                    });
                    addCharacters(match, '#encounterNewOverview', true);
                }
                else {
                    var match = $.grep(monsters, function (e) {
                        return e.name == properName
                    });
                    addMonsters(match, '#encounterNewOverview', true, '');
                }
            }
        }
    }
}

function saveNewEncounter(){
    var update = $('#editEncounter').val();
    var encounterInfo = $.extend({}, encounter);
    encounterInfo.name = $('#encounterNewName').val();
    encounterInfo.participants = $.extend([], []);

    $('#encounterNewOverview').children('li').each(function(){
        $(this).children('.monster').each(function(){
            //Find the counter value.
            var tempName = $(this).find('.monsterName').children('h2').html();
            var counterReference = '#' + tempName.replace(/\s|[()]/g, '') + 'counter';
            var totalNumber = Number($(this).find(counterReference).val());

            var name = $(this).find('.monsterName').children('h2').html();

            //hp handling
            var allhpInfo = $(this).find('.monsterHP').html().split('<h4>HP: </h4> ')[1];
            var hpSplit = allhpInfo.split(' ');
            var averageHP = hpSplit[0];
            var hitDieString = hpSplit[1];
            var hitDieCleaup = hitDieString.replace(/\s|[()]|\'|\*|\.|\/|\,/g, '');
            var dieSplitString = hitDieCleaup.split('d');
            var dieNum = Number(dieSplitString[0]);
            var dieTypeString = dieSplitString[1].split('+');
            var dieType = Number(dieTypeString[0]);
            var add = 0;
            if(dieTypeString[1] != undefined)
                add = Number(dieTypeString[1]);

            var result = 0;

            //xp & Challenge Rating handling
            var xpString = $(this).find('.monsterCR').html().split('(');
            var cr = xpString[0].split('<h5>Challenge: </h5>')[1];
            var xpTemp = xpString[1].split('xp')[0];
            var xp = xpTemp.replace(/,/g, '');

            for(var i=0; i < totalNumber; i++){
                if($('#hitDieCheck').is(":checked")) {
                    result = rollDie(dieNum, dieType) + add;
                }
                else
                    result = averageHP;
                var participantInfo = $.extend({}, {});
                participantInfo.name = name + "_" + String(i);
                participantInfo.totalHP = result;
                participantInfo.currentHP = result;
                participantInfo.turn = '0';
                participantInfo.type = 'monster';
                participantInfo.xp = xp;
                participantInfo.cr = cr;

                encounterInfo.participants.push(participantInfo);
            }
        });

        $(this).children('.character').each(function(){
            var participantInfo = $.extend({},{});

            participantInfo.name = $(this).find('.characterName').children('h2').html().split(' -')[0];

            var hpInfo = $(this).find('.monsterHP').html().split('<h4>HP: </h4> ')[1];
            var hpSplit = hpInfo.split('/');

            participantInfo.totalHP = hpSplit[1];
            participantInfo.currentHP = hpSplit[0];
            participantInfo.turn = '0';
            participantInfo.type = 'player';
            participantInfo.xp = "0";
            participantInfo.cr = "0";

            encounterInfo.participants.push(participantInfo);
        });

    });

    //Insert into Encounter Database
    if(update != "0"){
        encounterDB.update({name: update}, { $set: {name: encounterInfo.name, participants: encounterInfo.participants}}, function(err){
            console.log("Updated...");
        });
    }
    else {
        encounterDB.insert(encounterInfo, function (err, doc) {
            console.log("Inserted", doc.name, 'with ID', doc._id);
        });
    }

    reloadEncounters();
}