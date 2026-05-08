/*-- ============================================================
     SCRIPTS
============================================================ */

/* ============================================================
   GLOBALS
============================================================ */
const WA_NUMBER = '919789714637';
let cart = [];
let selectedPayment = '';

/* ============================================================
   SPINNER
============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const sp = document.getElementById('spinner');
    if(sp) sp.classList.add('hide');
  }, 1200);
});

/* ============================================================
   SCROLL PROGRESS
============================================================ */
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const p = h > 0 ? (window.scrollY / h) * 100 : 0;
  const bar = document.getElementById('scrollProgress');
  if(bar) bar.style.width = p + '%';
}, {passive:true});

/* ============================================================
   CUSTOM CURSOR
============================================================ */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor(){
  rx += (mx - rx) * .18; ry += (my - ry) * .18;
  if(dot)  { dot.style.left=mx+'px'; dot.style.top=my+'px'; }
  if(ring) { ring.style.left=rx+'px'; ring.style.top=ry+'px'; }
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a,button,.btn,.btn-add-cart,.service-item,.team-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if(dot) { dot.style.width='16px'; dot.style.height='16px'; dot.style.background='var(--primary-d)'; }
    if(ring) { ring.style.width='54px'; ring.style.height='54px'; ring.style.borderColor='var(--primary-d)'; ring.style.opacity='.4'; }
  });
  el.addEventListener('mouseleave', () => {
    if(dot) { dot.style.width='10px'; dot.style.height='10px'; dot.style.background='var(--primary)'; }
    if(ring) { ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='var(--primary)'; ring.style.opacity='.7'; }
  });
});

/* ============================================================
   NAVBAR ACTIVE + SCROLL
============================================================ */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if(window.scrollY > 80) mainNav?.classList.add('scrolled');
  else mainNav?.classList.remove('scrolled');
  // active link
  const pos = window.scrollY + 100;
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if(!href || !href.startsWith('#')) return;
    const sec = document.querySelector(href);
    if(!sec) return;
    if(sec.offsetTop <= pos && sec.offsetTop + sec.offsetHeight > pos){
      document.querySelectorAll('.navbar-nav .nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
  // back to top
  const btn = document.getElementById('backToTop');
  if(btn){ btn.style.display = window.scrollY > 300 ? 'flex' : 'none'; }
}, {passive:true});

document.getElementById('backToTop')?.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

/* smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if(t){ e.preventDefault(); window.scrollTo({top:t.offsetTop - 72, behavior:'smooth'}); }
  });
});

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('revealed');
      revObserver.unobserve(entry.target);
    }
  });
}, {threshold:.1});
document.querySelectorAll('.reveal-left,.reveal-right,.reveal-up,.reveal-zoom').forEach(el => revObserver.observe(el));

/* ============================================================
   COUNTER ANIMATION
============================================================ */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.getAttribute('data-target');
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if(current >= target){ current = target; clearInterval(timer); }
      el.textContent = current + (target >= 100 ? '+' : '');
    }, 30);
    counterObs.unobserve(el);
  });
}, {threshold:.5});
document.querySelectorAll('.counter-num').forEach(el => counterObs.observe(el));

