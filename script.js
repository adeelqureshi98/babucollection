/* ====== 1. Default Data & Initialization ====== */
const defaultData = {
    texts: {
        siteTitle: "Babu Collection",
        heroSubtitle: "Experience True Royalty",
        heroTitle: "Elegance Redefined",
        heroDesc: "Discover our luxurious Groom and Bridal wear, exclusively tailored for your big day.",
        feature1Title: "Luxury Craftsmanship",
        feature1Desc: "Finest materials and utmost attention to detail.",
        feature2Title: "Custom Tailoring",
        feature2Desc: "Bespoke tailoring tailored specifically to your measurements.",
        feature3Title: "Exclusive Designs",
        feature3Desc: "Unique patterns, sophisticated embroidery, and modern cuts.",
        ownerRole: "Founder & CEO",
        ownerName: "Amjad Makki",
        ownerStory: `<p>Established in 2010, Babu Collection began with a simple dream: to redefine elegance and fashion in Pakistan. Starting as a humble boutique, Amjad Makki's dedication to quality craftsmanship and luxurious designs transformed Babu Collection into a premier destination for bridal and groom wear.</p>`,
        textMission: "To make every groom and bride feel like royalty through uncompromising quality and unparalleled bespoke service.",
        textVision: "To bring world-class fashion to our people, preserving our culture while embracing modern luxury.",
        textValues: "Rooted in quality, integrity, customer satisfaction, and a deep respect for our heritage.",
        statYear: "2010",
        statClients: "15000",
        statRate: "99"
    },
    images: {
        heroBg: "images/sherwani.png",
        ownerImg: "images/owner.png"
    },
    collections: {
        sherwani: [
            { id: 1, title: "Royal Golden Sherwani", img: "images/sherwani.png", desc: "Zari intricate details.", price: "Rs. 45,000" },
            { id: 11, title: "Ivory White Pearl Sherwani", img: "images/sherwani_white.png", desc: "Elegant hand embroidery.", price: "Rs. 55,000" }
        ],
        princecoat: [
            { id: 3, title: "Midnight Blue Prince Coat", img: "images/princecoat.png", desc: "Premium bespoke fitting.", price: "Rs. 25,000" }
        ],
        threepiece: [
            { id: 4, title: "Classic 3-Piece Suit", img: "https://images.unsplash.com/photo-1594938298599-f71650b29864?q=80&w=600&auto=format&fit=crop", desc: "Modern corporate elegance.", price: "Rs. 30,000" }
        ],
        waistcoat: [
            { id: 5, title: "Maroon Velvet Waistcoat", img: "images/waistcoat.png", desc: "Traditional dark aesthetic.", price: "Rs. 12,000" }
        ],
        bridal: [
            { id: 2, title: "Crimson Red Lehnga", img: "images/bridal.png", desc: "Heavy zari and stone work.", price: "Rs. 150,000" },
            { id: 21, title: "Emerald Green Lehnga", img: "images/bridal_green.png", desc: "Stunning jewel tones.", price: "Rs. 135,000" }
        ]
    },
    reviews: [
        { name: "Ahmed Khan", text: "Got my sherwani from Babu Collection. The fitting, the intricate detail, and the premium fabric exceeded my expectations. Amjad bhai truly knows his craft." },
        { name: "Fatima Ali", text: "The crimson bridal lehnga was breathtaking. Everything from the heavy stone work to the majestic fall of the fabric was perfect. Highly recommended for any bride to be!" },
        { name: "Usman Tariq", text: "I ordered a bespoke Prince Coat and it was delivered flawlessly. The dark blue fabric with silver accents turned heads everywhere. Excellent customer service as well." }
    ]
};

