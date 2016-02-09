window.onload = function(){

	var navHeight 	 	= $('nav').height();
	var resultHeight 	= $('#result').height();
	var sideWidth 		= $('#side').width();
	var side_topHeight 	= $('#side_top').height();
	var berheight 		= $('#nav_ber').height();
    
    language_setting();

	resize();
	document.querySelector("#side").style.display = "none";
	document.querySelector("#side").style.bottom = $(window).height() + "px";
	//optionIn();
	changeTab('#output_tab');
	fileChangeTab(0)

	function resize() {

		var wh = $(window).height();
		var ww = $(window).width();

		$('#contain').height(wh - navHeight);
		$('#contain').width(ww);
		$('#editor').height(wh - ( navHeight + resultHeight + berheight) );
		$('#room_menber').height(wh - ( navHeight + side_topHeight ) );
		$('#main').width( ww );

		editor = ace.edit("editor");
		editor.$blockScrolling = Infinity;
		editor.getSession().setUseWrapMode(true);
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableSnippets: true,
			enableLiveAutocompletion: true
		});
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/" + editor_highlight);
		editor.setReadOnly(readOnly);

        editor.setFontSize(15);

		$('#nav_ber').height($('#file_tab').height() + 4);
		$('#editor').height(wh - ( navHeight + resultHeight + $('#nav_ber').height()) );

        if(readOnly) onclickDisable();
	}

	var timer = false;

	$(window).resize(function() {
		if (timer !== false) {
	    clearTimeout(timer);
		}
		timer = setTimeout(function() {
			console.log('resized');
			resize();
		}, 200);
	});
};

var editor;
var initSettled	= false;
var PeerId		= "";
var filelife	= [];
var filelength	= 0;
var editnumber	= 0;
var filenumber	= 0;

function changeTab(tabName) {
	$('#output_tab').hide();
	$('#input_tab').hide();
	document.getElementById('out_button').style.backgroundColor = "transparent";
	document.getElementById('inp_button').style.backgroundColor = "transparent";

//	$("#inp_button").css({ "background-color" : "transparent" });

	if (tabName == "#output_tab") {
		document.getElementById('out_button').style.backgroundColor = "#ccc";
	}else{
		document.getElementById('inp_button').style.backgroundColor = "#ccc";
	}

	$(tabName).show();
}

function compile() {

			var ul = document.querySelector("#file_tab");
			var fl = [];
			var flcnt = 0;
			var files = [];

			for(var i = 0; i < ul.children.length; i++) {
				if(ul.children[i].style.display != "none"){
					fl[flcnt] = i;
					flcnt++;
				}
			}

			for(var i = 0; i < flcnt; i++) {
				files[i] = [
					ul.children[fl[i]].firstElementChild.textContent,
					document.querySelector("#text_buf").children[fl[i]].innerText
				];
			}

            var jsonData = {
        		compiler 	: compiler_name,
        		code 		: files,
        		input_data	: document.getElementById('input_tab').innerText
        	}

            $.ajax({
                type:"POST",
                url: "/running",
                data: JSON.stringify(jsonData),
                contentType: 'application/json', // リクエストの Content-Type
                dataType: "json",

                success:
                function(response) {
                    if(response.status == "0"){
                        $("#output_area").text("");
                        $("#output_area").text(response.program_output);
                    }else{
                        $("#output_area").text("");

                        if("program_error" in response){
                            $("#output_area").text("");
                            $("#output_area").text(response.program_error);
                        }else if("compiler_error" in response){
                            $("#output_area").text("");
                            $("#output_area").text(response.compiler_error);
                        }else{
                            $("#output_area").text("");
                            $("#output_area").text("something error occured");
                        }
                    }
                }
            });
}

function fileChangeTab(filenumber) {
	var ul = document.querySelector("#file_tab");
	for(var i = 0; i < ul.children.length; i++ ){
		ul.children[i].style.backgroundColor = '#454544';
	}
	ul.children[filenumber].style.backgroundColor = 'rgba(32,32,33,1)';
}

