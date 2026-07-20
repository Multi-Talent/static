/**
 * プリントファイルアップロード - ドラッグ＆ドロップ機能
 *
 * 使用方法:
 * PrintUpload.init('yourDropZoneId', 'yourFileInputId');
 */

var PrintUpload = (function() {
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
     * 許可されたプリントファイルの拡張子
     */
    var ALLOWED_PRINT_EXTENSIONS = [
        '.pdf', '.ppt', '.pptx', '.doc', '.docx',
        '.xls', '.xlsx', '.txt', '.jpg', '.jpeg',
        '.png', '.gif'
    ];

    /**
     * 最大ファイルサイズ（100MB）
     */
    var MAX_FILE_SIZE = 100 * 1024 * 1024;

    /**
     * ファイルの拡張子が許可されているかチェック
     * @param {string} filename - ファイル名
     * @return {boolean} 許可されている場合true
     */
    function isAllowedPrintFile(filename) {
        if (!filename) return false;
        var ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        return ALLOWED_PRINT_EXTENSIONS.indexOf(ext) !== -1;
    }

    /**
     * ファイルサイズが許可範囲内かチェック
     * @param {number} size - ファイルサイズ（バイト）
     * @return {boolean} 許可範囲内の場合true
     */
    function isValidFileSize(size) {
        return size <= MAX_FILE_SIZE;
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
            console.warn('PrintUpload: dropZone or fileInput not found', {
                dropZoneId: dropZoneId,
                fileInputId: fileInputId
            });
            return;
        }

        var uploadPrompt = dropZone.querySelector('.print-file-upload-prompt');
        var selectedList = dropZone.querySelector('.print-file-selected-list');

        // selectedListが存在しない場合は作成
        if (!selectedList) {
            selectedList = document.createElement('div');
            selectedList.className = 'print-file-selected-list';
            selectedList.style.display = 'none';
            dropZone.querySelector('.print-file-drop-zone').appendChild(selectedList);
        }

        /**
         * ファイルリストの表示更新
         */
        function updateFileDisplay() {
            selectedList.innerHTML = '';

            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                var files = Array.from(fileInput.files);

                files.forEach(function(file, index) {
                    var fileItem = document.createElement('div');
                    fileItem.className = 'print-file-selected-item';

                    var fileInfo = document.createElement('div');
                    fileInfo.className = 'print-file-item-info';

                    var fileName = document.createElement('div');
                    fileName.className = 'print-file-item-name';
                    fileName.textContent = file.name;

                    var fileSize = document.createElement('div');
                    fileSize.className = 'print-file-item-size';
                    fileSize.textContent = 'サイズ: ' + formatBytes(file.size);

                    // エラーチェック
                    if (!isAllowedPrintFile(file.name)) {
                        fileSize.textContent += ' - エラー: 許可されていないファイル形式です';
                        fileSize.style.color = '#d9534f';
                    } else if (!isValidFileSize(file.size)) {
                        fileSize.textContent += ' - エラー: ファイルサイズが大きすぎます（最大100MB）';
                        fileSize.style.color = '#d9534f';
                    }

                    fileInfo.appendChild(fileName);
                    fileInfo.appendChild(fileSize);

                    var removeBtn = document.createElement('button');
                    removeBtn.type = 'button';
                    removeBtn.className = 'print-file-remove-btn';
                    removeBtn.textContent = '削除';
                    removeBtn.onclick = function() {
                        removeFile(index);
                    };

                    fileItem.appendChild(fileInfo);
                    fileItem.appendChild(removeBtn);
                    selectedList.appendChild(fileItem);
                });

                if (uploadPrompt) uploadPrompt.style.display = 'none';
                if (selectedList) selectedList.style.display = 'block';
                if (dropZone) dropZone.classList.add('print-file-has-file');
            } else {
                if (uploadPrompt) uploadPrompt.style.display = 'block';
                if (selectedList) selectedList.style.display = 'none';
                if (dropZone) dropZone.classList.remove('print-file-has-file');
            }
        }

        /**
         * ファイルを削除
         * @param {number} index - 削除するファイルのインデックス
         */
        function removeFile(index) {
            var dt = new DataTransfer();
            var files = Array.from(fileInput.files);

            files.forEach(function(file, i) {
                if (i !== index) {
                    dt.items.add(file);
                }
            });

            fileInput.files = dt.files;
            updateFileDisplay();
        }

        /**
         * ファイルを追加（既存ファイルに追加）
         * @param {FileList} newFiles - 追加するファイルリスト
         */
        function addFiles(newFiles) {
            var dt = new DataTransfer();

            // 既存ファイルを追加
            if (fileInput.files) {
                Array.from(fileInput.files).forEach(function(file) {
                    dt.items.add(file);
                });
            }

            // 新規ファイルを追加
            Array.from(newFiles).forEach(function(file) {
                // 重複チェック
                var isDuplicate = false;
                if (fileInput.files) {
                    Array.from(fileInput.files).forEach(function(existingFile) {
                        if (existingFile.name === file.name && existingFile.size === file.size) {
                            isDuplicate = true;
                        }
                    });
                }

                if (!isDuplicate) {
                    dt.items.add(file);
                }
            });

            fileInput.files = dt.files;
            updateFileDisplay();
        }

        // ファイル入力の変更イベント
        fileInput.addEventListener('change', function() {
            updateFileDisplay();
        });

        // ドロップゾーンのクリックイベント
        dropZone.addEventListener('click', function(e) {
            if (e.target === removeBtn || e.target.classList.contains('print-file-remove-btn')) {
                return;
            }
            fileInput.click();
        });

        // ドラッグオーバーイベント
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('print-file-dragover');
        });

        // ドラッグリーブイベント
        dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('print-file-dragover');
        });

        // ドロップイベント
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('print-file-dragover');

            var files = e.dataTransfer.files;
            if (files.length > 0) {
                addFiles(files);
            }
        });

        // 初期表示
        updateFileDisplay();
    }

    // 公開API
    return {
        init: init
    };
})();
