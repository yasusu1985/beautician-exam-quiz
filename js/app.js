// 美容師国家試験対策クイズアプリケーション v3.0
// 高度なランダム化とユーザー学習履歴機能付き

class BeauticianQuizApp {
    constructor() {
        this.questions = [];
        this.currentQuestion = null;
        this.currentQuestionIndex = 0;
        this.selectedQuestions = [];
        this.score = 0;
        this.totalQuestions = 10; // デフォルト問題数
        this.selectedSubjects = [];
        this.userAnswers = [];
        this.quizHistory = this.loadQuizHistory();
        this.questionWeights = this.loadQuestionWeights();
        this.usedQuestions = new Set(); // 重複防止用

        this.init();
    }

    async init() {
        try {
            await this.loadQuestions();
            this.setupEventListeners();
            this.displayWelcomeScreen();
            this.loadUserProgress();
        } catch (error) {
            console.error('初期化エラー:', error);
            this.showError('アプリケーションの初期化に失敗しました。');
        }
    }

    async loadQuestions() {
        try {
            const response = await fetch('data/questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.questions = data.subjects;
            this.metadata = data.metadata;
            console.log(`問題データ読み込み完了: ${this.metadata.total_questions}問`);
        } catch (error) {
            console.error('問題データの読み込みに失敗:', error);
            throw error;
        }
    }

    // 高度なランダム化関数
    selectRandomQuestions() {
        this.selectedQuestions = [];
        this.usedQuestions.clear();

        const availableQuestions = [];

        // 選択された科目から問題を収集
        this.selectedSubjects.forEach(subject => {
            if (this.questions[subject]) {
                this.questions[subject].forEach((question, index) => {
                    const questionId = `${subject}_${index}`;
                    const weight = this.getQuestionWeight(questionId, question);

                    availableQuestions.push({
                        ...question,
                        subject: subject,
                        questionId: questionId,
                        weight: weight
                    });
                });
            }
        });

        // 重み付きランダム選択
        const selectedQuestions = this.weightedRandomSelection(availableQuestions, this.totalQuestions);

        // Fisher-Yatesアルゴリズムでシャッフル
        this.shuffleArray(selectedQuestions);

        this.selectedQuestions = selectedQuestions;
        console.log(`ランダム選択完了: ${selectedQuestions.length}問`);
    }

    // 問題の重み計算（学習履歴を考慮）
    getQuestionWeight(questionId, question) {
        const history = this.quizHistory[questionId] || { attempts: 0, correct: 0, lastSeen: 0 };
        const now = Date.now();
        const daysSinceLastSeen = (now - history.lastSeen) / (1000 * 60 * 60 * 24);

        let weight = 1.0;

        // 間違えた問題ほど高い重み
        if (history.attempts > 0) {
            const correctRate = history.correct / history.attempts;
            weight *= (1.5 - correctRate); // 正解率が低いほど重みが増加
        }

        // 久しぶりの問題は重み増加
        if (daysSinceLastSeen > 7) {
            weight *= Math.min(2.0, 1 + daysSinceLastSeen / 30);
        }

        // 難易度による重み調整
        switch (question.difficulty) {
            case 'basic':
                weight *= 0.8;
                break;
            case 'intermediate':
                weight *= 1.0;
                break;
            case 'advanced':
                weight *= 1.3;
                break;
        }

        return Math.max(0.1, weight); // 最小重み0.1
    }

    // 重み付きランダム選択
    weightedRandomSelection(questions, count) {
        if (questions.length <= count) {
            return [...questions];
        }

        const selected = [];
        const remaining = [...questions];

        for (let i = 0; i < count; i++) {
            if (remaining.length === 0) break;

            const totalWeight = remaining.reduce((sum, q) => sum + q.weight, 0);
            let random = Math.random() * totalWeight;

            let selectedIndex = 0;
            for (let j = 0; j < remaining.length; j++) {
                random -= remaining[j].weight;
                if (random <= 0) {
                    selectedIndex = j;
                    break;
                }
            }

            selected.push(remaining[selectedIndex]);
            remaining.splice(selectedIndex, 1);
        }

        return selected;
    }

    // Fisher-Yatesシャッフル
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // 学習履歴の保存と読み込み
    loadQuizHistory() {
        try {
            const history = localStorage.getItem('beauticianQuizHistory');
            return history ? JSON.parse(history) : {};
        } catch {
            return {};
        }
    }

    saveQuizHistory() {
        try {
            localStorage.setItem('beauticianQuizHistory', JSON.stringify(this.quizHistory));
        } catch (error) {
            console.error('学習履歴の保存に失敗:', error);
        }
    }

    loadQuestionWeights() {
        try {
            const weights = localStorage.getItem('questionWeights');
            return weights ? JSON.parse(weights) : {};
        } catch {
            return {};
        }
    }

    updateQuestionHistory(questionId, isCorrect) {
        if (!this.quizHistory[questionId]) {
            this.quizHistory[questionId] = { attempts: 0, correct: 0, lastSeen: 0 };
        }

        const history = this.quizHistory[questionId];
        history.attempts++;
        if (isCorrect) {
            history.correct++;
        }
        history.lastSeen = Date.now();

        this.saveQuizHistory();
    }

    setupEventListeners() {
        // 科目選択チェックボックス
        document.querySelectorAll('input[name="subject"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSelectedSubjects());
        });

        // 問題数選択
        document.getElementById('questionCount').addEventListener('change', (e) => {
            this.totalQuestions = parseInt(e.target.value);
        });

        // クイズ開始ボタン
        document.getElementById('startQuiz').addEventListener('click', () => this.startQuiz());

        // 回答ボタン
        document.querySelectorAll('.answer-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => this.selectAnswer(index));
        });

