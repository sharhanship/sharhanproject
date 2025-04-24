
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

const textElement = document.getElementById('typing-text');
const cursor = document.querySelector('.cursor');
const professions = [
    "برنامه نویس فرانت",
    "برنامه نویس بک اند",
    "برنامه نویس اپلیکیشن"
];
let professionIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
    const currentText = professions[professionIndex];
    const displayText = currentText.substring(0, charIndex);

    textElement.textContent = displayText;

    if (!isDeleting && charIndex === currentText.length) {

        cursor.classList.remove('inactive');
        isDeleting = true;
        typeSpeed = 3000;
    } else if (isDeleting && charIndex === 0) {

        cursor.classList.add('inactive');
        isDeleting = false;
        professionIndex = (professionIndex + 1) % professions.length;
        typeSpeed = 500;
    } else {

        typeSpeed = isDeleting ? 50 : 100;
        cursor.classList.remove('inactive');


        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }
    }

    setTimeout(typeWriter, typeSpeed);
}


window.addEventListener('load', () => {
    setTimeout(() => {
        cursor.classList.remove('inactive');
        typeWriter();
    }, 1000);
});




let sections = document.querySelectorAll('section');
let navlinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        const offset = 100;
        if (
            rect.top <= offset &&
            rect.bottom >= offset
        ) {
            const id = sec.getAttribute('id');
            navlinks.forEach(link => {
                link.classList.remove('active');
            });
            const correspondingLink = document.querySelector(`header nav a[href="#${id}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });

    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);
}


window.addEventListener('DOMContentLoaded', () => {
    const progressItems = document.querySelectorAll('.skills-content .peogress');

    progressItems.forEach(item => {
        const percentageSpan = item.querySelector('.spanorg');
        const progressBar = item.querySelector('.bar span');

        if (percentageSpan && progressBar) {
            const percentageValue = percentageSpan.textContent.replace('%', '').trim();
            progressBar.style.width = percentageValue + '%';

            progressBar.setAttribute('aria-valuenow', percentageValue);
            progressBar.setAttribute('aria-valuemin', '0');
            progressBar.setAttribute('aria-valuemax', '100');
            progressBar.setAttribute('role', 'progressbar');
        }
    });
});



