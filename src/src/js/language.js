
var LANGUAGE_LIST ={
    "":"",
    "java":{"name":"java","compiler":"java7-openjdk","highlight":"java"},
    "c_cpp":{"name":"C/C++","compiler":"gcc-4.3.6","highlight":"c_cpp"},
    "python2_7":{"name":"Python2.7","compiler":"python-2.7.3","highlight":"python"},
    "python3_3":{"name":"Python3.3","compiler":"python-3.3.2","highlight":"python"},
    "ruby2":{"name":"Ruby2","compiler":"ruby-2.0.0^p247","highlight":"ruby"},
    "lisp":{"name":"Lisp","compiler":"clisp-2.49.0","highlight":"lisp"},
    "sqlite":{"name":"SQLite","compiler":"sqlite-3.8.1","highlight":"sql"},
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

    //フォームオブジェクトを作成
    var form = document.createElement("form");
    document.body.appendChild( form );

    //選択されたコンパイラ情報をセット
    var input = document.createElement("input");
    input.setAttribute( "type" , "hidden");
    input.setAttribute( "name" , "choice_language");
    input.setAttribute( "value" , choice_language);

    //送信先をセット
    form.appendChild(input);
    form.setAttribute("action" , window.location.href);
    form.setAttribute( "method", "POST");

    form.submit();
}