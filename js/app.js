// グローバル変数
let questions = [];
let currentQuestionIndex = 0;
let selectedSubject = '';
let userAnswers = [];
let correctCount = 0;
let totalQuestions = 0;
let allQuestions = [];

// DOM要素
const subjectSelection = document.getElementById('subjectSelection');
const quizSection = document.getElementById('quizSection');
const resultSection = document.getElementById('resultSection');
const questionText = document.getElementById('questionText');
const choicesContainer = document.getElementById('choicesContainer');
const submitBtn = document.getElementById('submitAnswer');
const nextBtn = document.getElementById('nextQuestion');
const explanationPanel = document.getElementById('explanationPanel');
const progressFill = document.getElementById('progressFill');
const questionCounter = document.getElementById('questionCounter');
const currentSubjectSpan = document.getElementById('currentSubject');

// 統計更新
function updateStats() {
    document.getElementById('totalQuestions').textContent = totalQuestions;
    document.getElementById('correctAnswers').textContent = correctCount;
    const rate = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    document.getElementById('accuracyRate').textContent = rate + '%';
}

// 問題データを読み込み
async function loadQuestions() {
    try {
        const response = await fetch('data/questions.json');
        allQuestions = await response.json();
    } catch (error) {
        console.error('問題データの読み込みに失敗しました:', error);
        // フォールバックとしてサンプル問題を使用
        allQuestions = getSampleQuestions();
    }
}

// サンプル問題データ
function getSampleQuestions() {
    return {
        "関係法規": [
            {
                "id": 1,
                "question": "美容師法に関する次の記述のうち、誤っているものはどれか。",
                "choices": [
                    "公衆衛生の向上に資することで国民全体の利益を図っている。",
                    "美容の業務が適正に行われるように規律している。",
                    "美容業の経営の健全化を促進することにより、美容業の振興を図っている。",
                    "美容師の資格を定め、美容師の免許を受けた者でなければ美容を業としてはならないとしている。"
                ],
                "correct": 2,
                "explanation": "美容業の経営の健全化を促進することにより、美容業の振興を図ることは、美容師法ではなく生活衛生関係営業の運営の適正化及び振興に関する法律（生衛法）の内容です。美容師法の目的は、美容師の資格を定め、美容の業務が適正に行われるよう規律し、公衆衛生の向上に資することです。"
            },
            {
                "id": 2,
                "question": "美容師の免許に関する次の記述のうち、正しいものはどれか。",
                "choices": [
                    "美容師の免許は都道府県知事が与える。",
                    "美容師の免許は厚生労働大臣が与える。",
                    "美容師の免許は市町村長が与える。",
                    "美容師の免許は理容師美容師試験研修センターが与える。"
                ],
                "correct": 1,
                "explanation": "美容師法第3条により、美容師の免許は厚生労働大臣が与えることが規定されています。都道府県知事や市町村長、試験研修センターは免許を与える権限がありません。"
            }
        ],
        "衛生管理": [
            {
                "id": 3,
                "question": "消毒に関する次の記述のうち、正しいものはどれか。",
                "choices": [
                    "消毒とは、すべての微生物を死滅させることである。",
                    "消毒とは、病原性微生物を死滅させるか、感染力を失わせることである。",
                    "消毒とは、細菌のみを対象とし、ウイルスは含まれない。",
                    "消毒とは、アルコールでしか行うことができない。"
                ],
                "correct": 1,
                "explanation": "消毒とは、病原性微生物を死滅させるか、または感染力を失わせることです。すべての微生物を死滅させるのは「滅菌」であり、消毒とは異なります。また、細菌だけでなくウイルスも対象となり、アルコール以外の方法でも行うことができます。"
            }
        ],
        "保健": [
            {
                "id": 4,
                "question": "生活習慣病に該当しないものはどれか。",
                "choices": [
                    "糖尿病",
                    "高血圧症",
                    "脂質異常症",
                    "インフルエンザ"
                ],
                "correct": 3,
                "explanation": "生活習慣病は、食習慣、運動習慣、休養、喫煙、飲酒等の生活習慣が発症・進行に関与する疾患群です。糖尿病、高血圧症、脂質異常症は代表的な生活習慣病ですが、インフルエンザは感染症であり生活習慣病ではありません。"
            }
        ],
        "香粧品化学": [
            {
                "id": 5,
                "question": "パーマネントウェーブに使用される還元剤として最も一般的なものはどれか。",
                "choices": [
                    "システイン",
                    "チオグリコール酸",
                    "アンモニア",
                    "過酸化水素"
                ],
                "correct": 1,
                "explanation": "パーマネントウェーブの第1剤（還元剤）として最も一般的に使用されるのはチオグリコール酸です。これは毛髪のジスルフィド結合を切断する働きがあります。過酸化水素は第2剤（酸化剤）として使用され、アンモニアはアルカリ剤として使用されます。"
            }
        ],
        "美容技術理論": [
            {
                "id": 6,
                "question": "ヘアカットにおけるグラデーションカットの特徴として正しいものはどれか。",
                "choices": [
                    "すべての髪が同じ長さになる",
                    "上の髪が下の髪より長くなる",
                    "下の髪が上の髪より長くなる",
                    "髪の長さに関係なく、ランダムにカットする"
                ],
                "correct": 2,
                "explanation": "グラデーションカットは、下の髪が上の髪より長くなるようにカットする技法です。これにより、髪に重さと厚みを持たせることができ、自然な丸みのあるシルエットを作ることができます。"
            }
        ],
        "運営管理": [
            {
                "id": 7,
                "question": "美容所の開設に必要な手続きとして正しいものはどれか。",
                "choices": [
                    "厚生労働省への届出",
                    "都道府県知事への届出",
                    "市町村長への届出",
                    "理容師美容師試験研修センターへの届出"
                ],
                "correct": 1,
                "explanation": "美容師法第11条により、美容所を開設しようとする者は、都道府県知事に届け出なければならないと規定されています。厚生労働省、市町村、試験研修センターではありません。"
            }
        ]
    };
}

