// ==================== CONFIGURATION & CONSTANTS ====================
const APP_CONFIG = {
    appName: "آزمون‌ساز حرفه‌ای AMIN QM",
    version: "3.6.5",
    storageKey: "professional_quiz_maker_amin_qm",
    defaultTimeLimit: 60, // minutes
    defaultPassingScore: 70,
    autoSaveInterval: 5000, // ms
    theme: "light"
};

// ==================== STATE MANAGEMENT ====================
let appState = {
    currentStep: 1,
    quizData: null,
    userAnswers: {},
    markedQuestions: new Set(),
    settings: {
        timeLimit: 60,
        questionOrder: "sequential",
        showExplanation: "after_quiz",
        passingScore: 70,
        allowMark: true,
        autoSave: true,
        showTimer: true,
        fullScreen: false
    },
    timer: {
        totalSeconds: 0,
        remainingSeconds: 0,
        interval: null,
        isRunning: false
    },
    quizResults: null
};

// ==================== DOM ELEMENTS ====================
const elements = {
    // Step sections
    stepSections: document.querySelectorAll('.step-section'),
    steps: document.querySelectorAll('.step'),
    
    // Step 1: JSON Input
    jsonInput: document.getElementById('jsonInput'),
    quizTitle: document.getElementById('quiz-title'),
    charCount: document.getElementById('charCount'),
    btnSample: document.getElementById('btnSample'),
    btnClear: document.getElementById('btnClear'),
    btnValidate: document.getElementById('btnValidate'),
    btnLoadQuiz: document.getElementById('btnLoadQuiz'),
    questionCount: document.getElementById('questionCount'),
    formatJson: document.getElementById('formatJson'),
    copyPrompt: document.getElementById('copyPrompt'),
    importFile: document.getElementById('importFile'),
    saveDraft: document.getElementById('saveDraft'),
    loadDraft: document.getElementById('loadDraft'),
    
    // Step 2: Settings
    timeLimit: document.getElementById('timeLimit'),
    timeValue: document.getElementById('timeValue'),
    questionOrder: document.getElementById('questionOrder'),
    showExplanation: document.getElementById('showExplanation'),
    passingScore: document.getElementById('passingScore'),
    scoreValue: document.getElementById('scoreValue'),
    allowMark: document.getElementById('allowMark'),
    autoSave: document.getElementById('autoSave'),
    showTimer: document.getElementById('showTimer'),
    fullScreen: document.getElementById('fullScreen'),
    btnBackStep1: document.getElementById('btnBackStep1'),
    btnStartQuiz: document.getElementById('btnStartQuiz'),
    
    // Step 3: Quiz
    currentQuizTitle: document.getElementById('currentQuizTitle'),
    timerDisplay: document.getElementById('timerDisplay'),
    timerText: document.getElementById('timerText'),
    timerBar: document.getElementById('timerBar'),
    currentQuestionNum: document.getElementById('currentQuestionNum'),
    totalQuestionsNum: document.getElementById('totalQuestionsNum'),
    answeredCount: document.getElementById('answeredCount'),
    markedCount: document.getElementById('markedCount'),
    quizProgress: document.getElementById('quizProgress'),
    progressPercent: document.getElementById('progressPercent'),
    questionsContainer: document.getElementById('questionsContainer'),
    markedQuestions: document.getElementById('markedQuestions'),
    questionList: document.getElementById('questionList'),
    btnFullscreen: document.getElementById('btnFullscreen'),
    btnReview: document.getElementById('btnReview'),
    btnPrevQuestion: document.getElementById('btnPrevQuestion'),
    btnNextQuestion: document.getElementById('btnNextQuestion'),
    btnMarkQuestion: document.getElementById('btnMarkQuestion'),
    btnClearAnswer: document.getElementById('btnClearAnswer'),
    btnSubmitQuiz: document.getElementById('btnSubmitQuiz'),
    
    // Step 4: Results
    resultQuizTitle: document.getElementById('resultQuizTitle'),
    scoreCircle: document.getElementById('scoreCircle'),
    scorePercentage: document.getElementById('scorePercentage'),
    correctAnswers: document.getElementById('correctAnswers'),
    incorrectAnswers: document.getElementById('incorrectAnswers'),
    unansweredCount: document.getElementById('unansweredCount'),
    timeSpent: document.getElementById('timeSpent'),
    resultStatus: document.getElementById('resultStatus'),
    performanceChart: document.getElementById('performanceChart'),
    distributionChart: document.getElementById('distributionChart'),
    questionsReview: document.getElementById('questionsReview'),
    btnNewQuiz: document.getElementById('btnNewQuiz'),
    btnPrintResults: document.getElementById('btnPrintResults'),
    btnQuickPDF: document.getElementById('btnQuickPDF'),
    btnShareResults: document.getElementById('btnShareResults'),
    
    // New elements for enhanced features
    filterOptions: document.querySelectorAll('.filter-option'),
    btnSelectForPDF: document.getElementById('btnSelectForPDF'),
    pdfSelectionPanel: document.getElementById('pdfSelectionPanel'),
    btnSelectAllPDF: document.getElementById('btnSelectAllPDF'),
    btnDeselectAllPDF: document.getElementById('btnDeselectAllPDF'),
    btnSelectCorrectPDF: document.getElementById('btnSelectCorrectPDF'),
    btnSelectIncorrectPDF: document.getElementById('btnSelectIncorrectPDF'),
    selectedCount: document.getElementById('selectedCount'),
    pdfSelectionList: document.getElementById('pdfSelectionList'),
    btnGeneratePDF: document.getElementById('btnGeneratePDF'),
    btnCancelPDF: document.getElementById('btnCancelPDF'),
    
    // Other
    themeToggle: document.getElementById('themeToggle'),
    helpBtn: document.getElementById('helpBtn'),
    promptModal: document.getElementById('promptModal'),
    copyPromptBtn: document.getElementById('copyPromptBtn'),
    closeModal: document.querySelectorAll('.modal-close, #closeModal'),
    showPromptGuide: document.getElementById('showPromptGuide'),
    promptText: document.getElementById('promptText'),
    currentYear: document.getElementById('currentYear')
};

// ==================== INITIALIZATION ====================
function init() {
    console.log(`${APP_CONFIG.appName} v${APP_CONFIG.version} initialized`);
    
    // Set current year
    if (elements.currentYear) {
        elements.currentYear.textContent = new Date().getFullYear();
    }
    
    // Load saved state
    loadState();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize sample quiz
    initSampleQuiz();
    
    // Initialize charts
    initCharts();
    
    // Apply saved theme
    applyTheme();
    
    // Update character count
    updateCharCount();
    
    console.log("Application initialized successfully");
}

