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