// 科目選択イベント
document.addEventListener('DOMContentLoaded', async function() {
    await loadQuestions();
    updateStats();

    // 科目ボタンのイベントリスナー
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const subject = this.dataset.subject;
            startQuiz(subject);
        });
    });

    // 全科目混合ボタン
    document.getElementById('allSubjectsBtn').addEventListener('click', function() {
        startQuiz('全科目');
    });

    // 戻るボタン
    document.getElementById('backToSubjects').addEventListener('click', function() {
        showSubjectSelection();
    });

    // 回答ボタン
    submitBtn.addEventListener('click', submitAnswer);

    // 次の問題ボタン
    nextBtn.addEventListener('click', nextQuestion);

    // 結果画面のボタン
    document.getElementById('retryQuiz').addEventListener('click', function() {
        startQuiz(selectedSubject);
    });

    document.getElementById('newSubject').addEventListener('click', function() {
        showSubjectSelection();
    });
});

// クイズ開始
function startQuiz(subject) {
    selectedSubject = subject;
    currentQuestionIndex = 0;
    userAnswers = [];

    // 問題を選択
    if (subject === '全科目') {
        questions = [];
        Object.keys(allQuestions).forEach(key => {
            questions = questions.concat(allQuestions[key]);
        });
        // シャッフル
        questions = shuffleArray(questions).slice(0, 15);
    } else {
        questions = shuffleArray([...allQuestions[subject]]).slice(0, 10);
    }

    currentSubjectSpan.textContent = subject;
    showQuiz();
    displayQuestion();
}

// 配列をシャッフル
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 問題表示
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    questionCounter.textContent = `問題 ${currentQuestionIndex + 1}/${questions.length}`;

    // プログレスバー更新
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressFill.style.width = progress + '%';

    // 選択肢をクリア
    choicesContainer.innerHTML = '';

    // 選択肢を表示
    question.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `
            <span class="choice-number">${index + 1}</span>
            ${choice}
        `;
        btn.addEventListener('click', function() {
            selectChoice(index);
        });
        choicesContainer.appendChild(btn);
    });

    // ボタンの状態をリセット
    submitBtn.disabled = true;
    submitBtn.style.display = 'inline-block';
    nextBtn.style.display = 'none';
    explanationPanel.style.display = 'none';
}

// 選択肢選択
function selectChoice(index) {
    // 全ての選択肢からselectedクラスを削除
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // 選択した選択肢にselectedクラスを追加
    document.querySelectorAll('.choice-btn')[index].classList.add('selected');

    // 回答ボタンを有効化
    submitBtn.disabled = false;
}