/* ============================================================
   MENU DATA + RENDER
============================================================ */
const menuData = {
  breakfast: [
    {name:'Grilled Chicken Wrap',    price:165, img:'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop', desc:'Juicy grilled chicken wrapped with fresh veggies and house sauce.',              tag:'🔥 Popular'},
    {name:'Masala Dosa',             price:85,  img:'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop', desc:'Crispy rice crepe stuffed with spiced potato filling. South Indian classic.',    tag:'⭐ Chef Special'},
    {name:'Egg Bhurji Toast',        price:95,  img:'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop', desc:'Scrambled eggs with onions, tomatoes, and spices on toasted bread.',            tag:'🌿 Healthy'},
    {name:'Idli Sambhar',            price:70,  img:'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', desc:'Soft steamed rice cakes served with lentil soup and coconut chutney.',          tag:'🔥 Popular'},
    {name:'Upma',                    price:60,  img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', desc:'Savory semolina porridge with vegetables and tempering spices.',                tag:'🌿 Healthy'},
    {name:'Poori Kuruma',            price:90,  img:'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop', desc:'Deep-fried puffed bread with vegetable kuruma gravy.',                          tag:'⭐ Chef Special'},
    {name:'Paneer Paratha',          price:110, img:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', desc:'Whole wheat flatbread stuffed with spiced cottage cheese, served with curd.',   tag:'🌿 Veg'},
    {name:'Aloo Paratha',            price:90,  img:'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop', desc:'Crispy wheat flatbread stuffed with spiced mashed potatoes and ghee.',          tag:'🔥 Popular'},
    {name:'French Toast',            price:120, img:'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop', desc:'Golden egg-dipped bread with cinnamon, maple syrup and powdered sugar.',       tag:'⭐ Chef Special'},
    {name:'Special Omelette',        price:100, img:'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&h=300&fit=crop', desc:'Fluffy three-egg omelette with cheese, mushrooms, and bell peppers.',           tag:'🌿 Healthy'},
    {name:'Medu Vada',               price:65,  img:'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', desc:'Crispy fried lentil doughnuts served with sambar and coconut chutney.',         tag:'🔥 Popular'},
    {name:'Rava Kesari',             price:75,  img:'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=400&h=300&fit=crop', desc:'Sweet semolina pudding with saffron, cashews, and raisins.',                   tag:'⭐ Chef Special'},
    {name:'Bread Omelette',          price:85,  img:'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop', desc:'Egg omelette sandwich on buttered bread with fresh veggies and cheese.',        tag:'🌿 Healthy'},
    {name:'Banana Pancakes',         price:130, img:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop', desc:'Fluffy American-style pancakes topped with banana slices and honey.',           tag:'🔥 Popular'},
    {name:'Avocado Toast',           price:150, img:'https://images.unsplash.com/photo-1585768425229-d3a88ff63ebb?w=500&fit=crop', desc:'Multigrain toast with smashed avocado, cherry tomatoes, and poached egg.',     tag:'🌿 Healthy'},
    {name:'Pongal',                  price:70,  img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', desc:'Creamy rice and lentil porridge flavored with black pepper and ghee.',          tag:'⭐ Chef Special'},
    {name:'Puttu & Kadala Curry',    price:90,  img:'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop', desc:'Steamed rice cylinders served with spicy black chickpea curry.',               tag:'🔥 Popular'},
    {name:'Egg Dosa',                price:80,  img:'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop', desc:'Thin crispy dosa topped with beaten eggs, onions, and chillies.',              tag:'🌿 Healthy'},
    {name:'Smoothie Bowl',           price:145, img:'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop', desc:'Thick blended açai base topped with granola, fresh fruits, and nuts.',         tag:'🌿 Healthy'},
    {name:'Chole Bhature',           price:120, img:'https://plus.unsplash.com/premium_photo-1694141253763-209b4c8f8ace?w=500&fit=crop', desc:'Spiced chickpea curry with fluffy deep-fried bread — North Indian classic.',   tag:'🔥 Popular'},
  ],
  lunch: [
    {name:'Chicken Biryani',         price:220, img:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', desc:'Fragrant basmati rice cooked with tender chicken and aromatic spices.',         tag:'🔥 Bestseller'},
    {name:'Mutton Curry Rice',       price:280, img:'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&h=300&fit=crop', desc:'Slow-cooked mutton curry served with steamed rice.',                             tag:'⭐ Chef Special'},
    {name:'Paneer Butter Masala',    price:180, img:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', desc:'Cottage cheese in rich, creamy tomato-based sauce.',                           tag:'🌿 Veg'},
    {name:'Fish Fry Meals',          price:210, img:'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=300&fit=crop', desc:'Crispy fried fish served with rice, sambar, rasam and sides.',                 tag:'🔥 Popular'},
    {name:'Dal Tadka Combo',         price:130, img:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', desc:'Yellow lentils tempered with ghee, cumin, and garlic. With roti.',               tag:'🌿 Veg'},
    {name:'Prawn Masala Rice',       price:260, img:'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&h=300&fit=crop', desc:'Fresh prawns cooked in spicy masala, served with fragrant rice.',                tag:'⭐ Chef Special'},
    {name:'Veg Biryani',             price:160, img:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', desc:'Aromatic basmati rice layered with mixed vegetables and whole spices.',        tag:'🌿 Veg'},
    {name:'Egg Curry Rice',          price:150, img:'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&h=300&fit=crop', desc:'Boiled eggs simmered in spicy onion-tomato gravy, served with rice.',           tag:'🔥 Popular'},
    {name:'Chettinad Chicken',       price:240, img:'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop', desc:'Fiery Chettinad-style chicken with freshly ground masala and curry leaves.',   tag:'🌶️ Spicy'},
    {name:'Kerala Fish Curry',       price:230, img:'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=300&fit=crop', desc:'Tangy kokum-based fish curry with coconut milk. Classic Kerala style.',       tag:'⭐ Chef Special'},
    {name:'Sambar Rice',             price:110, img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', desc:'Hot steamed rice mixed with tangy lentil sambar and ghee.',                   tag:'🌿 Veg'},
    {name:'Rajma Chawal',            price:140, img:'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&h=300&fit=crop', desc:'Creamy kidney bean curry served over fragrant steamed basmati rice.',           tag:'🌿 Veg'},
    {name:'Chicken Fried Rice',      price:170, img:'https://plus.unsplash.com/premium_photo-1694141252026-3df1de888a21?w=500&fit=crop', desc:'Wok-tossed fried rice with tender chicken, veggies, and soy sauce.',          tag:'🔥 Popular'},
    {name:'Mushroom Masala',         price:155, img:'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=300&fit=crop', desc:'Button mushrooms cooked in a rich onion-cashew masala gravy.',                tag:'🌿 Veg'},
    {name:'Kothu Parotta',           price:165, img:'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop', desc:'Minced parotta tossed with egg, chicken, and spicy masala.',                  tag:'🔥 Bestseller'},
    {name:'Mutton Biryani',          price:310, img:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', desc:'Slow-dum cooked mutton with saffron-infused basmati rice.',                   tag:'⭐ Chef Special'},
    {name:'Curd Rice',               price:90,  img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', desc:'Creamy yogurt rice with mustard, curry leaves, and pomegranate seeds.',       tag:'🌿 Veg'},
    {name:'Butter Chicken Naan',     price:195, img:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', desc:'Smoky tandoori chicken in silky butter sauce with fluffy garlic naan.',       tag:'🔥 Popular'},
    {name:'Thali Meal',              price:200, img:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', desc:'Full south Indian thali with rice, dal, 2 curries, papad, pickle & dessert.', tag:'⭐ Chef Special'},
    {name:'Mixed Veg Curry',         price:145, img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', desc:'Seasonal vegetables cooked in a fragrant coconut-tomato gravy.',              tag:'🌿 Veg'},
  ],
  dinner: [
    {name:'Chicken Alfredo Pasta',   price:220, img:'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop', desc:'Creamy pasta with grilled chicken strips and parmesan cheese.',                 tag:'⭐ Chef Special'},
    {name:'Lamb Chops & Mint Jus',   price:295, img:'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop', desc:'Grilled lamb chops served with seasoned potatoes and green beans.',           tag:'🔥 Popular'},
    {name:'Spicy Shrimp Tacos',      price:175, img:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop', desc:'Three soft tacos filled with spicy shrimp, slaw, and chipotle mayo.',         tag:'🌶️ Spicy'},
    {name:'Vegetarian Lasagna',      price:195, img:'https://images.unsplash.com/photo-1619895092538-128341789043?w=400&h=300&fit=crop', desc:'Layered with grilled vegetables, ricotta, and marinara sauce.',               tag:'🌿 Veg'},
    {name:'BBQ Ribs Plate',          price:310, img:'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop', desc:'Slow-cooked ribs glazed in BBQ sauce, served with coleslaw and fries.',       tag:'🔥 Popular'},
    {name:'Mushroom Risotto',        price:210, img:'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop', desc:'Creamy arborio rice with wild mushrooms, white wine, and truffle oil.',       tag:'⭐ Chef Special'},
    {name:'Tandoori Chicken',        price:250, img:'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop', desc:'Marinated chicken roasted in clay oven, served with mint chutney.',            tag:'🔥 Bestseller'},
    {name:'Grilled Fish Steak',      price:270, img:'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=300&fit=crop', desc:'Fresh fish fillet grilled with herbs, lemon butter, and seasonal greens.',     tag:'🌿 Healthy'},
    {name:'Paneer Tikka',            price:185, img:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', desc:'Smoky marinated cottage cheese cubes grilled with peppers and onions.',        tag:'🌿 Veg'},
    {name:'Chicken 65',              price:180, img:'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop', desc:'Crispy deep-fried chicken tossed in fiery red chilli and curry leaves.',      tag:'🌶️ Spicy'},
    {name:'Mutton Rogan Josh',       price:290, img:'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&h=300&fit=crop', desc:'Slow-cooked Kashmiri lamb in aromatic sauce of whole spices.',                  tag:'⭐ Chef Special'},
    {name:'Prawn Curry',             price:265, img:'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&h=300&fit=crop', desc:'Tiger prawns simmered in coconut milk and Goan-style red masala.',              tag:'🔥 Popular'},
    {name:'Hakka Noodles',           price:155, img:'https://images.unsplash.com/photo-1617622141573-2e00d8818f3f?w=500&fit=crop', desc:'Stir-fried noodles with veggies and soy-chilli sauce. Veg or chicken.',       tag:'🔥 Popular'},
    {name:'Butter Naan & Curry',     price:165, img:'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop', desc:'Freshly baked butter naan paired with your choice of curry.',                 tag:'⭐ Chef Special'},
    {name:'Chicken Shawarma',        price:160, img:'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop', desc:'Marinated chicken strips in warm flatbread with garlic sauce and salad.',     tag:'🔥 Bestseller'},
    {name:'Beef Steak',              price:340, img:'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop', desc:'Prime beef tenderloin cooked to perfection with mashed potato and gravy.',    tag:'⭐ Chef Special'},
    {name:'Pasta Arrabbiata',        price:185, img:'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop', desc:'Penne pasta in spicy tomato sauce with garlic, olives, and fresh basil.',      tag:'🌶️ Spicy'},
    {name:'Veg Spring Rolls',        price:130, img:'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop', desc:'Crispy fried rolls filled with seasoned vegetables and glass noodles.',       tag:'🌿 Veg'},
    {name:'Chicken Soup',            price:120, img:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', desc:'Nourishing slow-simmered chicken broth with vegetables and herbs.',             tag:'🌿 Healthy'},
    {name:'Veg Fried Rice',          price:145, img:'https://images.unsplash.com/photo-1664717698774-84f62382613b?w=500&fit=crop', desc:'Wok-tossed rice with seasonal vegetables, egg, and soy seasoning.',           tag:'🌿 Veg'},
  ]
};

function renderMenu(tab){
  const grid = document.getElementById('menuGrid-'+tab);
  if(!grid) return;
  grid.innerHTML = menuData[tab].map((item,i) => `
    <div class="col-lg-6 reveal-up" data-delay="${(i%4)+1}">
      <div class="menu-item-card">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <div class="menu-item-info">
          <div class="menu-item-name">${item.name}</div>
          <div class="menu-item-desc">${item.desc}</div>
          <div class="menu-item-bottom">
            <span class="menu-item-price">₹${item.price}</span>
            <span class="small text-muted">${item.tag}</span>
            <button class="btn-add-cart" onclick="addToCart('${item.name}',${item.price},'${item.img}')">
              <i class="fa fa-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    </div>`).join('');
  // observe new reveal elements
  grid.querySelectorAll('.reveal-up').forEach(el => revObserver.observe(el));
}
['breakfast','lunch','dinner'].forEach(renderMenu);

// Tab switching
document.querySelectorAll('.menu-tab-nav .nav-link').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab-nav .nav-link').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.getAttribute('data-tab');
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('d-none'));
    const el = document.getElementById(tab);
    if(el){ el.classList.remove('d-none'); }
  });
});

/* ============================================================
   CART SYSTEM
============================================================ */
function addToCart(name, price, img){
  const ex = cart.find(i => i.name === name);
  if(ex) ex.qty++;
  else cart.push({name, price, img, qty:1});
  updateCartUI();
  showToast(`🛒 <strong>${name}</strong> added!`, 'info');
  const fab = document.querySelector('.cart-fab');
  if(fab){ fab.style.transform='scale(1.35) rotate(10deg)'; setTimeout(()=>fab.style.transform='',350); }
  const badge = document.getElementById('navCartCount');
  if(badge){ badge.classList.remove('bounce'); void badge.offsetWidth; badge.classList.add('bounce'); }
}
function updateCartUI(){
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const count = cart.reduce((s,i)=>s+i.qty,0);
  ['cartCount','navCartCount'].forEach(id => {
    const el = document.getElementById(id); if(el) el.textContent=count;
  });
  const container = document.getElementById('cartItemsContainer');
  const emptyMsg  = document.getElementById('emptyCartMsg');
  const footer    = document.getElementById('cartFooter');
  const totalEl   = document.getElementById('cartTotal');
  if(!container) return;
  if(cart.length===0){
    if(emptyMsg) emptyMsg.style.display='block';
    if(footer) footer.classList.add('d-none');
    container.querySelectorAll('.cart-item-row').forEach(el=>el.remove());
    return;
  }
  if(emptyMsg) emptyMsg.style.display='none';
  if(footer) footer.classList.remove('d-none');
  if(totalEl) totalEl.textContent='₹'+total;
  container.querySelectorAll('.cart-item-row').forEach(el=>el.remove());
  cart.forEach((item,idx)=>{
    const div=document.createElement('div');
    div.className='cart-item-row';
    div.innerHTML=`
      <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/62'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} × ${item.qty} = <strong style="color:var(--primary)">₹${item.price*item.qty}</strong></div>
      </div>
      <div class="cart-item-controls">
        <button onclick="changeQty(${idx},-1)"><i class="fa fa-minus"></i></button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${idx},1)"><i class="fa fa-plus"></i></button>
        <button class="remove-btn" onclick="removeFromCart(${idx})"><i class="fa fa-trash"></i></button>
      </div>`;
    container.appendChild(div);
  });
}
function changeQty(idx,delta){
  cart[idx].qty+=delta;
  if(cart[idx].qty<=0) cart.splice(idx,1);
  updateCartUI();
}
function removeFromCart(idx){ cart.splice(idx,1); updateCartUI(); }
function openCart(){
  const el=document.getElementById('cartOffcanvas');
  if(el) new bootstrap.Offcanvas(el).show();
}
function openCheckout(){
  const oc=document.getElementById('cartOffcanvas');
  if(oc){ const i=bootstrap.Offcanvas.getInstance(oc); if(i) i.hide(); }
  if(cart.length===0){ showToast('⚠️ Your cart is empty!','warning'); return; }
  setTimeout(()=>{
    goToStep(1);
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
  },300);
}
function goToStep(n){
  document.querySelectorAll('.checkout-step').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.step-dot').forEach((d,i)=>d.classList.toggle('active',i<n));
  const step=document.getElementById('step'+n);
  if(step) step.classList.add('active');
  if(n===2){
    const si=document.getElementById('summaryItems');
    const st=document.getElementById('summaryTotal');
    if(si) si.innerHTML=cart.map(i=>`<div class="d-flex justify-content-between py-1"><span>${i.name} × ${i.qty}</span><strong style="color:var(--primary)">₹${i.price*i.qty}</strong></div>`).join('');
    const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
    if(st) st.textContent='₹'+total;
  }
}
function selectPayment(method){
  selectedPayment=method;
  document.querySelectorAll('.pay-method-card').forEach(c=>c.classList.remove('selected'));
  const map={'Cash on Delivery':'pay_cod','UPI / GPay':'pay_upi','Card Payment':'pay_card'};
  const el=document.getElementById(map[method]); if(el) el.classList.add('selected');
  document.getElementById('upiDetails')?.classList.toggle('d-none',method!=='UPI / GPay');
  document.getElementById('cardDetails')?.classList.toggle('d-none',method!=='Card Payment');
}
function placeOrder(){
  const name=document.getElementById('co_name').value.trim();
  const phone=document.getElementById('co_phone').value.trim();
  const address=document.getElementById('co_address').value.trim();
  const orderType=document.querySelector('input[name="orderType"]:checked')?.value||'Delivery';
  if(!name){showToast('⚠️ Please enter your name','warning');return;}
  if(!phone){showToast('⚠️ Please enter your phone number','warning');return;}
  if(!selectedPayment){showToast('⚠️ Please select a payment method','warning');return;}
  const orderId='#KR'+Date.now().toString().slice(-4);
  const badge=document.getElementById('orderIdBadge');
  if(badge) badge.textContent='Order '+orderId;
  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const itemsList=cart.map(i=>`• ${i.name} × ${i.qty} = ₹${i.price*i.qty}`).join('\n');
  const msg=encodeURIComponent(
    `🍽️ *NEW ORDER ${orderId}*\n\n`+
    `👤 Name: ${name}\n📞 Phone: ${phone}\n`+
    `📍 Address: ${address||'Pickup/Dine-In'}\n`+
    `🛵 Type: ${orderType}\n💳 Payment: ${selectedPayment}\n\n`+
    `📋 *Items:*\n${itemsList}\n\n`+
    `💰 *Total: ₹${total}*\n\n`+
    `Thank you for choosing Keeran Restaurant! 🙏`
  );
  const waLink=`https://wa.me/${WA_NUMBER}?text=${msg}`;
  const trackLink=document.getElementById('waTrackLink');
  if(trackLink) trackLink.href=waLink;
  window.open(waLink,'_blank');
  goToStep(3);
  startOrderTracking();
}
function startOrderTracking(){
  [{id:'trackStep2',lineId:'trackLine2',delay:2000},{id:'trackStep3',lineId:'trackLine3',delay:5000},{id:'trackStep4',lineId:null,delay:9000}]
  .forEach(s=>{
    setTimeout(()=>{
      const el=document.getElementById(s.id);
      if(el){el.classList.remove('step-active','step-pending');el.classList.add('step-done');}
      if(s.lineId){const l=document.getElementById(s.lineId);if(l) l.classList.add('done-line');}
    },s.delay);
  });
}
function resetCart(){ cart=[]; selectedPayment=''; updateCartUI(); }

/* ============================================================
   BOOKING → WHATSAPP
============================================================ */
function sendBookingWhatsApp(){
  const name=document.getElementById('bk_name').value.trim();
  const email=document.getElementById('bk_email').value.trim();
  const phone=document.getElementById('bk_phone').value.trim();
  const dt=document.getElementById('bk_datetime').value;
  const guests=document.getElementById('bk_guests').value;
  const table=document.getElementById('bk_table').value;
  const msg=document.getElementById('bk_msg').value.trim();
  if(!name){showToast('⚠️ Please enter your name','warning');return;}
  if(!email){showToast('⚠️ Please enter your email','warning');return;}
  if(!phone){showToast('⚠️ Please enter your phone','warning');return;}
  if(!dt){showToast('⚠️ Please select date & time','warning');return;}
  if(!msg){showToast('⚠️ Please enter your message','warning');return;}
  const dateStr=new Date(dt).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'});
  const waMsg=encodeURIComponent(
    `📅 *TABLE RESERVATION — Keeran Restaurant*\n\n`+
    `👤 Name: ${name}\n📧 Email: ${email||'N/A'}\n📞 Phone: ${phone}\n`+
    `🗓️ Date & Time: ${dateStr}\n👥 Guests: ${guests}\n🪑 Table: ${table}\n`+
    `📝 Special Request: ${msg||'None'}\n\nPlease confirm my reservation. Thank you! 🙏`
  );
  window.open(`https://wa.me/${WA_NUMBER}?text=${waMsg}`,'_blank');
  const alert=document.getElementById('bookingAlert');
  if(alert){alert.classList.remove('d-none');setTimeout(()=>alert.classList.add('d-none'),5000);}
  showToast('✅ Booking sent via WhatsApp!','success');
}

/* ============================================================
   CONTACT → WHATSAPP
============================================================ */
function sendContactWhatsApp(){
  const n=document.getElementById('c_name').value.trim();
  const em=document.getElementById('c_email').value.trim();
  const sub=document.getElementById('c_subject').value.trim();
  const msg=document.getElementById('c_message').value.trim();
  if(!n||!em||!sub||!msg){showToast('⚠️ Please fill in all fields','warning');return;}
  const waMsg=encodeURIComponent(
    `📩 *CONTACT — Keeran Restaurant*\n\n`+
    `👤 Name: ${n}\n📧 Email: ${em}\n📌 Subject: ${sub}\n\n💬 Message:\n${msg}`
  );
  window.open(`https://wa.me/${WA_NUMBER}?text=${waMsg}`,'_blank');
  showToast('✅ Message sent via WhatsApp!','success');
  document.getElementById('c_name').value='';
  document.getElementById('c_email').value='';
  document.getElementById('c_subject').value='';
  document.getElementById('c_message').value='';
}

/* ============================================================
   VIDEO MODAL
============================================================ */
document.getElementById('videoModal')?.addEventListener('show.bs.modal', () => {
  document.getElementById('videoFrame').src='https://www.youtube.com/embed/DWRcNpR6Kdc?autoplay=1&mute=1';
});
document.getElementById('videoModal')?.addEventListener('hide.bs.modal', () => {
  document.getElementById('videoFrame').src='';
});

/* ============================================================
   TEAM SLIDESHOW
============================================================ */
const teamMembers = [
  {
    name:'Rajesh Kumar',
    role:'Head Chef',
    location:'Chennai, Tamil Nadu',
    img:'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop&crop=faces'
  },
  {
    name:'Murugan Pillai',
    role:'Sous Chef',
    location:'Madurai, Tamil Nadu',
    img:'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=400&h=400&fit=crop&crop=faces'
  },
  {
    name:'Selvaraj A.',
    role:'Pastry Chef',
    location:'Coimbatore, Tamil Nadu',
    img:'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&h=400&fit=crop&crop=faces'
  },
  {
    name:'Annamalai T.',
    role:'Grill Master',
    location:'Trichy, Tamil Nadu',
    img:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=faces'
  },
  {
    name:'Karthikeyan M.',
    role:'Tandoor Specialist',
    location:'Salem, Tamil Nadu',
    img:'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&h=400&fit=crop&crop=faces'
  },
  {
    name:'Devi Priya',
    role:'Seafood Chef',
    location:'Tuticorin, Tamil Nadu',
    img:'https://images.unsplash.com/photo-1607631568010-a87245c0daf5?w=400&h=400&fit=crop&crop=faces'
  },
  {
    name:'Pandiyaraj K.',
    role:'Biryani Expert',
    location:'Theni, Tamil Nadu',
    img:'https://images.unsplash.com/photo-1527161153332-99adcc6f2966?w=400&h=400&fit=crop&crop=faces'
  },
  {
    name:'Velmurugan S.',
    role:'Continental Chef',
    location:'Erode, Tamil Nadu',
    img:'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=400&fit=crop&crop=faces'
  },
];

const teamTrack = document.getElementById('teamTrack');
const teamDots  = document.getElementById('teamDots');
teamMembers.forEach(m => {
  const card = document.createElement('div');
  card.className = 'team-card';
  card.innerHTML = `
    <div class="img-wrap"><img src="${m.img}" alt="${m.name}" loading="lazy" onerror="this.src='https://i.pravatar.cc/200?u=${m.name}'"></div>
    <h5>${m.name}</h5>
    <div class="small fw-bold mb-1" style="color:var(--primary)">${m.role}</div>
    <div class="location-badge"><i class="fa fa-map-marker-alt" style="font-size:.68rem"></i>${m.location}</div>
    <div class="socials">
      <a href="#"><i class="fab fa-facebook-f"></i></a>
      <a href="#"><i class="fab fa-twitter"></i></a>
      <a href="#"><i class="fab fa-instagram"></i></a>
    </div>`;
  teamTrack.appendChild(card);
});

let teamIdx = 0;
const visibleCards = () => window.innerWidth >= 992 ? 4 : window.innerWidth >= 576 ? 2 : 1;
const maxIdx = () => Math.max(0, teamMembers.length - visibleCards());

function buildDots(){
  if(!teamDots) return;
  teamDots.innerHTML='';
  const pages = Math.ceil(teamMembers.length / visibleCards());
  for(let i=0;i<pages;i++){
    const d=document.createElement('button');
    d.className='slide-dot'+(i===0?' active':'');
    d.addEventListener('click',()=>goTeam(i*visibleCards()));
    teamDots.appendChild(d);
  }
}
function goTeam(idx){
  teamIdx = Math.min(Math.max(0,idx), maxIdx());
  const cardW = teamTrack.querySelector('.team-card')?.offsetWidth + 24 || 0;
  teamTrack.style.transform = `translateX(-${teamIdx * cardW}px)`;
  const dots = teamDots?.querySelectorAll('.slide-dot');
  dots?.forEach((d,i)=>d.classList.toggle('active', i===Math.floor(teamIdx/visibleCards())));
}
document.getElementById('teamPrev')?.addEventListener('click',()=>goTeam(teamIdx-visibleCards()));
document.getElementById('teamNext')?.addEventListener('click',()=>goTeam(teamIdx+visibleCards()));
buildDots();
window.addEventListener('resize',()=>{buildDots();goTeam(0);});

// Auto-slide every 4s
setInterval(()=>{
  teamIdx = teamIdx >= maxIdx() ? 0 : teamIdx + visibleCards();
  goTeam(teamIdx);
},4000);

/* ============================================================
   TESTIMONIAL AUTO-SCROLL + PAUSE
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const track   = document.querySelector('.testimonial-track');
  const wrapper = document.querySelector('.testimonial-wrapper');
  const indicator = document.getElementById('pauseIndicator');
  if(!track||!wrapper) return;

  // clone for loop
  Array.from(track.querySelectorAll('.testimonial-item')).forEach(item=>{
    const c=item.cloneNode(true); c.setAttribute('aria-hidden','true'); track.appendChild(c);
  });

  let clickLocked=false, hoverPaused=false;
  const setIndicator = t => { if(indicator){indicator.textContent=t; indicator.style.opacity=t?'1':'0';} };
  const applyState = () => {
    track.style.animationPlayState = (clickLocked||hoverPaused)?'paused':'running';
  };

  wrapper.addEventListener('click',()=>{
    clickLocked=!clickLocked; applyState();
    setIndicator(clickLocked?'⏸ Paused — click to resume':hoverPaused?'🖱️ Hover paused':'');
  });
  wrapper.addEventListener('mouseenter',()=>{hoverPaused=true;applyState();if(!clickLocked)setIndicator('🖱️ Hover paused');});
  wrapper.addEventListener('mouseleave',()=>{hoverPaused=false;applyState();if(!clickLocked)setIndicator('');});
});

/* ============================================================
   NEWSLETTER → OPENS LOGIN MODAL
============================================================ */
function signupNewsletter(){
  const email = document.getElementById('newsletterEmail')?.value.trim();
  if(!email || !email.includes('@')){
    showToast('⚠️ Please enter a valid email','warning'); return;
  }
  // Store email and open login modal
  document.getElementById('r_email').value = email;
  document.getElementById('newsletterEmail').value = '';
  switchAuthTab('register');
  new bootstrap.Modal(document.getElementById('loginModal')).show();
  showToast('🎉 Almost there! Complete your registration.','success');
}

/* ============================================================
   AUTH — LOGIN / REGISTER
============================================================ */
function switchAuthTab(tab){
  document.querySelectorAll('.auth-tab-btn').forEach(b=>b.classList.toggle('active',b.textContent.toLowerCase()===tab));
  document.querySelectorAll('.auth-form').forEach(f=>f.classList.remove('active'));
  const form = tab==='login'?document.getElementById('loginForm'):document.getElementById('registerForm');
  if(form) form.classList.add('active');
}
function doLogin(){
  const email=document.getElementById('l_email').value.trim();
  const pass=document.getElementById('l_pass').value;
  if(!email||!pass){showToast('⚠️ Please fill in all fields','warning');return;}
  // Demo login
  showToast(`✅ Welcome back! Logged in as ${email}`,'success');
  bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();
}
function doRegister(){
  const fname=document.getElementById('r_fname').value.trim();
  const email=document.getElementById('r_email').value.trim();
  const pass=document.getElementById('r_pass').value;
  const terms=document.getElementById('r_terms').checked;
  if(!fname||!email||!pass){showToast('⚠️ Please fill in all fields','warning');return;}
  if(!terms){showToast('⚠️ Please accept terms &amp; conditions','warning');return;}
  showToast(`🎉 Account created! Welcome, ${fname}!`,'success');
  bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();
}

/* ============================================================
   TOAST NOTIFICATIONS
============================================================ */
function showToast(msg, type='info'){
  const container = document.getElementById('toastContainer');
  if(!container) return;
  const colors={success:'#16a34a',warning:'#e08c00',info:'var(--primary)',error:'#ef4444'};
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.style.background = colors[type]||colors.info;
  toast.innerHTML = msg;
  container.appendChild(toast);
  requestAnimationFrame(()=>requestAnimationFrame(()=>toast.classList.add('show')));
  setTimeout(()=>{
    toast.classList.remove('show');
    setTimeout(()=>toast.remove(), 450);
  }, 3500);
}