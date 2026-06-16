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

/**
 * DataTables の検索欄を「Enterキーで次を検索してスクロール」する検索に変更する
 *
 * ※ DataTables 標準のフィルター機能は無効化されます。
 * ※ 検索しても行は非表示にならず、該当行までスクロールします。
 *
 * @param {string} tableSelector DataTable のセレクタ 例: "#user_group_list_table"
 * @param {Object} options オプション
 * @param {number} options.offset スクロール位置の調整値
 * @param {number} options.speed スクロール速度
 */
function enable_datatable_enter_scroll_search(tableSelector, options) {
    options = options || {};

    var offset = options.offset || 100;
    var speed = options.speed || 300;

    var table = $(tableSelector).DataTable();

    var searchHitRows = [];
    var currentHitIndex = -1;
    var lastKeyword = '';

    var tableId = $(tableSelector).attr('id');
    var searchInputSelector = '#' + tableId + '_filter input';

    // DataTables 標準検索を無効化して、独自検索に変更
    $(searchInputSelector)
        .off()
        .on('keydown', function (e) {
            if (e.key !== 'Enter') {
                return;
            }

            e.preventDefault();

            var keyword = $(this).val().toLowerCase().trim();

            // ハイライト解除
            $(tableSelector + ' tbody tr').removeClass('search-hit current-search-hit');

            if (keyword === '') {
                searchHitRows = [];
                currentHitIndex = -1;
                lastKeyword = '';
                return;
            }

            // 検索文字が変わった場合は検索結果を作り直す
            if (keyword !== lastKeyword) {
                searchHitRows = [];
                currentHitIndex = -1;
                lastKeyword = keyword;

                table.rows().every(function () {
                    var rowNode = $(this.node());
                    var rowText = rowNode.text().toLowerCase();

                    if (rowText.indexOf(keyword) !== -1) {
                        searchHitRows.push(rowNode);
                    }
                });
            }

            if (searchHitRows.length === 0) {
                return;
            }

            // Enterを押すたびに次へ
            currentHitIndex++;

            // 最後まで行ったら最初へ戻る
            if (currentHitIndex >= searchHitRows.length) {
                currentHitIndex = 0;
            }

            var targetRow = searchHitRows[currentHitIndex];

            // 全ヒット行を薄くハイライト
            searchHitRows.forEach(function (row) {
                row.addClass('search-hit');
            });

            // 現在行を強くハイライト
            targetRow.addClass('current-search-hit');

            // DataTables のスクロール領域
            var scrollBody = $(tableSelector)
                .closest('.dataTables_scroll')
                .find('.dataTables_scrollBody');

            var rowTop = targetRow.position().top;
            var currentScrollTop = scrollBody.scrollTop();

            scrollBody.animate({
                scrollTop: currentScrollTop + rowTop - offset
            }, speed);
        });
}