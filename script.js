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
        { name: "Ahmed Khan", date: "February 28, 2026", text: "Got my sherwani from Babu Collection. The fitting, the intricate detail, and the premium fabric exceeded my expectations. Amjad bhai truly knows his craft." },
        { name: "Fatima Ali", date: "March 01, 2026", text: "The crimson bridal lehnga was breathtaking. Everything from the heavy stone work to the majestic fall of the fabric was perfect. Highly recommended for any bride to be!" },
        { name: "Usman Tariq", date: "March 02, 2026", text: "I ordered a bespoke Prince Coat and it was delivered flawlessly. The dark blue fabric with silver accents turned heads everywhere. Excellent customer service as well." }
    ],
    businessHours: {
        monday: "11:00 AM - 10:00 PM",
        tuesday: "11:00 AM - 10:00 PM",
        wednesday: "11:00 AM - 10:00 PM",
        thursday: "11:00 AM - 10:00 PM",
        friday: "03:00 PM - 11:00 PM",
        saturday: "11:00 AM - 11:00 PM",
        sunday: "11:00 AM - 11:00 PM"
    },
    faqs: {
        shop: [
            { q: "Do you offer Wood furniture customization?", a: "While our primary focus is luxury fashion, our parent company Sapna Furniture handles all premium wood furniture customization." },
            { q: "Do you offer Home delivery for dresses?", a: "Yes, we offer secure home delivery across Pakistan and international shipping options." },
            { q: "When is your next big sale?", a: "We typically have seasonal sales during Eid and the wedding season. Sign up for our newsletter to get notified." }
        ],
        support: [
            { q: "How can I track my order?", a: "Once your bespoke order is dispatched, you will receive a tracking link via email and WhatsApp." },
            { q: "What is your return policy?", a: "Since all items are custom-made to your measurements, we do not offer returns. However, we provide free alterations within 7 days of delivery." },
            { q: "How can I contact the Help Center?", a: "You can reach us 24/7 via WhatsApp at +92 332 5158303 or email us at info@babucollection.pk." }
        ],
        legal: [
            { q: "Terms and Services", a: "Our terms and services outline the agreement between you and Babu Collection for bespoke fashion tailored specifically for you. By placing an order, you agree to our standard non-refundable deposit terms." },
            { q: "Privacy Policy", a: "We value your privacy. Your personal details, measurements, and payment information are encrypted and never shared with third parties." },
            { q: "Cookies Policy", a: "We use essential cookies to ensure our website functions correctly and to save your theme preferences." }
        ]
    }
};

// Application State
const firebaseConfig = {
    apiKey: "AIzaSyBz-PJMfwHhaze5wovyat0aUAJ1p83mBnM",
    authDomain: "babu-collection-8abd1.firebaseapp.com",
    databaseURL: "https://babu-collection-8abd1-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "babu-collection-8abd1",
    storageBucket: "babu-collection-8abd1.firebasestorage.app",
    messagingSenderId: "622436087584",
    appId: "1:622436087584:web:0e10be1f3cd8331a8f4945"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let appData = defaultData;

// Cart State
let cart = JSON.parse(localStorage.getItem('babu-cart')) || [];
let currentDiscount = 0; // percentage

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

    // Render Business Hours
    renderBusinessHours();

    // Render Categorized FAQs
    renderFAQs();

    // Render Collections
    const categories = ['sherwani', 'princecoat', 'threepiece', 'waistcoat', 'bridal'];
    categories.forEach(cat => renderCategory(cat));

    // Render Reviews
    renderReviews();
}

function renderBusinessHours() {
    const hoursContainer = document.getElementById('business-hours-container');
    if (!hoursContainer) return;

    let html = '';
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
        const hours = appData.businessHours[day];
        html += `
            <div class="hours-row">
                <span class="day">${day.charAt(0).toUpperCase() + day.slice(1)}</span>
                <span class="time">${hours}</span>
            </div>
        `;
    });
    hoursContainer.innerHTML = html;
}

