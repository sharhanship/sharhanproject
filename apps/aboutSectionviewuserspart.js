document.addEventListener('DOMContentLoaded', function() {
    // ... (کدهای قبلی)

    // تابع بارگیری و نمایش داده‌ها
    function loadAndDisplayAboutData() {
        fetch('./apis/getAboutfrontAPI')
            .then(response => response.json())
            .then(data => {
                if(data.status === 'success' && data.data) {
                    // آپدیت بخش نمایش
                    document.getElementById('display-about-title').textContent = data.data.title || 'نیم نگاه';
                    document.getElementById('display-about-description').textContent = data.data.description || 'متن پیش‌فرض';
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // تابع آپدیت داده‌ها
    function updateAboutData(data) {
        fetch('./apis/updateAboutAPIforadminanduser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'success') {
                loadAndDisplayAboutData(); // رفرش نمایش پس از آپدیت
                alert('اطلاعات با موفقیت ذخیره شد!');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // بارگیری اولیه داده‌ها
    loadAndDisplayAboutData();
});