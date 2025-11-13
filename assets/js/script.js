// Cursor follower dots
let cursorDots = [];
let mouseX = 0;
let mouseY = 0;
let dotPositions = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];

// Create 3 dots
function createCursorDots() {
    const body = document.body;
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        dot.setAttribute('data-index', i);
        body.appendChild(dot);
        cursorDots.push(dot);
        dotPositions[i] = { x: 0, y: 0 };
    }
}

// Store previous mouse position for trailing effect
let prevMouseX = window.innerWidth / 2;
let prevMouseY = window.innerHeight / 2;
let mouseVelocityX = 0;
let mouseVelocityY = 0;
let isInitialized = false;

// Update dot positions with easing - trailing behind cursor
function updateCursorDots() {
    // Initialize on first frame
    if (!isInitialized) {
        prevMouseX = mouseX || window.innerWidth / 2;
        prevMouseY = mouseY || window.innerHeight / 2;
        isInitialized = true;
    }
    
    // Calculate velocity for trailing effect (with smoothing)
    const newVelocityX = mouseX - prevMouseX;
    const newVelocityY = mouseY - prevMouseY;
    mouseVelocityX = mouseVelocityX * 0.7 + newVelocityX * 0.3; // Smooth velocity
    mouseVelocityY = mouseVelocityY * 0.7 + newVelocityY * 0.3;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    
    cursorDots.forEach((dot, index) => {
        // Slower speeds so dots trail behind more clearly
        const speed = 0.07 + (index * 0.03); // Progressively slower for each dot
        dotPositions[index].x += (mouseX - dotPositions[index].x) * speed;
        dotPositions[index].y += (mouseY - dotPositions[index].y) * speed;
        
        // Offset dots backward relative to movement direction (creates trailing effect)
        const offsetX = -mouseVelocityX * (index + 1) * 2;
        const offsetY = -mouseVelocityY * (index + 1) * 2;
        
        dot.style.left = (dotPositions[index].x + offsetX) + 'px';
        dot.style.top = (dotPositions[index].y + offsetY) + 'px';
    });
    requestAnimationFrame(updateCursorDots);
}

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Show dots when mouse moves
    cursorDots.forEach(dot => {
        dot.classList.add('visible');
    });
});

// Hide dots when mouse leaves window
document.addEventListener('mouseleave', () => {
    cursorDots.forEach(dot => {
        dot.classList.remove('visible');
    });
});

// Show dots when mouse enters window
document.addEventListener('mouseenter', () => {
    cursorDots.forEach(dot => {
        dot.classList.add('visible');
    });
});

// Initialize cursor dots
createCursorDots();
updateCursorDots();