function fileAdd() {

	var ul = document.querySelector("#file_tab");
	ul.lastElementChild.lastElementChild.textContent = "×";
	ul.lastElementChild.lastElementChild.setAttribute('onclick','hoge(' + filenumber + ');sendfileDelete(' + filenumber + ')');

	document.querySelector("#text_buf").appendChild(document.createElement('span') );

	var li = document.createElement('li');
	var filename = document.createElement('a');
	var filequit = document.createElement('a');

	filename.textContent = "file" + ++filenumber;
	filename.setAttribute('href','#');
	filename.setAttribute('onclick','fileChange(' + filenumber + ')');
	filename.setAttribute('ondblclick','fileRename(' + filenumber + ')');
	filename.className = "file_name";

	filequit.textContent = "+";
	filequit.setAttribute('href','#');
	filequit.setAttribute('onclick','fileAdd();sendFileAdd();');
	filequit.className = "file_quit";

	li.appendChild(filename);
	li.appendChild(filequit);
	ul.appendChild(li);

	$('#nav_ber').height($('#file_tab').height() + 4);
	$('#editor').height($(window).height() - ( $('nav').height() + $('#result').height() + $('#nav_ber').height()) );

	editor = ace.edit("editor");
	editor.$blockScrolling = Infinity;
	editor.getSession().setUseWrapMode(true);
	editor.setOptions({
			enableBasicAutocompletion: true,
			enableSnippets: true,
			enableLiveAutocompletion: true
	});
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/" + editor_highlight);

    editor.setFontSize(13);

    if(!readOnly) fileRename(filenumber,13);

	if(readOnly) onclickDisable();
}

function fileRename(filenumber,code) {
	var ul = document.querySelector("#file_tab");
	var li = ul.children[filenumber];
	var input = document.createElement('input');

	input.value = li.firstElementChild.textContent;
	input.setAttribute('spellcheck','false');
	input.setAttribute('onblur','commitName(' + filenumber + ',13)');
	input.setAttribute('onkeypress','commitName(' + filenumber + ',event.keyCode)');

	li.firstElementChild.textContent = "";
	li.firstElementChild.appendChild(input);

	input.focus();
	input.select();
}

function commitName(filenumber,code) {

	if(13 === code)
	{
		if(document.querySelector("#file_tab").children[filenumber].firstElementChild.children[0].value == "") {
			alert("ファイル名を入力してください")
			return;
		}
		document.querySelector("#file_tab").children[filenumber].firstElementChild.textContent =
		document.querySelector("#file_tab").children[filenumber].firstElementChild.children[0].value;

		var data = {
			status: "rename",
			filenumber: filenumber,
			commitfilename: document.querySelector("#file_tab").children[filenumber].firstElementChild.textContent
		}

		multiparty.send(data);
	}
}

function sendFileAdd() {

	var data = {
		status:	"fileadd"
	}

	multiparty.send(data);
}

function sendfileDelete(filenumber) {

	var data = {
		status: "filedelete",
		num: 	filenumber
	}

	multiparty.send(data);
}

function hoge(filenumber) {
	var ul = document.querySelector("#file_tab");
	ul.children[filenumber].style.display = "none"

	$('#nav_ber').height($('#file_tab').height() + 4);
	$('#editor').height($(window).height() - ( $('nav').height() + $('#result').height() + $('#nav_ber').height()) );

}

function fileChange(filenumber) {
	var texts = document.querySelector("#text_buf");
	text = texts.children[filenumber];
	editnumber = filenumber;
	editor.setValue(text.innerText,-1);
	fileChangeTab(filenumber);
}

function optionIn() {
	var count = 0;
	var pi = Math.PI;
	var mh = $(window).height();
	document.querySelector("#side").style.bottom = mh + "px";
	document.querySelector("#side").style.display = "block";


	var s = setInterval(function() {
		count += 1;
		document.querySelector("#side").style.bottom = mh - Math.sin(pi/2/120*count)*mh + "px";
		if(count >= 120){
			clearTimeout(s);
		}
	},1);
}

function optionOut() {
	var count = 0;
	var pi = Math.PI;
	var mh = $(window).height();

	var s = setInterval(function() {
		count += 1;
		document.querySelector("#side").style.bottom = Math.sin(pi/2/120*count)*mh + "px";
		if(count >= 120){
			clearTimeout(s);
			document.querySelector("#side").style.display = "none";
		}
	},1);

}

