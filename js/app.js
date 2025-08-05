// 美容師国家試験対策アプリ
class ExamApp {
    constructor() {
        this.questions = this.getQuestionData();
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.wrongAnswers = [];
        this.isReviewMode = false;
        this.currentTestType = '';
        
        this.initializeApp();
    }

    initializeApp() {
        this.showScreen('subjectSelection');
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.add('hidden'));
        document.getElementById(screenId).classList.remove('hidden');
    }

    getQuestionData() {
        // 96問の問題データ（実際の美容師国家試験の過去問を基に作成）
        return [
            // 関係法規・制度
            {
                id: 1,
                subject: 'kanseigaku',
                question: '美容師法において、美容師の免許を与えるのはどこか。',
                options: ['都道府県知事', '厚生労働大臣', '市町村長', '保健所長'],
                correct: 1,
                explanation: '美容師法第3条により、美容師の免許は厚生労働大臣が与える。'
            },
            {
                id: 2,
                subject: 'kanseigaku',
                question: '美容師が業務を行う場合に必要な届出先はどこか。',
                options: ['市町村', '都道府県', '保健所', '厚生労働省'],
                correct: 2,
                explanation: '美容師法第11条により、美容師が業務を行う場合は都道府県知事に届け出る必要がある。'
            },
            {
                id: 3,
                subject: 'kanseigaku',
                question: '美容所の開設者が都道府県知事に届け出なければならない事項として正しいのはどれか。',
                options: ['営業時間', '従業員数', '開設者の氏名', '年間売上高'],
                correct: 2,
                explanation: '美容師法第11条の2により、美容所開設時は開設者の氏名等を届け出る必要がある。'
            },
            {
                id: 4,
                subject: 'kanseigaku',
                question: '美容師法における美容の定義として正しいのはどれか。',
                options: ['髪の毛を切ること', 'パーマネントウェーブをかけること', '容姿を美しくすること', '頭髪の結髪、化粧等により容姿を美しくすること'],
                correct: 3,
                explanation: '美容師法第2条により、美容とは「頭髪の結髪、化粧等により容姿を美しくすること」と定義される。'
            },
            {
                id: 5,
                subject: 'kanseigagu',
                question: '美容師免許の有効期間はどのくらいか。',
                options: ['3年', '5年', '10年', '期限なし'],
                correct: 3,
                explanation: '美容師免許に有効期間はなく、一度取得すると期限なしで有効である。'
            },
            {
                id: 6,
                subject: 'kanseigaku',
                question: '美容師が従事制限を受ける感染症として正しいのはどれか。',
                options: ['インフルエンザ', '結膜炎', '皮膚疾患', '活動性結核'],
                correct: 3,
                explanation: '美容師法施行令により、活動性結核等の感染症に罹患した場合は従事が制限される。'
            },
            {
                id: 7,
                subject: 'kanseigaku',
                question: '美容所に備え付けが義務付けられている消毒設備として正しいのはどれか。',
                options: ['紫外線消毒器', '煮沸消毒器', '化学的消毒設備', 'オートクレーブ'],
                correct: 2,
                explanation: '美容師法施行規則により、美容所には化学的消毒のための設備の設置が義務付けられている。'
            },
            {
                id: 8,
                subject: 'kanseigaku',
                question: '美容師養成施設の修業年限として正しいのはどれか。',
                options: ['1年以上', '2年以上', '3年以上', '4年以上'],
                correct: 1,
                explanation: '美容師法第4条により、美容師養成施設の修業年限は2年以上と定められている。'
            },
            
            // 衛生管理
            {
                id: 9,
                subject: 'eiseigaku',
                question: '手指の消毒に最も適した消毒薬はどれか。',
                options: ['次亜塩素酸ナトリウム', 'エタノール', 'ホルムアルデヒド', 'グルタルアルデヒド'],
                correct: 1,
                explanation: 'エタノール（70～80%）は手指消毒に最も適しており、迅速な殺菌効果がある。'
            },
            {
                id: 10,
                subject: 'eiseigaku',
                question: '器具の煮沸消毒における適切な条件はどれか。',
                options: ['80℃、5分間', '90℃、10分間', '100℃、15分間以上', '100℃、30分間'],
                correct: 2,
                explanation: '煮沸消毒は100℃で15分間以上行うことが基準とされている。'
            },
            {
                id: 11,
                subject: 'eiseigaku',
                question: '紫外線消毒の特徴として正しいのはどれか。',
                options: ['すべての微生物に有効', '深部まで浸透する', '表面のみに有効', '残留毒性がある'],
                correct: 2,
                explanation: '紫外線消毒は表面のみに効果があり、影になった部分や深部には届かない。'
            },
            {
                id: 12,
                subject: 'eiseigaku',
                question: 'B型肝炎ウイルスに対して最も有効な消毒法はどれか。',
                options: ['アルコール消毒', '次亜塩素酸ナトリウム', '石鹸と流水', '紫外線照射'],
                correct: 1,
                explanation: 'B型肝炎ウイルスは比較的抵抗性が強く、次亜塩素酸ナトリウムが最も有効である。'
            },
            {
                id: 13,
                subject: 'eiseigaku',
                question: '美容所の換気回数として適切なのはどれか。',
                options: ['1回/時間', '3回/時間', '6回/時間', '10回/時間'],
                correct: 2,
                explanation: '美容所における適切な換気回数は1時間あたり6回以上とされている。'
            },
            {
                id: 14,
                subject: 'eiseigaku',
                question: '感染症の感染経路として正しくないのはどれか。',
                options: ['飛沫感染', '接触感染', '空気感染', '遺伝感染'],
                correct: 3,
                explanation: '遺伝感染という感染経路は存在しない。感染症は後天的に病原体が侵入することで起こる。'
            },
            {
                id: 15,
                subject: 'eiseigaku',
                question: 'ハサミの消毒方法として最も適切なのはどれか。',
                options: ['水洗いのみ', '70%エタノールで清拭', '石鹸で洗浄', '乾熱滅菌'],
                correct: 1,
                explanation: 'ハサミなどの金属器具は70%エタノールでの清拭消毒が適切である。'
            },
            {
                id: 16,
                subject: 'eiseigaku',
                question: '美容業務における標準予防策（スタンダードプリコーション）の基本として正しいのはどれか。',
                options: ['特定の感染症のみに対応', 'すべての顧客の血液・体液を感染性があるものとして扱う', '症状のある顧客のみに対応', '医療従事者のみが実施'],
                correct: 1,
                explanation: '標準予防策では、すべての人の血液・体液等を感染性があるものとして扱い、感染防止対策を行う。'
            },

            // 美容の物理・化学
            {
                id: 17,
                subject: 'biyougaku',
                question: 'pHが7の溶液の性質はどれか。',
                options: ['酸性', 'アルカリ性', '中性', '両性'],
                correct: 2,
                explanation: 'pH7は中性を示す。pH7未満は酸性、pH7超はアルカリ性である。'
            },
            {
                id: 18,
                subject: 'biyougaku',
                question: 'パーマネントウェーブの第1剤に含まれる主成分はどれか。',
                options: ['チオグリコール酸', '過酸化水素', 'アンモニア', 'ケラチン'],
                correct: 0,
                explanation: 'パーマの第1剤（還元剤）の主成分はチオグリコール酸またはシステインである。'
            },
            {
                id: 19,
                subject: 'biyougaku',
                question: 'ヘアカラーの2剤に含まれる成分はどれか。',
                options: ['アンモニア', '過酸化水素', 'パラフェニレンジアミン', 'レゾルシン'],
                correct: 1,
                explanation: 'ヘアカラーの2剤（酸化剤）には過酸化水素が含まれている。'
            },
            {
                id: 20,
                subject: 'biyougaku',
                question: '界面活性剤の性質として正しいのはどれか。',
                options: ['親水基のみを持つ', '疎水基のみを持つ', '親水基と疎水基を併せ持つ', '極性を持たない'],
                correct: 2,
                explanation: '界面活性剤は親水基（水になじみやすい部分）と疎水基（油になじみやすい部分）を併せ持つ。'
            },
            {
                id: 21,
                subject: 'biyougaku',
                question: 'ブリーチの脱色原理として正しいのはどれか。',
                options: ['メラニン色素の分解', 'メラニン色素の凝集', 'メラニン色素の生成促進', 'メラニン色素の移動'],
                correct: 0,
                explanation: 'ブリーチは過酸化水素によってメラニン色素を分解（酸化分解）することで脱色する。'
            },
            {
                id: 22,
                subject: 'biyougaku',
                question: 'セッティングローションに含まれる成分の主な目的はどれか。',
                options: ['脱色', '着色', '保湿', '結着（スタイリング保持）'],
                correct: 3,
                explanation: 'セッティングローションは髪型を保持するための結着成分が主目的である。'
            },
            {
                id: 23,
                subject: 'biyougaku',
                question: 'シャンプーの洗浄成分として最も一般的なのはどれか。',
                options: ['石鹸', 'アルキル硫酸エステル塩', 'アンモニア', 'エタノール'],
                correct: 1,
                explanation: '現在のシャンプーの主洗浄成分は、アルキル硫酸エステル塩系の合成界面活性剤である。'
            },
            {
                id: 24,
                subject: 'biyougaku',
                question: 'ヘアトリートメントの主な目的として正しいのはどれか。',
                options: ['脱色', '染色', '毛髪の補修・保護', 'ウェーブ形成'],
                correct: 2,
                explanation: 'ヘアトリートメントは毛髪のダメージ補修や保護が主な目的である。'
            },

            // 美容技術理論
            {
                id: 25,
                subject: 'biyou_gijutsu',
                question: 'ヘアカットにおけるグラデーションの特徴として正しいのはどれか。',
                options: ['すべて同じ長さ', '下が短く上が長い', '上が短く下が長い', 'ランダムな長さ'],
                correct: 1,
                explanation: 'グラデーションカットは下が短く上が長くなるようにカットする技法である。'
            },
            {
                id: 26,
                subject: 'biyou_gijutsu',
                question: 'レイヤーカットの特徴として正しいのはどれか。',
                options: ['段のないカット', '上が短く下が長い', '螺旋状のカット', 'ジグザグのカット'],
                correct: 1,
                explanation: 'レイヤーカットは上が短く下が長くなる段をつけるカット技法である。'
            },
            {
                id: 27,
                subject: 'biyou_gijutsu',
                question: 'ワンレングスカットの特徴はどれか。',
                options: ['段のあるカット', 'すべて同じ長さのカット', '上下で長さが異なる', '左右で長さが異なる'],
                correct: 1,
                explanation: 'ワンレングスカットは段をつけず、すべて同じ長さにカットする基本技法である。'
            },
            {
                id: 28,
                subject: 'biyou_gijutsu',
                question: 'パーマネントウェーブにおけるアンダーワインディングの特徴はどれか。',
                options: ['ロッドを上から巻く', 'ロッドを下から巻く', '横から巻く', '斜めから巻く'],
                correct: 1,
                explanation: 'アンダーワインディングは毛束を下からロッドに巻きつける技法である。'
            },
            {
                id: 29,
                subject: 'biyou_gijutsu',
                question: 'オーバーワインディングの特徴はどれか。',
                options: ['ロッドを下から巻く', 'ロッドを上から巻く', '横から巻く', '内側から巻く'],
                correct: 1,
                explanation: 'オーバーワインディングは毛束を上からロッドに巻きつける技法である。'
            },
            {
                id: 30,
                subject: 'biyou_gijutsu',
                question: 'ヘアカラーリングにおけるリタッチの目的はどれか。',
                options: ['全体を明るくする', '根元の新生毛を染める', '毛先を暗くする', '色を抜く'],
                correct: 1,
                explanation: 'リタッチは根元に伸びてきた新生毛（地毛）を染めるための技法である。'
            },
            {
                id: 31,
                subject: 'biyou_gijutsu',
                question: 'アップスタイルの基本となる技法はどれか。',
                options: ['ブラッシング', 'コーミング', 'ピニング', 'すべて'],
                correct: 3,
                explanation: 'アップスタイルにはブラッシング、コーミング、ピニングすべての技法が基本となる。'
            },
            {
                id: 32,
                subject: 'biyou_gijutsu',
                question: 'フィンガーウェーブの特徴として正しいのはどれか。',
                options: ['道具を使わない', '手と櫛だけで作る', '熱を使って作る', 'ロッドを使って作る'],
                correct: 1,
                explanation: 'フィンガーウェーブは手と櫛を使って指で髪を波状に形作る古典的な技法である。'
            },

            // 美容運営管理
            {
                id: 33,
                subject: 'biyou_unyo',
                question: '美容業における接客サービスの基本として最も重要なのはどれか。',
                options: ['技術力', '設備', '顧客満足', '価格'],
                correct: 2,
                explanation: '美容業では技術力とともに顧客満足が最も重要な要素である。'
            },
            {
                id: 34,
                subject: 'biyou_unyo',
                question: '美容所の経営において、固定費に該当するのはどれか。',
                options: ['材料費', '家賃', '水道光熱費の使用量部分', '歩合給'],
                correct: 1,
                explanation: '固定費は売上に関係なく一定額かかる費用で、家賃が代表的な例である。'
            },
            {
                id: 35,
                subject: 'biyou_unyo',
                question: '美容業における労働基準法の適用として正しいのはどれか。',
                options: ['適用されない', '一部のみ適用', '完全に適用される', '任意適用'],
                correct: 2,
                explanation: '美容業も他の事業と同様に労働基準法が完全に適用される。'
            },
            {
                id: 36,
                subject: 'biyou_unyo',
                question: '美容サービスの特性として正しいのはどれか。',
                options: ['保存可能', '均質性', '無形性', '分離可能'],
                correct: 2,
                explanation: '美容サービスは形のない無形のサービスであり、これがサービス業の特徴である。'
            },
            {
                id: 37,
                subject: 'biyou_unyo',
                question: '美容所の開設に必要な届出の時期はいつか。',
                options: ['開設後30日以内', '開設前', '開設と同時', '開設後1年以内'],
                correct: 1,
                explanation: '美容所の開設は事前に保健所への届出が必要である。'
            },
            {
                id: 38,
                subject: 'biyou_unyo',
                question: '美容業における職業倫理として最も重要なのはどれか。',
                options: ['利益の追求', '技術の向上', '顧客の秘密保持', '競争への勝利'],
                correct: 2,
                explanation: '美容師は顧客の個人情報や秘密を守る職業倫理が最も重要である。'
            },
            {
                id: 39,
                subject: 'biyou_unyo',
                question: '美容所における安全管理として正しいのはどれか。',
                options: ['事故は起こらない', '保険加入は不要', '事故防止対策が重要', '責任は顧客にある'],
                correct: 2,
                explanation: '美容所では顧客と従業員の安全のため、事故防止対策が重要である。'
            },
            {
                id: 40,
                subject: 'biyou_unyo',
                question: '美容業における人材育成で重要なのはどれか。',
                options: ['技術のみ', '接客のみ', '技術と接客の両方', 'マネジメントのみ'],
                correct: 2,
                explanation: '美容業では優れた技術力と優れた接客力の両方が重要である。'
            },

            // 人体の構造及び機能
            {
                id: 41,
                subject: 'jinntaigaku',
                question: '毛髪の構造で最も外側にあるのはどれか。',
                options: ['毛小皮', '毛皮質', '毛髄質', '毛球'],
                correct: 0,
                explanation: '毛髪は外側から毛小皮（キューティクル）、毛皮質（コルテックス）、毛髄質（メデュラ）の構造になっている。'
            },
            {
                id: 42,
                subject: 'jinntaigaku',
                question: '毛髪の成長期間として正しいのはどれか。',
                options: ['1～2年', '3～6年', '7～10年', '10年以上'],
                correct: 1,
                explanation: '毛髪の成長期（アナゲン期）は通常3～6年程度である。'
            },
            {
                id: 43,
                subject: 'jinntaigaku',
                question: '毛周期において最も長い期間を占めるのはどれか。',
                options: ['成長期', '退行期', '休止期', '発生期'],
                correct: 0,
                explanation: '毛周期では成長期（アナゲン期）が最も長く、全期間の約85～90%を占める。'
            },
            {
                id: 44,
                subject: 'jinntaigaku',
                question: '毛髪の主成分として正しいのはどれか。',
                options: ['セルロース', 'ケラチン', 'コラーゲン', 'エラスチン'],
                correct: 1,
                explanation: '毛髪の主成分は硬ケラチンというタンパク質である。'
            },
            {
                id: 45,
                subject: 'jinntaigaku',
                question: '皮脂腺から分泌される皮脂の主な成分はどれか。',
                options: ['水分', 'タンパク質', '脂質', '糖質'],
                correct: 2,
                explanation: '皮脂腺から分泌される皮脂は主に脂質（トリグリセリド、ワックスエステルなど）で構成されている。'
            },
            {
                id: 46,
                subject: 'jinntaigaku',
                question: '汗腺の種類として正しいのはどれか。',
                options: ['エクリン腺のみ', 'アポクリン腺のみ', 'エクリン腺とアポクリン腺', 'セバクリン腺'],
                correct: 2,
                explanation: '汗腺にはエクリン腺（小汗腺）とアポクリン腺（大汗腺）の2種類がある。'
            },
            {
                id: 47,
                subject: 'jinntaigaku',
                question: '表皮の最も深い層はどれか。',
                options: ['角質層', '顆粒層', '有棘層', '基底層'],
                correct: 3,
                explanation: '表皮は外側から角質層、顆粒層、有棘層、基底層の順に構成され、基底層が最も深い。'
            },
            {
                id: 48,
                subject: 'jinntaigaku',
                question: 'メラニン色素を産生する細胞はどれか。',
                options: ['ケラチノサイト', 'メラノサイト', 'ランゲルハンス細胞', '繊維芽細胞'],
                correct: 1,
                explanation: 'メラニン色素はメラノサイト（色素細胞）で産生される。'
            },

            // 皮膚科学
            {
                id: 49,
                subject: 'hifugaku',
                question: '皮膚のpH値として正しいのはどれか。',
                options: ['3～4', '4.5～6.5', '7～8', '8～9'],
                correct: 1,
                explanation: '健康な皮膚のpHは弱酸性で、約4.5～6.5の範囲にある。'
            },
            {
                id: 50,
                subject: 'hifugaku',
                question: '皮膚の生理機能として正しくないのはどれか。',
                options: ['保護機能', '体温調節機能', '感覚機能', '消化機能'],
                correct: 3,
                explanation: '皮膚の主な機能は保護、体温調節、感覚、分泌・吸収、呼吸機能等があるが、消化機能はない。'
            },
            {
                id: 51,
                subject: 'hifugaku',
                question: '脂漏性皮膚炎の好発部位として正しいのはどれか。',
                options: ['手のひら', '足の裏', '頭部・顔面', '下肢'],
                correct: 2,
                explanation: '脂漏性皮膚炎は皮脂分泌の多い頭部や顔面に好発する。'
            },
            {
                id: 52,
                subject: 'hifugaku',
                question: 'アトピー性皮膚炎の特徴として正しいのはどれか。',
                options: ['急性で治りやすい', '慢性で再発しやすい', '感染性がある', '高齢者に多い'],
                correct: 1,
                explanation: 'アトピー性皮膚炎は慢性で再発しやすく、強いかゆみを伴う炎症性皮膚疾患である。'
            },
            {
                id: 53,
                subject: 'hifugaku',
                question: '頭皮の痒みの原因として最も多いのはどれか。',
                options: ['細菌感染', '真菌感染', '脂漏性皮膚炎', 'ウイルス感染'],
                correct: 2,
                explanation: '頭皮の痒みは脂漏性皮膚炎が最も多く、皮脂の過剰分泌と関連がある。'
            },
            {
                id: 54,
                subject: 'hifugaku',
                question: '接触性皮膚炎の原因として正しいのはどれか。',
                options: ['遺伝', 'ストレス', '外的刺激物質', '栄養不足'],
                correct: 2,
                explanation: '接触性皮膚炎は化学物質などの外的刺激物質が皮膚に接触することで起こる。'
            },
            {
                id: 55,
                subject: 'hifugaku',
                question: '乾燥肌（ドライスキン）の特徴として正しいのはどれか。',
                options: ['皮脂分泌が多い', '水分保持能が低い', '毛穴が目立つ', '光沢がある'],
                correct: 1,
                explanation: '乾燥肌は角質層の水分保持能力が低下し、皮膚が乾燥した状態である。'
            },
            {
                id: 56,
                subject: 'hifugaku',
                question: '日光皮膚炎（日焼け）の原因となる紫外線はどれか。',
                options: ['UV-A', 'UV-B', 'UV-C', 'すべて'],
                correct: 1,
                explanation: '日光皮膚炎（日焼け）は主にUV-Bが原因で、皮膚に炎症を起こす。'
            },

            // 香粧品化学
            {
                id: 57,
                subject: 'cosmetic',
                question: '化粧品における保湿剤の働きとして正しいのはどれか。',
                options: ['着色', '香り付け', '水分保持', '紫外線カット'],
                correct: 2,
                explanation: '保湿剤は皮膚や毛髪の水分を保持し、乾燥を防ぐ働きをする。'
            },
            {
                id: 58,
                subject: 'cosmetic',
                question: 'ファンデーションの主な目的はどれか。',
                options: ['保湿', '肌色の調整と保護', '香り付け', '殺菌'],
                correct: 1,
                explanation: 'ファンデーションは肌色を調整し、外的刺激から肌を保護することが主な目的である。'
            },
            {
                id: 59,
                subject: 'cosmetic',
                question: '日焼け止め化粧品に含まれる紫外線防止剤の種類はどれか。',
                options: ['紫外線吸収剤のみ', '紫外線散乱剤のみ', '紫外線吸収剤と散乱剤', '紫外線反射剤のみ'],
                correct: 2,
                explanation: '日焼け止めには紫外線吸収剤と紫外線散乱剤の両方が使用される。'
            },
            {
                id: 60,
                subject: 'cosmetic',
                question: '化粧水の主成分として正しいのはどれか。',
                options: ['油分', '水分', 'アルコール', '香料'],
                correct: 1,
                explanation: '化粧水の主成分は水分（精製水）で、全体の70～90%を占める。'
            },
            {
                id: 61,
                subject: 'cosmetic',
                question: '乳液とクリームの違いとして正しいのはどれか。',
                options: ['成分が全く違う', '油分の配合量の違い', '使用目的が違う', '製造方法が違う'],
                correct: 1,
                explanation: '乳液とクリームの主な違いは油分の配合量で、クリームの方が油分が多い。'
            },
            {
                id: 62,
                subject: 'cosmetic',
                question: 'SPFが表す内容として正しいのはどれか。',
                options: ['UV-A防止効果', 'UV-B防止効果', '保湿効果', '美白効果'],
                correct: 1,
                explanation: 'SPF（Sun Protection Factor）はUV-Bに対する防止効果を表す指標である。'
            },
            {
                id: 63,
                subject: 'cosmetic',
                question: 'PAが表す内容として正しいのはどれか。',
                options: ['UV-A防止効果', 'UV-B防止効果', '保湿効果', '美白効果'],
                correct: 0,
                explanation: 'PA（Protection grade of UV-A）はUV-Aに対する防止効果を表す指標である。'
            },
            {
                id: 64,
                subject: 'cosmetic',
                question: '化粧品の防腐剤の目的として正しいのはどれか。',
                options: ['香りを良くする', '微生物の増殖防止', '色を良くする', '使用感を良くする'],
                correct: 1,
                explanation: '防腐剤は化粧品中での細菌・真菌等の微生物の増殖を防止する目的で配合される。'
            },

            // 追加問題（65～96問目）
            {
                id: 65,
                subject: 'kanseigaku',
                question: '美容師が業務停止処分を受ける事由として正しいのはどれか。',
                options: ['技術不足', '営業時間の違反', '美容師法違反', '設備不備'],
                correct: 2,
                explanation: '美容師法第9条により、美容師法に違反した場合は業務停止処分を受ける場合がある。'
            },
            {
                id: 66,
                subject: 'eiseigaku',
                question: 'ノロウイルスの感染予防として最も有効なのはどれか。',
                options: ['マスク着用', '手洗い・手指消毒', '室内換気', 'うがい'],
                correct: 1,
                explanation: 'ノロウイルスは主に経口感染するため、手洗い・手指消毒が最も有効な予防法である。'
            },
            {
                id: 67,
                subject: 'biyougaku',
                question: 'ヘアマニキュアの特徴として正しいのはどれか。',
                options: ['毛髪内部に浸透', '毛髪表面に付着', 'メラニン色素を分解', '永久的な染色'],
                correct: 1,
                explanation: 'ヘアマニキュアは毛髪表面に色素が付着するタイプの染毛料である。'
            },
            {
                id: 68,
                subject: 'biyou_gijutsu',
                question: 'シザーズの正しい持ち方として適切なのはどれか。',
                options: ['親指と人差し指で持つ', '親指と薬指で持つ', '人差し指と中指で持つ', '親指と中指で持つ'],
                correct: 1,
                explanation: 'シザーズは親指を上の刃の穴に、薬指を下の刃の穴に入れて持つのが正しい。'
            },
            {
                id: 69,
                subject: 'biyou_unyo',
                question: '美容業における顧客情報の取り扱いで最も重要なことはどれか。',
                options: ['積極的な活用', '他店との共有', '適切な管理・保護', '長期間保存'],
                correct: 2,
                explanation: '個人情報保護法により、顧客情報は適切に管理・保護することが最も重要である。'
            },
            {
                id: 70,
                subject: 'jinntaigaku',
                question: '毛髪の断面が円形に近いのはどのタイプか。',
                options: ['直毛', '波状毛', '縮毛', 'すべて同じ'],
                correct: 0,
                explanation: '直毛の断面は円形に近く、波状毛や縮毛になるにつれて楕円形になる。'
            },
            {
                id: 71,
                subject: 'hifugaku',
                question: '皮膚のターンオーバー（新陳代謝）の周期はどのくらいか。',
                options: ['約14日', '約28日', '約42日', '約56日'],
                correct: 1,
                explanation: '正常な皮膚のターンオーバーは約28日周期で行われる。'
            },
            {
                id: 72,
                subject: 'cosmetic',
                question: '美容液の主な特徴として正しいのはどれか。',
                options: ['基礎化粧品', '有効成分高濃度配合', 'メイクアップ用品', '洗浄用化粧品'],
                correct: 1,
                explanation: '美容液は有効成分を高濃度で配合した基礎化粧品である。'
            },
            {
                id: 73,
                subject: 'kanseigaku',
                question: '美容師の免許証を紛失した場合の手続きはどれか。',
                options: ['再取得は不可', '再交付申請', '新規取得', '仮免許申請'],
                correct: 1,
                explanation: '美容師免許証を紛失した場合は、再交付の申請を行うことができる。'
            },
            {
                id: 74,
                subject: 'eiseigaku',
                question: '美容所における器具の保管方法として適切なのはどれか。',
                options: ['そのまま保管', '消毒後密閉容器保管', '水洗い後保管', '乾燥のみで保管'],
                correct: 1,
                explanation: '器具は消毒後、清潔な密閉容器に保管することが適切である。'
            },
            {
                id: 75,
                subject: 'biyougaku',
                question: 'コールドパーマとデジタルパーマの違いとして正しいのはどれか。',
                options: ['使用薬剤の違い', '熱の有無', '巻き方の違い', '時間の違い'],
                correct: 1,
                explanation: 'コールドパーマは熱を使わず、デジタルパーマは熱を利用してウェーブを形成する。'
            },
            {
                id: 76,
                subject: 'biyou_gijutsu',
                question: 'ブロードライの基本姿勢として正しいのはどれか。',
                options: ['座って行う', '立って行う', '寝て行う', '姿勢は関係ない'],
                correct: 1,
                explanation: 'ブロードライは立った姿勢で、適切なフォームを保ちながら行うのが基本である。'
            },
            {
                id: 77,
                subject: 'biyou_unyo',
                question: '美容業における労働安全衛生として重要なのはどれか。',
                options: ['利益の確保', '作業環境の整備', '競合他社の調査', '広告宣伝'],
                correct: 1,
                explanation: '労働安全衛生法に基づき、安全で健康的な作業環境の整備が重要である。'
            },
            {
                id: 78,
                subject: 'jinntaigaku',
                question: '毛髪中のメラニン色素の種類として正しいのはどれか。',
                options: ['ユーメラニンのみ', 'フェオメラニンのみ', 'ユーメラニンとフェオメラニン', 'ニューロメラニン'],
                correct: 2,
                explanation: '毛髪中には黒褐色のユーメラニンと黄赤色のフェオメラニンがある。'
            },
            {
                id: 79,
                subject: 'hifugaku',
                question: '敏感肌の特徴として正しいのはどれか。',
                options: ['皮脂分泌が多い', '刺激に対する反応が強い', '毛穴が大きい', '色素沈着しやすい'],
                correct: 1,
                explanation: '敏感肌は外的刺激に対して過敏に反応しやすい肌質である。'
            },
            {
                id: 80,
                subject: 'cosmetic',
                question: '化粧品における酸化防止剤の役割はどれか。',
                options: ['香りを良くする', '品質の劣化防止', '色を良くする', '泡立ちを良くする'],
                correct: 1,
                explanation: '酸化防止剤は化粧品の酸化による品質劣化を防ぐ役割がある。'
            },
            {
                id: 81,
                subject: 'kanseigaku',
                question: '美容師が他の美容所で業務を行う場合の手続きはどれか。',
                options: ['手続き不要', '移転届', '廃止届と開設届', '変更届'],
                correct: 3,
                explanation: '美容師が他の美容所で業務を行う場合は変更届の提出が必要である。'
            },
            {
                id: 82,
                subject: 'eiseigaku',
                question: '血液を介する感染症として正しいのはどれか。',
                options: ['インフルエンザ', 'B型肝炎', '結膜炎', '水虫'],
                correct: 1,
                explanation: 'B型肝炎ウイルスは血液を介して感染する代表的な感染症である。'
            },
            {
                id: 83,
                subject: 'biyougaku',
                question: 'アルカリ性パーマ液の特徴として正しいのはどれか。',
                options: ['作用が穏やか', '毛髪への負担が少ない', '浸透力が強い', '中性に近い'],
                correct: 2,
                explanation: 'アルカリ性パーマ液は毛髪への浸透力が強く、ウェーブ効果が高い。'
            },
            {
                id: 84,
                subject: 'biyou_gijutsu',
                question: 'セクショニングの目的として正しいのはどれか。',
                options: ['髪を濡らす', '髪を分割する', '髪を乾かす', '髪を染める'],
                correct: 1,
                explanation: 'セクショニングは施術をしやすくするために髪を適切に分割することである。'
            },
            {
                id: 85,
                subject: 'biyou_unyo',
                question: '美容業における品質管理として重要なのはどれか。',
                options: ['価格の統一', 'サービスの標準化', '営業時間の延長', '店舗数の拡大'],
                correct: 1,
                explanation: '品質管理ではサービスの標準化により一定の品質を保つことが重要である。'
            },
            {
                id: 86,
                subject: 'jinntaigaku',
                question: '毛母細胞の機能として正しいのはどれか。',
                options: ['色素の産生', '毛髪の成長', '皮脂の分泌', '汗の分泌'],
                correct: 1,
                explanation: '毛母細胞は細胞分裂を繰り返し、毛髪を成長させる機能がある。'
            },
            {
                id: 87,
                subject: 'hifugaku',
                question: '脂性肌の特徴として正しいのはどれか。',
                options: ['皮脂分泌が少ない', '毛穴が目立つ', '乾燥しやすい', '薄い皮膚'],
                correct: 1,
                explanation: '脂性肌は皮脂分泌が多く、毛穴が目立ちやすい特徴がある。'
            },
            {
                id: 88,
                subject: 'cosmetic',
                question: '口紅の主要成分として正しいのはどれか。',
                options: ['水', '油脂・ワックス', 'アルコール', '界面活性剤'],
                correct: 1,
                explanation: '口紅の主要成分は油脂やワックスで、これにより唇に密着し保護する。'
            },
            {
                id: 89,
                subject: 'kanseigaku',
                question: '美容師法における罰則として正しいのはどれか。',
                options: ['注意のみ', '免許取消し', '口頭指導', '研修受講'],
                correct: 1,
                explanation: '美容師法違反の場合、免許取消しや業務停止等の行政処分が科される場合がある。'
            },
            {
                id: 90,
                subject: 'eiseigaku',
                question: 'タオルの消毒方法として適切なのはどれか。',
                options: ['水洗いのみ', '80℃10分間の熱湯消毒', '日光乾燥のみ', '化学的消毒のみ'],
                correct: 1,
                explanation: 'タオルは80℃以上の熱湯で10分間以上の熱湯消毒が効果的である。'
            },
            {
                id: 91,
                subject: 'biyougaku',
                question: 'ヘアアイロンの適切な温度設定はどれか。',
                options: ['100℃以下', '120～180℃', '200℃以上', '温度は関係ない'],
                correct: 1,
                explanation: 'ヘアアイロンは毛髪の損傷を避けるため、120～180℃程度が適切である。'
            },
            {
                id: 92,
                subject: 'biyou_gijutsu',
                question: 'スライシングの技法として正しいのはどれか。',
                options: ['垂直にカット', '斜めにカット', '毛束を薄く取る', '厚く取る'],
                correct: 2,
                explanation: 'スライシングは毛束を薄く取って細かくカットする技法である。'
            },
            {
                id: 93,
                subject: 'biyou_unyo',
                question: '美容業におけるコンプライアンスとして重要なのはどれか。',
                options: ['利益追求', '法令遵守', '競争優位', '技術革新'],
                correct: 1,
                explanation: 'コンプライアンスは法令遵守という意味で、美容業でも重要な概念である。'
            },
            {
                id: 94,
                subject: 'jinntaigaku',
                question: '頭皮の構造として正しいのはどれか。',
                options: ['表皮のみ', '真皮のみ', '皮下組織のみ', '表皮・真皮・皮下組織'],
                correct: 3,
                explanation: '頭皮は表皮、真皮、皮下組織の3層構造からなる。'
            },
            {
                id: 95,
                subject: 'hifugaku',
                question: '紫外線による皮膚への影響として正しいのはどれか。',
                options: ['保湿効果', '日焼け・シミの原因', '血行促進のみ', 'ビタミン破壊のみ'],
                correct: 1,
                explanation: '紫外線は日焼けやシミ、しわなどの皮膚老化の主要な原因となる。'
            },
            {
                id: 96,
                subject: 'cosmetic',
                question: 'クレンジングの主な目的として正しいのはどれか。',
                options: ['保湿', 'メイクの除去', '栄養補給', 'マッサージ'],
                correct: 1,
                explanation: 'クレンジングの主な目的はメイクアップ化粧品や皮脂汚れの除去である。'
            }
        ];
    }

    // Fisher-Yates シャッフルアルゴリズム
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    startQuickTest() {
        this.currentTestType = 'quick';
        this.currentQuestions = this.shuffleArray(this.questions).slice(0, 10);
        this.startTest();
    }

    startPracticeTest() {
        this.currentTestType = 'practice';
        
        // 各科目から問題を選択（実践形式：55問）
        const subjectQuestions = {
            'kanseigaku': 8,
            'eiseigaku': 8,
            'biyougaku': 8,
            'biyou_gijutsu': 8,
            'biyou_unyo': 8,
            'jinntaigaku': 8,
            'hifugaku': 8,
            'cosmetic': 9
        };

        let selectedQuestions = [];
        
        Object.entries(subjectQuestions).forEach(([subject, count]) => {
            const subjectQs = this.questions.filter(q => q.subject === subject);
            const shuffled = this.shuffleArray(subjectQs);
            selectedQuestions = selectedQuestions.concat(shuffled.slice(0, count));
        });

        this.currentQuestions = this.shuffleArray(selectedQuestions);
        this.startTest();
    }

    startSubjectTest(subject) {
        this.currentTestType = subject;
        const subjectQuestions = this.questions.filter(q => q.subject === subject);
        this.currentQuestions = this.shuffleArray(subjectQuestions);
        this.startTest();
    }

    startTest() {
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.isReviewMode = false;
        this.showScreen('questionScreen');
        this.showQuestion();
        this.updateProgress();
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.showResults();
            return;
        }

        const question = this.currentQuestions[this.currentQuestionIndex];
        document.getElementById('questionText').textContent = question.question;
        
        const optionsContainer = document.getElementById('questionOptions');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = `${index + 1}. ${option}`;
            button.onclick = () => this.selectOption(index, button);
            optionsContainer.appendChild(button);
        });
        
        document.getElementById('nextButton').disabled = true;
        this.updateProgress();
    }

    selectOption(selectedIndex, selectedButton) {
        // 既存の選択をクリア
        document.querySelectorAll('.option').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 新しい選択をマーク
        selectedButton.classList.add('selected');
        
        // 答えを記録
        this.answers[this.currentQuestionIndex] = selectedIndex;
        
        // 次へボタンを有効化
        document.getElementById('nextButton').disabled = false;
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    showResults() {
        let correctCount = 0;
        this.wrongAnswers = []; // 間違えた問題をリセット

        this.currentQuestions.forEach((question, index) => {
            const userAnswer = this.answers[index];
            if (userAnswer === question.correct) {
                correctCount++;
            } else {
                // 間違えた問題を保存（詳細情報付き）
                this.wrongAnswers.push({
                    ...question,
                    userAnswer: userAnswer,
                    questionIndex: index
                });
            }
        });

        // 間違えた問題をローカルストレージに保存
        localStorage.setItem('wrongAnswers', JSON.stringify(this.wrongAnswers));

        const totalQuestions = this.currentQuestions.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);

        // 結果表示
        document.getElementById('scorePercentage').textContent = `${percentage}%`;
        document.getElementById('correctCount').textContent = correctCount;
        document.getElementById('totalCount').textContent = totalQuestions;

        // メッセージ設定
        let message = '';
        if (percentage >= 90) message = '素晴らしい！完璧です！';
        else if (percentage >= 80) message = '優秀です！';
        else if (percentage >= 70) message = '良好です！';
        else if (percentage >= 60) message = '合格ライン！復習しましょう';
        else message = 'もう少し頑張りましょう！';

        document.getElementById('resultMessage').textContent = message;

        // 詳細結果表示
        const detailResults = document.getElementById('detailResults');
        detailResults.innerHTML = '';

        this.currentQuestions.forEach((question, index) => {
            const userAnswer = this.answers[index];
            const isCorrect = userAnswer === question.correct;
            
            const item = document.createElement('div');
            item.className = `detail-item ${isCorrect ? 'correct' : 'incorrect'}`;
            item.innerHTML = `
                <strong>問${index + 1}:</strong> ${question.question}<br>
                <strong>あなたの答え:</strong> ${userAnswer !== undefined ? question.options[userAnswer] : '未回答'}<br>
                <strong>正解:</strong> ${question.options[question.correct]}<br>
                ${question.explanation ? `<strong>解説:</strong> ${question.explanation}` : ''}
            `;
            detailResults.appendChild(item);
        });

        this.showScreen('resultScreen');
    }

    updateProgress() {
        const current = this.currentQuestionIndex + 1;
        const total = this.currentQuestions.length;
        const percentage = (this.currentQuestionIndex / total) * 100;
        
        document.getElementById('currentQuestion').textContent = current;
        document.getElementById('totalQuestions').textContent = total;
        document.getElementById('progressBar').style.width = `${percentage}%`;
    }

    reviewWrongAnswers() {
        const savedWrongAnswers = localStorage.getItem('wrongAnswers');
        if (!savedWrongAnswers) {
            alert('復習する問題がありません。');
            return;
        }

        this.wrongAnswers = JSON.parse(savedWrongAnswers);
        
        if (this.wrongAnswers.length === 0) {
            alert('間違えた問題がありません。全問正解でした！');
            return;
        }

        // 復習モードを開始
        this.isReviewMode = true;
        this.currentQuestions = this.wrongAnswers;
        this.currentQuestionIndex = 0;
        this.answers = [];
        
        this.showScreen('questionScreen');
        this.showQuestion();
        this.updateProgress();
    }

    newStart() {
        // 状態をリセット
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.wrongAnswers = [];
        this.isReviewMode = false;
        this.currentTestType = '';
        
        // メイン画面に戻る
        this.showScreen('subjectSelection');
    }
}

// グローバル関数（HTML から呼び出し用）
let app;

document.addEventListener('DOMContentLoaded', function() {
    app = new ExamApp();
});

function startQuickTest() {
    app.startQuickTest();
}

function startPracticeTest() {
    app.startPracticeTest();
}

function startSubjectTest(subject) {
    app.startSubjectTest(subject);
}

function nextQuestion() {
    app.nextQuestion();
}

function reviewWrongAnswers() {
    app.reviewWrongAnswers();
}

function newStart() {
    app.newStart();
}
