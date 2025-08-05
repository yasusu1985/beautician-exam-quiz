class BeauticianExamApp {
    constructor() {
        this.questions = this.getQuestions();
        this.selectedSubjects = [];
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.startTime = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        console.log('アプリケーション初期化完了');
    }
    
    setupEventListeners() {
        // 科目選択のチェックボックス
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSubjectSelection());
        });
        
        // テスト開始ボタン
        document.getElementById('start-test').addEventListener('click', () => this.startTest());
        
        // 問題ナビゲーション
        document.getElementById('prev-question').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        document.getElementById('finish-test').addEventListener('click', () => this.finishTest());
        
        // リスタート
        document.getElementById('restart-test').addEventListener('click', () => this.restartTest());
    }
    
    updateSubjectSelection() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const selectedSubjects = [];
        let totalQuestions = 0;
        
        // 特別モード（クイック・実践形式）の確認
        const quickChecked = document.getElementById('quick-random').checked;
        const practiceChecked = document.getElementById('practice-all').checked;
        
        if (quickChecked || practiceChecked) {
            // 特別モードが選択されている場合、他のチェックボックスを無効にする
            checkboxes.forEach(cb => {
                if (cb.id !== 'quick-random' && cb.id !== 'practice-all') {
                    cb.disabled = true;
                    cb.checked = false;
                }
            });
            
            if (quickChecked) {
                selectedSubjects.push('quick-random');
                totalQuestions = 10;
            } else if (practiceChecked) {
                selectedSubjects.push('practice-all');
                totalQuestions = 55;
            }
        } else {
            // 特別モードが選択されていない場合、個別科目を有効にする
            checkboxes.forEach(cb => {
                if (cb.id !== 'quick-random' && cb.id !== 'practice-all') {
                    cb.disabled = false;
                    if (cb.checked) {
                        selectedSubjects.push(cb.value);
                        totalQuestions += parseInt(cb.dataset.questions) || 0;
                    }
                }
            });
        }
        
        this.selectedSubjects = selectedSubjects;
        
        // 選択状況の表示更新
        const subjectCount = quickChecked || practiceChecked ? 8 : selectedSubjects.length;
        document.getElementById('selected-subjects-count').textContent = subjectCount;
        document.getElementById('total-questions-count').textContent = totalQuestions;
        
        // テスト開始ボタンの状態更新
        const startButton = document.getElementById('start-test');
        startButton.disabled = selectedSubjects.length === 0;
    }
    
    startTest() {
        try {
            this.prepareQuestions();
            this.currentQuestionIndex = 0;
            this.answers = [];
            this.startTime = new Date();
            
            this.showSection('test-section');
            this.displayQuestion();
            
            console.log('テスト開始:', this.currentQuestions.length + '問');
        } catch (error) {
            console.error('テスト開始エラー:', error);
            this.showError('テストの開始に失敗しました。');
        }
    }
    
    prepareQuestions() {
        let selectedQuestions = [];
        
        if (this.selectedSubjects.includes('quick-random')) {
            // クイック：全科目から10問をランダム選択
            const allQuestions = Object.values(this.questions).flat();
            selectedQuestions = this.shuffleArray([...allQuestions]).slice(0, 10);
        } else if (this.selectedSubjects.includes('practice-all')) {
            // 実践形式：全科目から55問をランダム選択
            const allQuestions = Object.values(this.questions).flat();
            selectedQuestions = this.shuffleArray([...allQuestions]).slice(0, 55);
        } else {
            // 個別科目選択
            this.selectedSubjects.forEach(subject => {
                if (this.questions[subject]) {
                    selectedQuestions = selectedQuestions.concat(this.questions[subject]);
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
        const finishBtn = document.getElementById('finish-test');
        
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
    
    finishTest() {
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
    
    restartTest() {
        // 全選択解除
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
            cb.disabled = false;
        });
        
        this.selectedSubjects = [];
        this.currentQuestions = [];
        this.answers = [];
        
        this.updateSubjectSelection();
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
    
    getQuestions() {
        return {
            "関係法規・制度及び運営管理": [
                {
                    id: 1,
                    subject: "関係法規・制度及び運営管理",
                    question: "美容師法に関する次の記述のうち、誤っているものはどれか。",
                    choices: [
                        "公衆衛生の向上に資することを目的としている",
                        "美容の業務が適正に行われるように規律している",
                        "美容業の経営の健全化を促進することを目的としている",
                        "美容師の資格を定めている"
                    ],
                    correct: 2,
                    explanation: "美容業の経営の健全化を促進することは生活衛生関係営業の運営の適正化及び振興に関する法律の目的であり、美容師法の目的ではありません。"
                },
                {
                    id: 2,
                    subject: "関係法規・制度及び運営管理",
                    question: "美容師の免許に関する次の記述のうち、正しいものはどれか。",
                    choices: [
                        "美容師国家試験に合格すれば自動的に免許が交付される",
                        "免許の申請は試験合格から1年以内に行わなければならない",
                        "免許を受けようとする者は、厚生労働大臣に申請しなければならない",
                        "免許証を紛失した場合、再試験を受けなければならない"
                    ],
                    correct: 2,
                    explanation: "美容師の免許を受けようとする者は、厚生労働大臣に申請しなければなりません。"
                },
                {
                    id: 3,
                    subject: "関係法規・制度及び運営管理",
                    question: "美容所の開設について正しいものはどれか。",
                    choices: [
                        "美容師でなくても開設できる",
                        "都道府県知事の許可が必要である",
                        "市町村長への届出が必要である",
                        "保健所長への申請が必要である"
                    ],
                    correct: 1,
                    explanation: "美容所を開設しようとする者は、都道府県知事の許可を受けなければなりません。"
                },
                {
                    id: 4,
                    subject: "関係法規・制度及び運営管理",
                    question: "管理美容師について正しいものはどれか。",
                    choices: [
                        "美容師の免許を受けた後、すぐに管理美容師になれる",
                        "3年以上美容の業務に従事した後、講習会を受講する必要がある",
                        "美容所には管理美容師を置かなくてもよい",
                        "管理美容師は複数の美容所を管理できる"
                    ],
                    correct: 1,
                    explanation: "管理美容師になるには、美容師免許取得後3年以上の実務経験と講習会の受講が必要です。"
                },
                {
                    id: 5,
                    subject: "関係法規・制度及び運営管理",
                    question: "美容師法の処分について正しいものはどれか。",
                    choices: [
                        "戒告処分は美容師名簿に記載されない",
                        "業務停止処分の期間は最大5年である",
                        "免許取消処分を受けても再び免許を受けることができる",
                        "処分は都道府県知事が行う"
                    ],
                    correct: 2,
                    explanation: "免許取消処分を受けても、一定の条件を満たせば再び免許を受けることが可能です。"
                },
                {
                    id: 6,
                    subject: "関係法規・制度及び運営管理",
                    question: "美容師が従事してはならない行為はどれか。",
                    choices: [
                        "染毛", 
                        "結髪",
                        "化粧",
                        "医療行為"
                    ],
                    correct: 3,
                    explanation: "美容師は医療行為を行うことはできません。"
                },
                {
                    id: 7,
                    subject: "関係法規・制度及び運営管理",
                    question: "美容所の構造設備基準について正しいものはどれか。",
                    choices: [
                        "作業面積は1作業椅子につき1.3㎡以上",
                        "待合所は必ず設置しなければならない",
                        "洗髪設備は必要ない",
                        "採光は人工照明のみでよい"
                    ],
                    correct: 0,
                    explanation: "美容所の作業面積は、1作業椅子につき1.3㎡以上確保する必要があります。"
                },
                {
                    id: 8,
                    subject: "関係法規・制度及び運営管理",
                    question: "生活衛生関係営業の運営の適正化及び振興に関する法律について正しいものはどれか。",
                    choices: [
                        "生活衛生同業組合への加入は義務である",
                        "営業者の経営の健全化を図ることを目的としている",
                        "都道府県のみが所管している",
                        "美容業は対象外である"
                    ],
                    correct: 1,
                    explanation: "この法律は営業者の経営の健全化を図ることを目的としています。"
                },
                {
                    id: 9,
                    subject: "関係法規・制度及び運営管理",
                    question: "美容師の義務について正しいものはどれか。",
                    choices: [
                        "技術の研鑽に努める義務がある",
                        "免許証を常に携帯する義務がある",
                        "年1回の健康診断を受ける義務がある",
                        "業務に関する秘密を保持する義務がある"
                    ],
                    correct: 3,
                    explanation: "美容師には業務上知り得た秘密を他人に漏らしてはならない義務があります。"
                },
                {
                    id: 10,
                    subject: "関係法規・制度及び運営管理",
                    question: "美容所の消毒について正しいものはどれか。",
                    choices: [
                        "器具の消毒は1日1回行えばよい",
                        "消毒済みの器具と未消毒の器具は区別して保管する",
                        "消毒薬は1か月に1回交換する",
                        "紫外線消毒器は使用してはならない"
                    ],
                    correct: 1,
                    explanation: "消毒済みの器具と未消毒の器具は明確に区別して保管しなければなりません。"
                },
                {
                    id: 11,
                    subject: "関係法規・制度及び運営管理",
                    question: "美容師国家試験について正しいものはどれか。",
                    choices: [
                        "年1回実施される",
                        "実技試験のみで構成される",
                        "筆記試験と実技試験がある",
                        "都道府県が実施する"
                    ],
                    correct: 2,
                    explanation: "美容師国家試験は筆記試験と実技試験の両方で構成されています。"
                },
                {
                    id: 12,
                    subject: "関係法規・制度及び運営管理",
                    question: "美容所の開設者について正しいものはどれか。",
                    choices: [
                        "必ず美容師でなければならない",
                        "美容師でなくても開設できる",
                        "管理美容師でなければならない",
                        "美容師養成施設の卒業生でなければならない"
                    ],
                    correct: 1,
                    explanation: "美容所の開設者は美容師である必要はありませんが、管理美容師を置く必要があります。"
                }
            ],
            "公衆衛生・環境衛生": [
                {
                    id: 13,
                    subject: "公衆衛生・環境衛生",
                    question: "わが国の死因第1位はどれか。",
                    choices: [
                        "心疾患",
                        "脳血管疾患", 
                        "悪性新生物",
                        "肺炎"
                    ],
                    correct: 2,
                    explanation: "現在のわが国の死因第1位は悪性新生物（がん）です。"
                },
                {
                    id: 14,
                    subject: "公衆衛生・環境衛生",
                    question: "生活習慣病でないものはどれか。",
                    choices: [
                        "糖尿病",
                        "高血圧症",
                        "インフルエンザ",
                        "脂質異常症"
                    ],
                    correct: 2,
                    explanation: "インフルエンザは感染症であり、生活習慣病ではありません。"
                },
                {
                    id: 15,
                    subject: "公衆衛生・環境衛生",
                    question: "一酸化炭素について正しいものはどれか。",
                    choices: [
                        "無色無臭の気体である",
                        "空気より軽い",
                        "水に溶けやすい",
                        "酸化力が強い"
                    ],
                    correct: 0,
                    explanation: "一酸化炭素は無色無臭の有毒ガスです。"
                },
                {
                    id: 16,
                    subject: "公衆衛生・環境衛生",
                    question: "採光について正しいものはどれか。",
                    choices: [
                        "紫外線は有効な採光である",
                        "北向きの窓が最も良い",
                        "自然光が人工光より優れている",
                        "照度は低い方が目に良い"
                    ],
                    correct: 2,
                    explanation: "自然光は人工光に比べて光の質が優れており、健康にも良い影響があります。"
                },
                {
                    id: 17,
                    subject: "公衆衛生・環境衛生",
                    question: "室内環境について正しいものはどれか。",
                    choices: [
                        "湿度は30%以下が適切である",
                        "室温は25℃以上が適切である", 
                        "換気は1時間に0.5回以上必要である",
                        "二酸化炭素濃度は0.3%以下が適切である"
                    ],
                    correct: 2,
                    explanation: "適切な室内環境のためには、1時間に0.5回以上の換気が必要です。"
                },
                {
                    id: 18,
                    subject: "公衆衛生・環境衛生",
                    question: "水道水の消毒に使用されるものはどれか。",
                    choices: [
                        "塩素",
                        "オゾン",
                        "紫外線",
                        "アルコール"
                    ],
                    correct: 0,
                    explanation: "水道水の消毒には主に塩素が使用されます。"
                },
                {
                    id: 19,
                    subject: "公衆衛生・環境衛生",
                    question: "騒音について正しいものはどれか。",
                    choices: [
                        "50dB以下なら健康に影響しない",
                        "夜間の騒音基準は昼間と同じである",
                        "低周波音は聞こえないので無害である",
                        "長時間の騒音曝露は聴力障害を起こす"
                    ],
                    correct: 3,
                    explanation: "長時間の騒音曝露は聴力障害や健康被害を引き起こす可能性があります。"
                },
                {
                    id: 20,
                    subject: "公衆衛生・環境衛生",
                    question: "大気汚染物質でないものはどれか。",
                    choices: [
                        "二酸化硫黄",
                        "二酸化窒素",
                        "浮遊粒子状物質",
                        "二酸化炭素"
                    ],
                    correct: 3,
                    explanation: "二酸化炭素は通常の濃度では大気汚染物質として扱われません。"
                },
                {
                    id: 21,
                    subject: "公衆衛生・環境衛生",
                    question: "食中毒について正しいものはどれか。",
                    choices: [
                        "ウイルス性食中毒は冬季に多い",
                        "細菌性食中毒は冬季に多い",
                        "化学性食中毒は夏季に多い",
                        "自然毒食中毒は春季のみ発生する"
                    ],
                    correct: 0,
                    explanation: "ノロウイルスなどのウイルス性食中毒は冬季に多く発生します。"
                },
                {
                    id: 22,
                    subject: "公衆衛生・環境衛生", 
                    question: "健康づくりについて正しいものはどれか。",
                    choices: [
                        "第一次予防は治療を指す",
                        "第二次予防は早期発見・早期治療を指す",
                        "第三次予防は予防接種を指す",
                        "健康増進は病気になってから行う"
                    ],
                    correct: 1,
                    explanation: "第二次予防は疾病の早期発見・早期治療による重症化防止を指します。"
                },
                {
                    id: 23,
                    subject: "公衆衛生・環境衛生",
                    question: "産業保健について正しいものはどれか。",
                    choices: [
                        "労働安全衛生法は労働者50人以上の事業場に適用される",
                        "定期健康診断は2年に1回実施する",
                        "産業医の選任は労働者100人以上の事業場で必要",
                        "作業環境測定は必要ない"
                    ],
                    correct: 0,
                    explanation: "労働安全衛生法は労働者50人以上の事業場に適用されます。"
                },
                {
                    id: 24,
                    subject: "公衆衛生・環境衛生",
                    question: "学校保健について正しいものはどれか。",
                    choices: [
                        "学校医の配置は任意である",
                        "健康診断は年2回実施する",
                        "感染症の予防が重要である",
                        "環境衛生は対象外である"
                    ],
                    correct: 2,
                    explanation: "学校保健では感染症の予防と拡大防止が重要な課題です。"
                }
            ],
            "感染症": [
                {
                    id: 25,
                    subject: "感染症",
                    question: "感染症法に基づく就業制限の対象となるものはどれか。",
                    choices: [
                        "インフルエンザ",
                        "結核",
                        "風疹",
                        "水痘"
                    ],
                    correct: 1,
                    explanation: "結核は感染症法に基づく就業制限の対象となります。"
                },
                {
                    id: 26,
                    subject: "感染症",
                    question: "細菌について正しいものはどれか。",
                    choices: [
                        "核膜に包まれた核を持つ",
                        "細胞壁を持たない",
                        "単細胞生物である",
                        "ウイルスより小さい"
                    ],
                    correct: 2,
                    explanation: "細菌は単細胞の原核生物です。"
                },
                {
                    id: 27,
                    subject: "感染症",
                    question: "ウイルスについて正しいものはどれか。",
                    choices: [
                        "単独で増殖できる",
                        "細胞壁を持つ",
                        "宿主細胞内でのみ増殖する",
                        "抗生物質が有効である"
                    ],
                    correct: 2,
                    explanation: "ウイルスは宿主細胞内でのみ増殖することができます。"
                },
                {
                    id: 28,
                    subject: "感染症",
                    question: "感染経路について正しい組み合わせはどれか。",
                    choices: [
                        "結核 - 接触感染",
                        "B型肝炎 - 飛沫感染",
                        "インフルエンザ - 飛沫感染",
                        "食中毒 - 空気感染"
                    ],
                    correct: 2,
                    explanation: "インフルエンザは飛沫感染により伝播します。"
                },
                {
                    id: 29,
                    subject: "感染症",
                    question: "免疫について正しいものはどれか。",
                    choices: [
                        "自然免疫は後天的に獲得される",
                        "獲得免疫は生まれつき持っている",
                        "ワクチンは人工能動免疫である",
                        "抗体は細胞性免疫の主体である"
                    ],
                    correct: 2,
                    explanation: "ワクチンによる免疫は人工能動免疫に分類されます。"
                },
                {
                    id: 30,
                    subject: "感染症", 
                    question: "消毒について正しいものはどれか。",
                    choices: [
                        "滅菌と同じ意味である",
                        "すべての微生物を死滅させることである",
                        "病原微生物を除去・死滅させることである",
                        "ウイルスには効果がない"
                    ],
                    correct: 2,
                    explanation: "消毒は病原微生物を除去・死滅させ、感染力を失わせることです。"
                },
                {
                    id: 31,
                    subject: "感染症",
                    question: "手指衛生について正しいものはどれか。",
                    choices: [
                        "水で洗うだけで十分である",
                        "石鹸での手洗いが基本である",
                        "アルコールは効果がない",
                        "1日1回行えばよい"
                    ],
                    correct: 1,
                    explanation: "手指衛生の基本は石鹸を用いた手洗いです。"
                },
                {
                    id: 32,
                    subject: "感染症",
                    question: "肝炎について正しいものはどれか。",
                    choices: [
                        "A型肝炎は血液感染する",
                        "B型肝炎は経口感染する", 
                        "C型肝炎は主に血液感染する",
                        "すべて同じ感染経路である"
                    ],
                    correct: 2,
                    explanation: "C型肝炎は主に血液を介して感染します。"
                },
                {
                    id: 33,
                    subject: "感染症",
                    question: "HIV感染について正しいものはどれか。",
                    choices: [
                        "空気感染する",
                        "握手で感染する",
                        "血液を介して感染する",
                        "蚊を媒介して感染する"
                    ],
                    correct: 2,
                    explanation: "HIVは主に血液、性的接触、母子感染により感染します。"
                },
                {
                    id: 34,
                    subject: "感染症",
                    question: "新型コロナウイルス感染症について正しいものはどれか。",
                    choices: [
                        "細菌による感染症である",
                        "飛沫感染しない",
                        "無症状感染者も存在する",
                        "治療薬は存在しない"
                    ],
                    correct: 2,
                    explanation: "新型コロナウイルス感染症では無症状感染者も存在し、感染拡大の要因となります。"
                },
                {
                    id: 35,
                    subject: "感染症",
                    question: "抗生物質について正しいものはどれか。",
                    choices: [
                        "ウイルスに対して有効である",
                        "細菌に対して有効である",
                        "真菌に対してのみ有効である",
                        "すべての微生物に有効である"
                    ],
                    correct: 1,
                    explanation: "抗生物質は細菌に対して有効ですが、ウイルスには無効です。"
                },
                {
                    id: 36,
                    subject: "感染症",
                    question: "感染症の三要素に含まれないものはどれか。",
                    choices: [
                        "病原体",
                        "感染経路",
                        "宿主",
                        "季節"
                    ],
                    correct: 3,
                    explanation: "感染症の三要素は病原体、感染経路、宿主です。"
                }
            ],
            "衛生管理技術": [
                {
                    id: 37,
                    subject: "衛生管理技術",
                    question: "消毒の定義として正しいものはどれか。",
                    choices: [
                        "すべての微生物を死滅させること",
                        "病原微生物を死滅・除去して感染力を失わせること",
                        "細菌のみを死滅させること",
                        "ウイルスのみを死滅させること"
                    ],
                    correct: 1,
                    explanation: "消毒は病原微生物を死滅・除去して感染力を失わせることです。"
                },
                {
                    id: 38,
                    subject: "衛生管理技術",
                    question: "消毒用エタノールの濃度として最も適切なものはどれか。",
                    choices: [
                        "50%",
                        "70%",
                        "90%",
                        "100%"
                    ],
                    correct: 1,
                    explanation: "消毒用エタノールは70～80%の濃度が最も殺菌効果が高いとされています。"
                },
                {
                    id: 39,
                    subject: "衛生管理技術",
                    question: "次亜塩素酸ナトリウムについて正しいものはどれか。",
                    choices: [
                        "金属器具の消毒に適している",
                        "有機物があると効果が低下する",
                        "皮膚の消毒に適している",
                        "熱に対して安定である"
                    ],
                    correct: 1,
                    explanation: "次亜塩素酸ナトリウムは有機物があると塩素が消費され、効果が低下します。"
                },
                {
                    id: 40,
                    subject: "衛生管理技術",
                    question: "紫外線消毒について正しいものはどれか。",
                    choices: [
                        "波長400nmが最も効果的である",
                        "物質の内部まで到達する",
                        "表面の消毒に効果的である",
                        "有機物があっても効果は変わらない"
                    ],
                    correct: 2,
                    explanation: "紫外線消毒は表面の消毒に効果的ですが、物質の内部には到達しません。"
                },
                {
                    id: 41,
                    subject: "衛生管理技術",
                    question: "煮沸消毒について正しいものはどれか。",
                    choices: [
                        "80℃で10分間行う",
                        "100℃で15分間以上行う",
                        "沸騰後すぐに取り出してよい",
                        "水の量は関係ない"
                    ],
                    correct: 1,
                    explanation: "煮沸消毒は100℃で15分間以上行うのが基本です。"
                },
                {
                    id: 42,
                    subject: "衛生管理技術",
                    question: "器具の洗浄について正しいものはどれか。",
                    choices: [
                        "消毒前に必ず洗浄を行う",
                        "洗浄は消毒後に行う",
                        "中性洗剤は使用してはならない",
                        "水洗いのみで十分である"
                    ],
                    correct: 0,
                    explanation: "器具は消毒前に十分な洗浄を行うことが重要です。"
                },
                {
                    id: 43,
                    subject: "衛生管理技術",
                    question: "美容師法施行規則で定められた消毒法でないものはどれか。",
                    choices: [
                        "煮沸消毒",
                        "蒸気消毒",
                        "紫外線消毒",
                        "オゾン消毒"
                    ],
                    correct: 3,
                    explanation: "オゾン消毒は美容師法施行規則で定められた消毒法ではありません。"
                },
                {
                    id: 44,
                    subject: "衛生管理技術",
                    question: "消毒薬の希釈について正しいものはどれか。",
                    choices: [
                        "濃度が高いほど効果が高い",
                        "適正濃度を守ることが重要である",
                        "希釈倍率は関係ない",
                        "原液のまま使用する"
                    ],
                    correct: 1,
                    explanation: "消毒薬は適正濃度を守って使用することが最も重要です。"
                },
                {
                    id: 45,
                    subject: "衛生管理技術",
                    question: "器具の保管について正しいものはどれか。",
                    choices: [
                        "消毒済みと未消毒を同じ場所に保管する",
                        "消毒済みと未消毒を区別して保管する",
                        "湿った場所で保管する",
                        "密閉容器に入れる必要はない"
                    ],
                    correct: 1,
                    explanation: "消毒済みの器具と未消毒の器具は明確に区別して保管する必要があります。"
                },
                {
                    id: 46,
                    subject: "衛生管理技術",
                    question: "手指の消毒について正しいものはどれか。",
                    choices: [
                        "石鹸での手洗い後にアルコール消毒を行う",
                        "アルコール消毒のみで十分である",
                        "水洗いのみで十分である",
                        "消毒は1日1回でよい"
                    ],
                    correct: 0,
                    explanation: "手指は石鹸での手洗いの後、アルコールによる消毒を行うのが効果的です。"
                },
                {
                    id: 47,
                    subject: "衛生管理技術", 
                    question: "消毒効果に影響を与える因子として正しいものはどれか。",
                    choices: [
                        "温度",
                        "pH",
                        "有機物の存在",
                        "すべて正しい"
                    ],
                    correct: 3,
                    explanation: "消毒効果は温度、pH、有機物の存在など多くの因子に影響されます。"
                },
                {
                    id: 48,
                    subject: "衛生管理技術",
                    question: "滅菌について正しいものはどれか。",
                    choices: [
                        "病原微生物のみを死滅させること",
                        "すべての微生物とその芽胞を死滅させること",
                        "細菌のみを死滅させること",
                        "消毒と同じ意味である"
                    ],
                    correct: 1,
                    explanation: "滅菌はすべての微生物とその芽胞を完全に死滅または除去することです。"
                }
            ],
            "人体の構造及び機能": [
                {
                    id: 49,
                    subject: "人体の構造及び機能",
                    question: "頭蓋骨に含まれないものはどれか。",
                    choices: [
                        "前頭骨",
                        "頭頂骨",
                        "鎖骨",
                        "側頭骨"
                    ],
                    correct: 2,
                    explanation: "鎖骨は頭蓋骨ではなく、胸部の骨格に属します。"
                },
                {
                    id: 50,
                    subject: "人体の構造及び機能", 
                    question: "顔面の筋肉でないものはどれか。",
                    choices: [
                        "咬筋",
                        "眼輪筋",
                        "口輪筋",
                        "胸鎖乳突筋"
                    ],
                    correct: 3,
                    explanation: "胸鎖乳突筋は首の筋肉で、顔面の筋肉ではありません。"
                },
                {
                    id: 51,
                    subject: "人体の構造及び機能",
                    question: "神経系について正しいものはどれか。",
                    choices: [
                        "中枢神経系は脳と脊髄からなる",
                        "末梢神経系は脳神経のみからなる",
                        "自律神経は意識的に制御できる",
                        "交感神経と副交感神経は同じ働きをする"
                    ],
                    correct: 0,
                    explanation: "中枢神経系は脳と脊髄から構成されます。"
                },
                {
                    id: 52,
                    subject: "人体の構造及び機能",
                    question: "血液の働きでないものはどれか。",
                    choices: [
                        "酸素の運搬",
                        "栄養素の運搬",
                        "老廃物の運搬",
                        "音の伝達"
                    ],
                    correct: 3,
                    explanation: "血液の働きに音の伝達は含まれません。"
                },
                {
                    id: 53,
                    subject: "人体の構造及び機能",
                    question: "心臓について正しいものはどれか。",
                    choices: [
                        "2つの心房と2つの心室からなる",
                        "右心房から全身に血液を送る",
                        "左心室から肺に血液を送る",
                        "心臓には弁がない"
                    ],
                    correct: 0,
                    explanation: "心臓は2つの心房（右心房・左心房）と2つの心室（右心室・左心室）からなります。"
                },
                {
                    id: 54,
                    subject: "人体の構造及び機能",
                    question: "呼吸器について正しいものはどれか。",
                    choices: [
                        "鼻腔は呼吸器に含まれない",
                        "気管支は左右対称である",
                        "肺胞でガス交換が行われる",
                        "横隔膜は呼吸に関与しない"
                    ],
                    correct: 2,
                    explanation: "肺胞は酸素と二酸化炭素のガス交換が行われる場所です。"
                },
                {
                    id: 55,
                    subject: "人体の構造及び機能",
                    question: "消化器について正しいものはどれか。",
                    choices: [
                        "食道では消化が行われる",
                        "胃では主にタンパク質が消化される",
                        "小腸では吸収が行われない",
                        "大腸では栄養素が吸収される"
                    ],
                    correct: 1,
                    explanation: "胃では胃酸とペプシンによりタンパク質の消化が行われます。"
                },
                {
                    id: 56,
                    subject: "人体の構造及び機能",
                    question: "内分泌系について正しいものはどれか。",
                    choices: [
                        "ホルモンは神経を通して伝達される",
                        "甲状腺ホルモンは成長に関与する",
                        "インスリンは血糖値を上げる",
                        "副腎は腎臓の下にある"
                    ],
                    correct: 1,
                    explanation: "甲状腺ホルモンは成長・発育・代謝に重要な役割を果たします。"
                },
                {
                    id: 57,
                    subject: "人体の構造及び機能",
                    question: "泌尿器について正しいものはどれか。",
                    choices: [
                        "腎臓は血液をろ過する",
                        "尿管は膀胱から伸びる",
                        "膀胱は尿を作る",
                        "尿道は男女同じ長さである"
                    ],
                    correct: 0,
                    explanation: "腎臓は血液をろ過して老廃物を除去し、尿を生成します。"
                },
                {
                    id: 58,
                    subject: "人体の構造及び機能", 
                    question: "感覚器について正しいものはどれか。",
                    choices: [
                        "視覚は耳で感じる",
                        "聴覚は目で感じる", 
                        "味覚は舌で感じる",
                        "触覚は鼻で感じる"
                    ],
                    correct: 2,
                    explanation: "味覚は主に舌にある味蕾で感じられます。"
                },
                {
                    id: 59,
                    subject: "人体の構造及び機能",
                    question: "皮膚について正しいものはどれか。",
                    choices: [
                        "表皮、真皮、皮下組織の3層からなる",
                        "汗腺は表皮にある",
                        "色素細胞は真皮にある",
                        "皮脂腺は皮下組織にある"
                    ],
                    correct: 0,
                    explanation: "皮膚は外側から表皮、真皮、皮下組織の3層構造になっています。"
                },
                {
                    id: 60,
                    subject: "人体の構造及び機能",
                    question: "毛髪について正しいものはどれか。",
                    choices: [
                        "毛幹と毛根からなる",
                        "毛根は皮膚の表面にある",
                        "毛球は毛幹の先端にある",
                        "毛髪には血管がある"
                    ],
                    correct: 0,
                    explanation: "毛髪は皮膚の表面に出ている毛幹と、皮膚内にある毛根からなります。"
                }
            ],
            "皮膚科学": [
                {
                    id: 61,
                    subject: "皮膚科学",
                    question: "皮膚の構造について正しいものはどれか。",
                    choices: [
                        "表皮は最も厚い層である",
                        "真皮には血管がある",
                        "皮下組織には毛根がある",
                        "角質層は真皮にある"
                    ],
                    correct: 1,
                    explanation: "真皮には血管、リンパ管、神経などが分布しています。"
                },
                {
                    id: 62,
                    subject: "皮膚科学",
                    question: "表皮の細胞について正しいものはどれか。",
                    choices: [
                        "基底細胞は角化しない",
                        "有棘細胞は表面にある",
                        "顆粒細胞にはケラトヒアリン顆粒がある",
                        "角質細胞には核がある"
                    ],
                    correct: 2,
                    explanation: "顆粒細胞にはケラトヒアリン顆粒が含まれ、角化に関与します。"
                },
                {
                    id: 63,
                    subject: "皮膚科学",
                    question: "皮膚の機能でないものはどれか。",
                    choices: [
                        "保護機能",
                        "体温調節機能",
                        "感覚機能",
                        "消化機能"
                    ],
                    correct: 3,
                    explanation: "皮膚に消化機能はありません。"
                },
                {
                    id: 64,
                    subject: "皮膚科学",
                    question: "皮脂について正しいものはどれか。",
                    choices: [
                        "汗腺から分泌される",
                        "皮脂腺から分泌される",
                        "水溶性である",
                        "細菌の栄養にならない"
                    ],
                    correct: 1,
                    explanation: "皮脂は皮脂腺から分泌される脂質です。"
                },
                {
                    id: 65,
                    subject: "皮膚科学",
                    question: "汗について正しいものはどれか。",
                    choices: [
                        "エクリン汗腺から分泌される汗は無臭である",
                        "アポクリン汗腺は全身に分布する",
                        "汗の主成分は脂質である",
                        "汗腺は真皮にはない"
                    ],
                    correct: 0,
                    explanation: "エクリン汗腺から分泌される汗は通常無臭です。"
                },
                {
                    id: 66,
                    subject: "皮膚科学",
                    question: "毛髪の構造について正しいものはどれか。",
                    choices: [
                        "毛小皮、毛皮質、毛髄質からなる",
                        "毛小皮は最も内側にある",
                        "毛髄質は最も外側にある",
                        "毛皮質には血管がある"
                    ],
                    correct: 0,
                    explanation: "毛髪は外側から毛小皮、毛皮質、毛髄質の3層構造です。"
                },
                {
                    id: 67,
                    subject: "皮膚科学",
                    question: "毛周期について正しいものはどれか。",
                    choices: [
                        "成長期、退行期、休止期がある",
                        "成長期が最も短い",
                        "休止期はない",
                        "退行期が最も長い"
                    ],
                    correct: 0,
                    explanation: "毛周期は成長期、退行期、休止期の3つの時期からなります。"
                },
                {
                    id: 68,
                    subject: "皮膚科学",
                    question: "皮膚のpHについて正しいものはどれか。",
                    choices: [
                        "強いアルカリ性である",
                        "弱酸性である",
                        "中性である",
                        "個人差はない"
                    ],
                    correct: 1,
                    explanation: "健康な皮膚のpHは弱酸性（4.5～6.5）に保たれています。"
                },
                {
                    id: 69,
                    subject: "皮膚科学",
                    question: "皮膚疾患について正しいものはどれか。",
                    choices: [
                        "アトピー性皮膚炎は感染性である",
                        "じんましんは慢性疾患である",
                        "湿疹は炎症性疾患である",
                        "水虫は細菌感染である"
                    ],
                    correct: 2,
                    explanation: "湿疹は皮膚の炎症性疾患です。"
                },
                {
                    id: 70,
                    subject: "皮膚科学",
                    question: "皮膚の保健について正しいものはどれか。",
                    choices: [
                        "洗浄は1日に何度でも行ってよい",
                        "適度な洗浄と保湿が重要である",
                        "石鹸は使用しない方がよい",
                        "日光浴は制限する必要がない"
                    ],
                    correct: 1,
                    explanation: "皮膚の健康維持には適度な洗浄と保湿が重要です。"
                },
                {
                    id: 71,
                    subject: "皮膚科学",
                    question: "紫外線について正しいものはどれか。",
                    choices: [
                        "UV-Aは皮膚癌の原因とならない",
                        "UV-Bは真皮まで到達する",
                        "UV-Cは地表に到達しない",
                        "紫外線は皮膚に良い影響のみ与える"
                    ],
                    correct: 2,
                    explanation: "UV-Cはオゾン層で吸収され、通常地表には到達しません。"
                },
                {
                    id: 72,
                    subject: "皮膚科学",
                    question: "色素細胞について正しいものはどれか。",
                    choices: [
                        "メラノサイトは真皮にある",
                        "メラニン色素を産生する",
                        "紫外線に反応しない",
                        "すべての人で同じ数である"
                    ],
                    correct: 1,
                    explanation: "メラノサイト（色素細胞）はメラニン色素を産生します。"
                }
            ],
            "香粧品化学": [
                {
                    id: 73,
                    subject: "香粧品化学",
                    question: "界面活性剤について正しいものはどれか。",
                    choices: [
                        "親水基のみを持つ",
                        "疎水基のみを持つ",
                        "親水基と疎水基の両方を持つ",
                        "どちらも持たない"
                    ],
                    correct: 2,
                    explanation: "界面活性剤は親水基と疎水基の両方を持つ両親媒性分子です。"
                },
                {
                    id: 74,
                    subject: "香粧品化学",
                    question: "シャンプーの主成分はどれか。",
                    choices: [
                        "陰イオン界面活性剤",
                        "陽イオン界面活性剤",
                        "非イオン界面活性剤",
                        "両性界面活性剤"
                    ],
                    correct: 0,
                    explanation: "シャンプーの主成分は洗浄力の強い陰イオン界面活性剤です。"
                },
                {
                    id: 75,
                    subject: "香粧品化学",
                    question: "リンスの主成分はどれか。",
                    choices: [
                        "陰イオン界面活性剤",
                        "陽イオン界面活性剤", 
                        "非イオン界面活性剤",
                        "石鹸"
                    ],
                    correct: 1,
                    explanation: "リンスの主成分は毛髪に吸着しやすい陽イオン界面活性剤です。"
                },
                {
                    id: 76,
                    subject: "香粧品化学",
                    question: "パーマ剤について正しいものはどれか。",
                    choices: [
                        "1剤で毛髪を軟化させ、2剤で固定する",
                        "1剤で固定し、2剤で軟化させる",
                        "1剤のみで完了する",
                        "2剤のみで完了する"
                    ],
                    correct: 0,
                    explanation: "パーマは1剤で毛髪のシスチン結合を切断し、2剤で再結合させて固定します。"
                },
                {
                    id: 77,
                    subject: "香粧品化学",
                    question: "酸化染毛剤について正しいものはどれか。",
                    choices: [
                        "一時的な染毛である",
                        "永久染毛である",
                        "表面のみを染色する",
                        "シャンプーで容易に落ちる"
                    ],
                    correct: 1,
                    explanation: "酸化染毛剤は毛髪内部で発色し、永久的な染毛効果があります。"
                },
                {
                    id: 78,
                    subject: "香粧品化学",
                    question: "ヘアブリーチの原理はどれか。",
                    choices: [
                        "メラニン色素を酸化分解する",
                        "メラニン色素を還元する",
                        "メラニン色素を重合させる",
                        "メラニン色素を凝固させる"
                    ],
                    correct: 0,
                    explanation: "ヘアブリーチは過酸化水素によりメラニン色素を酸化分解して脱色します。"
                },
                {
                    id: 79,
                    subject: "香粧品化学",
                    question: "化粧品の防腐剤について正しいものはどれか。",
                    choices: [
                        "細菌のみに効果がある",
                        "カビのみに効果がある",
                        "微生物の増殖を防ぐ",
                        "化粧品には必要ない"
                    ],
                    correct: 2,
                    explanation: "防腐剤は細菌、酵母、カビなどの微生物の増殖を防ぎます。"
                },
                {
                    id: 80,
                    subject: "香粧品化学",
                    question: "乳化について正しいものはどれか。",
                    choices: [
                        "水と油を混ぜることである",
                        "界面活性剤なしでも可能である",
                        "O/W型とW/O型がある",
                        "温度に関係ない"
                    ],
                    correct: 2,
                    explanation: "乳化にはO/W型（水中油滴型）とW/O型（油中水滴型）があります。"
                },
                {
                    id: 81,
                    subject: "香粧品化学",
                    question: "香料について正しいものはどれか。",
                    choices: [
                        "天然香料のみ使用される",
                        "合成香料のみ使用される",
                        "天然香料と合成香料が使用される",
                        "香料は化粧品に不要である"
                    ],
                    correct: 2,
                    explanation: "化粧品には天然香料と合成香料の両方が使用されています。"
                },
                {
                    id: 82,
                    subject: "香粧品化学",
                    question: "保湿剤について正しいものはどれか。",
                    choices: [
                        "水分を奪う作用がある",
                        "水分を保持する作用がある",
                        "脂質のみからなる",
                        "化粧品には不要である"
                    ],
                    correct: 1,
                    explanation: "保湿剤は皮膚の水分を保持し、乾燥を防ぐ作用があります。"
                },
                {
                    id: 83,
                    subject: "香粧品化学",
                    question: "pH調整剤について正しいものはどれか。",
                    choices: [
                        "製品のpHを一定に保つ",
                        "製品の色を調整する",
                        "製品の香りを調整する",
                        "製品の粘度を調整する"
                    ],
                    correct: 0,
                    explanation: "pH調整剤は製品のpHを適切な範囲に保つために使用されます。"
                },
                {
                    id: 84,
                    subject: "香粧品化学",
                    question: "紫外線吸収剤について正しいものはどれか。",
                    choices: [
                        "紫外線を反射する",
                        "紫外線を吸収して熱に変える",
                        "紫外線を増強する",
                        "可視光線のみ吸収する"
                    ],
                    correct: 1,
                    explanation: "紫外線吸収剤は紫外線を吸収して熱エネルギーに変換します。"
                }
            ],
            "文化論及び美容技術理論": [
                {
                    id: 85,
                    subject: "文化論及び美容技術理論",
                    question: "日本髪について正しいものはどれか。",
                    choices: [
                        "明治時代に始まった",
                        "江戸時代に完成した",
                        "昭和時代の髪型である",
                        "外国から伝来した髪型である"
                    ],
                    correct: 1,
                    explanation: "日本髪は江戸時代に様々な型が完成し、日本独特の髪型文化として発達しました。"
                },
                {
                    id: 86,
                    subject: "文化論及び美容技術理論", 
                    question: "美容技術の基本姿勢で正しいものはどれか。",
                    choices: [
                        "お客様より高い位置に立つ",
                        "お客様と同じ目線の高さにする",
                        "常に座って作業する",
                        "片足に重心をかける"
                    ],
                    correct: 1,
                    explanation: "美容技術では、お客様と同じ目線の高さで作業することが基本です。"
                },
                {
                    id: 87,
                    subject: "文化論及び美容技術理論",
                    question: "シザーズの持ち方で正しいものはどれか。",
                    choices: [
                        "親指と人差し指で持つ",
                        "親指と薬指で持つ",
                        "人差し指と中指で持つ",
                        "中指と薬指で持つ"
                    ],
                    correct: 1,
                    explanation: "シザーズは親指を上の刃に、薬指を下の刃に入れて持ちます。"
                },
                {
                    id: 88,
                    subject: "文化論及び美容技術理論",
                    question: "ヘアデザインの要素でないものはどれか。",
                    choices: [
                        "フォルム",
                        "テクスチャー",
                        "カラー",
                        "価格"
                    ],
                    correct: 3,
                    explanation: "価格はヘアデザインの要素ではありません。"
                },
                {
                    id: 89,
                    subject: "文化論及び美容技術理論",
                    question: "ブラッシングの効果でないものはどれか。",
                    choices: [
                        "血行促進",
                        "汚れの除去",
                        "毛髪の整列",
                        "毛髪の成長促進"
                    ],
                    correct: 3,
                    explanation: "ブラッシングに直接的な毛髪成長促進効果はありません。"
                },
                {
                    id: 90,
                    subject: "文化論及び美容技術理論",
                    question: "シャンプーの目的として正しいものはどれか。",
                    choices: [
                        "毛髪の成長を促進する",
                        "毛髪と頭皮の汚れを除去する",
                        "毛髪を染色する",
                        "毛髪をカールさせる"
                    ],
                    correct: 1,
                    explanation: "シャンプーの主な目的は毛髪と頭皮の汚れを除去することです。"
                },
                {
                    id: 91,
                    subject: "文化論及び美容技術理論",
                    question: "ヘアカットの基本技術でないものはどれか。",
                    choices: [
                        "ブラントカット",
                        "グラデーションカット",
                        "レイヤーカット",
                        "パーマカット"
                    ],
                    correct: 3,
                    explanation: "パーマカットという基本技術はありません。"
                },
                {
                    id: 92,
                    subject: "文化論及び美容技術理論",
                    question: "ワインディングについて正しいものはどれか。",
                    choices: [
                        "毛束を太くするほどカールが強くなる",
                        "ロッドが細いほどカールが強くなる",
                        "薬剤の濃度は関係ない",
                        "巻く方向は関係ない"
                    ],
                    correct: 1,
                    explanation: "ロッドが細いほど、より強いカールがかかります。"
                },
                {
                    id: 93,
                    subject: "文化論及び美容技術理論",
                    question: "アイロン操作について正しいものはどれか。",
                    choices: [
                        "高温であるほど良い",
                        "毛髪が濡れた状態で使用する",
                        "適切な温度で使用する",
                        "長時間同じ箇所に当て続ける"
                    ],
                    correct: 2,
                    explanation: "アイロンは毛髪の状態に適した温度で使用することが重要です。"
                },
                {
                    id: 94,
                    subject: "文化論及び美容技術理論",
                    question: "ヘアカラーの基本について正しいものはどれか。",
                    choices: [
                        "明度とは色相のことである",
                        "彩度とは明るさのことである",
                        "色相とは色味のことである",
                        "トーンとは彩度のことである"
                    ],
                    correct: 2,
                    explanation: "色相は色味（赤、青、黄など）を表す要素です。"
                },
                {
                    id: 95,
                    subject: "文化論及び美容技術理論",
                    question: "接客マナーについて正しいものはどれか。",
                    choices: [
                        "お客様の話は適当に聞く",
                        "お客様のご要望を十分にうかがう",
                        "技術中は無言でいる",
                        "自分の意見を強く主張する"
                    ],
                    correct: 1,
                    explanation: "接客では、お客様のご要望を十分にうかがうことが重要です。"
                },
                {
                    id: 96,
                    subject: "文化論及び美容技術理論",
                    question: "美容師の職業倫理について正しいものはどれか。",
                    choices: [
                        "技術の向上に努める必要はない",
                        "お客様の秘密を保持する",
                        "流行に関心を持つ必要はない",
                        "他の美容師と競争する必要はない"
                    ],
                    correct: 1,
                    explanation: "美容師にはお客様の秘密を保持する職業倫理があります。"
                }
            ]
        };
    }
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
    new BeauticianExamApp();
});

