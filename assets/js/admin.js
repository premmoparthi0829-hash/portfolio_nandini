// Firebase is initialized in firebase-config.js

// UI Elements
const loginSection = document.getElementById('login-section');
const adminDashboard = document.getElementById('admin-dashboard');
const loginBtn = document.getElementById('login-btn');
const demoBtn = document.getElementById('demo-btn');
const logoutBtn = document.getElementById('logout-btn');
const sidebarItems = document.querySelectorAll('.sidebar__item');
const panels = document.querySelectorAll('.section-panel');
const toast = document.getElementById('toast');

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
  if(themeButton) themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
if(themeButton) {
    themeButton.addEventListener('click', () => {
        // Add or remove the dark / icon theme
        document.body.classList.toggle(darkTheme)
        themeButton.classList.toggle(iconTheme)
        // We save the theme and the current icon that the user chose
        localStorage.setItem('selected-theme', getCurrentTheme())
        localStorage.setItem('selected-icon', getCurrentIcon())
    })
}


// --- AUTHENTICATION ---
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            errorMsg.innerText = error.message;
        });
});

demoBtn.addEventListener('click', () => {
    loginSection.style.display = 'none';
    adminDashboard.style.display = 'block';
    // Use the default data for demo
    portfolioData = {
        home: { title: "Hi, I'm Nandini (Demo)", subtitle: "Senior Graphic Designer", description: "This is demo data." },
        about: { description: "Expertise in branding...", exp_years: "04+", projects_count: "50+", companies_count: "04+" },
        skills: [{ name: "Photoshop", color: "#31A8FF", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg" }],
        experience: { work: [], edu: [] },
        projects: [],
        contact: { phone: "7287928766", email: "demo@example.com", location: "Demo City" }
    };
    populateForms();
    renderLists();
    showToast("Logged in as Demo User!");
});

logoutBtn.addEventListener('click', () => {
    if (auth.currentUser) {
        auth.signOut();
    } else {
        // Fallback for Demo Mode: manually show login section
        loginSection.style.display = 'flex';
        adminDashboard.style.display = 'none';
        showToast("Logged out from Demo Mode");
    }
});

auth.onAuthStateChanged(user => {
    if (user) {
        loginSection.style.display = 'none';
        adminDashboard.style.display = 'block';
        loadAllData();
    } else {
        loginSection.style.display = 'flex';
        adminDashboard.style.display = 'none';
    }
});

// --- NAVIGATION ---
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const panelId = item.dataset.panel;
        panels.forEach(p => {
            p.classList.remove('active');
            if (p.id === panelId) p.classList.add('active');
        });
    });
});

// --- DATA MANAGEMENT ---
let portfolioData = {};

async function loadAllData() {
    try {
        const docRef = db.collection('portfolio').doc('content');
        const doc = await docRef.get();
        const defaults = getDefaultData(); 
        
        if (doc.exists) {
            const fetchedData = doc.data();
            portfolioData = {
                home: { ...defaults.home, ...fetchedData.home },
                about: { ...defaults.about, ...fetchedData.about },
                skills: (fetchedData.skills && fetchedData.skills.length > 0) ? fetchedData.skills : defaults.skills,
                experience: {
                    work: (fetchedData.experience?.work && fetchedData.experience.work.length > 0) ? fetchedData.experience.work : defaults.experience.work,
                    edu: (fetchedData.experience?.edu && fetchedData.experience.edu.length > 0) ? fetchedData.experience.edu : defaults.experience.edu
                },
                projects: (fetchedData.projects && fetchedData.projects.length > 0) ? fetchedData.projects : defaults.projects,
                contact: { ...defaults.contact, ...fetchedData.contact }
            };
        } else {
            // Document doesn't exist, try to initialize it automatically
            console.log("Database empty, initializing with defaults...");
            portfolioData = defaults;
            if (auth.currentUser) {
                try {
                    await docRef.set(defaults);
                    showToast("Database initialized successfully!");
                } catch (e) {
                    console.error("Init error:", e);
                    showToast("Initialized locally, but failed to save to Firebase.");
                }
            }
        }
        
        populateForms();
        renderLists();
    } catch (error) {
        console.error("Firestore Error:", error);
        if (error.code === 'permission-denied') {
            showToast("Permission Denied: Please check your Firestore Rules in Firebase Console.");
        } else if (error.code === 'unavailable') {
            showToast("Firebase Unavailable: Check your internet or if Firestore is enabled.");
        } else {
            showToast("Error loading data. Make sure Firestore is enabled in Firebase Console.");
        }
    }
}

