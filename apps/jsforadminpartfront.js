const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navbar = document.querySelector('.navbar');
const body = document.body;

function toggleMenu() {
    const isOpen = navbar.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    body.style.overflow = isOpen ? 'hidden' : '';
    
    // برای عملکرد بهتر در دستگاه‌های لمسی
    if (isOpen) {
        navbar.style.pointerEvents = 'auto';
    } else {
        setTimeout(() => {
            navbar.style.pointerEvents = 'none';
        }, 500);
    }
}

mobileMenuBtn.addEventListener('click', toggleMenu);

// بستن منو هنگام کلیک روی لینک‌ها یا خارج از منو
document.addEventListener('click', function(e) {
    const isClickInsideNav = navbar.contains(e.target);
    const isClickOnButton = mobileMenuBtn.contains(e.target);
    
    if (!isClickInsideNav && !isClickOnButton && navbar.classList.contains('active')) {
        toggleMenu();
    }
});

// بستن منو هنگام اسکرول در موبایل - نسخه اصلاح شده
let lastScrollPosition = 0;
const scrollThreshold = 50; // حداقل میزان اسکرول برای بستن منو

window.addEventListener('scroll', function() {
    if (navbar.classList.contains('active')) {
        const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDifference = Math.abs(currentScrollPosition - lastScrollPosition);
        
        if (scrollDifference > scrollThreshold) {
            toggleMenu();
        }
        
        lastScrollPosition = currentScrollPosition;
    }
});

// ساخت مُدال برای نمایش کامل پیام
document.querySelectorAll('.message-preview').forEach(item => {
    item.addEventListener('click', () => {
        const fullMessage = item.getAttribute('data-full-message');
        createModal(fullMessage);
    });
});

function createModal(message) {
    // ساخت عناصر مُدال
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay active';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const closeButton = document.createElement('button');
    closeButton.className = 'close-modal';
    closeButton.innerHTML = '×';
    closeButton.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        setTimeout(() => modalOverlay.remove(), 300);
    });

    const messageText = document.createElement('p');
    messageText.textContent = message;

    // اضافه کردن عناصر به DOM
    modalContent.appendChild(closeButton);
    modalContent.appendChild(messageText);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // بستن مُدال با کلیک خارج از محتوا
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            setTimeout(() => modalOverlay.remove(), 300);
        }
    });
}

// مدیریت نمایش بخش‌ها
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.navbar a');
let currentSectionIndex = 0;

// نمایش اولیه بخش اول
sections[0].classList.add('active-section');

// کلیک روی منو
navLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        currentSectionIndex = index;
        updateActiveSection();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

function updateActiveSection() {
    sections.forEach(section => section.classList.remove('active-section'));
    sections[currentSectionIndex].classList.add('active-section');
}

// نمایش درصد مهارت به صورت لحظه‌ای
const skillPercentInput = document.getElementById('skill-percent');
const percentValue = document.getElementById('percent-value');

skillPercentInput.addEventListener('input', () => {
    percentValue.textContent = `${skillPercentInput.value}%`;
});

// غیرفعال کردن فرم (برای جلوگیری از ارسال)
document.getElementById('add-skill-form').addEventListener('submit', (e) => {
    e.preventDefault();
});