// Application State
const firebaseConfig = {
    apiKey: "AIzaSyBz-PJMfwHhaze5wovyat0aUAJ1p83mBnM",
    authDomain: "babu-collection-8abd1.firebaseapp.com",
    databaseURL: "https://babu-collection-8abd1-default-rtdb.firebaseio.com",
    projectId: "babu-collection-8abd1",
    storageBucket: "babu-collection-8abd1.firebasestorage.app",
    messagingSenderId: "622436087584",
    appId: "1:622436087584:web:0e10be1f3cd8331a8f4945"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let appData = defaultData;

// Monitor connection state
const connectedRef = db.ref(".info/connected");
connectedRef.on("value", (snap) => {
    if (snap.val() === true) {
        console.log("Firebase is connected natively.");
    } else {
        console.log("Firebase is disconnected natively.");
    }
});

db.ref('babuPremiumData').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        appData = data;
        // Ensure new array keys exist for older cached structures
        if (!appData.reviews || appData.reviews.length === 0) appData.reviews = defaultData.reviews;
    } else {
        // First initialization of firebase data
        appData = defaultData;
        db.ref('babuPremiumData').set(appData);
    }

    // Attempt to re-render if loaded
    renderData();
    if (typeof loadAdminProducts === 'function') {
        loadAdminTexts();
        loadAdminProducts();
        loadAdminReviews();
    }
});

/* ====== 2. Rendering Data ====== */
function renderData() {
    // Setup Texts
    for (const key in appData.texts) {
        const el = document.getElementById(key);
        if (el) {
            if (key === 'ownerStory') el.innerHTML = appData.texts[key];
            else el.innerText = appData.texts[key];
        }
    }

    // Setup Images
    const heroBg = document.getElementById('hero-background-img');
    if (heroBg) heroBg.src = appData.images.heroBg;
    const ownerImg = document.getElementById('owner-img');
    if (ownerImg) ownerImg.src = appData.images.ownerImg;

    // Render Collections
    const categories = ['sherwani', 'princecoat', 'threepiece', 'waistcoat', 'bridal'];
    categories.forEach(cat => renderCategory(cat));

    // Render Reviews
    renderReviews();
}

function renderCategory(cat) {
    const grid = document.getElementById(`grid-${cat}`);
    if (!grid) return;
    grid.innerHTML = '';

    appData.collections[cat].forEach((item) => {
        // WhatsApp Message Format
        const phone = "923325158303";
        const msg = encodeURIComponent(`Hi Babu Collection, I would like to order: ${item.title} (${item.price}). Please share details.`);
        const waLink = `https://wa.me/${phone}?text=${msg}`;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.title}">
            <div class="product-info">
                <h3 class="product-title">${item.title}</h3>
                <p class="product-desc">${item.desc}</p>
                <span class="product-price text-gold">${item.price || ''}</span>
                <a href="${waLink}" target="_blank" class="wa-order-btn">
                    <i class="fab fa-whatsapp"></i> Order on WhatsApp
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderReviews() {
    const wrapper = document.getElementById('reviews-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';

    appData.reviews.forEach(review => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="review-slide-card">
                <i class="fas fa-quote-left"></i>
                <p class="review-text">"${review.text}"</p>
                <h4 class="review-name">- ${review.name}</h4>
            </div>
        `;
        wrapper.appendChild(slide);
    });
}

/* ====== 3. UI Interactions (Tabs, Cursor, FAQ, Counters) ====== */

function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById('tab-' + btn.getAttribute('data-tab')).classList.add('active');
        });
    });
}

function initCursor() {
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    if (window.innerWidth > 768 && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', function (e) {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
        });

        document.querySelectorAll('a, button, .product-card, .tab-btn, .faq-question').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }
}

function runCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / 200;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else counter.innerText = target;
        };

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) { updateCount(); observer.disconnect(); }
        });
        observer.observe(counter);
    });
}

function initFAQ() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(q => {
        q.addEventListener('click', () => {
            const answer = q.nextElementSibling;
            const icon = q.querySelector('i');

            if (answer.classList.contains('open')) {
                answer.classList.remove('open');
                icon.className = 'fas fa-chevron-down';
            } else {
                document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
                document.querySelectorAll('.faq-question i').forEach(i => i.className = 'fas fa-chevron-down');
                answer.classList.add('open');
                icon.className = 'fas fa-chevron-up';
            }
        });
    });
}

// Init everything
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();

    renderData();
    initTabs();
    initCursor();
    runCounters();
    initFAQ();

    // Navbar scroll
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            if (window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        }
    });

    if (typeof AOS !== 'undefined') AOS.init({ once: true, offset: 100 });

    if (typeof Swiper !== 'undefined') {
        new Swiper(".reviewsSwiper", {
            slidesPerView: 1, spaceBetween: 30,
            pagination: { el: ".swiper-pagination", clickable: true },
            breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
            autoplay: { delay: 4000, disableOnInteraction: false }
        });
    }
});