function getDefaultData() {
    return {
        home: {
            title: "Hi, I'm Nandini",
            subtitle: "Senior Graphic Designer",
            description: "Creative and detail-oriented Senior Graphic Designer with 4 years of experience."
        },
        about: {
            description: "Expertise in branding, social media campaigns, advertising creatives...",
            exp_years: "04+",
            projects_count: "50+",
            companies_count: "04+"
        },
        skills: [
            { name: "Photoshop", color: "#31A8FF", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg" },
            { name: "Illustrator", color: "#FF9A00", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-plain.svg" }
        ],
        experience: {
            work: [
                { title: "Senior Graphic Designer", subtitle: "All Hands Global Pvt Ltd", date: "Jan 2026 - Present" }
            ],
            edu: [
                { title: "B.Tech", subtitle: "Christu Jyothi Institute of Technology", date: "2018 - 2021" }
            ]
        },
        projects: [
            { title: "Freyr Energy Branding", description: "Designed branding materials...", image: "assets/img/portfolio1.jpg", link: "#" }
        ],
        contact: {
            phone: "7287928766",
            email: "nandini.vaddepalli31@gmail.com",
            location: "Hyderabad, India 500084"
        }
    };
}

function showToast(msg) {
    toast.innerText = msg || "Changes saved!";
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// --- FORM HANDLING ---
function populateForms() {
    if (portfolioData.home) {
        const h = portfolioData.home;
        const form = document.getElementById('home-form');
        form.title.value = h.title || '';
        form.subtitle.value = h.subtitle || '';
        form.description.value = h.description || '';
    }

    if (portfolioData.about) {
        const a = portfolioData.about;
        const form = document.getElementById('about-form');
        form.description.value = a.description || '';
        form.exp_years.value = a.exp_years || '';
        form.projects_count.value = a.projects_count || '';
        form.companies_count.value = a.companies_count || '';
    }

    if (portfolioData.contact) {
        const c = portfolioData.contact;
        const form = document.getElementById('contact-form');
        form.phone.value = c.phone || '';
        form.email.value = c.email || '';
        form.location.value = c.location || '';
    }
}

// Helper to update data (handles both Firebase and Demo Mode)
async function saveData(field, data) {
    if (auth.currentUser) {
        try {
            await db.collection('portfolio').doc('content').update({ [field]: data });
            showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated!`);
        } catch (error) {
            console.error("Save error:", error);
            showToast("Error saving to Firebase.");
        }
    } else {
        // Demo Mode: Update local state only
        portfolioData[field] = data;
        renderLists(); // Refresh lists if needed
        showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated (Demo Mode)!`);
    }
}

document.getElementById('home-form').onsubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    saveData('home', data);
};

document.getElementById('about-form').onsubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    saveData('about', data);
};

document.getElementById('contact-form').onsubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    saveData('contact', data);
};

// --- LIST RENDERING ---
function renderLists() {
    // Render Skills
    const skillsGrid = document.getElementById('skills-list');
    skillsGrid.innerHTML = '';
    (portfolioData.skills || []).forEach((skill, index) => {
        skillsGrid.innerHTML += `
            <div class="list-item">
                <div><strong>${skill.name}</strong> - ${skill.color}</div>
                <div class="list-item__actions">
                    <button class="action-btn delete-btn" onclick="deleteItem('skills', ${index})"><i class="uil uil-trash-alt"></i></button>
                </div>
            </div>
        `;
    });

    // Render Experience
    renderExperience('work', 'exp-work-list');
    renderExperience('edu', 'exp-edu-list');

    // Render Portfolio
    const portfolioList = document.getElementById('portfolio-list');
    portfolioList.innerHTML = '';
    (portfolioData.projects || []).forEach((project, index) => {
        portfolioList.innerHTML += `
            <div class="list-item">
                <div><strong>${project.title}</strong></div>
                <div class="list-item__actions">
                    <button class="action-btn delete-btn" onclick="deleteItem('projects', ${index})"><i class="uil uil-trash-alt"></i></button>
                </div>
            </div>
        `;
    });
}

