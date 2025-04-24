document.addEventListener('DOMContentLoaded', function() {
    // عناصر DOM
    const skillForm = document.getElementById('add-skill-form');
    const skillNameInput = document.getElementById('skill-name');
    const skillPercentInput = document.getElementById('skill-percent');
    const percentValueSpan = document.getElementById('percent-value');
    const skillsTableBody = document.querySelector('.skills-table tbody');
    
    // رویداد تغییر درصد مهارت
    skillPercentInput.addEventListener('input', function() {
        percentValueSpan.textContent = this.value + '%';
    });
    
    // بارگیری اولیه مهارت‌ها
    loadSkills();
    
    // رویداد ارسال فرم
    skillForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addSkill();
    });
    
    // تابع بارگیری مهارت‌ها
    function loadSkills() {
        fetch('../apis/codeskillsAPI?action=get_skills')
            .then(response => response.json())
            .then(data => {
                if(data.status === 'success') {
                    renderSkills(data.data);
                }
            })
            .catch(error => console.error('Error:', error));
    }
    
    // تابع نمایش مهارت‌ها در جدول
    function renderSkills(skills) {
        skillsTableBody.innerHTML = '';
        
        skills.forEach((skill, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${skill.skill_name}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${skill.skill_percentage}%;"></div>
                    </div>
                    <span class="percent">${skill.skill_percentage}%</span>
                </td>
                <td><button class="delete-btn" data-id="${skill.id}">حذف</button></td>
            `;
            skillsTableBody.appendChild(tr);
        });
        
        // رویداد حذف مهارت
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteSkill(this.getAttribute('data-id'));
            });
        });
    }

    // تابع افزودن مهارت
    function addSkill() {
        const skillData = {
            action: 'add_skill',
            name: skillNameInput.value.trim(),
            percent: parseInt(skillPercentInput.value)
        };
        
        // اعتبارسنجی سمت کلاینت
        if (!skillData.name || isNaN(skillData.percent)) {
            alert('لطفاً نام و درصد مهارت را وارد کنید');
            return;
        }

        fetch('../apis/codeskillsAPI', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(skillData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            if(data.status === 'success') {
                skillNameInput.value = '';
                skillPercentInput.value = 50;
                percentValueSpan.textContent = '50%';
                loadSkills();
                alert(data.message || 'مهارت با موفقیت اضافه شد');
            } else {
                throw new Error(data.message || 'خطای ناشناخته');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('خطا: ' + (error.message || 'خطا در ارتباط با سرور'));
        });
    }
    
    // تابع حذف مهارت
    function deleteSkill(id) {
        if(confirm('آیا از حذف این مهارت مطمئن هستید؟')) {
            const formData = new FormData();
            formData.append('action', 'delete_skill');
            formData.append('id', id);
            
            fetch('../apis/codeskillsAPI', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('خطای درخواست');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    loadSkills();
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
