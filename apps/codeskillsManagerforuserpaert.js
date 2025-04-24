document.addEventListener('DOMContentLoaded', function () {
    const skillsBox = document.querySelector('.skills-box');

    // بارگیری مهارت‌ها
    loadSkills();

    function loadSkills() {
        fetch('./apis/codeskillsAPIforuserpart')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    renderSkills(data.data);
                } else {
                    console.error('Failed to load skills:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function renderSkills(skills) {
        skillsBox.innerHTML = ''; // پاک کردن محتوای قبلی

        skills.forEach(skill => {
            const progressDiv = document.createElement('div');
            progressDiv.className = 'peogress';
            progressDiv.innerHTML = `
              <div class="skills-box">

                    <div class="skills-content">
                        
                          <h3>${skill.skill_name} <span class="spanorg">${skill.skill_percentage}%</span></h3>
                             <div class="bar">
                                       <span style="width: ${skill.skill_percentage}%;"></span>
                                 </div>
                    </div>
                </div>
             
            `;
            skillsBox.appendChild(progressDiv);
        });
    }
});
