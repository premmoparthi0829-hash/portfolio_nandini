/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== ACCORDION SKILLS ====================*/
const skillsContent = document.getElementsByClassName('skills__content'),
      skillsHeader = document.querySelectorAll('.skills__header')

function toggleSkills(){
    let itemClass = this.parentNode.className

    for(i = 0; i < skillsContent.length; i++){
        skillsContent[i].className = 'skills__content skills__close'
    }
    if(itemClass === 'skills__content skills__close'){
        this.parentNode.className = 'skills__content skills__open'
    }
}

skillsHeader.forEach((el) =>{
    el.addEventListener('click', toggleSkills)
})

/*==================== QUALIFICATION TABS ====================*/
const tabs = document.querySelectorAll('[data-target]'),
      tabContents = document.querySelectorAll('[data-content]')

tabs.forEach(tab =>{
    tab.addEventListener('click', () =>{
        const target = document.querySelector(tab.dataset.target)

        tabContents.forEach(tabContent =>{
            tabContent.classList.remove('qualification__active')
        })
        target.classList.add('qualification__active')

        tabs.forEach(tab =>{
            tab.classList.remove('qualification__active')
        })
        tab.classList.add('qualification__active')
    })
})

/*==================== PORTFOLIO SWIPER  ====================*/
let swiper = new Swiper('.portfolio__container', {
    cssMode: true,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
});

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/ 
function scrollHeader(){
    const nav = document.getElementById('header')
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL UP ====================*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*==================== DARK LIGHT THEME ====================*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'uil-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*==================== DYNAMIC CONTENT LOAD ====================*/
async function loadDynamicContent() {
    try {
        const doc = await db.collection('portfolio').doc('content').get();
        if (doc.exists) {
            const data = doc.data();
            renderDynamicSections(data);
        }
    } catch (error) {
        console.error("Error loading content:", error);
    }
}

function renderDynamicSections(data) {
    // Home
    if (data.home) {
        if (data.home.title) document.getElementById('home-title').innerText = data.home.title;
        if (data.home.subtitle) document.getElementById('home-subtitle').innerText = data.home.subtitle;
        if (data.home.description) document.getElementById('home-description').innerText = data.home.description;
    }

    // About
    if (data.about) {
        if (data.about.description) document.getElementById('about-description').innerText = data.about.description;
        const info = document.getElementById('about-info');
        if (info) {
            info.innerHTML = `
                <div>
                    <span class="about__info-title">${data.about.exp_years || '04+'}</span>
                    <span class="about__info-name">Years <br> experience</span>
                </div>
                <div>
                    <span class="about__info-title">${data.about.projects_count || '50+'}</span>
                    <span class="about__info-name">Completed <br> projects</span>
                </div>
                <div>
                    <span class="about__info-title">${data.about.companies_count || '04+'}</span>
                    <span class="about__info-name">Companies <br> worked</span>
                </div>
            `;
        }
    }

    // Experience
    if (data.experience) {
        renderExperienceItems(data.experience.work, 'experience-content');
        renderExperienceItems(data.experience.edu, 'education-content');
    }

    // Skills
    if (data.skills) {
        const grid = document.getElementById('skills-grid');
        grid.innerHTML = '';
        data.skills.forEach(skill => {
            grid.innerHTML += `
                <div class="skills__card" style="--color: ${skill.color || '#8338EC'};">
                    <div class="skills__card-inner">
                        ${skill.icon.includes('svg') || skill.icon.includes('http') 
                            ? `<img src="${skill.icon}" alt="${skill.name}" class="skills__card-img">`
                            : `<i class="${skill.icon} skills__card-icon"></i>`
                        }
                        <h3 class="skills__card-name">${skill.name}</h3>
                    </div>
                </div>
            `;
        });
    }

    // Portfolio
    if (data.projects) {
        const wrapper = document.getElementById('portfolio-wrapper');
        wrapper.innerHTML = '';
        data.projects.forEach(project => {
            wrapper.innerHTML += `
                <div class="portfolio__content grid swiper-slide">
                    <img src="${project.image}" alt="" class="portfolio__img">
                    <div class="portfolio__data">
                        <h3 class="portfolio__title">${project.title}</h3>
                        <p class="portfolio__description">${project.description}</p>
                        <a href="${project.link}" class="button button--flex button--small portfolio__button">
                            View Case Study
                            <i class="uil uil-arrow-right button__icon"></i>
                        </a>
                    </div>
                </div>
            `;
        });
        // Re-init Swiper
        swiper.destroy();
        swiper = new Swiper('.portfolio__container', {
            cssMode: true,
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }

    // Contact
    if (data.contact) {
        document.getElementById('contact-phone').innerText = data.contact.phone;
        document.getElementById('contact-phone-link').href = `tel:${data.contact.phone}`;
        document.getElementById('contact-email').innerText = data.contact.email;
        document.getElementById('contact-email-link').href = `https://mail.google.com/mail/?view=cm&fs=1&to=${data.contact.email}`;
        document.getElementById('contact-location').innerText = data.contact.location;
    }
}

function renderExperienceItems(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    (items || []).forEach((item, index) => {
        const isEven = index % 2 === 0;
        container.innerHTML += `
            <div class="qualification__data">
                ${isEven ? `
                    <div>
                        <h3 class="qualification__title">${item.title}</h3>
                        <span class="qualification__subtitle">${item.subtitle}</span>
                        <div class="qualification__calendar">
                            <i class="uil uil-calendar-alt"></i>
                            ${item.date}
                        </div>
                    </div>
                    <div>
                        <span class="qualification__rounder"></span>
                        <span class="qualification__line"></span>
                    </div>
                ` : `
                    <div></div>
                    <div>
                        <span class="qualification__rounder"></span>
                        <span class="qualification__line"></span>
                    </div>
                    <div>
                        <h3 class="qualification__title">${item.title}</h3>
                        <span class="qualification__subtitle">${item.subtitle}</span>
                        <div class="qualification__calendar">
                            <i class="uil uil-calendar-alt"></i>
                            ${item.date}
                        </div>
                    </div>
                `}
            </div>
        `;
    });
}

// Initial Load
document.addEventListener('DOMContentLoaded', loadDynamicContent);