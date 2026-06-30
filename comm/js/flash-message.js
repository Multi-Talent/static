/**
 * フラッシュメッセージ - 自動消去機能
 *
 * 使用方法:
 * 1. HTML側で flash-messages.html をインクルード
 * 2. このJSファイルをロード
 * 3. 自動的に初期化され、メッセージは5秒後に自動消去されます
 *
 * カスタマイズ:
 * FlashMessage.init({
 *   autoClose: true,          // 自動消去を有効化（デフォルト: true）
 *   autoCloseDelay: 5000,     // 自動消去までの時間（ミリ秒、デフォルト: 5000）
 *   showProgress: true        // プログレスバーを表示（デフォルト: true）
 * });
 */

var FlashMessage = (function() {
    'use strict';

    // デフォルト設定
    var config = {
        autoClose: true,
        autoCloseDelay: 5000,
        showProgress: true
    };

    /**
     * 初期化
     * @param {Object} options - オプション設定
     */
    function init(options) {
        // 設定をマージ
        if (options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    config[key] = options[key];
                }
            }
        }

        // ページ読み込み時に既存のメッセージを処理
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                processMessages();
            });
        } else {
            processMessages();
        }
    }

    /**
     * メッセージを処理
     */
    function processMessages() {
        var container = document.getElementById('flashMessagesContainer');
        if (!container) return;

        var messages = container.querySelectorAll('.flash-message');
        messages.forEach(function(message, index) {
            // プログレスバーを追加
            if (config.showProgress && config.autoClose) {
                var progress = document.createElement('div');
                progress.className = 'flash-message-progress';
                message.appendChild(progress);

                // 少し遅延してからアニメーション開始
                setTimeout(function() {
                    progress.classList.add('animate');
                    progress.style.animationDuration = config.autoCloseDelay + 'ms';
                }, 100);
            }

            // 自動消去を設定
            if (config.autoClose) {
                setTimeout(function() {
                    close(message);
                }, config.autoCloseDelay);
            }
        });
    }

    /**
     * メッセージを閉じる
     * @param {Element|HTMLElement} element - メッセージ要素または閉じるボタン
     */
    function close(element) {
        var message;
        if (element.classList && element.classList.contains('flash-message')) {
            message = element;
        } else {
            message = element.closest('.flash-message');
        }

        if (!message) return;

        // フェードアウトアニメーションを適用
        message.classList.add('fade-out');

        // アニメーション終了後に要素を削除
        setTimeout(function() {
            message.remove();

            // すべてのメッセージが削除されたらコンテナも削除
            var container = document.getElementById('flashMessagesContainer');
            if (container && container.querySelectorAll('.flash-message').length === 0) {
                container.remove();
            }
        }, 300); // fadeOutアニメーションの時間と同じ
    }

    /**
     * 動的にメッセージを追加
     * @param {string} message - メッセージ内容
     * @param {string} category - カテゴリ（success, error, warning, info）
     */
    function add(message, category) {
        category = category || 'info';

        // コンテナが存在しない場合は作成
        var container = document.getElementById('flashMessagesContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'flashMessagesContainer';
            container.className = 'flash-messages-container';
            document.body.appendChild(container);
        }

        // アイコンを決定
        var iconClass;
        if (category === 'success') {
            iconClass = 'fa-check-circle';
        } else if (category === 'error' || category === 'danger') {
            iconClass = 'fa-exclamation-circle';
        } else if (category === 'warning') {
            iconClass = 'fa-exclamation-triangle';
        } else if (category === 'info') {
            iconClass = 'fa-info-circle';
        } else {
            iconClass = 'fa-bell';
        }

        // メッセージ要素を作成
        var messageElement = document.createElement('div');
        messageElement.className = 'flash-message flash-message-' + category;
        messageElement.setAttribute('role', 'alert');
        messageElement.innerHTML =
            '<div class="flash-message-icon">' +
                '<i class="fa ' + iconClass + '"></i>' +
            '</div>' +
            '<div class="flash-message-content">' + message + '</div>' +
            '<button type="button" class="flash-message-close" onclick="FlashMessage.close(this)" aria-label="閉じる">' +
                '<i class="fa fa-times"></i>' +
            '</button>';

        // コンテナに追加
        container.appendChild(messageElement);

        // プログレスバーを追加
        if (config.showProgress && config.autoClose) {
            var progress = document.createElement('div');
            progress.className = 'flash-message-progress';
            messageElement.appendChild(progress);

            setTimeout(function() {
                progress.classList.add('animate');
                progress.style.animationDuration = config.autoCloseDelay + 'ms';
            }, 100);
        }

        // 自動消去を設定
        if (config.autoClose) {
            setTimeout(function() {
                close(messageElement);
            }, config.autoCloseDelay);
        }
    }

    /**
     * すべてのメッセージをクリア
     */
    function clearAll() {
        var container = document.getElementById('flashMessagesContainer');
        if (container) {
            container.remove();
        }
    }

    // 公開API
    return {
        init: init,
        close: close,
        add: add,
        clearAll: clearAll
    };
})();

// 自動初期化
FlashMessage.init();
