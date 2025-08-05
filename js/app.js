class BeauticianQuizApp {
    constructor() {
        this.questions = null;
        this.selectedSubjects = [];
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.startTime = null;
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadQuestions();
            this.setupEventListeners();
            console.log('アプリケーション初期化完了');
        } catch (error) {
            console.error('初期化エラー:', error);
            this.showError('問題データの読み込みに失敗しました。ページを再読み込みしてください。');
        }
    }
    
    async loadQuestions() {
        try {
            console.log('問題データを読み込み中...');
            const response = await fetch('data/questions.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.questions = await response.json();
            console.log('問題データ読み込み完了:', this.questions);
            
            if (!this.questions || !this.questions.subjects) {
                throw new Error('問題データの形式が正しくありません');
            }
            
        } catch (error) {
            console.error('問題読み込みエラー:', error);
            // フォールバック: 最小限の問題データ
            this.questions = {
                subjects: {
                    "関係法規・制度及び運営管理": [
                        {
                            id: 1,
                            subject: "関係法規・制度及び運営管理",
                            question: "美容師法の目的に関する記述で正しいものはどれか。",
                            choices: [
                                "美容師の資格を定める",
                                "美容業の経営を規制する", 
                                "美容技術の向上を図る",
                                "美容機器の安全性を確保する"
                            ],
                            correct: 0,
                            explanation: "美容師法第1条により、この法律の目的は美容師の資格を定めることです。"
                        }
                    ]
                }
            };
        }
    }
    
    setupEventListeners() {
        // 科目選択のチェックボックス
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSubjectSelection());
        });
        
        // クイズ開始ボタン
        document.getElementById('start-quiz').addEventListener('click', () => this.startQuiz());
        
        // 問題ナビゲーション
        document.getElementById('prev-question').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        document.getElementById('finish-quiz').addEventListener('click', () => this.finishQuiz());
        
        // リスタート
        document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
    }
    
    updateSubjectSelection() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const selectedSubjects = [];
        let totalQuestions = 0;
        
        // 実践形式が選択されているかチェック
        const practiceAllChecked = document.getElementById('practice-all').checked;
        
        if (practiceAllChecked) {
            // 実践形式が選択されている場合、他のチェックボックスを無効にする
            checkboxes.forEach(cb => {
                if (cb.id !== 'practice-all') {
                    cb.disabled = true;
                    cb.checked = false;
                }
            });
            selectedSubjects.push('practice-all');
            totalQuestions = 55;
        } else {
            // 実践形式が選択されていない場合、個別科目を有効にする
            checkboxes.forEach(cb => {
                if (cb.id !== 'practice-all') {
                    cb.disabled = false;
                    if (cb.checked) {
                        selectedSubjects.push(cb.value);
                        totalQuestions += parseInt(cb.dataset.questions);
                    }
                }
            });
        }
        
        this.selectedSubjects = selectedSubjects;
        
        // 選択状況の表示更新
        document.getElementById('selected-subjects-count').textContent = 
            practiceAllChecked ? 8 : selectedSubjects.length;
        document.getElementById('total-questions-count').textContent = totalQuestions;
        
        // クイズ開始ボタンの状態更新
        const startButton = document.getElementById('start-quiz');
        startButton.disabled = selectedSubjects.length === 0;
    }
    
    startQuiz() {
        try {
            this.prepareQuestions();
            this.currentQuestionIndex = 0;
            this.answers = [];
            this.startTime = new Date();
            
            this.showSection('quiz-section');
            this.displayQuestion();
            
            console.log('クイズ開始:', this.currentQuestions.length + '問');
        } catch (error) {
            console.error('クイズ開始エラー:', error);
            this.showError('クイズの開始に失敗しました。');
        }
    }
    
    prepareQuestions() {
        let selectedQuestions = [];
        
        if (this.selectedSubjects.includes('practice-all')) {
            // 実践形式：全科目から55問をランダム選択（実際の試験形式）
            const allQuestions = Object.values(this.questions.subjects).flat();
            selectedQuestions = this.shuffleArray([...allQuestions]).slice(0, 55);
        } else {
            // 個別科目選択
            this.selectedSubjects.forEach(subject => {
                if (this.questions.subjects[subject]) {
                    selectedQuestions = selectedQuestions.concat(this.questions.subjects[subject]);
                }
            });
            selectedQuestions = this.shuffleArray(selectedQuestions);
        }
        
        this.currentQuestions = selectedQuestions;
        
        if (this.currentQuestions.length === 0) {
            throw new Error('選択された科目の問題が見つかりません');
        }
        
        // UI更新
        document.getElementById('total-questions').textContent = this.currentQuestions.length;
    }
    
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    displayQuestion() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        
        if (!question) {
            console.error('問題データが見つかりません');
            return;
        }
        
        // 進捗バー更新
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100;
        document.querySelector('.progress-fill').style.width = progress + '%';
        
        // 問題番号と科目表示
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        document.getElementById('current-subject').textContent = question.subject;
        
        // 問題文表示
        document.getElementById('question-text').textContent = question.question;
        
        // 選択肢表示
        const choicesContainer = document.getElementById('choices-container');
        choicesContainer.innerHTML = '';
        
        question.choices.forEach((choice, index) => {
            const choiceElement = document.createElement('div');
            choiceElement.className = 'choice';
            choiceElement.textContent = choice;
            choiceElement.addEventListener('click', () => this.selectAnswer(index));
            choicesContainer.appendChild(choiceElement);
        });
        
        // 前回の回答があれば表示
        if (this.answers[this.currentQuestionIndex] !== undefined) {
            this.selectAnswer(this.answers[this.currentQuestionIndex], false);
        }
        
        // ボタン状態更新
        this.updateNavigationButtons();
        
        // 解説を隠す
        document.getElementById('explanation-panel').style.display = 'none';
    }
    
    selectAnswer(answerIndex, saveAnswer = true) {
        // 既存の選択を解除
        document.querySelectorAll('.choice').forEach(choice => {
            choice.classList.remove('selected');
        });
        
        // 新しい選択をマーク
        document.querySelectorAll('.choice')[answerIndex].classList.add('selected');
        
        if (saveAnswer) {
            this.answers[this.currentQuestionIndex] = answerIndex;
            
            // 解説表示
            this.showExplanation();
        }
        
        this.updateNavigationButtons();
    }
    
    showExplanation() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const userAnswer = this.answers[this.currentQuestionIndex];
        
        if (userAnswer === undefined) return;
        
        // 正解・不正解の色分け
        document.querySelectorAll('.choice').forEach((choice, index) => {
            if (index === question.correct) {
                choice.classList.add('correct');
            } else if (index === userAnswer && index !== question.correct) {
                choice.classList.add('incorrect');
            }
        });
        
        // 解説表示
        const explanationPanel = document.getElementById('explanation-panel');
        document.getElementById('explanation-text').textContent = question.explanation;
        explanationPanel.style.display = 'block';
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        const finishBtn = document.getElementById('finish-quiz');
        
        prevBtn.disabled = this.currentQuestionIndex === 0;
        
        const isLastQuestion = this.currentQuestionIndex === this.currentQuestions.length - 1;
        const hasAnswer = this.answers[this.currentQuestionIndex] !== undefined;
        
        if (isLastQuestion) {
            nextBtn.style.display = 'none';
            finishBtn.style.display = hasAnswer ? 'block' : 'none';
        } else {
            nextBtn.style.display = 'block';
            nextBtn.disabled = !hasAnswer;
            finishBtn.style.display = 'none';
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }
    
    finishQuiz() {
        this.showResults();
    }
    
    showResults() {
        // 結果計算
        let correctCount = 0;
        const subjectResults = {};
        
        this.currentQuestions.forEach((question, index) => {
            const userAnswer = this.answers[index];
            const isCorrect = userAnswer === question.correct;
            
            if (isCorrect) correctCount++;
            
            // 科目別集計
            if (!subjectResults[question.subject]) {
                subjectResults[question.subject] = { correct: 0, total: 0 };
            }
            subjectResults[question.subject].total++;
            if (isCorrect) subjectResults[question.subject].correct++;
        });
        
        const percentage = Math.round((correctCount / this.currentQuestions.length) * 100);
        
        // 結果表示
        document.getElementById('score-percentage').textContent = percentage + '%';
        document.getElementById('correct-answers').textContent = correctCount;
        document.getElementById('total-answered').textContent = this.currentQuestions.length;
        
        // 科目別結果表示
        const subjectResultsContainer = document.getElementById('subject-results');
        subjectResultsContainer.innerHTML = '';
        
        Object.entries(subjectResults).forEach(([subject, result]) => {
            const subjectDiv = document.createElement('div');
            subjectDiv.className = 'subject-result';
            subjectDiv.innerHTML = `
                <span>${subject}</span>
                <span>${result.correct}/${result.total} (${Math.round((result.correct/result.total)*100)}%)</span>
            `;
            subjectResultsContainer.appendChild(subjectDiv);
        });
        
        this.showSection('results-section');
    }
    
    restartQuiz() {
        this.showSection('subject-selection');
        this.updateSubjectSelection();
    }
    
    showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ef4444;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 5000);
    }
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
    new BeauticianQuizApp();
});
