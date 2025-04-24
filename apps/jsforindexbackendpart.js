const PERSIAN_REGEX = /^[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\s\u06F0-\u06F9]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IRAN_PHONE_REGEX = /^(0|۰)9[0-9۰-۹]{9}$/;
const IRAN_PREFIXES = ['0912','0913','0914','0915','0916','0917','0918','0919','0902','0903','0904','0905','0941','0921','0922','0923','0930','0931','0932','0933','0934','0935','0936','0937','0938','0939','0990','0991','0992','0993','0994','021','026','031','044','045','061','024','025','028','034','035','038','041','051','054','056','058','071','074','077','081','084','086','087'];


const SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)\b)|(--)|(\/\*)/i,
    /(\b(OR\s+1=1|AND\s+1=1)\b)/i, 
    /(\b(XP_|SP_|EXEC\()\b)/i
];

function showAlert(message, isSuccess = false) {
    const oldAlerts = document.querySelectorAll('.js-custom-alert');
    oldAlerts.forEach(alert => alert.remove());

    const alertDiv = document.createElement('div');
    alertDiv.className = 'js-custom-alert';
    
    Object.assign(alertDiv.style, {
        position: 'fixed',
        top: '100px',
        right: '50px',
        padding: '20px',
        borderRadius: '10px',
        color: 'white',
        backgroundColor: isSuccess ? 'rgba(46, 125, 50, 0.56)' : 'rgba(244, 67, 54, 0.56)',
        boxShadow: '0 4px 12px rgb(0, 0, 0)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        maxWidth: '90%',
        width: '400px',
        fontSize: '16px',
        fontWeight: '500',
        direction: 'rtl',
        animation: 'js-alert-fadeIn 0.3s ease-out'
    });

    alertDiv.innerHTML = `
        <span style="color:white">${message}</span>
        <button style="
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
        ">×</button>
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes js-alert-fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes js-alert-fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(alertDiv);

    alertDiv.querySelector('button').addEventListener('click', () => {
        alertDiv.style.animation = 'js-alert-fadeOut 0.3s ease-out';
        setTimeout(() => alertDiv.remove(), 300);
    });

    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.animation = 'js-alert-fadeOut 0.3s ease-out';
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, 5000);
}

function validatePersianName(name) {
    name = name.trim();
    if (name.length < 2) {
        return { isValid: false, message: 'نام باید حداقل ۲ کاراکتر داشته باشد' };
    }
    if (!PERSIAN_REGEX.test(name)) {
        return { isValid: false, message: 'لطفاً فقط از حروف فارسی استفاده کنید' };
    }
    return { isValid: true };
}

function checkForSQLInjection(input) {
    return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const phone = form.elements['phone'].value.trim();
    const message = form.elements['message'].value.trim();

    let emptyFields = [];
    if (!name) emptyFields.push('نام');
    if (!email) emptyFields.push('ایمیل');
    if (!phone) emptyFields.push('شماره تلفن');
    if (!message) emptyFields.push('پیام');

    if (emptyFields.length > 0) {
        showAlert(`لطفاً فیلدهای زیر را پر کنید: ${emptyFields.join('، ')}`);
        return false;
    }

    if (checkForSQLInjection(name) || checkForSQLInjection(email) || 
        checkForSQLInjection(phone) || checkForSQLInjection(message)) {
        showAlert('نمیتونی داداش تلاش نکن');
        return false;
    }

    const nameValidation = validatePersianName(name);
    if (!nameValidation.isValid) {
        showAlert(nameValidation.message);
        return false;
    }

    if (!EMAIL_REGEX.test(email)) {
        showAlert('فرمت ایمیل نامعتبر است');
        return false;
    }

    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 11) {
        showAlert('شماره تلفن باید ۱۱ رقم باشد');
        return false;
    }
    
    const prefix = cleanedPhone.substring(0, 4);
    if (!IRAN_PREFIXES.includes(prefix)) {
        showAlert('پیش‌شماره تلفن معتبر نیست');
        return false;
    }

    return true;
}

document.getElementById('contactForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    this.noValidate = true;

    if (!validateForm()) return;

    const form = e.target;
    const formData = {
        name: form.elements['name'].value.trim(),
        email: form.elements['email'].value.trim(),
        phone: form.elements['phone'].value.replace(/\D/g, ''),
        message: form.elements['message'].value.trim()
    };

    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (csrfToken) {
            headers['X-CSRF-TOKEN'] = csrfToken;
        }

        const response = await fetch('./apis/phpforindexcontactpart', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formData),
            credentials: 'same-origin'
        });

        if (!response.ok) {
            throw new Error(`خطای HTTP: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status === 'success') {
            showAlert('پیام شما با موفقیت ثبت شد', true);
            form.reset();
        } else {
            showAlert(result.message || 'خطا در ثبت پیام');
        }
    } catch (error) {
        console.error('خطا:', error);
        showAlert('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
    }
});

