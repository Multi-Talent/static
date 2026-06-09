"use strict";

/**
 * テキストをクリップボードにコピーする共通関数
 *
 * @param {string} text コピーする文字列
 * @param {string} successMsg コピー成功時のメッセージ
 * @param {string} errorMsg コピー失敗時のメッセージ
 */
function copy_text_to_clipboard(text, successMsg, errorMsg) {
    successMsg = successMsg || "コピーしました";
    errorMsg = errorMsg || "コピーに失敗しました";

    if (!text) {
        alert("コピーする内容がありません");
        return;
    }

    // navigator.clipboard が使える場合
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () {
            alert(successMsg);
        }).catch(function () {
            fallback_copy_text(text, successMsg, errorMsg);
        });
    } else {
        // HTTP環境や古いブラウザ用
        fallback_copy_text(text, successMsg, errorMsg);
    }
}

/**
 * 古いブラウザ・HTTP環境用のコピー処理
 *
 * @param {string} text コピーする文字列
 * @param {string} successMsg コピー成功時のメッセージ
 * @param {string} errorMsg コピー失敗時のメッセージ
 */
function fallback_copy_text(text, successMsg, errorMsg) {
    var textArea = document.createElement("textarea");

    textArea.value = text;

    // 画面に見えない位置へ配置
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand("copy");

        if (successful) {
            alert(successMsg);
        } else {
            alert(errorMsg);
        }
    } catch (err) {
        alert(errorMsg);
    }

    document.body.removeChild(textArea);
}

/**
 * 配列の値を改行区切りでコピーする共通関数
 *
 * @param {Array} list コピー対象配列
 * @param {string} successMsg コピー成功時のメッセージ
 */
function copy_list_to_clipboard(list, successMsg) {
    if (!Array.isArray(list) || list.length === 0) {
        alert("コピーする内容がありません");
        return;
    }

    var text = list.join("\n");
    copy_text_to_clipboard(text, successMsg);
}