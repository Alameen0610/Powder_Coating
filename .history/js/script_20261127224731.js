// Scroll reveal: works both directions (down and up)
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const el = entry.target;
    el.classList.remove('is-visible', 'is-above', 'is-below');
    if (entry.isIntersecting) {
      el.classList.add('is-visible');
    } else if (entry.boundingClientRect.top < 0) {
      el.classList.add('is-above');   // went out through the top
    } else {
      el.classList.add('is-below');   // is waiting below
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal, .reveal-hero').forEach((el) => io.observe(el));

// ===== Quote form -> email =====
// 1) YOUR_EMAIL ah unga real email ku maathunga
const FORM_EMAIL = "YOUR_EMAIL@example.com";

const form = document.getElementById('quoteForm');
const btn  = document.getElementById('qBtn');
const msg  = document.getElementById('formMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.className = 'form-msg'; msg.textContent = '';

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    msg.className = 'form-msg err';
    msg.textContent = 'Please fill all the fields correctly.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending...';

  const data = Object.fromEntries(new FormData(form));
  data._subject  = 'New Quote Request - Ruby Al Hadid Website';
  data._template = 'table';
  data._captcha  = 'false';

  try {
    const res = await fetch('https://formsubmit.co/ajax/' + FORM_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    const out = await res.json();
    if (res.ok && String(out.success) === 'true') {
      msg.className = 'form-msg ok';
      msg.textContent = 'Thank you! Your request has been sent. We will contact you soon.';
      form.reset();
      form.classList.remove('was-validated');
    } else {
      throw new Error(out.message || 'Failed');
    }
  } catch (err) {
    msg.className = 'form-msg err';
    msg.textContent = 'Sorry, something went wrong. Please try again or call us directly.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit Request';
  }
});