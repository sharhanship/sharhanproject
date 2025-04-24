document.addEventListener('DOMContentLoaded', function () {
    const educationForm = document.querySelector('.education-form');
    const educationYearInput = document.getElementById('education-year');
    const educationTitleInput = document.getElementById('education-title');
    const educationDescriptionInput = document.getElementById('education-description');
    const educationTableBody = document.querySelector('.education-table tbody');

    // بارگذاری تجربه‌ها
    loadExperiences();

    // رویداد ارسال فرم
    educationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addExperience();
    });

    // تابع بارگذاری تجربه‌ها
    function loadExperiences() {
        fetch('../apis/educationAPIforadmin?action=get_experiences')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    renderExperiences(data.data);
                } else {
                    console.error('Failed to load experiences:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // تابع نمایش تجربه‌ها در جدول
    function renderExperiences(experiences) {
        educationTableBody.innerHTML = ''; // پاک کردن محتوای قبلی

        experiences.forEach((experience, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${experience.year}</td>
                <td>${experience.title}</td>
                <td class="education-preview">${experience.description}</td>
                <td><button class="delete-btn" data-id="${experience.id}">حذف</button></td>
            `;
            educationTableBody.appendChild(tr);
        });

        // رویداد حذف تجربه
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                deleteExperience(this.getAttribute('data-id'));
            });
        });
    }

    // تابع افزودن تجربه
    function addExperience() {
        const experienceData = {
            action: 'add_experience',
            year: educationYearInput.value.trim(),
            title: educationTitleInput.value.trim(),
            description: educationDescriptionInput.value.trim()
        };

        // اعتبارسنجی سمت کلاینت
        if (!experienceData.year || !experienceData.title || !experienceData.description) {
            alert('لطفاً تمام فیلدها را پر کنید');
            return;
        }

        fetch('../apis/educationAPIforadmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(experienceData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    educationForm.reset();
                    loadExperiences();
                    alert(data.message);
                } else {
                    throw new Error(data.message || 'خطای ناشناخته');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('خطا: ' + error.message);
            });
    }

    // تابع حذف تجربه
    function deleteExperience(id) {
        if (confirm('آیا از حذف این تجربه مطمئن هستید؟')) {
            const formData = new FormData();
            formData.append('action', 'delete_experience');
            formData.append('id', id);

            fetch('../apis/educationAPIforadmin', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        loadExperiences();
                        alert(data.message);
                    } else {
                        throw new Error(data.message || 'خطای ناشناخته');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('خطا: ' + error.message);
                });
        }
    }
});
