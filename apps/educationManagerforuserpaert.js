document.addEventListener('DOMContentLoaded', function () {
    const educationBox = document.querySelector('.education-box');

    // بارگذاری تجربه‌ها
    loadExperiences();

    // تابع بارگذاری تجربه‌ها
    function loadExperiences() {
        fetch('./apis/educationAPIforadmin?action=get_experiences')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    renderExperiences(data.data);
                } else {
                    console.error(`خطا در بارگذاری تجربه‌ها: ${data.message}`);
                }
            })
            .catch(error => console.error(`خطا: ${error.message}`));
    }

    // تابع نمایش تجربه‌ها در بخش سایت اصلی
    function renderExperiences(experiences) {
        educationBox.innerHTML = ''; // پاک کردن محتوای قبلی

        experiences.forEach(experience => {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'education-content';
            contentDiv.innerHTML = `
                <div class="content">
                    <div class="year"><i class='bx bx-calendar'></i>${experience.year}</div>
                    <h3>${experience.title}</h3>
                    <p>${experience.description}</p>
                </div>
            `;
            educationBox.appendChild(contentDiv);
        });
    }
});
