/**
 * 学年コードと誕生日の整合性チェック機能
 *
 * 学年選択に基づいて適切な誕生年の範囲を計算し、
 * ユーザーが入力した誕生日が妥当かどうかを検証します。
 */

(function() {
    'use strict';

    /**
     * 学年コードマスター（デフォルト値）
     * APIから取得できない場合のフォールバック
     * key: 学年コード
     * value: { name: 学年名, schoolAge: 学校年齢 }
     */
    const DEFAULT_GRADE_CODE_MASTER = {
        '9': { name: '年長', schoolAge: 5 },       // 幼稚園年長
        '11': { name: '小１', schoolAge: 6 },      // 小学1年生
        '12': { name: '小２', schoolAge: 7 },      // 小学2年生
        '13': { name: '小３', schoolAge: 8 },      // 小学3年生
        '14': { name: '小４', schoolAge: 9 },      // 小学4年生
        '15': { name: '小５', schoolAge: 10 },     // 小学5年生
        '16': { name: '小６', schoolAge: 11 },     // 小学6年生
        '21': { name: '中１', schoolAge: 12 },     // 中学1年生
        '22': { name: '中２', schoolAge: 13 },     // 中学2年生
        '23': { name: '中３', schoolAge: 14 },     // 中学3年生
        '31': { name: '高１', schoolAge: 15 },     // 高校1年生
        '32': { name: '高２', schoolAge: 16 },     // 高校2年生
        '33': { name: '高３', schoolAge: 17 }      // 高校3年生
    };

    /**
     * 学年コードマスター（データベースから取得）
     * 初期化時にAPIから取得される
     */
    let GRADE_CODE_MASTER = Object.assign({}, DEFAULT_GRADE_CODE_MASTER);

    /**
     * データベースから学年マスターを取得
     * @returns {Promise<Object>} 学年マスターデータ
     */
    async function loadGradeMasterFromDB() {
        try {
            const response = await fetch('/api/grade-master', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'default' // ブラウザキャッシュを利用
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && typeof data === 'object' && !data.error) {
                GRADE_CODE_MASTER = data;
                console.log('Grade master loaded from database:', Object.keys(data).length, 'grades');
                return data;
            } else {
                console.warn('Failed to load grade master from database, using default');
                return DEFAULT_GRADE_CODE_MASTER;
            }
        } catch (error) {
            console.error('Error loading grade master:', error);
            console.warn('Using default grade master data');
            return DEFAULT_GRADE_CODE_MASTER;
        }
    }

    // ページ読み込み時に学年マスターを取得
    if (typeof $ !== 'undefined') {
        $(document).ready(function() {
            loadGradeMasterFromDB();
        });
    } else {
        // jQueryがない場合は通常のDOMContentLoaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadGradeMasterFromDB);
        } else {
            loadGradeMasterFromDB();
        }
    }

    /**
     * 現在の年度を取得（4月1日を基準）
     * 例: 2026年3月 → 2025年度、2026年4月 → 2026年度
     * @returns {number} 現在の年度
     */
    function getCurrentSchoolYear() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // 0-11 → 1-12

        // 1月～3月は前年度
        return month >= 4 ? year : year - 1;
    }

    /**
     * 学年コードから期待される誕生年の範囲を計算
     * @param {string} gradeCode - 学年コード
     * @param {number} tolerance - 許容誤差（前後何年まで許容するか）デフォルト: 2年
     * @returns {Object|null} { min: 最小年, max: 最大年, expected: 期待される年 } または null
     */
    function getExpectedBirthYearRange(gradeCode, tolerance = 2) {
        const gradeInfo = GRADE_CODE_MASTER[gradeCode];
        if (!gradeInfo) {
            return null;
        }

        const currentSchoolYear = getCurrentSchoolYear();
        const expectedBirthYear = currentSchoolYear - gradeInfo.schoolAge;

        return {
            min: expectedBirthYear - tolerance,
            max: expectedBirthYear + tolerance,
            expected: expectedBirthYear,
            gradeName: gradeInfo.name,
            schoolAge: gradeInfo.schoolAge
        };
    }

    /**
     * 誕生日が学年コードと整合性があるかチェック
     * @param {string} gradeCode - 学年コード
     * @param {string|number} birthYear - 誕生年
     * @param {number} tolerance - 許容誤差（デフォルト: 2年）
     * @returns {Object} { valid: boolean, message: string, range: Object }
     */
    function validateBirthYearForGrade(gradeCode, birthYear, tolerance = 2) {
        // 学年コードが選択されていない場合はスキップ
        if (!gradeCode || gradeCode === '') {
            return { valid: true, message: '', range: null };
        }

        // 誕生年が入力されていない場合はスキップ
        if (!birthYear || birthYear === '') {
            return { valid: true, message: '', range: null };
        }

        const range = getExpectedBirthYearRange(gradeCode, tolerance);
        if (!range) {
            return { valid: true, message: '', range: null };
        }

        const year = parseInt(birthYear, 10);
        if (isNaN(year)) {
            return { valid: false, message: '誕生年が正しくありません。', range: range };
        }

        if (year < range.min || year > range.max) {
            const message = `${range.gradeName}の場合、誕生年は${range.min}年～${range.max}年の範囲で入力してください。` +
                          `（標準: ${range.expected}年生まれ、前後${tolerance}年まで許容）`;
            return { valid: false, message: message, range: range };
        }

        return { valid: true, message: '', range: range };
    }

    /**
     * フォームフィールドにバリデーションを設定
     * @param {Object} options - 設定オプション
     * @param {string} options.gradeCodeSelector - 学年セレクトボックスのセレクタ
     * @param {string} options.birthYearSelector - 誕生年セレクトボックスのセレクタ
     * @param {string} options.errorContainerSelector - エラーメッセージ表示エリアのセレクタ（オプション）
     * @param {number} options.tolerance - 許容誤差（デフォルト: 2年）
     * @param {Function} options.onValidate - バリデーション実行時のコールバック
     */
    function setupGradeBirthdayValidator(options) {
        const {
            gradeCodeSelector = '#grade_code',
            birthYearSelector = '#birthday_year',
            errorContainerSelector = '#grade-birthday-error',
            tolerance = 2,
            onValidate = null
        } = options || {};

        const $gradeCode = $(gradeCodeSelector);
        const $birthYear = $(birthYearSelector);
        const $errorContainer = $(errorContainerSelector);

        if ($gradeCode.length === 0 || $birthYear.length === 0) {
            console.warn('Grade code or birth year selector not found');
            return;
        }

        // バリデーション実行関数
        function performValidation() {
            const gradeCode = $gradeCode.val();
            const birthYear = $birthYear.val();

            const result = validateBirthYearForGrade(gradeCode, birthYear, tolerance);

            // エラーメッセージ表示エリアが存在する場合
            if ($errorContainer.length > 0) {
                if (!result.valid && result.message) {
                    $errorContainer.html(`<span class="error-message" style="color: #d9534f; font-size: 14px;">${result.message}</span>`);
                    $errorContainer.show();
                } else {
                    $errorContainer.html('');
                    $errorContainer.hide();
                }
            }

            // コールバック実行
            if (onValidate && typeof onValidate === 'function') {
                onValidate(result);
            }

            return result;
        }

        // イベントリスナー設定
        $gradeCode.off('change.gradeValidator').on('change.gradeValidator', performValidation);
        $birthYear.off('change.gradeValidator').on('change.gradeValidator', performValidation);

        // 初回バリデーション実行
        setTimeout(performValidation, 100);

        return {
            validate: performValidation,
            getExpectedRange: function() {
                const gradeCode = $gradeCode.val();
                return getExpectedBirthYearRange(gradeCode, tolerance);
            }
        };
    }

    /**
     * 誕生年セレクトボックスの選択肢を学年に応じてフィルタリング
     * @param {Object} options - 設定オプション
     */
    function filterBirthYearOptions(options) {
        const {
            gradeCodeSelector = '#grade_code',
            birthYearSelector = '#birthday_year',
            tolerance = 2,
            highlightRecommended = true
        } = options || {};

        const $gradeCode = $(gradeCodeSelector);
        const $birthYear = $(birthYearSelector);

        if ($gradeCode.length === 0 || $birthYear.length === 0) {
            return;
        }

        $gradeCode.off('change.filterYear').on('change.filterYear', function() {
            const gradeCode = $gradeCode.val();

            if (!gradeCode || gradeCode === '') {
                // 学年が選択されていない場合は全選択肢を表示
                $birthYear.find('option').show();
                return;
            }

            const range = getExpectedBirthYearRange(gradeCode, tolerance);
            if (!range) {
                return;
            }

            // 全オプションを走査
            $birthYear.find('option').each(function() {
                const $option = $(this);
                const year = parseInt($option.val(), 10);

                if (isNaN(year)) {
                    // 空の選択肢は常に表示
                    $option.show();
                    return;
                }

                if (year >= range.min && year <= range.max) {
                    $option.show();

                    // 推奨年を強調表示
                    if (highlightRecommended && year === range.expected) {
                        const originalText = $option.text().replace(/\s*\(推奨\)$/, '');
                        $option.text(originalText + ' (推奨)');
                    }
                } else {
                    $option.hide();

                    // 非推奨年が選択されている場合はクリア
                    if ($birthYear.val() == year) {
                        $birthYear.val('');
                    }
                }
            });
        });
    }

    // グローバルに公開
    window.GradeBirthdayValidator = {
        getExpectedBirthYearRange: getExpectedBirthYearRange,
        validateBirthYearForGrade: validateBirthYearForGrade,
        setupGradeBirthdayValidator: setupGradeBirthdayValidator,
        filterBirthYearOptions: filterBirthYearOptions,
        getCurrentSchoolYear: getCurrentSchoolYear,
        loadGradeMasterFromDB: loadGradeMasterFromDB,
        getGradeMaster: function() {
            return GRADE_CODE_MASTER;
        },
        DEFAULT_GRADE_CODE_MASTER: DEFAULT_GRADE_CODE_MASTER
    };

})();
