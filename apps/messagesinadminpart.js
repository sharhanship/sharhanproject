document.addEventListener('DOMContentLoaded', function() {
    // متغیرهای اصلی
    const messagesAPI = '../apis/messagesAPI';
    const tbody = document.getElementById('messages-tbody');
    
    // 1. ایجاد ساختار مودال در DOM
    const modalHTML = `
        <div class="message-modal">
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-content">
                    <h3>متن کامل پیام</h3>
                    <div class="modal-body"></div>
                    <button class="modal-close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 2. اضافه کردن مودال به body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.querySelector('.message-modal');
    const modalBody = document.querySelector('.modal-body');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    
    // 3. استایل‌دهی پویا با JavaScript
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .message-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);
        }
        
        .message-modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-backdrop {
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        
        .modal-container {
            position: relative;
            z-index: 2;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            animation: modalFadeIn 0.4s ease-out;
        }
        
        .modal-content {
            background: rgba(0, 0, 0, 0.44);
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            overflow-y: auto;
            position: relative;
        }
        
        .modal-content h3 {
            margin-top: 0;
            color: #ffff;
            font-size: 1.5rem;
            text-align: right;
        }
        
        .modal-body {
            color: #ffff;
            line-height: 1.6;
            text-align: right;
            font-size: 1.1rem;
            white-space: pre-wrap;
            max-height: 50vh;
            overflow-y: auto;
            padding: 10px 0;
        }
        
        .modal-close-btn {
            position: absolute;
            top: 15px;
            left: 15px;
            background: rgba(255, 255, 255, 0.3);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .modal-close-btn:hover {
            background: rgba(255, 255, 255, 0.5);
            transform: rotate(90deg);
        }
        
        .modal-close-btn svg {
            width: 20px;
            height: 20px;
        }
        
        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(modalStyles);
    
    // 4. توابع مدیریت مودال
    function showModal(message) {
        modalBody.textContent = message;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function hideModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // 5. رویدادهای مودال
    modalCloseBtn.addEventListener('click', hideModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', hideModal);
    
    // 6. توابع اصلی مدیریت پیام‌ها
    function fetchMessages() {
        fetch(messagesAPI)
            .then(response => response.json())
            .then(data => {
                if(data.status === 'success') {
                    renderMessages(data.data);
                } else {
                    console.error('Error:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }
    
    function renderMessages(messages) {
        tbody.innerHTML = '';
        
        messages.forEach((message, index) => {
            const tr = document.createElement('tr');
            const shortText = message.mortext.length > 30 ? 
                message.mortext.substring(0, 30) + '...' : 
                message.mortext;
            
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${message.nameandfamily || '---'}</td>
                <td>${message.email || '---'}</td>
                <td>${message.numberphone || '---'}</td>
                <td class="message-preview">${shortText}</td>
                <td><button class="delete-btn" data-id="${message.id}">حذف</button></td>
            `;
            
            // رویداد کلیک برای پیشنمایش پیام
            tr.querySelector('.message-preview').addEventListener('click', () => {
                showModal(message.mortext);
            });
            
            tbody.appendChild(tr);
        });
    }
    
    // 7. تابع حذف پیام
    function deleteMessage(id) {
        if(confirm('آیا از حذف این پیام مطمئن هستید؟')) {
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('id', id);
            
            fetch(messagesAPI, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(data.status === 'success') {
                    fetchMessages();
                } else {
                    alert('خطا در حذف پیام: ' + (data.message || 'خطای ناشناخته'));
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }
    
    // 8. رویداد کلیک برای دکمه‌های حذف
    tbody.addEventListener('click', function(e) {
        if(e.target.classList.contains('delete-btn')) {
            deleteMessage(e.target.getAttribute('data-id'));
        }
    });
    
    // بارگیری اولیه پیام‌ها
    fetchMessages();
});