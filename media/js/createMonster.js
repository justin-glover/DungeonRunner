/**
 * Created by Tipster on 1/18/2017.
 */
function saveMonster(){

}

function addTrait(){

    var newTraitHTML = '' +
            '<div class="newMonsterTrait">' +
                '<h4>Trait Name:<input type="text" class="newMonsterTrait" placeholder="Fast Dude"/></h4>' +
                '<hr>' +
                '<label>Description</label>' +
                '<textarea rows="5" class="newMonsterTraitDesc descriptionInput"></textarea>' +
            '</div>';

    $('#newMonsterTraitList').append(newTraitHTML);
}

function addAction(){
    var newActionHTML = '' +
                '<div class="monsterAction">' +
                    '<h4>Action Name:<input type="text" class="newMonsterTrait" placeholder="Claws"/></h4>' +
                    '</br>' +
                    '<label>Description</label>' +
                    '<textarea rows="5" class="newMonsterAction descriptionInput"></textarea>' +
                    '<b>Hit:</b>' +
                    '<input type="text" id="newMonsterActionHit" placeholder="6 (1d8 + 1)" />' +
                '</div>';

    $('#newMonsterActionList').append(newActionHTML);
}

function addLegendary(){
    var newLegendaryHTML = '' +
             '<div class="monsterLegendary">' +
                '<h4>Legendary Name:<input type="text" class="newMonsterLegendary" placeholder="Quick Strike"/></h4>' +
                '<hr>' +
                '<label>Description</label>' +
                '<textarea rows="5" class="newMonsterLegendary descriptionInput"></textarea>' +
            '</div>';

    $('#newMonsterLegendList').append(newLegendaryHTML);
}
function injectCreateMonster(){
    
    var fillHTML = '' +
                '<div class="panel-heading">' +
                    '<div class="headerInfo innerInfo">' +
                                    '<div class="monsterName">' +
                                        '<label for="newMonsterName">Name:</label>' +
                                        '<h2><input type="text" id="newMonsterName" placeholder="Bibbidy Boo" /></h2>' +
                                    '</div>' +
                                    '<div class="monsterQuickInfo" style="margin-top:0px;">' +
                                      '<label for="newMonsterSize">Size:</label>' +
                                      '<input type="text" id="newMonsterSize" placeholder="medium" />' +
                                      '<label for="newMonsterType">Type:</label>' +
                                      '<input type="text" id="newMonsterType" placeholder="undead"/>' +
                                      '<label for="newMonsterAlign">Alignment:</label>' +
                                      '<input type="text" id="newMonsterAlign" placeholder="lawful evil" />' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div id="" class="panel monsterID">' +
                                '<div class="panel-body">' +
                                    '<div class="monsterStats">' +
                                        '<div class="monsterQuickStats">' +
                                            '<div class="monsterAC">' +
                                                '<h4>Armor Class: </h4>' +
                                                '<input type="text" id="newMonsterAC" placeholder="10"/>' +
                                            '</div>' +
                                            '<div class="monsterHP">' +
                                                '<h4>HP: </h4>' +
                                                '<input type="text" id="newMonsterHP" placeholder="5 (1d8)"/>' +
                                            '</div>' +
                                            '<div class="monsterSpeed">' +
                                                '<h4>Speed: </h4>' +
                                                '<input type="text" id="newMonsterSpeed" placeholder="30 ft"/>' +
                                            '</div>' +
                                        '</div>' +
                                        '<hr>' +
                                        '<div class="monsterAbilities">' +
                                            '<div class="monsterSTR">' +
                                                '<h5>STR</h5>' +
                                                '<input type="number" id="newMonsterSTR" placeholder="10" />' +
                                            '</div>' +
                                            '<div class="monsterDEX">' +
                                                '<h5>DEX</h5>' +
                                                '<input type="number" id="newMonsterDEX" placeholder="10" />' +
                                            '</div>' +
                                            '<div class="monsterCON">' +
                                                '<h5>CON</h5>' +
                                                '<input type="number" id="newMonsterCON" placeholder="10" />' +
                                            '</div>' +
                                            '<div class="monsterINT">' +
                                                '<h5>INT</h5>' +
                                                '<input type="number" id="newMonsterINT" placeholder="10" />' +
                                            '</div>' +
                                            '<div class="monsterWIS">' +
                                                '<h5>WIS</h5>' +
                                                '<input type="number" id="newMonsterWIS" placeholder="10" />' +
                                            '</div>' +
                                            '<div class="monsterCHA">' +
                                                '<h5>CHA</h5>' +
                                                '<input type="number" id="newMonsterCHA" placeholder="10" />' +
                                            '</div>' +
                                        '</div>' +
                                        '<hr>' +
                                        '<div class="monsterDetailBlock">' +
                                            '<div class="monsterSaves">' +
                                              '<h5>Saving Throws: </h5>' +
                                              '<input type="text" id="newMonsterSaves" placeholder="dexterity"/>' +
                                            '</div>' +
                                            '<div class="monsterSkills">' +
                                                '<h5>Skills: </h5>' +
                                                '<input type="text" id="newmonsterSkills" placeholder="Perception +5"/>' +
                                            '</div>' +
                                            '<div class="monsterVulners">' +
                                                '<h5>Damage Vulnerabilities: </h5>' +
                                                '<input type="text" id="newMonsterVulners" placeholder="poison"/>' +
                                            '</div>' +
                                            '<div class="monsterResists">' +
                                                '<h5>Damage Resistances: </h5>' +
                                                '<input type="text" id="newMonsterResists" placeholder="fire"/>' +
                                            '</div>' +
                                            '<div class="monsterImmune">' +
                                                '<h5>Damage Immunities: </h5>' +
                                                '<input type="text" id="newMonsterImmune" placeholder="radiant"/>' +
                                            '</div>' +
                                            '<div class="monsterConditionImmune">' +
                                                '<h5>Condition Immunities: </h5>' +
                                                '<input type="text" id="newMonsterCoditionImmune" placeholder="poisoned"/>' +
                                            '</div>' +
                                            '<div class="monsterSenses">' +
                                                '<h5>Senses: </h5>' +
                                                '<input type="text" id="newMonsterSenses" placeholder="darkvision 60 ft"/>' +
                                            '</div>' +
                                            '<div class="monsterPassivePerception">' +
                                                '<h5>Passive Perception: </h5>' +
                                            '</div>' +
                                            '<div class="monsterLanguage">' +
                                                '<h5>Languages: </h5>' +
                                                '<input type="text" id="newMonsterLanguage" placeholder="common"/>' +
                                            '</div>' +
                                            '<div class="monsterCR">' +
                                                '<h5>Challenge: </h5>' +
                                                '<input type="text" id="newMonsterCR" placeholder="5"/>' +
                                            '</div>' +
                                        '</div>' +
                                        '<hr>' +
                                    '</div>' +
                                    '<div class="newMonsterTraits">' +
                                        '<h2>Traits</h2>' +
                                        '<div id="newMonsterTraitList">' +
                                            '<div class="newMonsterTrait">' +
                                                '<h4>Trait Name:<input type="text" class="newMonsterTrait" placeholder="Fast Dude"/></h4>' +
                                                '<hr>' +
                                                '<label>Description</label>' +
                                                '<textarea rows="5" class="newMonsterTraitDesc descriptionInput"></textarea>' +
                                            '</div>' +
                                        '</div>' +
                                        '<button type="button" class="btn btn-info btn-lg" onclick="addTrait();">Add Trait</button>' +
                                    '</div>' +
                                    '<div class="monsterActions">' +
                                        '<h2>Actions</h2>' +
                                        '<div id="newMonsterActionList">' +
                                            '<div class="monsterAction">' +
                                                '<h4>Action Name:<input type="text" class="newMonsterTrait" placeholder="Claws"/></h4>' +
                                                '</br>' +
                                                '<label>Description</label>' +
                                                '<textarea rows="5" class="newMonsterAction descriptionInput"></textarea>' +
                                                '<b>Hit:</b>' +
                                                '<input type="text" id="newMonsterActionHit" placeholder="6 (1d8 + 1)" />' +
                                            '</div>' +
                                        '</div>' +
                                        '<button type="button" class="btn btn-info btn-lg" onclick="addAction();">Add Action</button>' +
                                    '</div>' +
                                    '<div class="monsterLegendaries">' +
                                        '<h2>Legendary Actions</h2>' +
                                        '<div id="newMonsterLegendList">' +
                                            '<div class="monsterLegendary">' +
                                                '<h4>Legendary Name:<input type="text" class="newMonsterLegendary" placeholder="Quick Strike"/></h4>' +
                                                '<hr>' +
                                                '<label>Description</label>' +
                                                '<textarea rows="5" class="newMonsterLegendary descriptionInput"></textarea>' +
                                            '</div>' +
                                        '</div>' +
                                        '<button type="button" class="btn btn-info btn-lg" onclick="addLegendary();">Add Legendary Action</button>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
    
    $('#newMonster').html(fillHTML);
}