$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        // Navbar transparency on scroll
        if (window.scrollY > 50) {
            $('header').addClass('navbar-transparent');
        } else {
            $('header').removeClass('navbar-transparent');
        }

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').not('[href*="drive.google.com"]').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        // Don't prevent default for resume link or external links
        if ($(this).attr('href').includes('drive.google.com') || $(this).attr('href').startsWith('http')) {
            return;
        }
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // Handle resume link - open in new tab
    $('a[href*="drive.google.com"]').not('.download-cert').on('click', function (e) {
        // Let the default target="_blank" behavior handle opening in new tab
        // No need to prevent default or trigger download
    });

    // Handle certificate download buttons
    $('.download-cert').on('click', function (e) {
        e.preventDefault();
        const downloadUrl = $(this).attr('href');
        const filename = $(this).data('filename') || 'certificate.pdf';
        
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // <!-- emailjs to mail contact form data -->
    // IMPORTANT: Configure EmailJS to send emails to vaibhavsrivastava2307@gmail.com
    // Steps:
    // 1. Sign up at https://www.emailjs.com/
    // 2. Create an Email Service (Gmail, Outlook, etc.)
    // 3. Create an Email Template with your email as the recipient
    // 4. Get your Public Key, Service ID, and Template ID
    // 5. Update the values below:
    
    const EMAILJS_PUBLIC_KEY = "x0CijDInwJp9ppRlM"; // Get from EmailJS dashboard > Account > API Keys
    const EMAILJS_SERVICE_ID = "service_pugb8mo"; // Get from EmailJS dashboard > Email Services
    const EMAILJS_TEMPLATE_ID = "template_fbp0415"; // Get from EmailJS dashboard > Email Templates
    
    // Initialize EmailJS once when page loads
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    $("#contact-form").submit(function (event) {
        event.preventDefault();
        
        // Get form data
        const formData = {
            from_name: $('input[name="name"]').val(),
            from_email: $('input[name="email"]').val(),
            phone: $('select[name="countryCode"]').val() + ' ' + $('input[name="phone"]').val(),
            message: "hello " + $('textarea[name="message"]').val(), // Format: "hello" + message
            to_email: "vaibhavsrivastava2307@gmail.com"
        };

        // Send form data via EmailJS
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                alert("Message sent successfully! I'll get back to you soon.");
            }, function (error) {
                console.log('FAILED...', error);
                console.error('EmailJS Error Details:', error);
                alert("Failed to send message. Please try again or contact me directly at vaibhavsrivastava2307@gmail.com");
            });
    });
    // <!-- emailjs to mail contact form data -->

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Vaibhav Srivastava";
            $("#favicon").attr("href", "assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });


// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["frontend development", "backend development", "web designing", "android development", "web development"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});
// <!-- typed js effect ends -->

async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json")
        :
        response = await fetch("./projects/projects.json")
    const data = await response.json();
    return data;
}

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`
    });
    skillsContainer.innerHTML = skillHTML;
}

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    
    // Filter out android projects and find specific projects
    const nonAndroidProjects = projects.filter(project => project.category != "android");
    
    // Find ResumeGen
    const resumeGen = nonAndroidProjects.find(project => project.name === "ResumeGen" || project.name.toLowerCase().includes("resume"));
    
    // Get 2 more projects (excluding ResumeGen if found)
    const otherProjects = nonAndroidProjects
        .filter(project => project.name !== "ResumeGen" && !project.name.toLowerCase().includes("resume"))
        .slice(0, 2);
    
    // Combine: ResumeGen first, then 2 others
    const selectedProjects = resumeGen ? [resumeGen, ...otherProjects] : otherProjects.slice(0, 3);
    
    selectedProjects.forEach(project => {
        projectHTML += `
        <div class="box tilt">
      <img draggable="false" src="/assets/images/projects/${project.image}.png" alt="project" />
      <div class="content">
        <div class="tag">
        <h3>${project.name}</h3>
        </div>
        <div class="desc">
          <p>${project.desc}</p>
          <div class="btns">
            <a href="${project.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>
            <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>
          </div>
        </div>
      </div>
    </div>`
    });
    projectsContainer.innerHTML = projectHTML;

    // <!-- tilt js effect starts -->
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
    // <!-- tilt js effect ends -->

    /* ===== SCROLL REVEAL ANIMATION ===== */
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });

    /* SCROLL PROJECTS */
    srtop.reveal('.work .box', { interval: 200 });

}

fetchData().then(data => {
    showSkills(data);
});

// Projects are now hardcoded in HTML, so we don't need to fetch and display them dynamically
// fetchData("projects").then(data => {
//     showProjects(data);
// });

// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});
// <!-- tilt js effect ends -->


// pre loader start - optimized for faster loading
const startTime = Date.now();
const minDisplayTime = 2000; // 1.5 seconds display time

function loader() {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
    
    setTimeout(() => {
        const loaderContainer = document.querySelector('.loader-container');
        if (loaderContainer) {
            loaderContainer.classList.add('fade-out');
            // Remove from DOM after animation completes
            setTimeout(() => {
                loaderContainer.style.display = 'none';
            }, 400); // Reduced animation time
        }
    }, remainingTime);
}
function fadeOut() {
    // Check if page is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        loader();
    } else {
        // Use DOMContentLoaded for faster initial render
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loader);
        }
        // Fallback to load event
        window.addEventListener('load', loader);
    }
}
fadeOut();
// pre loader end

// disable developer mode
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}

// Start of Tawk.to Live Chat - COMMENTED OUT FOR NOW
// IMPORTANT: Replace YOUR_PROPERTY_ID and YOUR_WIDGET_ID with your own Tawk.to credentials
// Steps to get your IDs:
// 1. Sign up at https://www.tawk.to/
// 2. Create a new property/website
// 3. Go to Administration > Channels > Chat Widget
// 4. Copy your Property ID and Widget ID from the embed code
// 5. Replace the values below in the format: YOUR_PROPERTY_ID/YOUR_WIDGET_ID

/*
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();
*/
// End of Tawk.to Live Chat - COMMENTED OUT FOR NOW


/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL HOME */
srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });

srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .linkedin', { interval: 600 });
srtop.reveal('.home .github', { interval: 800 });
srtop.reveal('.home .twitter', { interval: 1000 });
srtop.reveal('.home .telegram', { interval: 600 });
srtop.reveal('.home .instagram', { interval: 600 });
srtop.reveal('.home .dev', { interval: 600 });

/* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });


/* SCROLL SKILLS */
srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skills .container .bar', { delay: 400 });

/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });

/* SCROLL PROJECTS */
srtop.reveal('.work .box', { interval: 200 });

/* SCROLL CERTIFICATES */
srtop.reveal('.certificates .box', { interval: 200 });

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });