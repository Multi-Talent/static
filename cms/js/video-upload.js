/**
 * 動画ファイルアップロード - ドラッグ＆ドロップ機能
 *
 * 使用方法:
 * HTML側で以下の構造を用意してください:
 *
 * <div class="video-file-upload-area" id="yourDropZoneId">
 *   <div class="video-file-drop-zone">
 *     <div class="video-file-upload-prompt">
 *       <i class="fa fa-cloud-upload fa-3x"></i>
 *       <p class="video-file-drop-text">ここにファイルをドラッグ＆ドロップ</p>
 *       <p class="video-file-drop-or">または</p>
 *       <input type="file" class="video-file-input" id="yourFileInputId" />
 *       <label for="yourFileInputId" class="video-file-button">ファイルを選択</label>
 *     </div>
 *     <div class="video-file-selected-info" style="display: none;">
 *       <i class="fa fa-check-circle fa-3x" style="color: #5cb85c;"></i>
 *       <p class="video-file-selected-name"></p>
 *       <p class="video-file-selected-size"></p>
 *       <button type="button" class="video-file-change-button">ファイルを変更</button>
 *     </div>
 *   </div>
 * </div>
 *
 * JavaScript側で初期化:
 * VideoUpload.init('yourDropZoneId', 'yourFileInputId');
 */

var VideoUpload = (function() {
    'use strict';

    /**
     * ファイルサイズをフォーマット
     * @param {number} bytes - バイト数
     * @return {string} フォーマットされたファイルサイズ
     */
    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        var k = 1024;
        var sizes = ['Bytes', 'KB', 'MB', 'GB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * 許可された動画ファイルの拡張子
     */
    var ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv'];

    /**
     * ファイルの拡張子が許可されているかチェック
     * @param {string} filename - ファイル名
     * @return {boolean} 許可されている場合true
     */
    function isAllowedVideoFile(filename) {
        if (!filename) return false;
        var ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        return ALLOWED_VIDEO_EXTENSIONS.indexOf(ext) !== -1;
    }

    /**
     * ドラッグ＆ドロップ機能を初期化
     * @param {string} dropZoneId - ドロップゾーンのID
     * @param {string} fileInputId - ファイル入力のID
     */
    function init(dropZoneId, fileInputId) {
        var dropZone = document.getElementById(dropZoneId);
        var fileInput = document.getElementById(fileInputId);

        if (!dropZone || !fileInput) {
            console.warn('VideoUpload: dropZone or fileInput not found', {
                dropZoneId: dropZoneId,
                fileInputId: fileInputId
            });
            return;
        }

        var uploadPrompt = dropZone.querySelector('.video-file-upload-prompt');
        var selectedInfo = dropZone.querySelector('.video-file-selected-info');
        var selectedName = dropZone.querySelector('.video-file-selected-name');
        var selectedSize = dropZone.querySelector('.video-file-selected-size');
        var changeButton = dropZone.querySelector('.video-file-change-button');

        /**
         * ファイル選択時の表示更新
         */
        function updateFileDisplay() {
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                var file = fileInput.files[0];
                if (selectedName) selectedName.textContent = file.name;
                if (selectedSize) selectedSize.textContent = 'サイズ: ' + formatBytes(file.size);
                if (uploadPrompt) uploadPrompt.style.display = 'none';
                if (selectedInfo) selectedInfo.style.display = 'block';
                if (dropZone) dropZone.classList.add('video-file-has-file');
            } else {
                if (uploadPrompt) uploadPrompt.style.display = 'block';
                if (selectedInfo) selectedInfo.style.display = 'none';
                if (dropZone) dropZone.classList.remove('video-file-has-file');
            }
        }

        // ドラッグオーバー時
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('video-file-dragover');
        });

        // ドラッグリーブ時
        dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('video-file-dragover');
        });

        // ドロップ時
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('video-file-dragover');

            var files = e.dataTransfer.files;
            if (files.length > 0) {
                var file = files[0];

                // ファイル拡張子チェック
                if (!isAllowedVideoFile(file.name)) {
                    alert('対応していないファイル形式です。\n\n対応形式: MP4, MOV, AVI, WMV, FLV, MKV\n\n選択されたファイル: ' + file.name);
                    return;
                }

                // ファイル入力に設定
                fileInput.files = files;
                // changeイベントを発火
                var event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            }
        });

        // ファイル選択ボタンのクリックイベント
        var fileButton = dropZone.querySelector('.video-file-button');
        if (fileButton) {
            fileButton.addEventListener('click', function(e) {
                e.preventDefault();
                fileInput.click();
            });
        }

        // ファイル変更ボタンのクリックイベント
        if (changeButton) {
            changeButton.addEventListener('click', function(e) {
                e.preventDefault();
                fileInput.click();
            });
        }

        // ファイル選択時のイベント
        fileInput.addEventListener('change', function() {
            // ファイルが選択されている場合、拡張子チェック
            if (fileInput.files && fileInput.files.length > 0) {
                var file = fileInput.files[0];

                if (!isAllowedVideoFile(file.name)) {
                    alert('対応していないファイル形式です。\n\n対応形式: MP4, MOV, AVI, WMV, FLV, MKV\n\n選択されたファイル: ' + file.name);
                    // ファイル選択をクリア
                    fileInput.value = '';
                    updateFileDisplay();
                    return;
                }
            }

            updateFileDisplay();
        });

        // 初期表示の更新
        updateFileDisplay();
    }

    // 公開API
    return {
        init: init,
        formatBytes: formatBytes
    };
})();
