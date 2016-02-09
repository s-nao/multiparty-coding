# coding:utf-8

# bottleの主要なクラス
from bottle import run
from bottle import route, redirect
from bottle import response, request
from bottle import static_file

from bottle import jinja2_template as template

# 実行時間計測
import time
# json のダンプに使用する
import json
import os


import platform

OWN_IP = "localhost"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VIEW_DIR = BASE_DIR + "/view/"
CSS_DIR = BASE_DIR + "/css"
JS_DIR = BASE_DIR + "/js"

os_name = platform.architecture()

if os_name[1] == "ELF":
    import netifaces
    OWN_IP = netifaces.ifaddresses('eth0')[netifaces.AF_INET][0]["addr"]
elif os_name[1] == "WindowsPE":
    import socket
    OWN_IP = socket.gethostbyname(socket.gethostname())


#
# ---------------------URL ROUTING----------------------
#


@route("/", method=["GET", "POST"])
def index():
    return redirect("/coding")


@route("/coding", method=["POST", "GET"])
def display_view():

    if request.method == "GET":
        language_name = "java"
        return template(VIEW_DIR + "coding.html",
                        language_name=str(language_name),
                        room_name="",
                        isReadOnly=False)

    elif request.method == "POST":
        language_name = request.forms.get("choice_language")

        return template(VIEW_DIR + "coding.html",
                        language_name=str(language_name),
                        room_name="",
                        isReadOnly=False)


@route("/coding/room", method=["GET", "POST"])
def create_room():
    # writer か readerどちらかを判断する
    input_name = request.query.get("i")
    status = request.query.get("s")

    print(input_name)
    print(type(status))

    is_read_only = False

    if status == "0":  # writer
        """
        if input_name in ROOM_INFO.keys():
            print("同じ部屋が作成されています")
            return redirect("/coding")
        """

    elif status == "1":  # reader
        is_read_only = True

    return template(VIEW_DIR + "coding.html",
                    language_name="java",
                    room_name=input_name,
                    isReadOnly=is_read_only)


@route("/running", method=["POST"])
def run_code():
    # オンラインコンパイラ

    from wandbox.wandbox import Wandbox

    print(request.json)
    start = time.time()

    print("create instance : " + str(time.time() - start))
    wand = Wandbox()

    wand.compiler(request.json["compiler"])
    print("set compiler : " + str(time.time() - start))
    print("set main compiler " + request.json["compiler"])

    code_data = request.json["code"]
    # コードのセット
    wand.code(code_data[0][1])

    print('set main code ' + code_data[0][1])
    wand.parameter["codes"] = []
    # もし２つ以上のファイルが送られてきていた時に行う処理
    if len(code_data) >= 2:
        print("print code_data")
        print()
        print(code_data)
        print()

        print("detail")
        for codeDetail in code_data[1:]:
            wand.add_file(codeDetail[0], codeDetail[1])
            print(codeDetail)
    print("set code : " + str(time.time() - start))

    if request.json["input_data"] != "":
        input_data_list = request.json["input_data"].split("\n")
        while "" in input_data_list:
            input_data_list.remove("")

        print("data list : " + str(input_data_list))
        for input_sentence in input_data_list:
            print("input : " + input_sentence)
            wand.stdin(input_sentence)

    result = wand.run()

    print("execute : " + str(time.time() - start))
    # print(json.dumps(result))

    response.content_type = 'application/json'
    response.dataType = "json"

    print("returned data : " + str(time.time() - start))
    return json.dumps(result)


# この記述をすることでCSSを読み込むことができるようになる
@route("/css/<filename>")
def css_dir(filename):
    print(CSS_DIR)
    return static_file(filename, root=CSS_DIR)


@route("/js/<filename>")
def js_dir(filename):
    print(JS_DIR)
    return static_file(filename, root=JS_DIR)

if __name__ == "__main__":
    run(host=OWN_IP, port=8080, debug=True, reloader=True)