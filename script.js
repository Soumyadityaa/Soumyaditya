// --- THEME TOGGLE LOGIC ---
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'light');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
});

// --- SCROLL ANIMATIONS (Intersection Observer) ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((elem) => {
    observer.observe(elem);
});

// --- GOOGLE SHEETS CONTACT FORM LOGIC ---
/*
====================================================================
GOOGLE SHEETS INTEGRATION INSTRUCTIONS (Using Google Apps Script)
====================================================================
1. Open Google Sheets and create a new blank spreadsheet.
2. Add these exact column headers in Row 1: Timestamp | Name | Email | Message
3. Click on "Extensions" in the top menu -> "Apps Script".
4. Delete any code in the editor and paste the following snippet:

    function doPost(e) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var newRow = [
        new Date(),
        e.parameter.name,
        e.parameter.email,
        e.parameter.message
      ];
      sheet.appendRow(newRow);
      return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
    }

5. Click "Deploy" (top right) -> "New deployment".
6. Select type: "Web app".
7. Description: "Contact Form", Execute as: "Me", Who has access: "Anyone".
8. Click "Deploy" (authorize permissions if prompted).
9. Copy the generated "Web app URL" and paste it into the 'scriptURL' variable below!
====================================================================
*/

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
const scriptURL = 'https://script.google.com/macros/s/AKfycbwoeod9V7uJVgsbwODA_xfUqrQwHB1q8JZpmPrkQIUKjQv5hrHQoCKjwHeOfKTJp3KJ/exec';

contactForm.addEventListener('submit', e => {
    e.preventDefault();
    
    // UI Feedback: Loading state (Preserving inner structure to not break SVG)
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            formStatus.innerHTML = 'Message sent successfully!';
            formStatus.style.color = 'var(--accent-color)';
            contactForm.reset();
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error!', error.message);
            formStatus.innerHTML = 'Failed to send message. Please try again.';
            formStatus.style.color = '#ef4444'; 
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
        });
});


// --- ROBOTICS SKILLS MODAL LOGIC ---
const skillCards = document.querySelectorAll('.skill-card');
const robotModal = document.getElementById('robotics-modal');
const robotModalClose = document.getElementById('robot-modal-close');
const modalCategoryTitle = document.getElementById('modal-category-title');
const modalSkillsList = document.getElementById('modal-skills-list');

skillCards.forEach(card => {
    card.addEventListener('click', () => {
        const category = card.getAttribute('data-category');
        const skillsRaw = card.getAttribute('data-skills');
        const skillsArray = skillsRaw.split(',');

        // Set title
        modalCategoryTitle.textContent = category.toUpperCase();

        // Populate badges with stagger delay
        modalSkillsList.innerHTML = '';
        skillsArray.forEach((skill, index) => {
            const badge = document.createElement('div');
            badge.className = 'robot-skill-badge';
            badge.textContent = skill.trim();
            badge.style.animationDelay = `${index * 0.08}s`;
            modalSkillsList.appendChild(badge);
        });

        // Open modal
        robotModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    });
});

// Close Modal Functions
function closeRobotModal() {
    robotModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

robotModalClose.addEventListener('click', closeRobotModal);

// Close on clicking outside container overlay
robotModal.addEventListener('click', (e) => {
    if (e.target === robotModal) {
        closeRobotModal();
    }
});

// Close on pressing 'Escape' key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && robotModal.classList.contains('active')) {
        closeRobotModal();
    }
});