document.querySelector('input[name="name"]')?.addEventListener('input', function(e) {
    const cursorPos = e.target.selectionStart;
    const originalValue = e.target.value;
    e.target.value = originalValue.replace(/[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\s\u06F0-\u06F9]/g, '');
    if (originalValue !== e.target.value) {
        const diff = originalValue.length - e.target.value.length;
        e.target.setSelectionRange(cursorPos - diff, cursorPos - diff);
        showAlert('فقط حروف فارسی مجاز است');
    }
});

document.querySelector('input[name="email"]')?.addEventListener('keypress', function(e) {
    if (/[\u0600-\u06FF]/.test(String.fromCharCode(e.keyCode))) {
        e.preventDefault();
        showAlert('ایمیل باید به انگلیسی وارد شود');
    }
});

document.querySelector('input[name="phone"]')?.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 11);
    const prefix = e.target.value.substring(0, 4);
    const isValid = IRAN_PREFIXES.includes(prefix) && e.target.value.length === 11;
    e.target.style.borderColor = isValid ? '' : '#f44336';
});

let loginOverlay = null;
let loginForm = null;

let shortcutSequence = [];
const SECRET_SHORTCUT = ['Control', 'Alt', 'A'];

document.addEventListener('keydown', function(event) {
    if (!shortcutSequence.includes(event.key)) {
        shortcutSequence.push(event.key);
    }
    
    if (shortcutSequence.length === SECRET_SHORTCUT.length && 
        shortcutSequence.every((key, index) => key === SECRET_SHORTCUT[index])) {
        
        showGlassmorphicLoginForm();
        shortcutSequence = [];
    }
    
    if (shortcutSequence.length > SECRET_SHORTCUT.length) {
        shortcutSequence = [];
    }
});

document.addEventListener('keyup', function() {
    shortcutSequence = [];
});

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden' && loginOverlay) {
        closeForm(loginOverlay);
    }
});