// 回答提出
function submitAnswer() {
    const selectedBtn = document.querySelector('.choice-btn.selected');
    if (!selectedBtn) return;

    const selectedIndex = Array.from(document.querySelectorAll('.choice-btn')).indexOf(selectedBtn);
    const question = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.correct;

    // 回答を記録
    userAnswers.push({
        questionId: question.id,
        selectedIndex: selectedIndex,
        correct: isCorrect,
        question: question.question,
        explanation: question.explanation
    });

    if (isCorrect) {
        correctCount++;
        totalQuestions++;
        updateStats();
    } else {
        totalQuestions++;
        updateStats();
    }

    // 選択肢の色分け
    document.querySelectorAll('.choice-btn').forEach((btn, index) => {
        btn.classList.add('disabled');
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    // 解説を表示
    showExplanation(isCorrect, question.explanation);

    // ボタンの状態を変更
    submitBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';
}

// 解説表示
function showExplanation(isCorrect, explanation) {
    const resultIcon = document.getElementById('resultIcon');
    const resultText = document.getElementById('resultText');
    const explanationText = document.getElementById('explanationText');

    if (isCorrect) {
        resultIcon.textContent = '✅';
        resultText.textContent = '正解！';
        resultText.className = 'result-text correct';
    } else {
        resultIcon.textContent = '❌';
        resultText.textContent = '不正解';
        resultText.className = 'result-text incorrect';
    }

    explanationText.textContent = explanation;
    explanationPanel.style.display = 'block';
}

// 次の問題
function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
        showResults();
    } else {
        displayQuestion();
    }
}

// 結果表示
function showResults() {
    const score = userAnswers.filter(answer => answer.correct).length;
    const accuracy = Math.round((score / questions.length) * 100);

    document.getElementById('finalScore').textContent = `${score}/${questions.length}`;
    document.getElementById('finalAccuracy').textContent = `${accuracy}%`;

    // メッセージ設定
    let message = '';
    if (accuracy >= 80) {
        message = '素晴らしい結果です！🎉 この調子で学習を続けてください。';
    } else if (accuracy >= 60) {
        message = 'よく頑張りました！😊 もう少し復習すれば完璧です。';
    } else {
        message = 'お疲れさまでした。🔥 復習して再挑戦してみてください。';
    }

    document.getElementById('resultMessage').textContent = message;

    // 間違えた問題の復習セクション
    const incorrectAnswers = userAnswers.filter(answer => !answer.correct);
    if (incorrectAnswers.length > 0) {
        const reviewSection = document.getElementById('reviewSection');
        const reviewList = document.getElementById('reviewList');

        reviewList.innerHTML = '';
        incorrectAnswers.forEach(answer => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <div class="review-question">${answer.question}</div>
                <div class="review-explanation">${answer.explanation}</div>
            `;
            reviewList.appendChild(reviewItem);
        });

        reviewSection.style.display = 'block';
    }

    showResult();
}

// 画面表示制御
function showSubjectSelection() {
    subjectSelection.style.display = 'block';
    quizSection.style.display = 'none';
    resultSection.style.display = 'none';
}

function showQuiz() {
    subjectSelection.style.display = 'none';
    quizSection.style.display = 'block';
    resultSection.style.display = 'none';
}

function showResult() {
    subjectSelection.style.display = 'none';
    quizSection.style.display = 'none';
    resultSection.style.display = 'block';

    // プログレスバーを100%に
    progressFill.style.width = '100%';
}

// ローカルストレージから統計を読み込み
function loadStats() {
    const stats = localStorage.getItem('beauticianQuizStats');
    if (stats) {
        const data = JSON.parse(stats);
        correctCount = data.correctCount || 0;
        totalQuestions = data.totalQuestions || 0;
        updateStats();
    }
}

// ローカルストレージに統計を保存
function saveStats() {
    const stats = {
        correctCount: correctCount,
        totalQuestions: totalQuestions
    };
    localStorage.setItem('beauticianQuizStats', JSON.stringify(stats));
}

// ページ読み込み時に統計を読み込み
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
});

// ページを離れる時に統計を保存
window.addEventListener('beforeunload', function() {
    saveStats();
});