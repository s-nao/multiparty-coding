window.addEventListener('DOMContentLoaded', function() {
/* HTMLがロードされたら実行される // DOMContentLoaded */

    var wrap         = document.getElementById('wrap');
    var openTriggers = document.querySelectorAll('#wrap .openModal');

    // デフォルトの余白値 余白はここで調整
    var defaultMargin = 100;

    /* モーダルを開く */
    function showModal(baseLayer, modal) {
        // モーダルウィンドウのtop値をセット
        setModalTop(modal);
        // #wrapの高さをセットする
        setWrapHeight(modal);
        // モーダルを閉じるためのイベントリスナを設定
        bindCloseModal(baseLayer, modal);
        // モーダルベースレイヤを表示する
        baseLayer.style.visibility = 'visible';
    }

    /**
     * モーダルを閉じる
     */
    function hideModal(baseLayer, modal) {
        // モーダルベースレイヤを非表示にする
        baseLayer.style.visibility = 'hidden';
        // モーダルウィンドウのtop値をクリア
        clearModalTop(modal);
        // #wrapの高さをクリアする
        clearWrapHeight(modal);
    }

    /**
     * 「クリックするとモーダルが開くよ」をクリックしたときの処理
     */
    function bindOpenModal(openTrigger) {
        openTrigger.addEventListener('click', function(event) {
            // デフォルトのイベント（ここではa要素のイベント）をキャンセル
            event.preventDefault();

            // href属性値にセットした、表示するモーダルウィンドウのターゲット
            var baseLayerId = this.hash;
            var baseLayer   = document.querySelector(baseLayerId);
            var modal       = baseLayer.querySelector('.modal');

            // モーダルを表示
            showModal(baseLayer, modal);
        }, false);
    }

    /**
     * モーダル内の「閉じる」をクリックしたときの処理
     */
    function bindCloseModal(baseLayer, modal) {
        // モーダルウィンドウ内の.closeModal指定したエレメントを抽出
        var closeTriggers = modal.querySelectorAll('.closeModal');

        // 上記エレメントに、モーダルを閉じるイベントリスナを設定
        for (var i = 0, len = closeTriggers.length; i < len; i++) {
            var closeTrigger = closeTriggers[i];
            closeTrigger.addEventListener('click', closeModal(baseLayer, modal, closeTrigger), false);
        }
    }

    /**
     * モーダル内の「閉じる」をクリックしたときの処理の内容
     */
    function closeModal(baseLayer, modal, closeTrigger) {
        return function _closeModal(event) {
            // デフォルトのイベント（ここではa要素のイベント）をキャンセル
            event.preventDefault();
            // モーダルを非表示
            hideModal(baseLayer, modal);
            // 「閉じる」がクリックされたら、イベントリスナを解除する。
            // これを設定しないと、モーダルが開く度にイベントリスナが設定されて、メモリーリークしちゃう
            closeTrigger.removeEventListener('click', _closeModal, false);
        };
    }

    /**
     * window.scrollYを返す
     * https://developer.mozilla.org/ja/docs/Web/API/window.scrollY
     */
    function getScrollY() {
        return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }

    /**
     * モーダルウィンドウのTOP値に、スクロールY値を加算した値をセットする
     */
    function setModalTop(modal) {
        // スクロールY値を加算した値をセットする
        modal.style.top = defaultMargin + getScrollY() + 'px';
    }

    /**
     * モーダルウィンドウのTOP値をクリアする
     * 表示する度にtop値指定しているから、この処理いらない気もするけど
     * なんか設定したものはクリアしないと気持ち悪い
     */
    function clearModalTop(modal) {
        modal.style.top = '';
    }

    /**
     * スクロールY値＋マージン値＋モーダルの高さが
     * ウィンドウの高さ（innerHight）を超える場合は、
     * #wrapの高さを超過分加算してセットする
     */
    function setWrapHeight(modal) {

        // モーダルウィンドウの底辺座標を返す
        function getModalOffsetBottom() {
            var modalBound = modal.getBoundingClientRect();
            return getScrollY() + (defaultMargin * 2) + modalBound.height;
        }

        // #wrapの底辺座標（というか#wrap高さですが）
        var wrapBottom  = wrap.getBoundingClientRect().height;
        // モーダルウィンドウの底辺座標
        var modalBottom = getModalOffsetBottom();
        // モーダルウィンドウ - #wrap
        var overHeight  = modalBottom - wrapBottom;

        // モーダルウィンドウの底辺座標が#wrapの底辺座標を超える場合
        if (overHeight > 0) {
            // #wrapの高さに、超過分の値を追加した高さを設定する
            wrap.style.height = wrapBottom + overHeight + 'px';
        }
    }

    /**
     * #wrapの高さをクリアする
     */
    function clearWrapHeight(modal) {
        wrap.style.height = '';
    }


    for (var i = 0, len = openTriggers.length; i < len; i++) {
        // モーダルを開くためのイベントリスナを設定
        bindOpenModal(openTriggers[i]);
    }

}, false);
