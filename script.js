/* ===== The Weekend Table ===== */
const ORDER_EMAIL = 'izzynestcleaning@hotmail.com'; // TODO: swap to The Weekend Table's own email
const MEAL_PRICE = 10;
const EXTRA_PROTEIN = 3;

/* Mobile nav */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
  hamburger.classList.toggle('open');
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  hamburger.classList.remove('open');
}));

/* Live order summary */
const form = document.getElementById('orderForm');
const qty = document.getElementById('qty');
const extra = document.getElementById('extraProtein');
const el = {
  dish: document.getElementById('sumDish'),
  protein: document.getElementById('sumProtein'),
  qty: document.getElementById('sumQty'),
  extra: document.getElementById('sumExtra'),
  total: document.getElementById('sumTotal'),
};

function currentVal(name){
  const c = form.querySelector(`input[name="${name}"]:checked`);
  return c ? c.value : null;
}

function updateSummary(){
  const dish = currentVal('dish');
  const protein = currentVal('protein');
  const n = Math.max(1, parseInt(qty.value) || 1);
  const hasExtra = extra.checked;

  el.dish.textContent = dish || '—';
  el.protein.textContent = protein || '—';
  el.qty.textContent = n;
  el.extra.textContent = hasExtra ? 'Yes (+£' + EXTRA_PROTEIN + '/meal)' : 'No';

  let total = 0;
  if (dish) total = n * (MEAL_PRICE + (hasExtra ? EXTRA_PROTEIN : 0));
  el.total.textContent = '£' + total;
}

form.addEventListener('change', updateSummary);
form.addEventListener('input', updateSummary);
updateSummary();

/* Submit via FormSubmit AJAX */
const submitBtn = document.getElementById('submitBtn');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }

  const data = Object.fromEntries(new FormData(form).entries());
  data.estimated_total = el.total.textContent;
  data._subject = 'New Pre-Order — The Weekend Table';

  const original = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const res = await fetch('https://formsubmit.co/ajax/' + ORDER_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      form.innerHTML = '<div style="text-align:center;padding:30px 10px">' +
        '<div style="font-size:3rem">🎉</div>' +
        '<h3 style="font-family:Fraunces,serif;font-size:1.6rem;margin:.5rem 0;color:var(--terra)">Order received!</h3>' +
        '<p style="color:var(--ink-soft)">Thank you — we\'ve got your pre-order and will message you shortly to confirm your meal and delivery. 🍛</p>' +
        '</div>';
    } else {
      throw new Error('bad response');
    }
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = original;
    alert('Sorry, something went wrong sending your order. Please message us on WhatsApp instead and we\'ll sort you out!');
  }
});