function onclickDisable() {
	var ul = document.querySelector("#file_tab");

	for(var i = 0; i < ul.children.length; i++) {
		ul.children[i].lastElementChild.setAttribute('onclick','');
		ul.children[i].children[ul.children[i].children.length-2].setAttribute('ondblclick','');
	}
}

function editTabMotion(filenumber) {
	var ul = document.querySelector("#file_tab");
	var c  = document.createElement("canvas");
	c.width = 10;
	c.height = 10;
	c.style.marginRight = "5px";
	if ( ! c || ! c.getContext ) { return false; }
	var ctx = c.getContext('2d');
	var a = 0.6;
	var s = 0.1;

	ctx.beginPath();
	ctx.fillStyle = 'rgb(238,99,99)'; // 赤
	ctx.arc(5,6, 4, 0, Math.PI*2, false);
	ctx.fill();

	ul.children[filenumber].insertBefore(c,ul.children[filenumber].firstElementChild);

	return setInterval(function(){
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.globalAlpha = a;
		ctx.fillStyle = 'rgb(178,34,34)'; // 赤
		ctx.arc(5,6, 4, 0, Math.PI*2, false);
		ctx.fill();

		a += s;

		//console.log(a); 

		if (a < 0.6) {
			s *= -1;
		};
		if (a > 1){
			s *= -1;
		}

	},100);
}

var multiparty;
var markId = -1;
var markTab = -1;

function connect(room_name) {

    multiparty = new MultiParty({
        "key": "445d9ac2-98bf-4e76-8f56-66d19235e990",
        //"id" : ""+userId,
        "reliable": true,
        "video" : false,
        "audio" : false,
        "debug": 1,
        "room":room_name
    });

	multiparty.on('peer_ms', function(video) {
		var vNode = MultiParty.util.createVideoNode(video);
		vNode.setAttribute("class", "video peer-video");
	}).on('ms_close', function(peer_id) {
		$("#"+peer_id).remove();
	}).on('dc_open',function(myid){
        if(initSettled) return;

		if(!readOnly) {
			var data = { status: "writerInit" }
			multiparty.send(data);
		}else{
			var data = { status: "init" }
			multiparty.send(data);
		}
	}).on('error', function(err) {
		//alert(err);
	});

	multiparty.on('message', function(mesg) {
	//	editor.setValue(mesg.data, -1);

		if(mesg.data.status == "editcode"){

			if(markTab == -1){
				markTab = mesg.data.value.num;
				markId = editTabMotion(mesg.data.value.num);
			}else if(markTab != mesg.data.value.num) {
				clearInterval(markId);
				document.querySelector("#file_tab").children[markTab].removeChild(document.querySelector("#file_tab").children[markTab].firstElementChild);
				markTab = mesg.data.value.num;
				markId = editTabMotion(mesg.data.value.num);
			}

			if(editnumber == mesg.data.value.num){
				editor.setValue(mesg.data.value.code, -1);
			}
			var texts = document.querySelector("#text_buf");
			text = texts.children[mesg.data.value.num];
			text.innerText = mesg.data.value.code;
		}else if(mesg.data.status == "fileadd"){
			fileAdd();
		}else if(mesg.data.status == "filedelete"){
			hoge(mesg.data.num);
		}else if(mesg.data.status == "init" && readOnly != true){

			var ul = document.querySelector("#file_tab");
			var fl = [];
			var flcnt = 0;
			var files = [];

			for(var i = 0; i < ul.children.length; i++) {
				if(ul.children[i].style.display != "none"){
					fl[flcnt] = i;
					flcnt++;
				}
			}

			for(var i = 0; i < flcnt; i++) {
				files[i] = [
					ul.children[fl[i]].firstElementChild.textContent,
					document.querySelector("#text_buf").children[fl[i]].innerText
				];
			}

			var data = {
				status:	"initdata",
				value:	{
					filelength:	filenumber,
					filelife:	fl,
					files:		files
				}
			}

			multiparty.send(data);

		}else if(mesg.data.status == "initdata" && initSettled != true){

			initSettled = true;

			editor.setValue(mesg.data.value.files[0][1], -1);

			for (var i = 0; i < mesg.data.value.filelength; i++) {
				fileAdd();
				document.querySelector("#file_tab").children[i+1].style.display = "none";
			};

			for (var i = 0; i < mesg.data.value.filelife.length; i++) {
				document.querySelector("#file_tab").children[mesg.data.value.filelife[i]].style.display = "block";
				document.querySelector("#file_tab").children[mesg.data.value.filelife[i]].firstElementChild.textContent = mesg.data.value.files[i][0];
				document.querySelector("#text_buf").children[mesg.data.value.filelife[i]].innerText = mesg.data.value.files[i][1];

				// block　を使う
			};

			console.log("init finish");

		}else if(mesg.data.status == "rename") {
			document.querySelector("#file_tab").children[mesg.data.filenumber].firstElementChild.textContent = mesg.data.commitfilename;
		}else if(mesg.data.status == "writerInit") {
			var data = createInitdata("readerEcho");
			multiparty.send(data);
		}else if(mesg.data.status == "readerEcho" && !readOnly) {

			if (writerInitState !== false) {
			    clearTimeout(writerInitState);
			}

			writerInitState = setTimeout(function() {
				setInit(mesg);
			}, 600);
		}

	});

	multiparty.start();

}

