function buildSubjectCards() {
    const container = document.getElementById('subjects-container');
    container.innerHTML = "";

    syllabusSubjects.forEach((subKey, index) => {
        let progress = getSubjectProgress(subKey);
        let gujSubjectName = subjectData[subKey].gujName; // Gujarati Text Display

        const card = document.createElement('div');
        card.className = "card";
        card.onclick = () => goToBranchSelect(subKey); 
        card.innerHTML = `
            <div>
                <div>${index + 1}. ${gujSubjectName}</div>
                <span class="sub-perc">કુલ પ્રગતિ: ${progress}%</span>
            </div>
            <span>➔</span>
        `;
        container.appendChild(card);
    });
}
function goToBranchSelect(subjectKey) {
    currentSubject = subjectKey;
    
    let cleanSubjectName = subjectData[subjectKey].gujName;
    document.getElementById('current-subject-title-branch').innerText = cleanSubjectName;
    
    const container = document.getElementById('branches-container');
    container.innerHTML = "";

    const branches = Object.keys(subjectData[subjectKey].branches);
    
    branches.forEach((branchKey, index) => {
        let qProg = getBranchProgress(subjectKey, branchKey, 'Quiz');
        let mProg = getBranchProgress(subjectKey, branchKey, 'Mock Test');
        let branchProgress = Math.round((qProg + mProg) / 2) || 0;

        let cleanBranchName = subjectData[subjectKey].branches[branchKey].gujName;

        const card = document.createElement('div');
        card.className = "card";
        card.onclick = () => goToTypeSelect(branchKey); 
        card.innerHTML = `
            <div>
                <div>${index + 1}. ${cleanBranchName}</div>
                <span class="sub-perc">કુલ પ્રગતિ: ${branchProgress}%</span>
            </div>
            <span>➔</span>
        `;
        container.appendChild(card);
    });

    changeScreen('screen-branches');
}

// --- ⚡ TYPE SELECT INTERMEDIARY (Screen 3) ---
function goToTypeSelect(branchKey) {
    currentBranch = branchKey;
    
    let cleanBranchName = subjectData[currentSubject].branches[branchKey].gujName;
    document.getElementById('current-subject-name').innerText = cleanBranchName;
    
    let quizProg = getBranchProgress(currentSubject, branchKey, 'Quiz');
    let mockProg = getBranchProgress(currentSubject, branchKey, 'Mock Test');
    
    document.getElementById('quiz-type-perc').innerText = `Progress: ${quizProg}%`;
    document.getElementById('mock-type-perc').innerText = `Progress: ${mockProg}%`;
    
    changeScreen('screen-type-select');
}

// --- 📋 DYNAMIC QUIZ ROWS GENERATOR (Screen 4) ---
function goToQuizList(type) {
    currentType = type;
    
    let cleanBranchName = subjectData[currentSubject].branches[currentBranch].gujName;
    document.getElementById('current-list-title').innerText = `${cleanBranchName} - ${type}`;
    
    buildQuizRows();
    changeScreen('screen-quiz-list');
}
function initDashboard() {
    updateProfileUI();
    buildSubjectCards();

    // 🔄 Pure memory system ko sessionStorage par shift kar diya hai
    const savedSubject = sessionStorage.getItem('last_active_subject');
    const savedBranch = sessionStorage.getItem('last_active_branch');
    const savedType = sessionStorage.getItem('last_active_type');

    if (savedSubject && savedBranch && savedType) {
        currentSubject = savedSubject;
        currentBranch = savedBranch;
        currentType = savedType;
      
        isRestoring = true;
      
        goToBranchSelect(currentSubject);
        goToTypeSelect(currentBranch);
        goToQuizList(currentType);

        // 🔥 Magic Line: Turant memory saaf taaki background kill aur refresh sahi chale!
        sessionStorage.removeItem('last_active_subject');
        sessionStorage.removeItem('last_active_branch');
        sessionStorage.removeItem('last_active_type');
        isRestoring = false;
    }
}
// 🌐 Case 1: Jab page bilkul pehli baar normal load/refresh ho
window.onload = function() {
    initDashboard();
};

// 📱 Case 2: HARDWARE BACK BUTTON PROTECTION ENGINE
// Jab bacha quiz player se hardware back button daba kar aayega, tab ye event fire hoga
window.onpageshow = function(event) {
    // event.persisted = true ka matlab hai page browser ki history cache se wapas aaya hai
    if (isBackForwardNavigation(event)) {
        initDashboard();
    }
};
window.onpopstate = function(event) {
      if (skipPopState === true) {
        skipPopState = false; // Agli baar ke liye reset karo
        return; // Chupchaap return ho jao, neche ka HTML logic skip karo!
    } 
    // 1. Pata karo ki abhi screen par kaun si screen active (khuli) hai
    const currentActiveScreen = document.querySelector('.screen.active')?.id;

    // 2. Agar bacha sabse pehli screen (Subject List) par hai, toh call hi mat karo (browser website se exit ho jayega)
    if (currentActiveScreen === 'screen-subjects') {
        return; 
    }

    // 3. 🔥 AAPKA LOGIC: Current screen ke hisab se target screen chuniyen
    let targetScreen = 'screen-subjects';

    if (currentActiveScreen === 'screen-quiz-list') {
        targetScreen = 'screen-type-select'; // Quiz list se peeche Type Select
    } else if (currentActiveScreen === 'screen-type-select') {
        targetScreen = 'screen-branches';    // Type Select se peeche Branch Select
    } else if (currentActiveScreen === 'screen-branches') {
        targetScreen = 'screen-subjects';    // Branch Select se peeche Subject List
    }

    // 4. 🔥 DIRECT HTML MANIPULATION (Bina pushState ko chhede)
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); //
    document.getElementById(targetScreen).classList.add('active'); //
    window.scrollTo(0,0); //
};
