const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
    alert('دسترسی غیرمجاز!');
    window.location.href = 'http://localhost/alisharhan/';
}