if(room_name != ""){
	connect(room_name);
}else{
	console.log("solo");
}

//connectメソッドの下に下記の関数を追加

function createInitdata(sendstate) {

	var ul = document.querySelector("#file_tab");
	var fl = [];
	var flcnt = 0;
	var files = [];

	for(var i = 0; i < ul.children.length; i++) {
		if(ul.children[i].style.display != "none"){
			fl[flcnt] = i;
			flcnt++;
		}
	}

	for(var i = 0; i < flcnt; i++) {
		files[i] = [
			ul.children[fl[i]].children[document.querySelector("#file_tab").children[fl[i]].children.length-2].textContent,
			document.querySelector("#text_buf").children[fl[i]].innerText
		];
	}

	var data = {
		status:	sendstate,
		value:	{
			filelength:	filenumber,
			filelife:	fl,
			files:		files
		}
	}

	return data;
}

function setInit(mesg) {

	initSettled = true;

	editor.setValue(mesg.data.value.files[0][1], -1);

	for (var i = 0; i < mesg.data.value.filelength; i++) {
		fileAdd();
		document.querySelector("#file_tab").children[i+1].style.display = "none";
	};

	for (var i = 0; i < mesg.data.value.filelife.length; i++) {
		document.querySelector("#file_tab").children[mesg.data.value.filelife[i]].style.display = "block";
		document.querySelector("#file_tab").children[mesg.data.value.filelife[i]].firstElementChild.textContent = mesg.data.value.files[i][0];
		document.querySelector("#text_buf").children[mesg.data.value.filelife[i]].innerText = mesg.data.value.files[i][1];
	};
}



// 追加してほしい変数
var writerInitState;

function send_msg() {
    if(readOnly) return;
	var texts = document.querySelector("#text_buf");
	text = texts.children[editnumber];
	text.innerText = editor.getValue();
	var data = {
		status:	"editcode",
		value: 	{
			num:	editnumber,
			code:	editor.getValue()
		}
	}
	multiparty.send(data);
}

$(function() {
    $('#side_top').perfectScrollbar();
    $('#room_menber').perfectScrollbar();
});


//サーバ側との通信とか設定とか
function setReadable(readOnly){
    editor = ace.edit("editor");
    if(readOnly){
        editor.setReadOnly(true);
        readOnly = true
        tabOnclickDisable();
    }else{
        readOnly = false;
        editor.setReadOnly(false);
    }
}


//書き込みする人
function tabOnclickDisable() {

	var ul = document.querySelector("#file_tab");

	for(var i = 0; i < ul.children.length; i++) {
		ul.children[i].lastElementChild.setAttribute('onclick','');
        ul.children[i].children[ul.children[i].children.length-2].setAttribute('ondblclick','');
	}
}

function accessRoom(status){
	var status_code = "";
	var input_name = "";

	if(status == "writer"){
		status_code = 0;
		input_name = document.forms.create_room.room_name.value;

	}else if(status == "reader"){
		status_code = 1;
		input_name = input_name = document.forms.connect_room.room_name.value;

	}else{
		alert("正しくないアクセスです");
		exit;
	}

	if(input_name == ""){
		alert("何も入力されていません");
		exit;
	}else if(input_name.length < 4){
		alert("4文字以上入力してください");
		exit;
	}

	location.href = "/coding/room?i=" + input_name + "&s=" + status_code
}