        // 次の問題ボタン
        document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());

        // 結果を見るボタン
        document.getElementById('showResults').addEventListener('click', () => this.showResults());

        // もう一度挑戦ボタン
        document.getElementById('restartQuiz').addEventListener('click', () => this.restartQuiz());

        // ホームに戻るボタン
        document.getElementById('backHome').addEventListener('click', () => this.backToHome());
    }

    displayWelcomeScreen() {
        this.hideAllSections();
        document.getElementById('welcome').style.display = 'block';

        // 科目選択肢を更新
        this.updateSubjectOptions();

        // 進捗情報を表示
        this.displayProgressInfo();
    }

    updateSubjectOptions() {
        const subjectContainer = document.querySelector('.subject-selection');
        if (!subjectContainer || !this.questions) return;

        subjectContainer.innerHTML = '';

        Object.keys(this.questions).forEach(subject => {
            const questionCount = this.questions[subject].length;
            const div = document.createElement('div');
            div.className = 'subject-option';
            div.innerHTML = `
                <label>
                    <input type="checkbox" name="subject" value="${subject}" checked>
                    <span class="subject-name">${subject}</span>
                    <span class="question-count">(${questionCount}問)</span>
                </label>
            `;
            subjectContainer.appendChild(div);
        });

        this.updateSelectedSubjects();
    }

    displayProgressInfo() {
        const progressInfo = document.getElementById('progressInfo');
        if (!progressInfo) return;

        const totalAttempts = Object.values(this.quizHistory).reduce((sum, h) => sum + h.attempts, 0);
        const totalCorrect = Object.values(this.quizHistory).reduce((sum, h) => sum + h.correct, 0);
        const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

        progressInfo.innerHTML = `
            <div class="progress-stats">
                <h3>📈 学習進捗</h3>
                <div class="stat-item">
                    <span class="stat-label">総回答数:</span>
                    <span class="stat-value">${totalAttempts}問</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">正解率:</span>
                    <span class="stat-value">${overallAccuracy}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">利用可能問題数:</span>
                    <span class="stat-value">${this.metadata?.total_questions || 0}問</span>
                </div>
            </div>
        `;
    }

    updateSelectedSubjects() {
        const checkboxes = document.querySelectorAll('input[name="subject"]:checked');
        this.selectedSubjects = Array.from(checkboxes).map(cb => cb.value);

        const startButton = document.getElementById('startQuiz');
        startButton.disabled = this.selectedSubjects.length === 0;

        if (this.selectedSubjects.length === 0) {
            startButton.textContent = '科目を選択してください';
        } else {
            startButton.textContent = `クイズ開始 (${this.selectedSubjects.length}科目)`;
        }
    }

    startQuiz() {
        if (this.selectedSubjects.length === 0) {
            alert('少なくとも1つの科目を選択してください。');
            return;
        }

        this.selectRandomQuestions();

        if (this.selectedQuestions.length === 0) {
            alert('選択した科目に問題が見つかりませんでした。');
            return;
        }

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.usedQuestions.clear();

        this.hideAllSections();
        document.getElementById('quiz').style.display = 'block';

        this.displayQuestion();
        this.updateProgressBar();
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.selectedQuestions.length) {
            this.showResults();
            return;
        }

        this.currentQuestion = this.selectedQuestions[this.currentQuestionIndex];

        // 問題表示
        document.getElementById('questionText').textContent = this.currentQuestion.question;

        // 科目名表示
        document.getElementById('currentSubject').textContent = `科目: ${this.currentQuestion.subject}`;

        // 難易度表示
        const difficultyText = {
            'basic': '基礎',
            'intermediate': '標準', 
            'advanced': '応用'
        };
        document.getElementById('currentDifficulty').textContent = 
            `難易度: ${difficultyText[this.currentQuestion.difficulty] || '標準'}`;

        // 選択肢をシャッフル
        const shuffledChoices = [...this.currentQuestion.choices];
        const correctIndex = this.currentQuestion.correct;
        const correctAnswer = shuffledChoices[correctIndex];

        this.shuffleArray(shuffledChoices);

        // 正解の新しいインデックスを見つける
        this.currentCorrectIndex = shuffledChoices.indexOf(correctAnswer);

        // 選択肢ボタンを更新
        const answerBtns = document.querySelectorAll('.answer-btn');
        answerBtns.forEach((btn, index) => {
            if (index < shuffledChoices.length) {
                btn.textContent = `${String.fromCharCode(65 + index)}. ${shuffledChoices[index]}`;
                btn.style.display = 'block';
                btn.disabled = false;
                btn.className = 'answer-btn';
            } else {
                btn.style.display = 'none';
            }
        });

        // UI状態リセット
        document.getElementById('feedback').style.display = 'none';
        document.getElementById('nextQuestion').style.display = 'none';
        document.getElementById('showResults').style.display = 'none';
    }

    selectAnswer(selectedIndex) {
        const answerBtns = document.querySelectorAll('.answer-btn');
        const isCorrect = selectedIndex === this.currentCorrectIndex;

        // ボタンの状態を更新
        answerBtns.forEach((btn, index) => {
            btn.disabled = true;
            if (index === this.currentCorrectIndex) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // スコア更新
        if (isCorrect) {
            this.score++;
        }

        // 回答履歴を記録
        this.userAnswers.push({
            question: this.currentQuestion,
            selectedIndex: selectedIndex,
            correctIndex: this.currentCorrectIndex,
            isCorrect: isCorrect
        });

        // 学習履歴を更新
        this.updateQuestionHistory(this.currentQuestion.questionId, isCorrect);

        // フィードバック表示
        this.showFeedback(isCorrect);

        // 次の問題ボタンまたは結果ボタンを表示
        if (this.currentQuestionIndex < this.selectedQuestions.length - 1) {
            document.getElementById('nextQuestion').style.display = 'inline-block';
        } else {
            document.getElementById('showResults').style.display = 'inline-block';
        }
    }

    showFeedback(isCorrect) {
        const feedback = document.getElementById('feedback');
        const resultText = document.getElementById('resultText');
        const explanation = document.getElementById('explanation');

        if (isCorrect) {
            resultText.textContent = '✅ 正解です！';
            resultText.className = 'result-correct';
        } else {
            resultText.textContent = '❌ 不正解です';
            resultText.className = 'result-incorrect';
        }

        explanation.textContent = this.currentQuestion.explanation || '';
        feedback.style.display = 'block';
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.displayQuestion();
        this.updateProgressBar();
    }

    updateProgressBar() {
        const progress = ((this.currentQuestionIndex + 1) / this.selectedQuestions.length) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
        document.getElementById('questionCounter').textContent = 
            `問題 ${this.currentQuestionIndex + 1} / ${this.selectedQuestions.length}`;
    }

    showResults() {
        this.hideAllSections();
        document.getElementById('results').style.display = 'block';

        const accuracy = Math.round((this.score / this.selectedQuestions.length) * 100);

        document.getElementById('finalScore').textContent = 
            `${this.score} / ${this.selectedQuestions.length}`;
        document.getElementById('accuracy').textContent = accuracy + '%';

        // 成績評価
        let evaluation = '';
        if (accuracy >= 90) {
            evaluation = '🌟 素晴らしい成績です！';
        } else if (accuracy >= 80) {
            evaluation = '🎉 良好な成績です！';
        } else if (accuracy >= 70) {
            evaluation = '👍 もう少し頑張りましょう';
        } else {
            evaluation = '📚 復習を重点的に行いましょう';
        }
        document.getElementById('evaluation').textContent = evaluation;

        this.displayDetailedResults();
        this.saveUserProgress();
    }

    displayDetailedResults() {
        const container = document.getElementById('detailedResults');
        container.innerHTML = '';

        this.userAnswers.forEach((answer, index) => {
            const div = document.createElement('div');
            div.className = `result-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;

            div.innerHTML = `
                <div class="question-summary">
                    <h4>問題 ${index + 1}: ${answer.question.subject}</h4>
                    <p class="question-text">${answer.question.question}</p>
                    <div class="answer-info">
                        <p class="user-answer">
                            あなたの回答: ${answer.question.choices[answer.selectedIndex]}
                            ${answer.isCorrect ? '✅' : '❌'}
                        </p>
                        ${!answer.isCorrect ? `
                            <p class="correct-answer">
                                正解: ${answer.question.choices[answer.correctIndex]}
                            </p>
                        ` : ''}
                        ${answer.question.explanation ? `
                            <p class="explanation">${answer.question.explanation}</p>
                        ` : ''}
                    </div>
                </div>
            `;

            container.appendChild(div);
        });
    }

    restartQuiz() {
        this.displayWelcomeScreen();
    }

    backToHome() {
        this.displayWelcomeScreen();
    }

    hideAllSections() {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
    }

    loadUserProgress() {
        // 進捗データの読み込み処理
        console.log('ユーザー進捗を読み込みました');
    }

    saveUserProgress() {
        // 進捗データの保存処理
        const progressData = {
            totalQuizzes: this.getTotalQuizzesTaken(),
            averageScore: this.getAverageScore(),
            lastQuizDate: new Date().toISOString(),
            subjectProgress: this.getSubjectProgress()
        };

        localStorage.setItem('beauticianQuizProgress', JSON.stringify(progressData));
        console.log('ユーザー進捗を保存しました');
    }

    getTotalQuizzesTaken() {
        const progress = JSON.parse(localStorage.getItem('beauticianQuizProgress') || '{}');
        return (progress.totalQuizzes || 0) + 1;
    }

    getAverageScore() {
        // 簡易的な平均スコア計算
        const currentAccuracy = (this.score / this.selectedQuestions.length) * 100;
        const progress = JSON.parse(localStorage.getItem('beauticianQuizProgress') || '{}');
        const previousAverage = progress.averageScore || currentAccuracy;
        const totalQuizzes = this.getTotalQuizzesTaken();

        return ((previousAverage * (totalQuizzes - 1)) + currentAccuracy) / totalQuizzes;
    }

    getSubjectProgress() {
        const subjectStats = {};
        this.userAnswers.forEach(answer => {
            const subject = answer.question.subject;
            if (!subjectStats[subject]) {
                subjectStats[subject] = { total: 0, correct: 0 };
            }
            subjectStats[subject].total++;
            if (answer.isCorrect) {
                subjectStats[subject].correct++;
            }
        });
        return subjectStats;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.insertBefore(errorDiv, document.body.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    window.quizApp = new BeauticianQuizApp();
});

// Service Worker登録（PWA対応）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
