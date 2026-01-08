---
title: "Contact"
description: "Get in touch"
template: "page"
date: "2026-01-02"
tags:
  - contact
  - form
---

# Contact

If you'd like to reach out, feel free to send a message using the form below.

<!-- 
  This contact form uses the Fabform.io backend service.
  Fabform handles form submissions without requiring a custom server.
  Learn more at: https://fabform.io
  Documentation: https://fabform.io/docs
-->

<form action="https://fabform.io/f/YOUR_FORM_ID_HERE" method="POST" class="space-y-4">

  <div>
    <label class="block mb-1 font-medium">Your Name</label>
    <input type="text" name="name" required class="w-full border p-2 rounded">
  </div>

  <div>
    <label class="block mb-1 font-medium">Your Email</label>
    <input type="email" name="email" required class="w-full border p-2 rounded">
  </div>

  <div>
    <label class="block mb-1 font-medium">Message</label>
    <textarea name="message" rows="5" required class="w-full border p-2 rounded"></textarea>
  </div>

  <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
    Send Message
  </button>

</form>