function renderExperience(type, containerId) {
    const list = document.getElementById(containerId);
    list.innerHTML = '';
    (portfolioData.experience?.[type] || []).forEach((item, index) => {
        list.innerHTML += `
            <div class="list-item">
                <div><strong>${item.title}</strong> - ${item.subtitle} (${item.date})</div>
                <div class="list-item__actions">
                    <button class="action-btn delete-btn" onclick="deleteExperience('${type}', ${index})"><i class="uil uil-trash-alt"></i></button>
                </div>
            </div>
        `;
    });
}

// --- MODAL & CRUD ---
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalFields = document.getElementById('modal-fields');
let currentModalType = '';
let currentModalSubtype = '';

function openModal(type, subtype = '') {
    currentModalType = type;
    currentModalSubtype = subtype;
    modal.style.display = 'flex';
    modalFields.innerHTML = '';

    if (type === 'skill') {
        modalTitle.innerText = "Add Skill";
        modalFields.innerHTML = `
            <div class="form__group">
                <label class="form__label">Skill Name</label>
                <input type="text" name="name" class="form__input" required>
            </div>
            <div class="form__group">
                <label class="form__label">Icon/Img URL</label>
                <input type="text" name="icon" class="form__input" placeholder="URL to SVG or Image">
            </div>
            <div class="form__group">
                <label class="form__label">Color (Hex)</label>
                <input type="text" name="color" class="form__input" placeholder="#8338EC">
            </div>
        `;
    } else if (type === 'experience') {
        modalTitle.innerText = subtype === 'work' ? "Add Work Experience" : "Add Education";
        modalFields.innerHTML = `
            <div class="form__group">
                <label class="form__label">Title</label>
                <input type="text" name="title" class="form__input" required>
            </div>
            <div class="form__group">
                <label class="form__label">Subtitle (Company/School)</label>
                <input type="text" name="subtitle" class="form__input" required>
            </div>
            <div class="form__group">
                <label class="form__label">Date</label>
                <input type="text" name="date" class="form__input" placeholder="e.g. 2021 - Present">
            </div>
        `;
    } else if (type === 'portfolio') {
        modalTitle.innerText = "Add Project";
        modalFields.innerHTML = `
            <div class="form__group">
                <label class="form__label">Project Title</label>
                <input type="text" name="title" class="form__input" required>
            </div>
            <div class="form__group">
                <label class="form__label">Description</label>
                <textarea name="description" class="form__textarea"></textarea>
            </div>
            <div class="form__group">
                <label class="form__label">Image URL</label>
                <input type="text" name="image" class="form__input" placeholder="assets/img/...">
            </div>
            <div class="form__group">
                <label class="form__label">Case Study Link</label>
                <input type="text" name="link" class="form__input" value="#">
            </div>
        `;
    }
}

function closeModal() {
    modal.style.display = 'none';
}

document.getElementById('modal-form').onsubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (currentModalType === 'skill') {
        if (!portfolioData.skills) portfolioData.skills = [];
        portfolioData.skills.push(data);
        await saveData('skills', portfolioData.skills);
    } else if (currentModalType === 'experience') {
        if (!portfolioData.experience) portfolioData.experience = { work: [], edu: [] };
        portfolioData.experience[currentModalSubtype].push(data);
        await saveData('experience', portfolioData.experience);
    } else if (currentModalType === 'portfolio') {
        if (!portfolioData.projects) portfolioData.projects = [];
        portfolioData.projects.push(data);
        await saveData('projects', portfolioData.projects);
    }

    closeModal();
    renderLists();
};

async function deleteItem(field, index) {
    if (confirm("Are you sure you want to delete this?")) {
        portfolioData[field].splice(index, 1);
        await saveData(field, portfolioData[field]);
        renderLists();
    }
}

async function deleteExperience(subtype, index) {
    if (confirm("Are you sure?")) {
        portfolioData.experience[subtype].splice(index, 1);
        await saveData('experience', portfolioData.experience);
        renderLists();
    }
}

// --- INITIALIZATION ---
// No longer needed as loadAllData handles defaults through getDefaultData()

