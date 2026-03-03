// Assuming appData is available globally from script.js, which is loaded before admin.js

window.toggleAdminPanel = function () {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('adminOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
};

function showAdminNotification() {
    const notif = document.getElementById('admin-notif');
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
}

// Convert image file to base64 with resizing
function getAdminBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const imgEl = new Image();
        imgEl.onload = function () {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800; // Resize to fit typical max width needed
            let width = imgEl.width;
            let height = imgEl.height;

            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(imgEl, 0, 0, width, height);

            // Compress nicely to reduce Firebase load
            const compressedB64 = canvas.toDataURL('image/jpeg', 0.8);
            callback(compressedB64);
        };
        imgEl.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function previewAdminImage(input, previewId) {
    if (input.files && input.files[0]) {
        getAdminBase64(input.files[0], (base64) => {
            const imgEl = document.getElementById(previewId);
            imgEl.src = base64;
            imgEl.dataset.base64 = base64;
        });
    }
}

// Save back to Firebase and trigger public re-render
window.diagnoseFirebase = function () {
    if (typeof db !== 'undefined') {
        console.log("Running Firebase Diagnostics...");
        db.ref('.info/connected').once('value').then((snap) => {
            console.log("Is Connected to Firebase servers?", snap.val());
            if (snap.val() === true) {
                // Try writing a tiny test string to see if rules allow it
                const testRef = db.ref('babuPremiumData_TestWrite');
                testRef.set("test_write_123")
                    .then(() => {
                        console.log("✅ SUCCESS: You have WRITE permissions to the database.");
                        alert("✅ SUCCESS: You have WRITE permissions to the database.");
                        testRef.remove(); // Clean up
                    })
                    .catch((error) => {
                        console.error("❌ FAILED: Write permission denied.");
                        console.error("Firebase Error Details:", error);
                        alert("Firebase Security Rules are blocking writes! Please check your Realtime Database Rules.");
                    });
            } else {
                alert("Firebase connection failed completely.");
            }
        });
    } else {
        alert("Firebase is not initialized.");
    }
};

function saveAdminToDB() {
    if (typeof db !== 'undefined') {
        const payloadSize = JSON.stringify(appData).length;
        console.log(`Attempting to save payload of size: ${(payloadSize / 1024 / 1024).toFixed(2)} MB`);

        db.ref('babuPremiumData').set(appData)
            .then(() => {
                showAdminNotification();
                console.log("Firebase Save Successful.");
            })
            .catch((error) => {
                alert("Firebase Save Error! The data might be too large. Check console.");
                console.error("Firebase Details:", error);
            });
    } else {
        alert("Firebase is not connected!");
    }
}

/* ================== General TEXTS ================== */
function loadAdminTexts() {
    // Texts
    if (!appData) return;
    document.getElementById('admin_statClients').value = appData.texts.statClients || '';
    document.getElementById('admin_statRate').value = appData.texts.statRate || '';
    document.getElementById('admin_ownerStory').value = appData.texts.ownerStory || '';
}

window.saveAdminTexts = function () {
    appData.texts.statClients = document.getElementById('admin_statClients').value;
    appData.texts.statRate = document.getElementById('admin_statRate').value;
    appData.texts.ownerStory = document.getElementById('admin_ownerStory').value;
    saveAdminToDB();
};

/* ================== CORE IMAGES ================== */
window.handleDirectImageUpload = function (input, targetImageKey) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const originalB64 = e.target.result;

            // Create an image to resize
            const imgEl = new Image();
            imgEl.onload = function () {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; // Resize to fit typical max width needed
                const scaleSize = MAX_WIDTH / imgEl.width;
                canvas.width = MAX_WIDTH;
                canvas.height = imgEl.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);

                // Compress nicely to reduce Firebase load
                const compressedB64 = canvas.toDataURL('image/jpeg', 0.8);

                // 1. Immediately reflect visual change in Admin window
                if (targetImageKey === 'heroBg') {
                    document.getElementById('hero-background-img').src = compressedB64;
                } else if (targetImageKey === 'ownerImg') {
                    document.getElementById('owner-img').src = compressedB64;
                }

                // 2. Save directly to Firebase Database
                appData.images[targetImageKey] = compressedB64;
                saveAdminToDB();

                // 3. Reset file input
                input.value = "";
            };
            imgEl.src = originalB64;
        }

        reader.readAsDataURL(file);
    }
};

