class BeauticianQuizApp {
    constructor() {
        this.questions = [];
        this.selectedSubjects = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.correctAnswers = 0;
        this.quizQuestions = [];
        this.isAnswered = false;

        this.init();
    }

    async init() {
        try {
            await this.loadQuestions();
            this.setupEventListeners();
            this.updateSubjectSelection();
        } catch (error) {
            console.error('初期化エラー:', error);
            this.showError('問題データの読み込みに失敗しました。');
        }
    }

    async loadQuestions() {
        try {
            const response = await fetch('data/questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.questions = data.questions || [];
            console.log(`📚 ${this.questions.length}問の問題を読み込み完了`);
        } catch (error) {
            console.warn('外部ファイル読み込み失敗、サンプルデータを使用:', error);
            this.questions = this.getSampleQuestions();
        }
    }

    getSampleQuestions() {
        return [
            {
                id: 1,
                subject: "関係法規・制度及び運営管理",
                question: "美容師法に関する次の記述のうち、誤っているものはどれか。",
                choices: [
                    "公衆衛生の向上に資することで国民全体の利益を図っている。",
                    "美容の業務が適正に行われるように規律している。",
                    "美容業の経営の健全化を促進することにより、美容業の振興を図っている。",
                    "美容師の資格を定め、美容師の免許を受けた者でなければ美容を業としてはならないとしている。"
                ],
                correctAnswer: 2,
                explanation: "美容業の経営の健全化を促進することにより、美容業の振興を図ることは、美容師法ではなく生活衛生関係営業の運営の適正化及び振興に関する法律（生衛法）の内容です。"
            }
        ];
    }

    setupEventListeners() {
        // 科目選択チェックボックスのイベント
        document.querySelectorAll('.subject-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateSubjectSelection();
            });
        });

        // 特別な科目選択（ランダム・実践形式）
        document.getElementById('random-all').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.uncheckOtherSubjects('random-all');
            }
        });

        document.getElementById('practical-exam').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.uncheckOtherSubjects('practical-exam');
            }
        });

        // 個別科目チェック時に特別科目のチェックを外す
        document.querySelectorAll('[data-subject]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    document.getElementById('random-all').checked = false;
                    document.getElementById('practical-exam').checked = false;
                }
                this.updateSubjectSelection();
            });
        });

        // クイズ開始ボタン
        document.getElementById('start-quiz').addEventListener('click', () => {
            this.startQuiz();
        });

        // クイズナビゲーション
        document.getElementById('prev-question').addEventListener('click', () => {
            this.previousQuestion();
        });

        document.getElementById('next-question').addEventListener('click', () => {
            this.nextQuestion();
        });

        // 結果画面ボタン
        document.getElementById('restart-quiz').addEventListener('click', () => {
            this.restartQuiz();
        });

        document.getElementById('review-incorrect').addEventListener('click', () => {
            this.reviewIncorrectAnswers();
        });
    }

    uncheckOtherSubjects(exceptId) {
        document.querySelectorAll('.subject-checkbox').forEach(checkbox => {
            if (checkbox.id !== exceptId) {
                checkbox.checked = false;
            }
        });
        this.updateSubjectSelection();
    }

    updateSubjectSelection() {
        const checkboxes = document.querySelectorAll('.subject-checkbox:checked');
        let selectedCount = 0;
        let totalQuestions = 0;

        // ランダム（全科目）が選択されている場合
        if (document.getElementById('random-all').checked) {
            selectedCount = 8;
            totalQuestions = 160;
        }
        // 実践形式（全科目）が選択されている場合
        else if (document.getElementById('practical-exam').checked) {
            selectedCount = 8;
            totalQuestions = 55;
        }
        // 個別科目が選択されている場合
        else {
            const individualSubjects = document.querySelectorAll('[data-subject]:checked');
            selectedCount = individualSubjects.length;
            totalQuestions = selectedCount * 20;
        }

        // 表示更新
        document.getElementById('selected-subjects-count').textContent = selectedCount;
        document.getElementById('total-questions-count').textContent = totalQuestions;

        // クイズ開始ボタンの有効/無効
        const startButton = document.getElementById('start-quiz');
        startButton.disabled = selectedCount === 0;
    }

    startQuiz() {
        this.prepareQuizQuestions();
        if (this.quizQuestions.length === 0) {
            this.showError('問題の準備に失敗しました。');
            return;
        }

        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.correctAnswers = 0;
        this.isAnswered = false;

        this.showSection('quiz-section');
        this.displayQuestion();
    }

    prepareQuizQuestions() {
        this.quizQuestions = [];

        // ランダム（全科目）の場合
        if (document.getElementById('random-all').checked) {
            this.quizQuestions = this.shuffleArray([...this.questions]);
        }
        // 実践形式（全科目）の場合
        else if (document.getElementById('practical-exam').checked) {
            // 各科目から比例的に問題を選択（合計55問）
            const subjectQuestions = this.getQuestionsBySubjectCount();
            const questionsPerSubject = Math.floor(55 / Object.keys(subjectQuestions).length);

            Object.values(subjectQuestions).forEach(questions => {
                const shuffled = this.shuffleArray([...questions]);
                this.quizQuestions.push(...shuffled.slice(0, questionsPerSubject));
            });

            // 残りの問題を補填
            const remaining = 55 - this.quizQuestions.length;
            if (remaining > 0) {
                const allRemaining = this.questions.filter(q => !this.quizQuestions.includes(q));
                const shuffled = this.shuffleArray(allRemaining);
                this.quizQuestions.push(...shuffled.slice(0, remaining));
            }

            this.quizQuestions = this.shuffleArray(this.quizQuestions);
        }
        // 個別科目選択の場合
        else {
            const selectedSubjects = Array.from(document.querySelectorAll('[data-subject]:checked'))
                .map(checkbox => checkbox.dataset.subject);

            selectedSubjects.forEach(subject => {
                const subjectQuestions = this.questions.filter(q => q.subject === subject);
                this.quizQuestions.push(...subjectQuestions);
            });

            this.quizQuestions = this.shuffleArray(this.quizQuestions);
        }

        console.log(`🎯 ${this.quizQuestions.length}問でクイズを開始`);
    }

    getQuestionsBySubjectCount() {
        const subjectGroups = {};
        this.questions.forEach(question => {
            if (!subjectGroups[question.subject]) {
                subjectGroups[question.subject] = [];
            }
            subjectGroups[question.subject].push(question);
        });
        return subjectGroups;
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.quizQuestions.length) {
            this.showResults();
            return;
        }

        const question = this.quizQuestions[this.currentQuestionIndex];
        this.isAnswered = false;

        // 進捗更新
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = this.quizQuestions.length;

        const progress = ((this.currentQuestionIndex + 1) / this.quizQuestions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;

        // 問題文表示
        document.getElementById('question-text').textContent = question.question;

        // 選択肢表示
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = '';

        question.choices.forEach((choice, index) => {
            const choiceElement = document.createElement('div');
            choiceElement.className = 'choice';
            choiceElement.textContent = choice;
            choiceElement.addEventListener('click', () => {
                this.selectAnswer(index);
            });
            choicesContainer.appendChild(choiceElement);
        });

        // フィードバック非表示
        this.hideFeedback();

        // ナビゲーションボタン
        document.getElementById('prev-question').style.display = 
            this.currentQuestionIndex > 0 ? 'inline-block' : 'none';

        document.getElementById('next-question').textContent = 
            this.currentQuestionIndex === this.quizQuestions.length - 1 ? '結果を見る' : '次の問題';
    }

    selectAnswer(selectedIndex) {
        if (this.isAnswered) return;

        const question = this.quizQuestions[this.currentQuestionIndex];
        const choices = document.querySelectorAll('.choice');

        // 選択状態をクリア
        choices.forEach(choice => {
            choice.classList.remove('selected', 'correct', 'incorrect');
        });

        // 選択した選択肢をハイライト
        choices[selectedIndex].classList.add('selected');

        // 回答を記録
        this.userAnswers[this.currentQuestionIndex] = selectedIndex;

        // 正解判定（0ベースのインデックスで比較）
        const isCorrect = selectedIndex === question.correctAnswer;

        if (isCorrect) {
            this.correctAnswers++;
            choices[selectedIndex].classList.add('correct');
            this.showFeedback(true, question.explanation);
        } else {
            choices[selectedIndex].classList.add('incorrect');
            choices[question.correctAnswer].classList.add('correct');
            this.showFeedback(false, question.explanation);
        }

        this.isAnswered = true;
    }

    showFeedback(isCorrect, explanation) {
        const feedback = document.getElementById('feedback');
        feedback.className = `feedback show ${isCorrect ? 'correct' : 'incorrect'}`;

        const title = isCorrect ? '✅ 正解！' : '❌ 不正解';
        feedback.innerHTML = `
            <h4>${title}</h4>
            <p>${explanation}</p>
        `;
    }

    hideFeedback() {
        const feedback = document.getElementById('feedback');
        feedback.classList.remove('show');
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        const totalQuestions = this.quizQuestions.length;
        const scorePercentage = Math.round((this.correctAnswers / totalQuestions) * 100);

        document.getElementById('final-score').textContent = scorePercentage;
        document.getElementById('correct-count').textContent = this.correctAnswers;
        document.getElementById('question-count').textContent = totalQuestions;

        // メッセージ
        let message = '';
        if (scorePercentage >= 90) {
            message = '🎉 素晴らしい！完璧に近い成績です！';
        } else if (scorePercentage >= 70) {
            message = '👍 良い成績です！この調子で頑張りましょう！';
        } else if (scorePercentage >= 60) {
            message = '📚 合格ラインです！もう少し復習して完璧を目指しましょう！';
        } else {
            message = '💪 復習が必要です！間違えた問題を見直しましょう！';
        }
        document.getElementById('score-message').textContent = message;

        // 科目別結果
        this.displaySubjectResults();

        this.showSection('results-section');
    }

    displaySubjectResults() {
        const subjectResults = {};

        this.quizQuestions.forEach((question, index) => {
            if (!subjectResults[question.subject]) {
                subjectResults[question.subject] = { correct: 0, total: 0 };
            }
            subjectResults[question.subject].total++;
            if (this.userAnswers[index] === question.correctAnswer) {
                subjectResults[question.subject].correct++;
            }
        });

        const container = document.getElementById('subject-results');
        container.innerHTML = '<h3>📊 科目別結果</h3>';

        Object.entries(subjectResults).forEach(([subject, result]) => {
            const percentage = Math.round((result.correct / result.total) * 100);
            const resultDiv = document.createElement('div');
            resultDiv.className = 'subject-result';
            resultDiv.innerHTML = `
                <span>${subject}</span>
                <span>${result.correct}/${result.total} (${percentage}%)</span>
            `;
            container.appendChild(resultDiv);
        });
    }

    reviewIncorrectAnswers() {
        const incorrectQuestions = [];
        this.quizQuestions.forEach((question, index) => {
            if (this.userAnswers[index] !== question.correctAnswer) {
                incorrectQuestions.push(question);
            }
        });

        if (incorrectQuestions.length === 0) {
            alert('間違えた問題はありません！🎉');
            return;
        }

        this.quizQuestions = incorrectQuestions;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.correctAnswers = 0;
        this.isAnswered = false;

        this.showSection('quiz-section');
        this.displayQuestion();
    }

    restartQuiz() {
        this.showSection('subject-selection');
    }

    showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <h3>⚠️ エラーが発生しました</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="btn btn-primary">再読み込み</button>
        `;
        document.querySelector('.container').prepend(errorDiv);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
    new BeauticianQuizApp();
});