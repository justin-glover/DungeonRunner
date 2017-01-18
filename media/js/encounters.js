/**
 * Created by Tipster on 1/10/2017.
 */

function deleteEncounter(elementID, name){
    $(elementID).parent().remove();
    encounterDB.remove({name: name}, function(err, numDeleted){
        console.log("Deleted ", numDeleted, 'encounter(s)');
    });
}

function populateEncounter(encounterName, round){
    $('#allEncounters').hide();
    $('#runningEncounterName').children('h2').html(encounterName);
    $('#runningEncounter').show();

    var activeMonster = $('#encounterOverview').find('.activeTurn').find('.monsterName h2, .characterName h2').html();

    $('#encounterOverview').empty();

    if(round != undefined ){
        roundString(round);
    }

    var encounter = $.grep(encounters, function(e){ return e.name == encounterName});
    var participantList = [];

    for(var i=0; i < encounter.length; i++){
        var initHTML = '';
        for(var k=0; k < encounter[i].participants.length; k++){
            var properName = encounter[i].participants[k].name.split('_')[0];
            var monsterReference = encounter[i].participants[k].name.replace(/\s|[()]/g, '');
            participantList.push(properName);
            
            if (encounter[i].participants[k].type == "player") {
                var match = $.grep(characters, function (e) {
                    return e.name == properName
                });
                addCharacters(match, '#encounterOverview', 'running', Number(encounter[i].participants[k].turn));
            }
            else {
                var match = $.grep(monsters, function (e) {
                    return e.name == properName
                });
                addMonsters(match, '#encounterOverview', "running", encounter[i].participants[k].name, Number(encounter[i].participants[k].turn));
                var finder = '#' + monsterReference;
                var panel = $('#encounterOverview').find(finder).parent();

                $(panel).find('.monsterCurrentHealth').html(encounter[i].participants[k].currentHP);
                $(panel).find('.monsterTotalHealth').html(encounter[i].participants[k].totalHP);
            }

            var splitName = encounter[i].participants[k].name.split('_');
            var name = splitName[0];
            if(splitName[1] != undefined){
                var number = Number(splitName[1]) + 1;
                name += ' #' + String(number);
            }

            var referenceName = 'init' + encounter[i].participants[k].name;

            initHTML += '<li>' +
                            '<div class=".initInfo">' +
                                '<label for="' + name + '" style="display: inline-block;">' + name + '</label>' +
                                '<input type="text" class="form-control" id="' + referenceName + '" placeholder="0" style="display: inline-block; width: 50px;">' +
                            '</div>' +
                        '</li>';
        }
        $('#initiativeList').html(initHTML);
    }

    var li = $('#encounterOverview').children('li');


    li.detach().sort(function(a,b) {
        return $(b).data('turn') - $(a).data('turn');
    });

    $('#encounterOverview').append(li);

    $('#encounterOverview').children('li').each(function(){
       var currentHealth = Number($(this).find('.monsterCurrentHealth').html());
        if(currentHealth == undefined){
            console.log("Player not supported yet");
        }
        else{
            if(currentHealth == 0)
               $(this).children('.monster').children('.panel-heading').addClass('dead');
        }
    });

    if(round == 0 &&  activeMonster == undefined)
        $('#encounterOverview').children('li').first().find('.monster, .character').addClass("activeTurn");
    else
        var searchString = "h2:contains('" + activeMonster + "')";
        $(searchString).closest('li').find('.monster, .character').addClass("activeTurn");

    $("#encounterOverview").children('li').children('.monster, .character').children(".panel-heading").click(function(e) {
        var damageButton = $('#damageButton').attr('enabled');
        var healingButton = $('#healingButton').attr('enabled');
        if ( damageButton == "false" && healingButton == "false") {
            $(this).parent().children('.collapse').collapse("toggle");
            return false;
        }
        else if(damageButton == "true"){
            e.stopPropagation();
            if($(this).parent().hasClass("selectedD")){
                $(this).parent().removeClass("selectedD");
            }
            else{
                $(this).parent().addClass("selectedD");
            }
        }
        else if(healingButton == "true"){
            e.stopPropagation();
            if($(this).parent().hasClass("selectedH")){
                $(this).parent().removeClass("selectedH");
            }
            else{
                $(this).parent().addClass("selectedH");
            }
        }
    });
}

