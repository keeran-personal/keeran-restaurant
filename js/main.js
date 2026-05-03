(function ($) {
    "use strict";

    // ============================================================
    //  SCROLL PROGRESS BAR  +  BTT RING SYNC
    // ============================================================
    const progressBar = document.getElementById('scrollProgress');
    const bttBtn      = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop  = window.scrollY;
        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // top progress bar
        if (progressBar) progressBar.style.width = pct.toFixed(1) + '%';

        // conic-gradient ring on back-to-top button
        if (bttBtn) bttBtn.style.setProperty('--scroll-pct', pct.toFixed(1));
    }, { passive: true });

    // ============================================================
    //  SPINNER
    // ============================================================
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // ============================================================
    //  WOW.JS
    // ============================================================
    new WOW().init();

    // ============================================================
    //  STICKY NAVBAR — always sticky with shadow
    // ============================================================
    $('.navbar').addClass('sticky-top shadow-sm');
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('shadow-sm');
        } else {
            $('.navbar').removeClass('shadow-sm');
        }
    });

    // ============================================================
    //  DROPDOWN HOVER
    // ============================================================
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";

    $(window).on("load resize", function () {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
                function () {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function () {
                    const $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });

    // ============================================================
    //  BACK TO TOP  — bounce-in/out + eased rAF scroll-to-top
    // ============================================================
    (function () {
        if (!bttBtn) return;

        /* always show with bounce-in on page load */
        bttBtn.style.display = 'flex';
        void bttBtn.offsetWidth;          // force reflow
        bttBtn.classList.add('btt-show');

        /* eased scroll-to-top on click (easeOutExpo) */
        bttBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const startY   = window.pageYOffset;
            const duration = Math.max(500, Math.min(startY * 0.45, 1100));
            let startTime  = null;
            function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
            function step(now) {
                if (!startTime) startTime = now;
                const t = Math.min((now - startTime) / duration, 1);
                window.scrollTo(0, startY * (1 - easeOutExpo(t)));
                if (t < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    })();

    // ============================================================
    //  COUNTER UP
    // ============================================================
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });

    // ============================================================
    //  SCROLL REVEAL (custom lightweight)
    // ============================================================
    function initScrollReveal() {
        // Auto-add reveal to sections that don't already have WOW
        document.querySelectorAll('.container-xxl.py-5').forEach((el, i) => {
            if (!el.hasAttribute('data-reveal') && !el.classList.contains('hero-header')) {
                el.setAttribute('data-reveal', 'up');
            }
        });

        const revealEls = document.querySelectorAll('[data-reveal]');
        if (!revealEls.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => observer.observe(el));
    }
    initScrollReveal();

    // ============================================================
    //  SMOOTH SECTION NAV + ACTIVE HIGHLIGHT
    // ============================================================

    /**
     * Custom eased smooth scroll with navbar offset compensation.
     * Uses easeInOutCubic for natural deceleration.
     */
    function smoothScrollTo(targetEl) {
        const navH     = (document.querySelector('.navbar') || {}).offsetHeight || 80;
        const targetY  = targetEl.getBoundingClientRect().top + window.pageYOffset - navH - 8;
        const startY   = window.pageYOffset;
        const dist     = targetY - startY;
        const duration = Math.max(420, Math.min(Math.abs(dist) * 0.42, 1000));
        let startTime  = null;

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function step(now) {
            if (!startTime) startTime = now;
            const t = Math.min((now - startTime) / duration, 1);
            window.scrollTo(0, startY + dist * easeInOutCubic(t));
            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const id     = href.slice(1);
                const target = document.getElementById(id) || document.querySelector(href);
                if (target) {
                    smoothScrollTo(target);
                    // close mobile menu if open
                    const collapse = document.getElementById('navbarCollapse');
                    if (collapse && collapse.classList.contains('show')) {
                        collapse.classList.remove('show');
                    }
                }
            }
        });
    });

    // Active nav on scroll
    const sections = document.querySelectorAll('[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 100;
            if (window.scrollY >= top) current = sec.id;
        });
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href') || '';
            if (href === '#' + current || href.includes(current)) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    // ============================================================
    //  FLOATING ICONS IN HERO
    // ============================================================
    function addFloatingIcons() {
        const hero = document.querySelector('.hero-header');
        if (!hero) return;
        const wrap = document.createElement('div');
        wrap.className = 'floating-icons';
        const icons = ['🍕', '🍔', '🍜', '🍗', '🥗', '🍰', '☕', '🥘'];
        icons.forEach((icon, i) => {
            const span = document.createElement('span');
            span.textContent = icon;
            span.style.cssText = `
                left: ${Math.random() * 100}%;
                animation-duration: ${12 + Math.random() * 10}s;
                animation-delay: ${-Math.random() * 12}s;
                font-size: ${1.5 + Math.random() * 1.5}rem;
            `;
            wrap.appendChild(span);
        });
        hero.appendChild(wrap);
    }
    addFloatingIcons();

    // ============================================================
    //  CART & ORDER SYSTEM
    // ============================================================
    let cart = [];
    let selectedPayment = '';
    let currentOrderId = '';

    function addToCart(name, price, img) {
        const existing = cart.find(i => i.name === name);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name, price, img, qty: 1 });
        }
        updateCartUI();
        showToast(name + ' added to cart!');
        // animate count badge
        const badge = document.getElementById('cartCount');
        if (badge) {
            badge.style.animation = 'none';
            badge.offsetHeight; // reflow
            badge.style.animation = 'cartBounce 0.4s ease';
        }
    }

    function updateCartUI() {
        const count = cart.reduce((s, i) => s + i.qty, 0);
        document.getElementById('cartCount').textContent = count;
        renderCartItems();
    }

    function renderCartItems() {
        const container = document.getElementById('cartItemsContainer');
        const footer = document.getElementById('cartFooter');

        if (cart.length === 0) {
            container.innerHTML = '<div class="text-center text-muted py-5"><i class="fa fa-shopping-cart fa-3x mb-3 d-block" style="opacity:.3"></i>Your cart is empty.<br>Add items from the menu!</div>';
            footer.classList.add('d-none');
            return;
        }
        footer.classList.remove('d-none');
        let html = '';
        let total = 0;
        cart.forEach((item, idx) => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            html += `
            <div class="cart-item-row d-flex align-items-center gap-3">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='img/menu-1.jpg'">
                <div class="flex-grow-1">
                    <div class="small fw-medium">${item.name}</div>
                    <div class="small text-primary fw-bold">₹${item.price} × ${item.qty} = ₹${itemTotal}</div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
                    <span class="small fw-bold">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
                    <button class="qty-btn text-danger" onclick="removeItem(${idx})"><i class="fa fa-trash" style="font-size:11px"></i></button>
                </div>
            </div>`;
        });
        container.innerHTML = html;
        document.getElementById('cartTotal').textContent = '₹' + total;
    }

    function changeQty(idx, delta) {
        cart[idx].qty += delta;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
        updateCartUI();
    }

    function removeItem(idx) {
        cart.splice(idx, 1);
        updateCartUI();
    }

    function openCart() {
        const oc = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
        oc.show();
    }

    // ============================================================
    //  CHECKOUT VALIDATION + STEPS
    // ============================================================
    function openCheckout() {
        const oc = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
        if (oc) oc.hide();
        setTimeout(() => {
            goToStep(1);
            const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
            modal.show();
        }, 300);
    }

    function goToStep(step) {
        [1, 2, 3].forEach(n => {
            document.getElementById('step' + n).classList.remove('active');
            document.getElementById('dot' + n).classList.remove('active');
        });
        document.getElementById('step' + step).classList.add('active');
        document.getElementById('dot' + step).classList.add('active');

        if (step === 2) {
            let summaryHtml = '';
            let total = 0;
            cart.forEach(i => {
                const t = i.price * i.qty;
                total += t;
                summaryHtml += `<div class="d-flex justify-content-between"><span>${i.name} x${i.qty}</span><span class="fw-bold">₹${t}</span></div>`;
            });
            document.getElementById('summaryItems').innerHTML = summaryHtml;
            document.getElementById('summaryTotal').textContent = '₹' + total;
        }
    }

    // Checkout Step 1 → 2 with validation
    window.goToCheckoutStep2 = function () {
        const name = document.getElementById('co_name').value.trim();
        const phone = document.getElementById('co_phone').value.trim();
        const address = document.getElementById('co_address').value.trim();
        const orderType = document.querySelector('input[name="orderType"]:checked').value;

        let valid = true;

        // Name
        if (!name) {
            setFieldError('co_name', 'Full name is required.');
            valid = false;
        } else {
            clearFieldError('co_name');
        }

        // Phone
        if (!phone) {
            setFieldError('co_phone', 'Phone number is required.');
            valid = false;
        } else if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
            setFieldError('co_phone', 'Enter a valid 10-digit mobile number.');
            valid = false;
        } else {
            clearFieldError('co_phone');
        }

        // Address (only for delivery)
        if (orderType === 'Delivery' && !address) {
            setFieldError('co_address', 'Delivery address is required.');
            valid = false;
        } else {
            clearFieldError('co_address');
        }

        if (valid) goToStep(2);
    };

    function setFieldError(id, msg) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.add('is-invalid');
        el.classList.remove('is-valid');
        let fb = el.parentNode.querySelector('.invalid-feedback');
        if (!fb) {
            fb = document.createElement('div');
            fb.className = 'invalid-feedback';
            el.parentNode.appendChild(fb);
        }
        fb.textContent = msg;
    }

    function clearFieldError(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('is-invalid');
        el.classList.add('is-valid');
        const fb = el.parentNode.querySelector('.invalid-feedback');
        if (fb) fb.textContent = '';
    }

    function selectPayment(method) {
        selectedPayment = method;
        ['pay_cod', 'pay_upi', 'pay_card'].forEach(id => document.getElementById(id).classList.remove('selected'));
        document.getElementById('upiDetails').classList.add('d-none');
        document.getElementById('cardDetails').classList.add('d-none');

        if (method === 'Cash on Delivery') {
            document.getElementById('pay_cod').classList.add('selected');
        } else if (method === 'UPI / GPay') {
            document.getElementById('pay_upi').classList.add('selected');
            document.getElementById('upiDetails').classList.remove('d-none');
        } else if (method === 'Card Payment') {
            document.getElementById('pay_card').classList.add('selected');
            document.getElementById('cardDetails').classList.remove('d-none');
        }
    }

    function placeOrder() {
        const name = document.getElementById('co_name').value.trim();
        const phone = document.getElementById('co_phone').value.trim();
        const address = document.getElementById('co_address').value.trim();
        const orderType = document.querySelector('input[name="orderType"]:checked').value;

        if (!name || !phone) { showToast('⚠️ Please check your details.'); goToStep(1); return; }
        if (orderType === 'Delivery' && !address) { showToast('⚠️ Delivery address required.'); goToStep(1); return; }
        if (!selectedPayment) { showToast('⚠️ Please select a payment method.'); return; }

        const orderId = 'KFC' + Date.now().toString().slice(-6);
        currentOrderId = orderId;

        let itemLines = cart.map(i => `  • ${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('\n');
        let total = cart.reduce((s, i) => s + i.price * i.qty, 0);

        const msg =
            `🍽️ *NEW ORDER - Keeran Food Center*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `🔖 *Order ID:* ${orderId}\n` +
            `👤 *Name:* ${name}\n` +
            `📞 *Phone:* ${phone}\n` +
            `📍 *${orderType === 'Delivery' ? 'Address' : 'Type'}:* ${orderType === 'Delivery' ? address : orderType}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `🛒 *Items Ordered:*\n${itemLines}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `💰 *Total: ₹${total}*\n` +
            `💳 *Payment: ${selectedPayment}*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Please confirm this order. Thank you! 🙏`;

        const waURL = `https://wa.me/919789714637?text=${encodeURIComponent(msg)}`;
        document.getElementById('orderIdBadge').textContent = 'Order #' + orderId;
        document.getElementById('waTrackLink').href = waURL;
        window.open(waURL, '_blank');

        goToStep(3);
        startTracking();
    }

    function startTracking() {
        setTimeout(() => {
            document.getElementById('trackStep2').className = 'tracking-step step-done';
            document.getElementById('trackLine2').className = 'tracking-line done-line';
            document.getElementById('trackStep3').className = 'tracking-step step-active';
        }, 5000);
        setTimeout(() => {
            document.getElementById('trackStep3').className = 'tracking-step step-done';
            document.getElementById('trackLine3').className = 'tracking-line done-line';
            document.getElementById('trackStep4').className = 'tracking-step step-active';
        }, 10000);
    }

    function resetCart() {
        cart = [];
        selectedPayment = '';
        updateCartUI();
        goToStep(1);
    }

    // ============================================================
    //  TOAST NOTIFICATION
    // ============================================================
    function showToast(msg) {
        let toast = document.getElementById('cartToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cartToast';
            toast.style.cssText = `
                position:fixed;bottom:180px;right:24px;
                background:var(--dark);color:#fff;
                padding:12px 20px;border-radius:12px;
                z-index:99999;font-size:13px;
                transition:opacity .4s, transform .4s;
                border-left:4px solid var(--primary);
                max-width:240px;font-family:'Poppins',sans-serif;
                box-shadow:0 8px 30px rgba(0,0,0,.3);
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        clearTimeout(toast._t);
        toast._t = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
        }, 2800);
    }

    // ============================================================
    //  BOOKING TABLE VALIDATION + WHATSAPP
    // ============================================================
    function sendBookingWhatsApp() {
        const nameEl    = document.getElementById('name');
        const emailEl   = document.getElementById('email');
        const phoneEl   = document.getElementById('phone');
        const datetimeEl= document.getElementById('datetime');
        const peopleEl  = document.getElementById('select1');
        const tableEl   = document.getElementById('tableType');
        const msgEl     = document.getElementById('message');

        const name     = nameEl.value.trim();
        const email    = emailEl.value.trim();
        const phone    = phoneEl.value.trim();
        const datetime = datetimeEl.value;
        const people   = peopleEl.options[peopleEl.selectedIndex].text;
        const tableType= tableEl.options[tableEl.selectedIndex].text;
        const message  = msgEl ? msgEl.value.trim() : '';

        let valid = true;

        // Name
        if (!name) { setFieldError('name', 'Name is required.'); valid = false; }
        else { clearFieldError('name'); }

        // Email
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) { setFieldError('email', 'Email is required.'); valid = false; }
        else if (!emailRx.test(email)) { setFieldError('email', 'Enter a valid email address.'); valid = false; }
        else { clearFieldError('email'); }

        // Phone
        if (!phone) { setFieldError('phone', 'Phone number is required.'); valid = false; }
        else if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
            setFieldError('phone', 'Enter a valid 10-digit mobile number.'); valid = false;
        } else { clearFieldError('phone'); }

        // Datetime
        if (!datetime) { setFieldError('datetime', 'Please select a date and time.'); valid = false; }
        else {
            const selectedDate = new Date(datetime);
            if (selectedDate < new Date()) { setFieldError('datetime', 'Please select a future date and time.'); valid = false; }
            else { clearFieldError('datetime'); }
        }

        if (!valid) return;

        const dt = new Date(datetime);
        const formattedDate = dt.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const formattedTime = dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        const whatsappMsg =
            `🍽️ *NEW TABLE RESERVATION*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `👤 *Name:* ${name}\n` +
            `📧 *Email:* ${email}\n` +
            `📞 *Phone:* ${phone}\n` +
            `📅 *Date:* ${formattedDate}\n` +
            `🕐 *Time:* ${formattedTime}\n` +
            `👥 *Guests:* ${people}\n` +
            `🪑 *Table:* ${tableType}\n` +
            (message ? `📝 *Special Request:* ${message}\n` : '') +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `📍 Keeran Food Center, 2/127 Gandamanur, Theni`;

        window.open(`https://wa.me/919789714637?text=${encodeURIComponent(whatsappMsg)}`, '_blank');

        const alert = document.getElementById('bookingAlert');
        if (alert) {
            alert.classList.remove('d-none');
            setTimeout(() => alert.classList.add('d-none'), 6000);
        }
        document.getElementById('bookingForm').reset();
        document.querySelectorAll('#bookingForm .form-control').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
    }

    // ============================================================
    //  CONTACT FORM VALIDATION
    // ============================================================
    function validateContactForm(e) {
        e.preventDefault();
        const nameEl    = document.getElementById('name');
        const emailEl   = document.getElementById('email');
        const subjectEl = document.getElementById('subject');
        const msgEl     = document.getElementById('message');

        // Only run for the contact form (check by parent context)
        if (!subjectEl) return;

        const name    = nameEl ? nameEl.value.trim() : '';
        const email   = emailEl ? emailEl.value.trim() : '';
        const subject = subjectEl.value.trim();
        const msg     = msgEl ? msgEl.value.trim() : '';

        let valid = true;
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name)              { setFieldError('name',    'Your name is required.'); valid = false; }
        else                    { clearFieldError('name'); }

        if (!email)             { setFieldError('email',   'Email is required.'); valid = false; }
        else if (!emailRx.test(email)) { setFieldError('email', 'Enter a valid email.'); valid = false; }
        else                    { clearFieldError('email'); }

        if (!subject)           { setFieldError('subject', 'Subject is required.'); valid = false; }
        else                    { clearFieldError('subject'); }

        if (!msg || msg.length < 10) { setFieldError('message', 'Please write at least 10 characters.'); valid = false; }
        else                         { clearFieldError('message'); }

        if (valid) showToast('✅ Message sent successfully!');
    }

    // Attach contact form submit listener
    $(document).ready(function () {
        const contactForm = document.querySelector('#Contact form');
        if (contactForm) contactForm.addEventListener('submit', validateContactForm);
    });

    // ============================================================
    //  REAL-TIME FIELD VALIDATION (live feedback)
    // ============================================================
    document.addEventListener('input', function (e) {
        const el = e.target;
        if (!el.classList.contains('form-control')) return;
        if (el.id && el.value.trim()) {
            el.classList.remove('is-invalid');
            el.classList.add('is-valid');
            const fb = el.parentNode.querySelector('.invalid-feedback');
            if (fb) fb.textContent = '';
        }
    });

    // ============================================================
    //  MODAL VIDEO
    // ============================================================
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });

        $('#videoModal').on('shown.bs.modal', function () {
            $("#video").attr('src', $videoSrc + "?autoplay=1&modestbranding=1&showinfo=0");
        });
        $('#videoModal').on('hide.bs.modal', function () {
            $("#video").attr('src', $videoSrc);
        });
    });

    // ============================================================
    //  TESTIMONIAL TRACK CLICK TO PAUSE
    // ============================================================
    const track = document.querySelector('.testimonial-track');
    if (track) {
        track.addEventListener('click', () => {
            const state = getComputedStyle(track).animationPlayState;
            track.style.animationPlayState = state === 'paused' ? 'running' : 'paused';
        });
    }

    // ============================================================
    //  CARD NUMBER FORMATTING
    // ============================================================
    document.addEventListener('input', function (e) {
        const el = e.target;
        if (el.placeholder === 'Card Number') {
            el.value = el.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
        }
        if (el.placeholder === 'MM / YY') {
            el.value = el.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1 / $2');
        }
        if (el.placeholder === 'CVV') {
            el.value = el.value.replace(/\D/g, '');
        }
    });

    // ============================================================
    //  EXPOSE GLOBALS
    // ============================================================
    window.addToCart        = addToCart;
    window.changeQty        = changeQty;
    window.removeItem       = removeItem;
    window.openCart         = openCart;
    window.openCheckout     = openCheckout;
    window.goToStep         = goToStep;
    window.selectPayment    = selectPayment;
    window.placeOrder       = placeOrder;
    window.resetCart        = resetCart;
    window.sendBookingWhatsApp = sendBookingWhatsApp;

    // ============================================================
    //  ADVANCED SCROLL ANIMATION SYSTEM  (SA)
    //  Auto-assigns data-sa to images, text, stats/numbers,
    //  cards — then reveals them with IntersectionObserver.
    //  Includes a pure-JS eased counter (no counterup.js needed).
    // ============================================================
    (function () {

        // ── 1. AUTO-ASSIGN [data-sa] ATTRIBUTES ──────────────────

        function assignSA() {

            // Section labels (Pacifico font labels)
            document.querySelectorAll('.section-title').forEach(el => {
                if (el.closest('.hero-header') || el.hasAttribute('data-sa')) return;
                el.setAttribute('data-sa', 'text-left');
            });

            // Main headings (h1 / h2 outside hero)
            document.querySelectorAll('h1, h2').forEach(el => {
                if (el.closest('.hero-header') || el.closest('.navbar') || el.hasAttribute('data-sa')) return;
                el.setAttribute('data-sa', 'text-up');
                el.classList.add('sa-heading');
            });

            // Body paragraphs in content cols
            document.querySelectorAll(
                '.col-lg-6 > p, .col-md-6 > p, .col-12 > p, .col-lg-8 > p'
            ).forEach((el, i) => {
                if (el.closest('.hero-header') || el.hasAttribute('data-sa')) return;
                el.setAttribute('data-sa', 'text-up');
                el.setAttribute('data-sa-delay', '2');
            });

            // Buttons in content sections (not navbar / hero)
            document.querySelectorAll(
                '.col-lg-6 .btn, .col-md-6 .btn, .col-12 .btn, .col-lg-8 .btn'
            ).forEach(el => {
                if (el.closest('.hero-header') || el.closest('.navbar') || el.hasAttribute('data-sa')) return;
                el.setAttribute('data-sa', 'text-up');
                el.setAttribute('data-sa-delay', '3');
            });

            // About / section images
            document.querySelectorAll(
                '.col-lg-6 img.img-fluid, .col-md-6 img, .col-6 img, .col-4 img'
            ).forEach((el, i) => {
                if (el.closest('.hero-header') || el.hasAttribute('data-sa')) return;
                // alternate zoom / left / right for visual variety
                const types = ['img-zoom', 'img-left', 'img-zoom', 'img-right'];
                el.setAttribute('data-sa', types[i % 4]);
                el.setAttribute('data-sa-delay', String((i % 4) + 1));
            });

            // Service cards
            document.querySelectorAll('.service-item').forEach((el, i) => {
                if (el.hasAttribute('data-sa')) return;
                el.setAttribute('data-sa', 'card-up');
                el.setAttribute('data-sa-delay', String((i % 4) + 1));
            });

            // Team cards
            document.querySelectorAll('.team-item').forEach((el, i) => {
                if (el.hasAttribute('data-sa')) return;
                el.setAttribute('data-sa', 'card-up');
                el.setAttribute('data-sa-delay', String((i % 4) + 1));
            });

            // Stat / counter wrapper boxes
            document.querySelectorAll('[data-toggle="counter-up"]').forEach((el, i) => {
                const box = el.closest('.d-flex.align-items-center') || el.parentElement;
                if (!box || box.hasAttribute('data-sa')) return;
                box.setAttribute('data-sa', 'num');
                box.setAttribute('data-sa-delay', String((i % 2) + 1));
            });

            // Menu item rows (food cards)
            document.querySelectorAll('.tab-content .d-flex.align-items-center').forEach((el, i) => {
                if (el.hasAttribute('data-sa') || el.querySelector('.btn-add-cart') === null) return;
                el.setAttribute('data-sa', 'card-up');
                el.setAttribute('data-sa-delay', String((i % 5) + 1));
            });

            // Map / contact iframe
            document.querySelectorAll('iframe').forEach(el => {
                if (el.hasAttribute('data-sa')) return;
                el.setAttribute('data-sa', 'img-left');
                el.setAttribute('data-sa-delay', '1');
            });

            // Contact / booking forms
            document.querySelectorAll('#Contact form, #booking-table form').forEach(el => {
                if (el.hasAttribute('data-sa')) return;
                el.setAttribute('data-sa', 'text-right');
                el.setAttribute('data-sa-delay', '2');
            });
        }


        // ── 2. INTERSECTIONOBSERVER → add .sa-in ─────────────────

        function initSAObserver() {
            const els = document.querySelectorAll('[data-sa]');
            if (!els.length) return;

            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    el.classList.add('sa-in');
                    obs.unobserve(el);

                    // fire counter for num boxes
                    el.querySelectorAll('[data-toggle="counter-up"]').forEach(animateCounter);
                    if (el.hasAttribute('data-toggle') && el.getAttribute('data-toggle') === 'counter-up') {
                        animateCounter(el);
                    }
                });
            }, {
                threshold: 0.14,
                rootMargin: '0px 0px -45px 0px'
            });

            els.forEach(el => obs.observe(el));
        }


        // ── 3. PURE-JS EASED COUNTER (replaces counterup.js) ──────

        function animateCounter(el) {
            if (el.dataset.saCountDone) return;
            el.dataset.saCountDone = '1';

            const raw    = el.textContent.trim();
            const target = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
            const isFloat = raw.includes('.');
            const suffix  = raw.replace(/[0-9.,]/g, '').trim();
            const duration = 2000;  // ms
            const startTime = performance.now();

            // easeOutQuart — fast start, smooth finish
            function ease(t) { return 1 - Math.pow(1 - t, 4); }

            function tick(now) {
                const pct   = Math.min((now - startTime) / duration, 1);
                const value = ease(pct) * target;
                el.textContent = (isFloat ? value.toFixed(1) : Math.floor(value)) + (suffix || '');
                if (pct < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = (isFloat ? target.toFixed(1) : target) + (suffix || '');
                }
            }
            requestAnimationFrame(tick);
        }


        // ── 4. INIT ───────────────────────────────────────────────

        // Run after DOM is ready (jQuery already guarantees this context)
        assignSA();
        initSAObserver();

        // Expose for manual use
        window.animateCounter = animateCounter;

    })();
    // ── END SCROLL ANIMATION SYSTEM ──

})(jQuery);