// ==================== EVENT LISTENERS ====================
function initEventListeners() {
    // Step navigation
    elements.steps.forEach(step => {
        step.addEventListener('click', () => {
            const stepNum = parseInt(step.dataset.step);
            if (stepNum < appState.currentStep) {
                goToStep(stepNum);
            }
        });
    });
    
    // Step 1: JSON Input
    elements.jsonInput.addEventListener('input', updateCharCount);
    elements.btnSample.addEventListener('click', loadSampleQuiz);
    elements.btnClear.addEventListener('click', clearJsonInput);
    elements.btnValidate.addEventListener('click', validateJson);
    elements.btnLoadQuiz.addEventListener('click', loadQuizFromJson);
    elements.formatJson.addEventListener('click', formatJson);
    elements.copyPrompt.addEventListener('click', showPromptModal);
    elements.importFile.addEventListener('click', importFromFile);
    elements.saveDraft.addEventListener('click', saveDraft);
    elements.loadDraft.addEventListener('click', loadDraft);
    
    // Step 2: Settings
    elements.timeLimit.addEventListener('input', updateTimeValue);
    elements.passingScore.addEventListener('input', updateScoreValue);
    elements.btnBackStep1.addEventListener('click', () => goToStep(1));
    elements.btnStartQuiz.addEventListener('click', startQuiz);
    
    // Step 3: Quiz
    elements.btnPrevQuestion.addEventListener('click', showPreviousQuestion);
    elements.btnNextQuestion.addEventListener('click', showNextQuestion);
    elements.btnMarkQuestion.addEventListener('click', toggleMarkQuestion);
    elements.btnClearAnswer.addEventListener('click', clearCurrentAnswer);
    elements.btnSubmitQuiz.addEventListener('click', submitQuiz);
    elements.btnFullscreen.addEventListener('click', toggleFullscreen);
    elements.btnReview.addEventListener('click', toggleReviewMode);
    
    // Step 4: Results
    elements.btnNewQuiz.addEventListener('click', startNewQuiz);
    elements.btnPrintResults.addEventListener('click', printResults);
    elements.btnQuickPDF.addEventListener('click', generateQuickPDF);
    elements.btnShareResults.addEventListener('click', shareResults);
    
    // New filter checkboxes
    elements.filterOptions.forEach(option => {
        option.addEventListener('change', handleFilterChange);
    });
    
    // PDF selection functionality
    if (elements.btnSelectForPDF) {
        elements.btnSelectForPDF.addEventListener('click', showPDFSelectionPanel);
    }
    if (elements.btnSelectAllPDF) {
        elements.btnSelectAllPDF.addEventListener('click', selectAllForPDF);
    }
    if (elements.btnDeselectAllPDF) {
        elements.btnDeselectAllPDF.addEventListener('click', deselectAllForPDF);
    }
    if (elements.btnSelectCorrectPDF) {
        elements.btnSelectCorrectPDF.addEventListener('click', selectCorrectForPDF);
    }
    if (elements.btnSelectIncorrectPDF) {
        elements.btnSelectIncorrectPDF.addEventListener('click', selectIncorrectForPDF);
    }
    if (elements.btnGeneratePDF) {
        elements.btnGeneratePDF.addEventListener('click', generatePDF);
    }
    if (elements.btnCancelPDF) {
        elements.btnCancelPDF.addEventListener('click', hidePDFSelectionPanel);
    }
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Help and prompts
    elements.helpBtn.addEventListener('click', showHelp);
    elements.showPromptGuide.addEventListener('click', showPromptModal);
    elements.copyPromptBtn.addEventListener('click', copyPromptToClipboard);
    elements.closeModal.forEach(btn => {
        btn.addEventListener('click', hidePromptModal);
    });
    
    // Auto-save on unload
    window.addEventListener('beforeunload', () => {
        if (appState.settings.autoSave) {
            saveState();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// ==================== STEP MANAGEMENT ====================
function goToStep(stepNumber) {
    // Validate step transition
    if (stepNumber < 1 || stepNumber > 4) return;
    
    // Special validation for step 2
    if (stepNumber === 2 && !appState.quizData) {
        showToast('لطفاً ابتدا یک آزمون بارگذاری کنید', 'error');
        return;
    }
    
    // Special validation for step 3
    if (stepNumber === 3 && !appState.quizData) {
        showToast('لطفاً ابتدا یک آزمون بارگذاری کنید', 'error');
        return;
    }
    
    // Special validation for step 4
    if (stepNumber === 4 && !appState.quizResults) {
        showToast('هنوز آزمونی انجام نشده است', 'error');
        return;
    }
    
    // Update current step
    appState.currentStep = stepNumber;
    
    // Update step indicators
    elements.steps.forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        if (stepNum === stepNumber) {
            step.classList.add('active');
        } else if (stepNum < stepNumber) {
            step.classList.remove('active');
            step.classList.add('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Show/hide sections
    elements.stepSections.forEach(section => {
        if (section.id === `step${stepNumber}`) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
    
    // Step-specific initialization
    switch (stepNumber) {
        case 1:
            initStep1();
            break;
        case 2:
            initStep2();
            break;
        case 3:
            initStep3();
            break;
        case 4:
            initStep4();
            break;
    }
    
    // Save state
    saveState();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initStep1() {
    console.log("Initializing Step 1: JSON Input");
    updateCharCount();
}

function initStep2() {
    console.log("Initializing Step 2: Settings");
    // Update settings UI with current values
    updateSettingsUI();
}

function initStep3() {
    console.log("Initializing Step 3: Quiz");
    // Reset quiz state
    resetQuizState();
    
    // Render first question
    renderQuestion(0);
    
    // Update UI
    updateQuizUI();
    
    // Start timer if enabled
    if (appState.settings.showTimer && appState.settings.timeLimit > 0) {
        startTimer();
    }
    
    // Initialize question list
    initQuestionList();
}

function initStep4() {
    console.log("Initializing Step 4: Results");
    // Calculate and display results
    displayResults();
    
    // Update charts
    updateCharts();
}

// ==================== STEP 1: JSON INPUT ====================
function updateCharCount() {
    if (elements.jsonInput && elements.charCount) {
        const count = elements.jsonInput.value.length;
        elements.charCount.textContent = `${count.toLocaleString()} کاراکتر`;
        
        // Auto-detect quiz title from JSON
        try {
            const json = JSON.parse(elements.jsonInput.value);
            if (json.quiz_title && elements.quizTitle) {
                elements.quizTitle.value = json.quiz_title;
            }
        } catch (e) {
            // Ignore JSON parsing errors
        }
    }
}

function loadSampleQuiz() {
    const sampleQuiz = {
        "quiz_title": "آزمون نمونه - زیست‌شناسی پیشرفته",
        "questions": [
            {
                "id": 1,
                "question": "کدام آنزیم در مرحله محدودکننده سرعت سنتز هورمون‌های استروئیدی نقش دارد؟",
                "options": [
                    "آروماتاز",
                    "۵-آلفا ردوکتاز",
                    "Desmolase (P450scc)",
                    "هیدروکسیلاز"
                ],
                "correct_answer": 2,
                "explanation": "آنزیم Desmolase (P450scc) مسئول تبدیل کلسترول به پرگننولون است که مرحله محدودکننده سرعت در سنتز تمام هورمون‌های استروئیدی می‌باشد."
            },
            {
                "id": 2,
                "question": "تفاوت اصلی گیرنده‌های هورمون‌های پپتیدی و استروئیدی چیست؟",
                "options": [
                    "گیرنده‌های پپتیدی در سیتوزول و گیرنده‌های استروئیدی در غشای سلول قرار دارند",
                    "گیرنده‌های پپتیدی در غشای سلول و گیرنده‌های استروئیدی در داخل سلول قرار دارند",
                    "هر دو نوع گیرنده در غشای سلول قرار دارند",
                    "هر دو نوع گیرنده در داخل سلول قرار دارند"
                ],
                "correct_answer": 1,
                "explanation": "هورمون‌های پپتیدی به دلیل ماهیت هیدروفیلیک نمی‌توانند از غشای سلولی عبور کنند، بنابراین گیرنده‌های آنها روی سطح سلول قرار دارد. در حالی که هورمون‌های استروئیدی لیپوفیلیک بوده و به گیرنده‌های داخل سلولی متصل می‌شوند."
            },
            {
                "id": 3,
                "question": "کدام گزینه در مورد ذخیره هورمون‌های استروئیدی صحیح است؟",
                "options": [
                    "در وزیکول‌های ترشحی ذخیره می‌شوند",
                    "در شبکه آندوپلاسمی ذخیره می‌شوند",
                    "ذخیره نمی‌شوند و سنتز و ترشح همگام است",
                    "در دستگاه گلژی ذخیره می‌شوند"
                ],
                "correct_answer": 2,
                "explanation": "هورمون‌های استروئیدی برخلاف هورمون‌های پپتیدی ذخیره نمی‌شوند. سنتز و ترشح آنها همگام است که نکته‌ای کلیدی در تست‌های پزشکی می‌باشد."
            }
        ]
    };
    
    elements.jsonInput.value = JSON.stringify(sampleQuiz, null, 2);
    elements.quizTitle.value = sampleQuiz.quiz_title;
    updateCharCount();
    showToast('آزمون نمونه بارگذاری شد', 'success');
}

function clearJsonInput() {
    if (confirm('آیا مطمئن هستید که می‌خواهید همه متن را پاک کنید؟')) {
        elements.jsonInput.value = '';
        elements.quizTitle.value = '';
        updateCharCount();
        showToast('متن پاک شد', 'info');
    }
}

function validateJson() {
    try {
        const json = JSON.parse(elements.jsonInput.value);
        
        // Validate structure
        if (!json.quiz_title) {
            throw new Error('فیلد quiz_title یافت نشد');
        }
        
        if (!Array.isArray(json.questions)) {
            throw new Error('فیلد questions باید یک آرایه باشد');
        }
        
        if (json.questions.length === 0) {
            throw new Error('آرایه questions خالی است');
        }
        
        // Validate each question
        json.questions.forEach((q, index) => {
            if (!q.id) throw new Error(`سوال ${index + 1}: فیلد id یافت نشد`);
            if (!q.question) throw new Error(`سوال ${index + 1}: فیلد question یافت نشد`);
            if (!Array.isArray(q.options)) throw new Error(`سوال ${index + 1}: options باید آرایه باشد`);
            if (q.options.length !== 4) throw new Error(`سوال ${index + 1}: باید دقیقاً ۴ گزینه داشته باشد`);
            if (q.correct_answer === undefined) throw new Error(`سوال ${index + 1}: فیلد correct_answer یافت نشد`);
            if (q.correct_answer < 0 || q.correct_answer > 3) throw new Error(`سوال ${index + 1}: correct_answer باید بین ۰ تا ۳ باشد`);
        });
        
        showToast(`✅ JSON معتبر است - ${json.questions.length} سوال شناسایی شد`, 'success');
        return true;
        
    } catch (error) {
        showToast(`❌ خطا در JSON: ${error.message}`, 'error');
        return false;
    }
}

function formatJson() {
    try {
        const json = JSON.parse(elements.jsonInput.value);
        elements.jsonInput.value = JSON.stringify(json, null, 2);
        showToast('JSON فرمت‌بندی شد', 'success');
    } catch (error) {
        showToast('خطا در فرمت‌بندی JSON', 'error');
    }
}

function loadQuizFromJson() {
    if (!validateJson()) return;
    
    try {
        const json = JSON.parse(elements.jsonInput.value);
        
        // Store quiz data
        appState.quizData = {
            ...json,
            // Add metadata
            loadedAt: new Date().toISOString(),
            totalQuestions: json.questions.length
        };
        
        // Update question count badge
        if (elements.questionCount) {
            elements.questionCount.textContent = json.questions.length;
        }
        
        // Update quiz title if empty
        if (elements.quizTitle && !elements.quizTitle.value) {
            elements.quizTitle.value = json.quiz_title;
        }
        
        // Auto-save
        saveState();
        
        // Go to step 2
        goToStep(2);
        
        showToast(`آزمون "${json.quiz_title}" با موفقیت بارگذاری شد`, 'success');
        
    } catch (error) {
        showToast(`خطا در بارگذاری آزمون: ${error.message}`, 'error');
    }
}

function importFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            elements.jsonInput.value = e.target.result;
            updateCharCount();
            showToast('فایل با موفقیت بارگذاری شد', 'success');
        };
        
        reader.onerror = function() {
            showToast('خطا در خواندن فایل', 'error');
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

function saveDraft() {
    if (!elements.jsonInput.value.trim()) {
        showToast('هیچ متنی برای ذخیره وجود ندارد', 'warning');
        return;
    }
    
    try {
        const draft = {
            json: elements.jsonInput.value,
            title: elements.quizTitle.value,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(`${APP_CONFIG.storageKey}_draft`, JSON.stringify(draft));
        showToast('پیش‌نویس ذخیره شد', 'success');
    } catch (error) {
        showToast('خطا در ذخیره پیش‌نویس', 'error');
    }
}

function loadDraft() {
    try {
        const draft = JSON.parse(localStorage.getItem(`${APP_CONFIG.storageKey}_draft`));
        if (!draft) {
            showToast('هیچ پیش‌نویس ذخیره‌شده‌ای یافت نشد', 'warning');
            return;
        }
        
        if (confirm(`پیش‌نویس ذخیره‌شده در تاریخ ${new Date(draft.timestamp).toLocaleString('fa-IR')} بارگذاری شود؟`)) {
            elements.jsonInput.value = draft.json;
            elements.quizTitle.value = draft.title || '';
            updateCharCount();
            showToast('پیش‌نویس بارگذاری شد', 'success');
        }
    } catch (error) {
        showToast('خطا در بارگذاری پیش‌نویس', 'error');
    }
}

// ==================== STEP 2: SETTINGS ====================
function updateSettingsUI() {
    // Update sliders
    if (elements.timeLimit && elements.timeValue) {
        elements.timeLimit.value = appState.settings.timeLimit;
        elements.timeValue.textContent = `${appState.settings.timeLimit} دقیقه`;
    }
    
    if (elements.passingScore && elements.scoreValue) {
        elements.passingScore.value = appState.settings.passingScore;
        elements.scoreValue.textContent = `${appState.settings.passingScore}%`;
    }
    
    // Update selects
    if (elements.questionOrder) {
        elements.questionOrder.value = appState.settings.questionOrder;
    }
    
    if (elements.showExplanation) {
        elements.showExplanation.value = appState.settings.showExplanation;
    }
    
    // Update checkboxes
    if (elements.allowMark) {
        elements.allowMark.checked = appState.settings.allowMark;
    }
    
    if (elements.autoSave) {
        elements.autoSave.checked = appState.settings.autoSave;
    }
    
    if (elements.showTimer) {
        elements.showTimer.checked = appState.settings.showTimer;
    }
    
    if (elements.fullScreen) {
        elements.fullScreen.checked = appState.settings.fullScreen;
    }
}

function updateTimeValue() {
    const value = parseInt(elements.timeLimit.value);
    appState.settings.timeLimit = value;
    elements.timeValue.textContent = `${value} دقیقه`;
    saveState();
}

function updateScoreValue() {
    const value = parseInt(elements.passingScore.value);
    appState.settings.passingScore = value;
    elements.scoreValue.textContent = `${value}%`;
    saveState();
}

function startQuiz() {
    if (!appState.quizData) {
        showToast('لطفاً ابتدا یک آزمون بارگذاری کنید', 'error');
        return;
    }
    
    // Update settings from UI
    appState.settings = {
        timeLimit: parseInt(elements.timeLimit.value),
        questionOrder: elements.questionOrder.value,
        showExplanation: elements.showExplanation.value,
        passingScore: parseInt(elements.passingScore.value),
        allowMark: elements.allowMark.checked,
        autoSave: elements.autoSave.checked,
        showTimer: elements.showTimer.checked,
        fullScreen: elements.fullScreen.checked
    };
    
    // Set quiz title
    if (elements.quizTitle.value) {
        appState.quizData.quiz_title = elements.quizTitle.value;
    }
    
    // Save state
    saveState();
    
    // Go to quiz step
    goToStep(3);
}

// ==================== STEP 3: QUIZ ====================
let currentQuestionIndex = 0;
let isReviewMode = false;

function resetQuizState() {
    currentQuestionIndex = 0;
    isReviewMode = false;
    appState.userAnswers = {};
    appState.markedQuestions.clear();
    appState.timer = {
        totalSeconds: appState.settings.timeLimit * 60,
        remainingSeconds: appState.settings.timeLimit * 60,
        interval: null,
        isRunning: false
    };
    appState.quizResults = null;
}

function renderQuestion(index) {
    if (!appState.quizData || !appState.quizData.questions[index]) {
        console.error('Question not found at index', index);
        return;
    }
    
    const question = appState.quizData.questions[index];
    const isMarked = appState.markedQuestions.has(index);
    const userAnswer = appState.userAnswers[index];
    
    // Clear container
    elements.questionsContainer.innerHTML = '';
    
    // Create question card
    const questionCard = document.createElement('div');
    questionCard.className = `question-item ${isMarked ? 'marked' : ''}`;
    questionCard.dataset.index = index;
    
    // Question number
    const questionNumber = document.createElement('div');
    questionNumber.className = 'question-number';
    questionNumber.textContent = index + 1;
    questionCard.appendChild(questionNumber);
    
    // Question text
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.innerHTML = question.question;
    questionCard.appendChild(questionText);
    
    // Options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    // Create options
    question.options.forEach((option, optionIndex) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (userAnswer === optionIndex) {
            optionDiv.classList.add('selected');
        }
        
        const optionLetter = document.createElement('div');
        optionLetter.className = 'option-letter';
        optionLetter.textContent = String.fromCharCode(1575 + optionIndex); // الف, ب, ج, د
        
        const optionLabel = document.createElement('div');
        optionLabel.className = 'option-label';
        optionLabel.innerHTML = option;
        
        optionDiv.appendChild(optionLetter);
        optionDiv.appendChild(optionLabel);
        
        // Add click event
        optionDiv.addEventListener('click', () => selectAnswer(index, optionIndex));
        
        optionsContainer.appendChild(optionDiv);
    });
    
    questionCard.appendChild(optionsContainer);
    
    // Add explanation if in review mode and explanation exists
    if (isReviewMode && question.explanation) {
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'review-explanation';
        
        const explanationTitle = document.createElement('h5');
        explanationTitle.innerHTML = '<i class="fas fa-info-circle"></i> توضیح پاسخ';
        
        const explanationText = document.createElement('p');
        explanationText.textContent = question.explanation;
        
        explanationDiv.appendChild(explanationTitle);
        explanationDiv.appendChild(explanationText);
        questionCard.appendChild(explanationDiv);
    }
    
    elements.questionsContainer.appendChild(questionCard);
    
    // Update current question display
    if (elements.currentQuestionNum) {
        elements.currentQuestionNum.textContent = index + 1;
    }
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update question list highlight
    updateQuestionListHighlight();
}

function selectAnswer(questionIndex, answerIndex) {
    appState.userAnswers[questionIndex] = answerIndex;
    
    // Update UI
    const questionCard = document.querySelector(`.question-item[data-index="${questionIndex}"]`);
    if (questionCard) {
        // Remove selected class from all options
        questionCard.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selected class to chosen option
        const selectedOption = questionCard.querySelectorAll('.option')[answerIndex];
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
    
    // Update answered count
    updateAnsweredCount();
    
    // Auto-save
    if (appState.settings.autoSave) {
        saveState();
    }
}

function updateAnsweredCount() {
    if (elements.answeredCount) {
        const answered = Object.keys(appState.userAnswers).length;
        elements.answeredCount.textContent = answered;
    }
}

function updateMarkedCount() {
    if (elements.markedCount) {
        elements.markedCount.textContent = appState.markedQuestions.size;
    }
}

function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion(currentQuestionIndex);
        updateQuizUI();
    }
}

function showNextQuestion() {
    if (currentQuestionIndex < appState.quizData.questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion(currentQuestionIndex);
        updateQuizUI();
    }
}

function toggleMarkQuestion() {
    if (!appState.settings.allowMark) {
        showToast('علامت‌گذاری سوالات غیرفعال است', 'warning');
        return;
    }
    
    if (appState.markedQuestions.has(currentQuestionIndex)) {
        appState.markedQuestions.delete(currentQuestionIndex);
        showToast('علامت از سوال برداشته شد', 'info');
    } else {
        appState.markedQuestions.add(currentQuestionIndex);
        showToast('سوال علامت‌دار شد', 'info');
    }
    
    // Update UI
    const questionCard = document.querySelector(`.question-item[data-index="${currentQuestionIndex}"]`);
    if (questionCard) {
        questionCard.classList.toggle('marked');
    }
    
    updateMarkedCount();
    updateQuestionList();
    saveState();
}

function clearCurrentAnswer() {
    if (confirm('آیا مطمئن هستید که می‌خواهید پاسخ این سوال را پاک کنید؟')) {
        delete appState.userAnswers[currentQuestionIndex];
        renderQuestion(currentQuestionIndex);
        updateAnsweredCount();
        saveState();
        showToast('پاسخ پاک شد', 'info');
    }
}

function updateNavigationButtons() {
    if (elements.btnPrevQuestion) {
        elements.btnPrevQuestion.disabled = currentQuestionIndex === 0;
    }
    
    if (elements.btnNextQuestion) {
        const isLastQuestion = currentQuestionIndex === appState.quizData.questions.length - 1;
        elements.btnNextQuestion.disabled = isLastQuestion;
        elements.btnNextQuestion.innerHTML = isLastQuestion ? 
            'پایان آزمون <i class="fas fa-flag-checkered"></i>' : 
            'سوال بعدی <i class="fas fa-arrow-left"></i>';
    }
    
    if (elements.btnMarkQuestion) {
        const isMarked = appState.markedQuestions.has(currentQuestionIndex);
        elements.btnMarkQuestion.innerHTML = isMarked ? 
            '<i class="fas fa-flag"></i> حذف علامت' : 
            '<i class="far fa-flag"></i> علامت‌گذاری';
    }
}

function initQuestionList() {
    if (!elements.questionList) return;
    
    elements.questionList.innerHTML = '';
    
    appState.quizData.questions.forEach((_, index) => {
        const qNumber = document.createElement('div');
        qNumber.className = 'q-number';
        qNumber.textContent = index + 1;
        qNumber.dataset.index = index;
        
        // Set initial classes
        if (index === currentQuestionIndex) {
            qNumber.classList.add('active');
        }
        
        if (appState.markedQuestions.has(index)) {
            qNumber.classList.add('marked');
        }
        
        if (appState.userAnswers[index] !== undefined) {
            qNumber.classList.add('answered');
        }
        
        // Add click event
        qNumber.addEventListener('click', () => {
            currentQuestionIndex = index;
            renderQuestion(index);
            updateQuizUI();
        });
        
        elements.questionList.appendChild(qNumber);
    });
}

function updateQuestionList() {
    if (!elements.questionList) return;
    
    document.querySelectorAll('.q-number').forEach((qNum, index) => {
        // Update classes
        qNum.classList.toggle('active', index === currentQuestionIndex);
        qNum.classList.toggle('marked', appState.markedQuestions.has(index));
        qNum.classList.toggle('answered', appState.userAnswers[index] !== undefined);
    });
}

function updateQuestionListHighlight() {
    if (!elements.questionList) return;
    
    document.querySelectorAll('.q-number').forEach((qNum, index) => {
        qNum.classList.toggle('active', index === currentQuestionIndex);
    });
}

function updateQuizUI() {
    if (!appState.quizData) return;
    
    const totalQuestions = appState.quizData.questions.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    
    // Update progress bar
    if (elements.quizProgress) {
        elements.quizProgress.style.width = `${progress}%`;
    }
    
    if (elements.progressPercent) {
        elements.quizProgress.style.width = `${progress}%`;
        elements.progressPercent.textContent = `${Math.round(progress)}%`;
    }
    
    // Update counts
    if (elements.totalQuestionsNum) {
        elements.totalQuestionsNum.textContent = totalQuestions;
    }
    
    updateAnsweredCount();
    updateMarkedCount();
    
    // Update marked questions sidebar
    updateMarkedQuestionsSidebar();
}

function updateMarkedQuestionsSidebar() {
    if (!elements.markedQuestions) return;
    
    elements.markedQuestions.innerHTML = '';
    
    if (appState.markedQuestions.size === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'هنوز سوالی علامت‌دار نشده';
        elements.markedQuestions.appendChild(emptyState);
        return;
    }
    
    Array.from(appState.markedQuestions).sort((a, b) => a - b).forEach(index => {
        const markedItem = document.createElement('div');
        markedItem.className = 'marked-item';
        markedItem.innerHTML = `
            <span>سوال ${index + 1}</span>
            <button class="btn-small goto-marked" data-index="${index}">
                <i class="fas fa-external-link-alt"></i>
            </button>
        `;
        
        markedItem.querySelector('.goto-marked').addEventListener('click', (e) => {
            e.stopPropagation();
            currentQuestionIndex = index;
            renderQuestion(index);
            updateQuizUI();
        });
        
        elements.markedQuestions.appendChild(markedItem);
    });
}

// ==================== TIMER FUNCTIONS ====================
function startTimer() {
    if (appState.timer.isRunning) return;
    
    appState.timer.isRunning = true;
    appState.timer.remainingSeconds = appState.timer.totalSeconds;
    
    updateTimerDisplay();
    
    appState.timer.interval = setInterval(() => {
        appState.timer.remainingSeconds--;
        updateTimerDisplay();
        
        if (appState.timer.remainingSeconds <= 0) {
            clearInterval(appState.timer.interval);
            appState.timer.isRunning = false;
            showToast('زمان آزمون به پایان رسید', 'warning');
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    if (!elements.timerText || !elements.timerBar) return;
    
    const minutes = Math.floor(appState.timer.remainingSeconds / 60);
    const seconds = appState.timer.remainingSeconds % 60;
    
    elements.timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress bar
    const progress = (appState.timer.remainingSeconds / appState.timer.totalSeconds) * 100;
    elements.timerBar.style.width = `${progress}%`;
    
    // Change color based on remaining time
    if (progress < 20) {
        elements.timerDisplay.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
    } else if (progress < 50) {
        elements.timerDisplay.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
    }
}

function pauseTimer() {
    if (appState.timer.interval) {
        clearInterval(appState.timer.interval);
        appState.timer.isRunning = false;
    }
}

function resumeTimer() {
    if (!appState.timer.isRunning && appState.timer.remainingSeconds > 0) {
        startTimer();
    }
}

// ==================== QUIZ SUBMISSION ====================
function submitQuiz() {
    if (!confirm('آیا مطمئن هستید که می‌خواهید آزمون را ارسال کنید؟ پس از ارسال امکان تغییر پاسخ وجود ندارد.')) {
        return;
    }
    
    // Stop timer
    if (appState.timer.interval) {
        clearInterval(appState.timer.interval);
        appState.timer.isRunning = false;
    }
    
    // Calculate results
    calculateResults();
    
    // Go to results step
    goToStep(4);
}

function calculateResults() {
    if (!appState.quizData) return;
    
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    const total = appState.quizData.questions.length;
    
    // Calculate scores
    appState.quizData.questions.forEach((question, index) => {
        const userAnswer = appState.userAnswers[index];
        
        if (userAnswer === undefined) {
            unanswered++;
        } else if (userAnswer === question.correct_answer) {
            correct++;
        } else {
            incorrect++;
        }
    });
    
    // Calculate percentage
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeSpent = appState.settings.timeLimit * 60 - appState.timer.remainingSeconds;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    
    // Store results
    appState.quizResults = {
        correct,
        incorrect,
        unanswered,
        total,
        percentage,
        timeSpent: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        passed: percentage >= appState.settings.passingScore,
        details: appState.quizData.questions.map((q, index) => ({
            question: q.question,
            userAnswer: appState.userAnswers[index],
            correctAnswer: q.correct_answer,
            isCorrect: appState.userAnswers[index] === q.correct_answer,
            explanation: q.explanation,
            isMarked: appState.markedQuestions.has(index)
        }))
    };
    
    // Save state
    saveState();
}

// ==================== STEP 4: RESULTS ====================
let selectedQuestionsForPDF = new Set();

function displayResults() {
    if (!appState.quizResults) return;
    
    const results = appState.quizResults;
    
    // Update result elements
    if (elements.resultQuizTitle) {
        elements.resultQuizTitle.textContent = appState.quizData.quiz_title;
    }
    
    if (elements.scorePercentage) {
        elements.scorePercentage.textContent = `${results.percentage}%`;
    }
    
    if (elements.correctAnswers) {
        elements.correctAnswers.textContent = results.correct;
    }
    
    if (elements.incorrectAnswers) {
        elements.incorrectAnswers.textContent = results.incorrect;
    }
    
    if (elements.unansweredCount) {
        elements.unansweredCount.textContent = results.unanswered;
    }
    
    if (elements.timeSpent) {
        elements.timeSpent.textContent = results.timeSpent;
    }
    
    // Update progress circle
    if (elements.scoreCircle) {
        const circumference = 565;
        const offset = circumference - (results.percentage / 100) * circumference;
        elements.scoreCircle.style.strokeDashoffset = offset;
        
        // Change color based on score
        if (results.percentage >= 80) {
            elements.scoreCircle.style.stroke = '#4caf50';
        } else if (results.percentage >= 60) {
            elements.scoreCircle.style.stroke = '#ff9800';
        } else {
            elements.scoreCircle.style.stroke = '#f44336';
        }
    }
    
    // Update status
    if (elements.resultStatus) {
        elements.resultStatus.innerHTML = '';
        
        const statusDiv = document.createElement('div');
        statusDiv.className = `result-status ${results.passed ? 'pass' : 'fail'}`;
        statusDiv.innerHTML = `
            <i class="fas ${results.passed ? 'fa-trophy' : 'fa-exclamation-triangle'}"></i>
            ${results.passed ? 'تبریک! شما با موفقیت قبول شدید.' : 'متأسفانه شما مردود شدید.'}
            <br>
            <small>نمره قبولی: ${appState.settings.passingScore}% - نمره شما: ${results.percentage}%</small>
        `;
        
        elements.resultStatus.appendChild(statusDiv);
    }
    
    // Render review questions
    renderReviewQuestions();
    
    // Update PDF selection list
    updatePDFSelectionList();
}

function renderReviewQuestions() {
    if (!appState.quizResults || !elements.questionsReview) return;
    
    elements.questionsReview.innerHTML = '';
    
    appState.quizResults.details.forEach((detail, index) => {
        const question = appState.quizData.questions[index];
        const statusClass = detail.isCorrect ? 'correct' : 
                          detail.userAnswer === undefined ? 'unanswered' : 'incorrect';
        const statusText = detail.isCorrect ? 'صحیح' : 
                          detail.userAnswer === undefined ? 'بی‌پاسخ' : 'نادرست';
        
        const reviewCard = document.createElement('div');
        reviewCard.className = `review-question ${statusClass} ${detail.isMarked ? 'marked' : ''}`;
        reviewCard.style.marginBottom = '25px';
        reviewCard.style.pageBreakInside = 'avoid';
        
        reviewCard.innerHTML = `
            <div class="review-question-header">
                <h4>سوال ${index + 1}</h4>
                <span class="review-status ${statusClass}">${statusText}</span>
            </div>
            <div class="question-text">${question.question}</div>
            <div class="options-container">
                ${question.options.map((option, optIndex) => `
                    <div class="option ${optIndex === detail.userAnswer ? 'user-answer' : ''} 
                                      ${optIndex === question.correct_answer ? 'correct-answer' : ''}">
                        <div class="option-letter">${String.fromCharCode(1575 + optIndex)}</div>
                        <div class="option-label">${option}</div>
                    </div>
                `).join('')}
            </div>
            ${question.explanation ? `
                <div class="review-explanation">
                    <h5><i class="fas fa-info-circle"></i> توضیح پاسخ</h5>
                    <p>${question.explanation}</p>
                </div>
            ` : ''}
        `;
        
        elements.questionsReview.appendChild(reviewCard);
    });
}

function handleFilterChange() {
    const selectedFilters = Array.from(elements.filterOptions)
        .filter(option => option.checked)
        .map(option => option.value);
    
    filterReviewQuestionsMulti(selectedFilters);
}

function filterReviewQuestionsMulti(filters) {
    if (!elements.questionsReview) return;
    
    document.querySelectorAll('.review-question').forEach(card => {
        const isCorrect = card.classList.contains('correct');
        const isIncorrect = card.classList.contains('incorrect');
        const isUnanswered = card.classList.contains('unanswered');
        const isMarked = card.classList.contains('marked');
        
        let shouldShow = false;
        
        if (filters.includes('all')) {
            shouldShow = true;
        } else {
            if (filters.includes('correct') && isCorrect) shouldShow = true;
            if (filters.includes('incorrect') && isIncorrect) shouldShow = true;
            if (filters.includes('unanswered') && isUnanswered) shouldShow = true;
            if (filters.includes('marked') && isMarked) shouldShow = true;
        }
        
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

// ==================== PDF FUNCTIONALITY ====================
function showPDFSelectionPanel() {
    if (elements.pdfSelectionPanel) {
        elements.pdfSelectionPanel.style.display = 'block';
        updatePDFSelectionList();
    }
}

function hidePDFSelectionPanel() {
    if (elements.pdfSelectionPanel) {
        elements.pdfSelectionPanel.style.display = 'none';
    }
}

function updatePDFSelectionList() {
    if (!elements.pdfSelectionList || !appState.quizResults) return;
    
    elements.pdfSelectionList.innerHTML = '';
    selectedQuestionsForPDF.clear();
    
    appState.quizResults.details.forEach((detail, index) => {
        const question = appState.quizData.questions[index];
        const statusClass = detail.isCorrect ? 'correct' : 
                          detail.userAnswer === undefined ? 'unanswered' : 'incorrect';
        const statusText = detail.isCorrect ? 'صحیح' : 
                          detail.userAnswer === undefined ? 'بی‌پاسخ' : 'نادرست';
        
        const selectionItem = document.createElement('div');
        selectionItem.className = 'pdf-selection-item';
        selectionItem.innerHTML = `
            <label class="pdf-selection-label">
                <input type="checkbox" class="pdf-question-checkbox" data-index="${index}" checked>
                <span class="pdf-question-title">
                    سوال ${index + 1} (${statusText})
                </span>
            </label>
        `;
        
        const checkbox = selectionItem.querySelector('.pdf-question-checkbox');
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedQuestionsForPDF.add(index);
            } else {
                selectedQuestionsForPDF.delete(index);
            }
            updateSelectedCount();
        });
        
        selectedQuestionsForPDF.add(index);
        elements.pdfSelectionList.appendChild(selectionItem);
    });
    
    updateSelectedCount();
}

function updateSelectedCount() {
    if (elements.selectedCount) {
        elements.selectedCount.textContent = selectedQuestionsForPDF.size;
    }
}

function selectAllForPDF() {
    if (!appState.quizResults) return;
    
    selectedQuestionsForPDF.clear();
    appState.quizResults.details.forEach((_, index) => {
        selectedQuestionsForPDF.add(index);
    });
    
    document.querySelectorAll('.pdf-question-checkbox').forEach(checkbox => {
        checkbox.checked = true;
    });
    
    updateSelectedCount();
}

function deselectAllForPDF() {
    selectedQuestionsForPDF.clear();
    document.querySelectorAll('.pdf-question-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    updateSelectedCount();
}

function selectCorrectForPDF() {
    if (!appState.quizResults) return;
    
    selectedQuestionsForPDF.clear();
    appState.quizResults.details.forEach((detail, index) => {
        if (detail.isCorrect) {
            selectedQuestionsForPDF.add(index);
        }
    });
    
    document.querySelectorAll('.pdf-question-checkbox').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        checkbox.checked = selectedQuestionsForPDF.has(index);
    });
    
    updateSelectedCount();
}

function selectIncorrectForPDF() {
    if (!appState.quizResults) return;
    
    selectedQuestionsForPDF.clear();
    appState.quizResults.details.forEach((detail, index) => {
        if (!detail.isCorrect && detail.userAnswer !== undefined) {
            selectedQuestionsForPDF.add(index);
        }
    });
    
    document.querySelectorAll('.pdf-question-checkbox').forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        checkbox.checked = selectedQuestionsForPDF.has(index);
    });
    
    updateSelectedCount();
}

function generatePDF() {
    if (selectedQuestionsForPDF.size === 0) {
        showToast('لطفاً حداقل یک سوال را انتخاب کنید', 'warning');
        return;
    }
    
    showToast('در حال تولید PDF... لطفاً صبر کنید', 'info');
    
    // Create a temporary div for rendering selected questions
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '800px';
    tempContainer.style.padding = '20px';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.fontFamily = 'Vazirmatn, sans-serif';
    tempContainer.style.direction = 'rtl';
    tempContainer.style.textAlign = 'right';
    
    // PDF title
    const title = document.createElement('h1');
    title.textContent = appState.quizData.quiz_title + ' - نتایج آزمون';
    title.style.textAlign = 'center';
    title.style.color = '#1a237e';
    title.style.marginBottom = '30px';
    tempContainer.appendChild(title);
    
    // General information
    const summary = document.createElement('div');
    summary.innerHTML = `
        <div style="margin-bottom: 20px; border-bottom: 2px solid #1a237e; padding-bottom: 10px;">
            <p><strong>تاریخ:</strong> ${new Date().toLocaleDateString('fa-IR')}</p>
            <p><strong>نمره:</strong> ${appState.quizResults.percentage}%</p>
            <p><strong>صحیح:</strong> ${appState.quizResults.correct} | <strong>نادرست:</strong> ${appState.quizResults.incorrect} | <strong>بی‌پاسخ:</strong> ${appState.quizResults.unanswered}</p>
            <p><strong>زمان صرف شده:</strong> ${appState.quizResults.timeSpent}</p>
        </div>
    `;
    tempContainer.appendChild(summary);
    
    // Selected questions
    Array.from(selectedQuestionsForPDF).sort((a, b) => a - b).forEach(index => {
        const detail = appState.quizResults.details[index];
        const question = appState.quizData.questions[index];
        const statusText = detail.isCorrect ? 'صحیح' : 
                          detail.userAnswer === undefined ? 'بی‌پاسخ' : 'نادرست';
        
        const questionDiv = document.createElement('div');
        questionDiv.style.marginBottom = '30px';
        questionDiv.style.border = '1px solid #ddd';
        questionDiv.style.borderRadius = '8px';
        questionDiv.style.padding = '20px';
        questionDiv.style.backgroundColor = detail.isCorrect ? '#f0fff0' : 
                                          detail.userAnswer === undefined ? '#fff9e6' : '#fff0f0';
        
        questionDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #1a237e;">سوال ${index + 1}</h3>
                <span style="background-color: ${detail.isCorrect ? '#4caf50' : detail.userAnswer === undefined ? '#ff9800' : '#f44336'}; color: white; padding: 5px 15px; border-radius: 15px; font-size: 14px;">
                    ${statusText}
                </span>
            </div>
            <div style="font-size: 18px; margin-bottom: 20px; line-height: 1.6;">
                ${question.question}
            </div>
            <div style="margin-bottom: 20px;">
                ${question.options.map((option, optIndex) => `
                    <div style="padding: 10px 15px; margin-bottom: 8px; border: 2px solid ${optIndex === question.correct_answer ? '#4caf50' : optIndex === detail.userAnswer ? '#f44336' : '#ddd'}; border-radius: 8px; background-color: ${optIndex === question.correct_answer ? '#e8f5e9' : optIndex === detail.userAnswer ? '#ffebee' : 'white'};">
                        ${String.fromCharCode(1575 + optIndex)}. ${option}
                    </div>
                `).join('')}
            </div>
            ${question.explanation ? `
                <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; border-right: 4px solid #2196f3;">
                    <h4 style="margin-top: 0; color: #0d47a1;">توضیح پاسخ:</h4>
                    <p style="margin-bottom: 0; line-height: 1.6;">${question.explanation}</p>
                </div>
            ` : ''}
        `;
        
        tempContainer.appendChild(questionDiv);
    });
    
    document.body.appendChild(tempContainer);
    
    // Use html2canvas to capture the element
    html2canvas(tempContainer).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const imgWidth = 190;
        const pageHeight = 280;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 10;
        
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
        
        // Add more pages if content is longer than one page
        while (heightLeft > 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight - 20;
        }
        
        pdf.save(`${appState.quizData.quiz_title.replace(/[^\w\s]/gi, '')}_نتایج.pdf`);
        
        // Remove temporary element
        document.body.removeChild(tempContainer);
        
        showToast('PDF با موفقیت دانلود شد', 'success');
        hidePDFSelectionPanel();
    }).catch(error => {
        console.error('Error generating PDF:', error);
        showToast('خطا در تولید PDF', 'error');
        document.body.removeChild(tempContainer);
    });
}

function generateQuickPDF() {
    // Select all questions for PDF
    selectedQuestionsForPDF.clear();
    if (appState.quizResults) {
        appState.quizResults.details.forEach((_, index) => {
            selectedQuestionsForPDF.add(index);
        });
    }
    generatePDF();
}

// ==================== CHART FUNCTIONS ====================
let performanceChart = null;
let distributionChart = null;

function initCharts() {
    // Charts will be initialized when results are displayed
}

function updateCharts() {
    if (!appState.quizResults) return;
    
    // Destroy existing charts
    if (performanceChart) {
        performanceChart.destroy();
    }
    
    if (distributionChart) {
        distributionChart.destroy();
    }
    
    // Create performance chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        const labels = ['صحیح', 'نادرست', 'بی‌پاسخ'];
        const data = [
            appState.quizResults.correct,
            appState.quizResults.incorrect,
            appState.quizResults.unanswered
        ];
        const backgroundColors = ['#4caf50', '#f44336', '#ff9800'];
        
        performanceChart = new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'تعداد',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(c => c.replace('0.8', '1')),
                    borderWidth: 1,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Create distribution chart
    const distributionCtx = document.getElementById('distributionChart');
    if (distributionCtx) {
        distributionChart = new Chart(distributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['صحیح', 'نادرست', 'بی‌پاسخ'],
                datasets: [{
                    data: [
                        appState.quizResults.correct,
                        appState.quizResults.incorrect,
                        appState.quizResults.unanswered
                    ],
                    backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        rtl: true,
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                family: 'Vazirmatn'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// ==================== UTILITY FUNCTIONS ====================
function toggleReviewMode() {
    isReviewMode = !isReviewMode;
    
    if (elements.btnReview) {
        elements.btnReview.innerHTML = isReviewMode ? 
            '<i class="fas fa-eye-slash"></i> خروج از مرور' : 
            '<i class="fas fa-eye"></i> مرور پاسخ';
    }
    
    renderQuestion(currentQuestionIndex);
    showToast(isReviewMode ? 'حالت مرور فعال شد' : 'حالت مرور غیرفعال شد', 'info');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
        elements.btnFullscreen.innerHTML = '<i class="fas fa-compress"></i> خروج از تمام صفحه';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            elements.btnFullscreen.innerHTML = '<i class="fas fa-expand"></i> تمام صفحه';
        }
    }
}

function printResults() {
    // Save original styles
    const originalStyles = {
        questionsReview: elements.questionsReview ? elements.questionsReview.style.cssText : '',
        reviewSection: document.querySelector('.review-section') ? document.querySelector('.review-section').style.cssText : ''
    };
    
    // Change styles for better printing
    if (elements.questionsReview) {
        elements.questionsReview.style.maxHeight = 'none';
        elements.questionsReview.style.overflow = 'visible';
    }
    
    const reviewSection = document.querySelector('.review-section');
    if (reviewSection) {
        reviewSection.style.pageBreakInside = 'auto';
    }
    
    // Print
    window.print();
    
    // Restore original styles
    if (elements.questionsReview && originalStyles.questionsReview !== undefined) {
        elements.questionsReview.style.cssText = originalStyles.questionsReview;
    }
    if (reviewSection && originalStyles.reviewSection !== undefined) {
        reviewSection.style.cssText = originalStyles.reviewSection;
    }
}

function startNewQuiz() {
    if (confirm('آیا می‌خواهید آزمون جدیدی شروع کنید؟ نتایج فعلی ذخیره خواهد شد.')) {
        // Reset state
        appState.quizData = null;
        appState.userAnswers = {};
        appState.markedQuestions.clear();
        appState.quizResults = null;
        
        // Go to step 1
        goToStep(1);
        
        showToast('آماده برای آزمون جدید', 'info');
    }
}

function shareResults() {
    if (!appState.quizResults) return;
    
    const text = `نمره من در آزمون "${appState.quizData.quiz_title}" ${appState.quizResults.percentage}% شد! 
    (${appState.quizResults.correct} از ${appState.quizResults.total} سوال صحیح)`;
    
    if (navigator.share) {
        navigator.share({
            title: 'نتایج آزمون',
            text: text,
            url: window.location.href
        }).catch(err => {
            console.error('Error sharing:', err);
            copyToClipboard(text);
        });
    } else {
        copyToClipboard(text);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('متن در کلیپ‌بورد کپی شد', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('خطا در کپی کردن متن', 'error');
    });
}

// ==================== THEME FUNCTIONS ====================
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    APP_CONFIG.theme = newTheme;
    
    // Update button text
    if (elements.themeToggle) {
        elements.themeToggle.innerHTML = newTheme === 'dark' ? 
            '<i class="fas fa-sun"></i> <span>تم روشن</span>' : 
            '<i class="fas fa-moon"></i> <span>تم تاریک</span>';
    }
    
    // Save theme preference
    localStorage.setItem(`${APP_CONFIG.storageKey}_theme`, newTheme);
    showToast(`تم ${newTheme === 'dark' ? 'تاریک' : 'روشن'} فعال شد`, 'info');
}

function applyTheme() {
    const savedTheme = localStorage.getItem(`${APP_CONFIG.storageKey}_theme`) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    APP_CONFIG.theme = savedTheme;
    
    // Update button text
    if (elements.themeToggle) {
        elements.themeToggle.innerHTML = savedTheme === 'dark' ? 
            '<i class="fas fa-sun"></i> <span>تم روشن</span>' : 
            '<i class="fas fa-moon"></i> <span>تم تاریک</span>';
    }
}

// ==================== MODAL FUNCTIONS ====================
function showPromptModal() {
    if (elements.promptModal) {
        elements.promptModal.classList.add('active');
    }
}

function hidePromptModal() {
    if (elements.promptModal) {
        elements.promptModal.classList.remove('active');
    }
}

function copyPromptToClipboard() {
    if (elements.promptText) {
        navigator.clipboard.writeText(elements.promptText.value).then(() => {
            showToast('پرامپت در کلیپ‌بورد کپی شد', 'success');
            hidePromptModal();
        }).catch(err => {
            console.error('Failed to copy prompt:', err);
            showToast('خطا در کپی کردن پرامپت', 'error');
        });
    }
}

// ==================== HELP FUNCTIONS ====================
function showHelp() {
    const helpContent = `
        <h3><i class="fas fa-question-circle"></i> راهنمای استفاده از آزمون‌ساز</h3>
        <div class="help-sections">
            <div class="help-section">
                <h4>مرحله ۱: وارد کردن سوالات</h4>
                <ul>
                    <li>از پرامپت حرفه‌ای برای ساخت سوالات با کیفیت استفاده کنید</li>
                    <li>JSON تولید شده را در کادر متن پیست کنید</li>
                    <li>حتماً JSON را قبل از بارگذاری بررسی کنید</li>
                    <li>می‌توانید آزمون نمونه را برای آشنایی با سیستم بارگذاری کنید</li>
                </ul>
            </div>
            <div class="help-section">
                <h4>مرحله ۲: تنظیمات آزمون</h4>
                <ul>
                    <li>زمان آزمون را مطابق نیاز خود تنظیم کنید</li>
                    <li>ترتیب نمایش سوالات را انتخاب کنید</li>
                    <li>نحوه نمایش توضیحات پاسخ را تنظیم کنید</li>
                    <li>نمره قبولی مورد نظر را تعیین کنید</li>
                </ul>
            </div>
            <div class="help-section">
                <h4>مرحله ۳: شرکت در آزمون</h4>
                <ul>
                    <li>با دقت به سوالات پاسخ دهید</li>
                    <li>می‌توانید سوالات را علامت‌گذاری کنید</li>
                    <li>از تایمر برای مدیریت زمان استفاده کنید</li>
                    <li>قبل از ارسال نهایی پاسخ‌ها را مرور کنید</li>
                </ul>
            </div>
            <div class="help-section">
                <h4>مرحله ۴: نتایج و تحلیل</h4>
                <ul>
                    <li>نتایج کامل را مشاهده کنید</li>
                    <li>از نمودارهای تحلیلی برای بررسی عملکرد استفاده کنید</li>
                    <li>سوالات را با توضیحات مرور کنید</li>
                    <li>نتایج را چاپ یا با قابلیت PDF جدید دانلود کنید</li>
                </ul>
            </div>
        </div>
        <div class="help-tips">
            <h4><i class="fas fa-lightbulb"></i> نکات کلیدی</h4>
            <p>برای بهترین نتایج، حتماً از پرامپت حرفه‌ای استفاده کنید تا سوالات مفهومی و سخت تولید شوند.</p>
        </div>
    `;
    
    // You could implement a modal for help or use alert for simplicity
    alert(helpContent.replace(/<[^>]*>/g, ''));
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'info') {
    // Remove any existing toasts
    const existingToasts = document.querySelectorAll('.toastify');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        className: `toastify-${type}`,
        style: {
            background: type === 'success' ? 'linear-gradient(90deg, #4caf50, #66bb6a)' :
                       type === 'error' ? 'linear-gradient(90deg, #f44336, #ef5350)' :
                       type === 'warning' ? 'linear-gradient(90deg, #ff9800, #ffb74d)' :
                       'linear-gradient(90deg, #2196f3, #42a5f5)',
            fontFamily: 'Vazirmatn, sans-serif',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
    }).showToast();
}

// ==================== KEYBOARD SHORTCUTS ====================
function handleKeyboardShortcuts(e) {
    // Don't trigger shortcuts when user is typing
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
        return;
    }
    
    switch (e.key) {
        case 'ArrowRight':
        case 'd':
            if (appState.currentStep === 3) {
                e.preventDefault();
                showPreviousQuestion();
            }
            break;
        case 'ArrowLeft':
        case 'a':
            if (appState.currentStep === 3) {
                e.preventDefault();
                showNextQuestion();
            }
            break;
        case 'm':
            if (appState.currentStep === 3 && appState.settings.allowMark) {
                e.preventDefault();
                toggleMarkQuestion();
            }
            break;
        case ' ':
            if (appState.currentStep === 3) {
                e.preventDefault();
                const currentOption = document.querySelector('.option.selected');
                if (currentOption) {
                    const options = document.querySelectorAll('.option');
                    const currentIndex = Array.from(options).indexOf(currentOption);
                    const nextIndex = (currentIndex + 1) % options.length;
                    options[nextIndex].click();
                } else if (options.length > 0) {
                    options[0].click();
                }
            }
            break;
        case 'Escape':
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            hidePromptModal();
            break;
        case '1':
        case '2':
        case '3':
        case '4':
            if (appState.currentStep === 3 && e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                const optionIndex = parseInt(e.key) - 1;
                const options = document.querySelectorAll('.option');
                if (options.length > optionIndex) {
                    options[optionIndex].click();
                }
            }
            break;
    }
}

// ==================== STATE PERSISTENCE ====================
function saveState() {
    try {
        const state = {
            quizData: appState.quizData,
            userAnswers: appState.userAnswers,
            markedQuestions: Array.from(appState.markedQuestions),
            settings: appState.settings,
            currentStep: appState.currentStep,
            currentQuestionIndex: currentQuestionIndex
        };
        
        localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(state));
    } catch (error) {
        console.error('Error saving state:', error);
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem(APP_CONFIG.storageKey);
        if (!saved) return;
        
        const state = JSON.parse(saved);
        
        // Restore state
        if (state.quizData) appState.quizData = state.quizData;
        if (state.userAnswers) appState.userAnswers = state.userAnswers;
        if (state.markedQuestions) appState.markedQuestions = new Set(state.markedQuestions);
        if (state.settings) appState.settings = state.settings;
        if (state.currentQuestionIndex) currentQuestionIndex = state.currentQuestionIndex;
        
        // Go to saved step
        if (state.currentStep && state.currentStep !== 1) {
            setTimeout(() => goToStep(state.currentStep), 100);
        }
        
        console.log('State loaded successfully');
    } catch (error) {
        console.error('Error loading state:', error);
    }
}

// ==================== INIT SAMPLE QUIZ ====================
function initSampleQuiz() {
    // This function ensures the sample quiz button works even if JSON is malformed
    console.log("Sample quiz initialized");
}

// ==================== START APPLICATION ====================
// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for debugging
window.quizApp = {
    state: appState,
    goToStep,
    showToast,
    validateJson,
    loadSampleQuiz,
    generatePDF,
    generateQuickPDF
};

console.log(`${APP_CONFIG.appName} v${APP_CONFIG.version} loaded`);