function saveInitiative(){
    var encounterName = $('#runningEncounterName').children('h2').html();
    var encounter = $.grep(encounters, function(e){ return e.name == encounterName});
    // var creatureList = [];
    var participants = [];
    $('#initiativeList').children('li').each(function() {
        var nameString = $(this).find('label').html();
        var splitName = nameString.split(' #');
        var referenceName = "";
        if(splitName[1] == undefined){
            referenceName = splitName[0];
        }
        else {
            var number = Number(splitName[1]) - 1;
            var name = splitName[0];
            referenceName = name.replace(/|[()]|\'|\*|\.|\/|\+|\,/g, '') +'_' + String(number);
        }
        // creatureList.push(referenceName);

        console.log("Reference: ", referenceName);
        var participant = $.grep(encounter[0].participants, function(e){return e.name == referenceName});
        participant[0].turn = $(this).find('input').val();
        participants.push(participant[0]);

    });

    //Save turn to database
    encounterDB.update({name: encounterName}, { $set: {name: encounterName, participants: participants}}, function(err){
        console.log("Updated...");
    });

    populateEncounter(encounterName, 0);
}

function rollInitiative(){
    var initList = [];
    $('#encounterOverview').children('li').each(function(){
        var fixedString = "";
        try{
            var bonusString = $(this).find('.monsterDEX').html().split('+');

            if(bonusString.length < 2){
                fixedString = $(this).find('.monsterDEX').html().split('-')[1];
            }
            else{
                 fixedString = bonusString[1]
            }
            var bonus = fixedString.split(')')[0];
        }
        catch(err){
            var bonusString = $(this).find('.charInit').html().split('+');

            if(bonusString.length < 2){
                fixedString = $(this).find('.charInit').html().split('-')[1];
            }
            else{
                fixedString = bonusString[1];
            }
            var bonus = fixedString;

        }
        initList.push(Number(rollDie(1, 20)) + Number(bonus));
    });

    $('#initiativeList').children('li').each(function(i){
       $(this).find('input').val(initList[i]);
    });
}

function toggleDamage(){
    if($('#damageButton').attr('enabled') == 'true'){
        $('#damageButton').attr('enabled', 'false');
        $('#dealDamageBtn, #damageInput').hide();
        $('#initButton, #healingButton').show();
    }
    else {
        $('#damageButton').attr('enabled', 'true');
        $('#dealDamageBtn, #damageInput').show();
        $('#initButton, #healingButton').hide();
    }
}

function toggleHealing(){
    if($('#healingButton').attr('enabled') == 'true'){
        $('#healingButton').attr('enabled', 'false');
        $('#dealHealingBtn, #healingInput').hide();
        $('#initButton, #damageButton').show();
    }
    else {
        $('#healingButton').attr('enabled', 'true');
        $('#dealHealingBtn, #healingInput').show();
        $('#initButton, #damageButton').hide();
    }
}


//Damage Function
function dealDamage(){
    var encounterName = $('#runningEncounterName').children('h2').html();
    var encounter = $.grep(encounters, function(e){ return e.name == encounterName});
    var damage = Number($('#damageInput').val());
    var participants = [];

    $('#encounterOverview').children('li').each(function() {
        var nameString = $(this).find('.monsterName').children('h2').html();
        var splitName = '';
        var referenceName = "";
        if(nameString == undefined){
            nameString = $(this).find('.characterName').children('h2').html();
            referenceName = nameString.split(' -')[0];
        }
        else{
            referenceName = $(this).find('.dbName').val();
        }

        var participant = $.grep(encounter[0].participants, function(e){return e.name == referenceName});

        if($(this).find('.selectedD').length !=0){
            var currentHealth = $(this).find('.monsterCurrentHealth').html();
            if(currentHealth == undefined){
                console.log("Player not supported yet");
            }
            else{
                var newHealth = Number(currentHealth) - damage;
                if(newHealth < 0){
                    newHealth = 0;
                }
                participant[0].currentHP = String(newHealth);
            }
        }
        participants.push(participant[0]);
    });

    //Save turn to database
    encounterDB.update({name: encounterName}, { $set: {name: encounterName, participants: participants}}, function(err){
        console.log("Updated...");
    });

    toggleDamage();
    $('#damageInput').val('');
    populateEncounter(encounterName, getRound());
}


//Healing Function
function heal(){
    var encounterName = $('#runningEncounterName').children('h2').html();
    var encounter = $.grep(encounters, function(e){ return e.name == encounterName});
    var healing = Number($('#healingInput').val());
    var participants = [];


    $('#encounterOverview').children('li').each(function() {
        var nameString = $(this).find('.monsterName').children('h2').html();
        var splitName = '';
        var referenceName = "";
        if(nameString == undefined){
            nameString = $(this).find('.characterName').children('h2').html();
            referenceName = nameString.split(' -')[0];
        }
        else{
            referenceName = $(this).find('.dbName').val();
        }


        var participant = $.grep(encounter[0].participants, function(e){return e.name == referenceName});

        if($(this).find('.selectedH').length !=0){
            var currentHealth = $(this).find('.monsterCurrentHealth').html();
            if(currentHealth == undefined){
                console.log("Player not supported yet");
            }
            else{
                var newHealth = Number(currentHealth) + healing;

                if(newHealth > Number(participant[0].totalHP)){
                    newHealth = Number(participant[0].totalHP);
                }
                participant[0].currentHP = String(newHealth);
            }
        }
        participants.push(participant[0]);
    });

    //Save turn to database
    encounterDB.update({name: encounterName}, { $set: {name: encounterName, participants: participants}}, function(err){
        console.log("Updated...");
    });

    toggleHealing();
    $('#healingInput').val('');
    populateEncounter(encounterName, getRound());
}

function nextTurn(){
    var current = $('.activeTurn').closest('li');
    var next = $(current).next();
    $(current).find('.monster, .character').removeClass('activeTurn');
    if(next.length == 0){
        $('#encounterOverview').children('li').first().find('.monster, .character').addClass("activeTurn");
        var round = getRound() + 1;
        roundString(round);
    }
    else
        $(next).find('.monster, .character').addClass('activeTurn');
        if($(next).find('.panel-heading').hasClass('dead')){
            nextTurn();
        }
}

function previousTurn(){
    var current = $('.activeTurn').closest('li');
    var prev = $(current).prev();
    $(current).find('.monster, .character').removeClass('activeTurn');
    if(prev.length == 0){
       $('#encounterOverview').children('li').last().find('.monster, .character').addClass("activeTurn");
       var round = getRound() - 1;
       if(round < 0)
           round = 0;
       roundString(round);
    }
    else
        $(prev).find('.monster, .character').addClass('activeTurn');
        if($(prev).find('.panel-heading').hasClass('dead')){
            previousTurn();
        }
}

function getRound(){
    return Number($('#roundCount h2').html().split(' ')[1]);
}

function roundString(round){
    var time = round * 6;
    var roundString = "Round " + String(round) + " - " + String(time) + " seconds passed";

    $("#roundCount h2").html(roundString);
}

function endEncounter(){
    $('#runningEncounter').hide();
    $('#allEncounters').show();
}