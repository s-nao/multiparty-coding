
var LANGUAGE_LIST ={
    "":"",
    "java":{"name":"java","compiler":"java7-openjdk","highlight":"java"},
    "C":{"name":"C","compiler":"gcc-4.3.6","highlight":"c_cpp"},
    "Python2.7":{"name":"Python2.7","compiler":"python-2.7.3","highlight":"python"},
};

function language_setting(){
    var langListId = document.getElementById("language_list");
    
    langListId.onchange = language_change;

    for(var language in LANGUAGE_LIST){
        if(language == ""){
            continue;
        }
        var option = document.createElement("option");
        
        option.setAttribute("value", language);
        option.innerHTML = LANGUAGE_LIST[language]["name"]
        
        langListId.appendChild(option);
    }
    
    compiler_name = LANGUAGE_LIST[language_name]["compiler"];
    editor_highlight = LANGUAGE_LIST[language_name]["highlight"];
    
}

function language_change(){
    var choice_language = this.options[this.selectedIndex].value;
    
    //compiler_name = LANGUAGE_LIST[language_name]["compiler"];
    //editor_highlight = LANGUAGE_LIST[language_name]["highlight"];
    
    //editor.getSession().setMode(editor_highlight);
    location.href='/coding/' + choice_language;
}