function showGlassmorphicLoginForm() {
    if (loginOverlay) {
        closeForm(loginOverlay);
        return;
    }

    loginOverlay = document.createElement('div');
    Object.assign(loginOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.36)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: '9999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: '0',
        transition: 'opacity 0.3s ease',
        padding: '20px',
        boxSizing: 'border-box'
    });

    loginForm = document.createElement('div');
    Object.assign(loginForm.style, {
        backgroundColor: 'rgba(0, 0, 0, 0.17)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '2.5rem 2rem',
        borderRadius: '1.5rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transform: 'translateY(20px)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        color: '#fff',
        fontFamily: '"Vazirmatn", sans-serif',
        textAlign: 'right',
        direction: 'rtl'
    });

    loginForm.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 2rem; font-size: 1.8rem; font-weight: 700; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">ورود به پنل مدیریت</h3>
        
        <div style="margin-bottom: 1.8rem;">
            <label style="display: block; margin-bottom: 0.8rem; font-size: 1.9rem; font-weight: 600; color: rgba(255,255,255,0.9);">نام کاربری</label>
            <input type="text" id="login-username" style="width: 100%; padding: 1rem; border-radius: 0.8rem; 
                   border: 1px solid rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.1); 
                   color: #fff; outline: none; transition: all 0.3s ease; font-size: 1rem;
                   box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);" placeholder="نام کاربری خود را وارد کنید">
        </div>
        
        <div style="margin-bottom: 2.5rem;">
            <label style="display: block; margin-bottom: 0.8rem; font-size: 1.9rem; font-weight: 600; color: rgba(255,255,255,0.9);">رمز عبور</label>
            <input type="password" id="login-password" style="width: 100%; padding: 1rem; border-radius: 0.8rem; 
                   border: 1px solid rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.1); 
                   color: #fff; outline: none; transition: all 0.3s ease; font-size: 1rem;
                   box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);" placeholder="رمز عبور خود را وارد کنید">
        </div>
        
        <div style="display: flex; gap: 1rem; direction: ltr;">
            <button id="login-submit" style="flex: 1; padding: 1rem; border-radius: 0.8rem; 
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)); 
                    border: none; color: #fff; font-weight: 700; font-size: 1.1rem;
                    cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(41, 128, 185, 0.3);
                    display: flex; justify-content: center; align-items: center;">
                <span style="color:white;">ورود به سیستم</span>
            </button>
            
            <button id="login-close" style="flex: 0.5; color:black; padding: 1rem; border-radius: 0.8rem; 
                    background: rgb(0, 0, 0); border: none; color: #fff; 
                    font-weight: 700; font-size: 1.1rem; cursor: pointer; 
                    transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);">
                انصراف
            </button>
        </div>
    `;

    loginOverlay.appendChild(loginForm);
    document.body.appendChild(loginOverlay);

    setTimeout(() => {
        loginOverlay.style.opacity = '1';
        loginForm.style.transform = 'translateY(0)';
    }, 10);

    const usernameInput = loginForm.querySelector('#login-username');
    const passwordInput = loginForm.querySelector('#login-password');
    const submitBtn = loginForm.querySelector('#login-submit');
    const closeBtn = loginForm.querySelector('#login-close');

    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => {
            input.style.border = '1px solid rgba(255, 255, 255, 0.6)';
            input.style.background = 'rgba(255, 255, 255, 0.2)';
            input.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.2)';
        });
        
        input.addEventListener('blur', () => {
            input.style.border = '1px solid rgba(255, 255, 255, 0.3)';
            input.style.background = 'rgba(255, 255, 255, 0.1)';
            input.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)';
        });
    });

    submitBtn.addEventListener('mouseenter', () => {
        submitBtn.style.transform = 'translateY(-2px)';
        submitBtn.style.boxShadow = '0 6px 16px rgb(0, 153, 255)';
    });
    
    submitBtn.addEventListener('mouseleave', () => {
        submitBtn.style.transform = 'translateY(0)';
        submitBtn.style.boxShadow = '0 4px 12px rgba(41, 128, 185, 0.3)';
    });

    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.transform = 'translateY(-2px)';
        closeBtn.style.boxShadow = '0 6px 16px rgb(255, 0, 0)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.transform = 'translateY(0)';
        closeBtn.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)';
    });

    submitBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !password) {
            shakeForm(loginForm);
            return;
        }
        
        submitBtn.innerHTML = '<div style="width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('./apis/phpforlogintoadminpart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password})
            });
            
            const data = await response.json();
            
            if (data.success) {
                closeForm(loginOverlay);
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 300);
            } else {
                shakeForm(loginForm);
                alert(data.message || "خطا در ورود!");
                submitBtn.innerHTML = '<span>ورود به سیستم</span>';
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            alert("خطا در ارتباط با سرور");
            submitBtn.innerHTML = '<span>ورود به سیستم</span>';
            submitBtn.disabled = false;
        }
    });
    
    closeBtn.addEventListener('click', () => {
        closeForm(loginOverlay);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @media (max-width: 480px) {
            #login-username, #login-password {
                padding: 0.8rem !important;
                font-size: 0.95rem !important;
            }
            #login-submit, #login-close {
                padding: 0.8rem !important;
                font-size: 1rem !important;
            }
            h3 {
                font-size: 1.5rem !important;
            }
            label {
                font-size: 1rem !important;
            }
        }
    `;
    document.head.appendChild(style);
}

function shakeForm(form) {
    form.style.animation = 'shake 0.4s ease';
    setTimeout(() => {
        form.style.animation = '';
    }, 400);
}



function closeForm(overlay) {
    if (!overlay) return;
    
    overlay.style.opacity = '0';
    setTimeout(() => {
        if (overlay && overlay.parentNode) {
            document.body.removeChild(overlay);
        }
        loginOverlay = null;
        loginForm = null;
    }, 300);
}


document.getElementById("downloadBtn").addEventListener("click", function() {
    // روش مطمئن‌تر با استفاده از لینک موقت
    const link = document.createElement('a');
    link.href = './apis/phpfordowanloadmyres?t=' + Date.now();
    link.target = '_blank';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