/* ================== PRODUCTS ================== */
window.loadAdminProducts = function () {
    const cat = document.getElementById('prodCategorySelect').value;
    const tbody = document.querySelector('#adminProductsTable tbody');
    tbody.innerHTML = '';

    if (appData.collections[cat]) {
        appData.collections[cat].forEach((prod, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${prod.img}"></td>
                <td>${prod.title}</td>
                <td>${prod.price || ''}</td>
                <td style="white-space:nowrap;">
                    <button class="admin-edit-btn" onclick="editAdminProduct('${cat}', ${index})"><i class="fas fa-edit"></i></button>
                    <button class="admin-btn-danger" onclick="deleteAdminProduct('${cat}', ${index})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
};

window.addNewAdminProduct = function () {
    const cat = document.getElementById('prodCategorySelect').value;
    const title = document.getElementById('newProdTitle').value;
    const desc = document.getElementById('newProdDesc').value;
    const price = document.getElementById('newProdPrice').value;
    const b64 = document.getElementById('newProdImg').dataset.base64;
    const editIndex = parseInt(document.getElementById('editProdIndex').value, 10);

    if (!title || !b64) {
        alert("Please provide a Title and an Image.");
        return;
    }

    if (!appData.collections[cat]) appData.collections[cat] = [];

    if (editIndex > -1) {
        // Edit existing
        appData.collections[cat][editIndex].title = title;
        appData.collections[cat][editIndex].desc = desc;
        appData.collections[cat][editIndex].price = price;
        appData.collections[cat][editIndex].img = b64;
    } else {
        // Add new
        appData.collections[cat].push({
            id: Date.now(),
            title: title,
            desc: desc,
            price: price,
            img: b64
        });
    }

    saveAdminToDB();
    loadAdminProducts();
    resetAdminProductForm();
};

window.editAdminProduct = function (cat, index) {
    const prod = appData.collections[cat][index];
    document.getElementById('editProdIndex').value = index;
    document.getElementById('newProdTitle').value = prod.title;
    document.getElementById('newProdDesc').value = prod.desc || '';
    document.getElementById('newProdPrice').value = prod.price || '';

    const imgEl = document.getElementById('newProdImg');
    imgEl.src = prod.img;
    imgEl.dataset.base64 = prod.img;

    document.getElementById('saveProductBtn').innerHTML = '<i class="fas fa-save"></i> Update Product';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
};

window.resetAdminProductForm = function () {
    document.getElementById('editProdIndex').value = -1;
    document.getElementById('newProdTitle').value = '';
    document.getElementById('newProdDesc').value = '';
    document.getElementById('newProdPrice').value = '';
    document.getElementById('newProdImg').src = '';
    document.getElementById('newProdImg').dataset.base64 = '';
    document.getElementById('newProdFile').value = '';

    document.getElementById('saveProductBtn').innerHTML = '<i class="fas fa-plus"></i> Add Product';
    document.getElementById('cancelEditBtn').style.display = 'none';
};

window.deleteAdminProduct = function (cat, index) {
    if (confirm("Are you sure you want to delete this product?")) {
        appData.collections[cat].splice(index, 1);
        saveAdminToDB();
        loadAdminProducts();
    }
};

/* ================== REVIEWS ================== */
window.loadAdminReviews = function () {
    const tbody = document.querySelector('#adminReviewsTable tbody');
    tbody.innerHTML = '';

    appData.reviews.forEach((r, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.name}</td>
            <td><button class="admin-btn-danger" onclick="deleteAdminReview(${index})"><i class="fas fa-trash"></i></button></td>
        `;
        tbody.appendChild(tr);
    });
};

window.addAdminReview = function () {
    const name = document.getElementById('newRevName').value;
    const text = document.getElementById('newRevText').value;

    if (!name || !text) { alert("Fill all fields"); return; }

    appData.reviews.push({ name: name, text: text });
    saveAdminToDB();
    loadAdminReviews();

    // Also re-init swiper to pick up new review if needed
    if (typeof renderData === 'function') renderData();

    document.getElementById('newRevName').value = '';
    document.getElementById('newRevText').value = '';
};

window.deleteAdminReview = function (index) {
    if (confirm("Delete this review?")) {
        appData.reviews.splice(index, 1);
        saveAdminToDB();
        loadAdminReviews();
        if (typeof renderData === 'function') renderData();
    }
};

/* ================== ORDERS MANAGEMENT ================== */
window.loadAdminOrders = function () {
    if (typeof db === 'undefined') return;

    const tbody = document.querySelector('#adminOrdersTable tbody');

    db.ref('babuPremiumOrders').on('value', (snapshot) => {
        tbody.innerHTML = '';

        if (!snapshot.exists()) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No orders found.</td></tr>';
            return;
        }

        const orders = snapshot.val();
        // Convert to array and sort by date descending
        const ordersArray = Object.keys(orders).map(key => ({
            id: key,
            ...orders[key]
        })).sort((a, b) => new Date(b.date) - new Date(a.date));

        ordersArray.forEach(order => {
            const tr = document.createElement('tr');

            // Format Date
            const d = new Date(order.date);
            const dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Status Badge
            let statusColor = '#3498db'; // Processing/Blue
            if (order.status === 'Pending') statusColor = '#f1c40f'; // Yellow
            if (order.status === 'Completed') statusColor = '#2ecc71'; // Green
            if (order.status === 'Cancelled') statusColor = '#e74c3c'; // Red

            const statusBadge = `<span style="background:${statusColor}; color:${statusColor === '#f1c40f' ? '#000' : '#fff'}; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">${order.status}</span>`;

            tr.innerHTML = `
                <td style="font-size: 0.8rem;">${dateStr}</td>
                <td>
                    <strong>${order.customer.name}</strong><br>
                    <span style="font-size: 0.8rem; color:#aaa;">${order.customer.phone}</span>
                </td>
                <td class="text-gold">Rs. ${order.total.toLocaleString()}</td>
                <td>${statusBadge}</td>
                <td style="white-space:nowrap;">
                    <button class="admin-btn" style="padding: 5px 10px; font-size: 0.8rem;" onclick="viewOrderDetails('${order.id}')"><i class="fas fa-eye"></i> View</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
};

window.viewOrderDetails = function (orderId) {
    db.ref('babuPremiumOrders/' + orderId).once('value').then((snap) => {
        const order = snap.val();
        if (!order) return;

        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `- ${item.qty}x ${item.title} (Rs. ${(item.price * item.qty).toLocaleString()})\n`;
        });

        const details = `
ORDER DETAILS:
-----------------------
Status: ${order.status}
Date: ${new Date(order.date).toLocaleString()}
Payment Method: ${order.paymentMethod || 'N/A'}

CUSTOMER:
Name: ${order.customer.name}
Phone: ${order.customer.phone}
Address: ${order.customer.address}, ${order.customer.city}

ITEMS:
${itemsHtml}
Subtotal: Rs. ${order.subtotal.toLocaleString()}
Discount Applied: ${order.discountPercent || 0}%
Total to Pay: Rs. ${order.total.toLocaleString()}
        `;

        // Very basic simple view + action for now via prompt/alert
        alert(details);

        const newStatus = prompt("Update Status (Type: Pending, Processing, Completed, or Cancelled):", order.status);
        if (newStatus && ['Pending', 'Processing', 'Completed', 'Cancelled'].includes(newStatus)) {
            db.ref('babuPremiumOrders/' + orderId).update({ status: newStatus })
                .then(() => alert("Status updated successfully!"))
                .catch(err => alert("Failed to update status."));
        }
    });
};

// Initialize Admin UI
document.addEventListener('DOMContentLoaded', () => {
    // Slight delay to ensure script.js has loaded appData
    setTimeout(() => {
        loadAdminTexts();
        loadAdminProducts();
        loadAdminReviews();
        loadAdminOrders();
    }, 200);
});