function renderFAQs() {
    ['shop', 'support', 'legal'].forEach(category => {
        const container = document.getElementById(`faq-list-${category}`);
        if (!container) return;

        let html = '';
        appData.faqs[category].forEach(item => {
            html += `
                <div class="faq-item">
                    <div class="faq-question">${item.q} <i class="fas fa-chevron-down"></i></div>
                    <div class="faq-answer">${item.a}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    });

    // Re-initialize FAQ toggle events for newly rendered elements
    initFAQ();
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
                <button class="btn-primary" style="width: 100%; border-radius: 4px; padding: 10px; margin-top: 10px; margin-bottom: 5px; font-size: 0.9rem;" onclick="addToCart('${item.title}', '${item.price}', '${item.img}')">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <a href="${waLink}" target="_blank" class="wa-order-btn" style="margin-top: 5px;">
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
        const dateHtml = review.date ? `<span class="review-date">${review.date}</span>` : '';
        slide.innerHTML = `
            <div class="review-slide-card">
                <i class="fas fa-quote-left"></i>
                ${dateHtml}
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

/* ====== 4. Theme & Firebase Auth ====== */

function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const icon = document.getElementById('theme-icon');

    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('babu-theme') || 'dark';

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (icon) icon.className = 'fas fa-sun';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            let theme = 'dark';
            if (document.body.classList.contains('light-theme')) {
                theme = 'light';
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
            localStorage.setItem('babu-theme', theme);
        });
    }
}

function initAuth() {
    const authBtnText = document.getElementById('auth-btn-text');
    const authBtn = document.getElementById('auth-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');

    // Listen to Auth State changes
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            if (authBtnText) authBtnText.innerText = "Profile / Logout";
            if (authBtn) {
                authBtn.onclick = () => {
                    const confirmLogout = confirm(`Logged in as ${user.email}. Do you want to logout?`);
                    if (confirmLogout) {
                        firebase.auth().signOut().then(() => alert('Logged out successfully.')).catch(e => alert(e.message));
                    }
                };
            }
        } else {
            // User is signed out
            if (authBtnText) authBtnText.innerText = "Login / Sign Up";
            if (authBtn) {
                authBtn.onclick = () => {
                    loginModal.classList.add('active');
                };
            }
        }
    });

    // Close Modals Setup
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.auth-modal').classList.remove('active');
        });
    });

    // Switch between Login and Signup
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');

    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('active');
            signupModal.classList.add('active');
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.classList.remove('active');
            loginModal.classList.add('active');
        });
    }

    // Handle Forms
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    alert('Login successful!');
                    loginModal.classList.remove('active');
                    loginForm.reset();
                })
                .catch((error) => alert('Login Error: ' + error.message));
        });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = signupForm.email.value;
            const password = signupForm.password.value;
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    alert('Registration successful!');
                    signupModal.classList.remove('active');
                    signupForm.reset();
                })
                .catch((error) => alert('Registration Error: ' + error.message));
        });
    }
}

/* ====== 5. Cart & Checkout ====== */

function initCart() {
    updateCartUI();

    const cartBtn = document.getElementById('cart-btn');
    const cartDropdown = document.getElementById('cart-dropdown');

    if (cartBtn && cartDropdown) {
        cartBtn.addEventListener('click', () => {
            cartDropdown.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cart-wrapper')) {
                cartDropdown.classList.remove('active');
            }
        });
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutBtn && checkoutModal) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }
            cartDropdown.classList.remove('active');
            renderCheckoutSummary();
            checkoutModal.classList.add('active');
        });
    }

    // Checkout Logic
    const applyDiscountBtn = document.getElementById('apply-discount-btn');
    if (applyDiscountBtn) {
        applyDiscountBtn.addEventListener('click', () => {
            const code = document.getElementById('chk-discount').value.trim().toUpperCase();
            if (code === 'BABU10') {
                currentDiscount = 10;
                alert('10% Discount Applied!');
            } else {
                currentDiscount = 0;
                alert('Invalid or expired code.');
            }
            renderCheckoutSummary();
        });
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            processCheckout();
        });
    }
}

window.addToCart = function (title, priceStr, img) {
    // Basic extraction of number from "Rs. 45,000"
    const priceNum = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;

    const existing = cart.find(i => i.title === title);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ title, price: priceNum, priceStr, img, qty: 1 });
    }

    saveCart();
    updateCartUI();
    document.getElementById('cart-dropdown').classList.add('active');
    setTimeout(() => document.getElementById('cart-dropdown').classList.remove('active'), 2500);
};

