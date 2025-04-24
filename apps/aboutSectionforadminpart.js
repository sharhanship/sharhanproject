document.addEventListener('DOMContentLoaded', function() {
    const aboutForm = document.querySelector('.about-form');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    
    // بارگیری داده‌های موجود
    loadAboutData();
    
    // ارسال فرم
    aboutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const data = {
            title: titleInput.value,
            description: descriptionInput.value
        };
        
        updateAboutData(data);
    });
    
    // تابع بارگیری داده‌های موجود
    function loadAboutData() {
        fetch('../apis/getAboutAPIforadmin')
            .then(response => response.json())
            .then(data => {
                if(data.status === 'success' && data.data.length > 0) {
                    const aboutData = data.data[0];
                    titleInput.value = aboutData.title || '';
                    descriptionInput.value = aboutData.description || '';
                }
            })
            .catch(error => console.error('Error:', error));
    }
    
    // تابع آپدیت داده‌ها
    function updateAboutData(data) {
        fetch('../apis/updateAboutAPIforadminanduser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'success') {
                alert('اطلاعات با موفقیت ذخیره شد!');
            } else {
                alert('خطا در ذخیره اطلاعات: ' + (data.message || 'خطای ناشناخته'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('خطا در ارتباط با سرور');
        });
    }
});