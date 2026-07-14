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