window.removeFromCart = function (index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    renderCheckoutSummary();
};

function saveCart() {
    localStorage.setItem('babu-cart', JSON.stringify(cart));
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');

    if (!badge || !container) return;

    let totalQty = 0;
    let totalPrice = 0;
    let html = '';

    cart.forEach((item, index) => {
        totalQty += item.qty;
        totalPrice += (item.price * item.qty);
        html += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.priceStr} (x${item.qty})</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">&times;</button>
            </div>
        `;
    });

    if (cart.length === 0) {
        html = '<p style="color:var(--text-muted); text-align:center; padding: 20px 0;">Cart is empty.</p>';
    }

    badge.innerText = totalQty;
    container.innerHTML = html;
    totalEl.innerText = 'Rs. ' + totalPrice.toLocaleString();
}

function renderCheckoutSummary() {
    const container = document.getElementById('checkout-summary-items');
    const totalEl = document.getElementById('chk-final-total');
    if (!container || !totalEl) return;

    let html = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        html += `
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.95rem;">
                <span>${item.qty}x ${item.title}</span>
                <span class="text-gold">Rs. ${itemTotal.toLocaleString()}</span>
            </div>
        `;
    });

    let discountAmount = 0;
    if (currentDiscount > 0) {
        discountAmount = subtotal * (currentDiscount / 100);
        html += `
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.95rem; color:#2ecc71;">
                <span>Discount (${currentDiscount}%)</span>
                <span>- Rs. ${discountAmount.toLocaleString()}</span>
            </div>
        `;
    }

    const total = subtotal - discountAmount;
    container.innerHTML = html;
    totalEl.innerText = 'Rs. ' + total.toLocaleString();
}

function processCheckout() {
    if (cart.length === 0) return;

    const name = document.getElementById('chk-name').value;
    const phone = document.getElementById('chk-phone').value;
    const address = document.getElementById('chk-address').value;
    const city = document.getElementById('chk-city').value;

    let subtotal = 0;
    let itemsStr = '';
    cart.forEach(item => {
        subtotal += item.price * item.qty;
        itemsStr += `- ${item.qty}x ${item.title} (Rs. ${(item.price * item.qty).toLocaleString()})\n`;
    });

    const discountAmount = subtotal * (currentDiscount / 100);
    const total = subtotal - discountAmount;

    // 1. Save to Firebase
    const orderData = {
        date: new Date().toISOString(),
        status: 'Pending',
        customer: { name, phone, address, city },
        items: cart,
        subtotal: subtotal,
        discountPercent: currentDiscount,
        total: total,
        paymentMethod: 'JazzCash'
    };

    db.ref('babuPremiumOrders').push(orderData)
        .then(() => {
            // 2. Format WhatsApp Message
            const waPhone = "923325158303";
            let msg = `*NEW ORDER - Babu Collection*\n\n`;
            msg += `*Name:* ${name}\n`;
            msg += `*Phone:* ${phone}\n`;
            msg += `*Address:* ${address}, ${city}\n\n`;
            msg += `*Items:*\n${itemsStr}\n`;
            if (currentDiscount > 0) msg += `*Discount:* ${currentDiscount}%\n`;
            msg += `*Total Amount:* Rs. ${total.toLocaleString()}\n`;
            msg += `*Payment Method:* JazzCash Transfer (Pending)\n\n`;
            msg += `Please confirm my order details.`;

            const waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;

            // Clear cart
            cart = [];
            currentDiscount = 0;
            saveCart();
            updateCartUI();

            document.getElementById('checkout-modal').classList.remove('active');

            // Redirect to WhatsApp
            window.open(waLink, '_blank');
        })
        .catch(err => alert("Error processing order: " + err.message));
}

// Init everything
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();

    renderData();
    initTabs();
    initCursor();
    runCounters();
    initTheme();
    initAuth();
    initCart();
    // initFAQ is called after data is rendered in renderFAQs

    // FAQ Category Tabs Logic
    const faqTabs = document.querySelectorAll('.faq-cat-btn');
    if (faqTabs.length > 0) {
        faqTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                faqTabs.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.faq-category-content').forEach(c => c.style.display = 'none');

                btn.classList.add('active');
                document.getElementById('faq-' + btn.getAttribute('data-cat')).style.display = 'block';
            });
        });
    }

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
