---
title: Contact
subtitle: We’d love to hear from you
---
**Email:** <a href="mailto:{{ site.email }}">{{ site.email }}</a><br>
**Phone:** <a href="tel:{{ site.phone | replace: '(', '' | replace: ')', '' | replace: ' ', '' | replace: '-', '' }}">{{ site.phone }}</a>

If you prefer a simple form, you can use a service like <a href="https://formspree.io/" target="_blank" rel="noopener">Formspree</a>.
Replace the `action` URL below with your Formspree endpoint.

<form class="round" method="POST" action="https://example.com/your-form-endpoint" style="background:var(--paper); border:1px solid #f0e6de; padding:1rem;">
  <label>Name<br><input required name="name" type="text" style="width:100%"></label><br><br>
  <label>Email<br><input required name="email" type="email" style="width:100%"></label><br><br>
  <label>Message<br><textarea required name="message" rows="5" style="width:100%"></textarea></label><br><br>
  <button class="btn btn-primary" type="submit">Send</button>
</form>
