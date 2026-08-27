// ===== MOBILE MENU =====
const menu = document.getElementById('menu');
const nav = document.getElementById('navLinks');

if (menu) {
  menu.addEventListener('click', () => {
    nav.classList.toggle('show');
  });
}

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('show');
  });
});

// ===== PRELOADER - Prevent Flash =====
(function initPreloader() {
  document.body.classList.add('loading');
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
  
  function ready() {
    setTimeout(() => {
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
    }, 100);
  }
})();

// ===== ACTIVE TAB DETECTION =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-links a').forEach(link => {
  const linkHref = link.getAttribute('href');
  if (linkHref === currentPage) {
    link.classList.add('active');
  }
});

// ===== REVEAL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});

// ===== AUTO UPDATE YEAR =====
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ===== IMAGE ERROR HANDLING =====
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    if (this.parentElement.classList.contains('project-img')) {
      this.parentElement.innerHTML = '<i class="fa-solid fa-image"></i>';
    } else {
      this.style.visibility = 'hidden';
    }
  });
});

// ===== STATS COUNTING ANIMATION =====
function animateCounter(element, target, suffix, duration) {
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    if (suffix === '/7') {
      element.textContent = Math.floor(current) + '/7';
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const stats = entry.target.querySelectorAll('.stat');
      stats.forEach((stat, index) => {
        const numberEl = stat.querySelector('.stat-number');
        const target = parseInt(stat.dataset.count);
        const suffix = stat.dataset.suffix || '+';
        const duration = 2000 + (index * 200);

        if (suffix === '/7') {
          numberEl.textContent = '0/7';
        } else {
          numberEl.textContent = '0' + suffix;
        }

        setTimeout(() => {
          animateCounter(numberEl, target, suffix, duration);
        }, index * 150);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsGrid = document.getElementById('statsGrid');
if (statsGrid) {
  statsObserver.observe(statsGrid);
}

// ===== CYBER BACKGROUND ANIMATION =====
(function initCyberBackground() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let animationId = null;
  let dots = [];
  let isVisible = true;
  let isInitialized = false;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width || window.innerWidth;
    canvas.height = rect.height || window.innerHeight;
    initDots();
  }

  function initDots() {
    const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 25000));
    dots = [];
    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  function drawDots() {
    if (!isVisible) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    dots.forEach(dot => {
      dot.x += dot.vx;
      dot.y += dot.vy;
      
      if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
      if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
      
      ctx.save();
      ctx.globalAlpha = dot.alpha;
      ctx.fillStyle = '#4aafff';
      ctx.shadowColor = '#4aafff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = 0.1 * (1 - dist / 120);
          ctx.strokeStyle = '#4aafff';
          ctx.lineWidth = 0.5;
          ctx.shadowColor = '#4aafff';
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    
    animationId = requestAnimationFrame(drawDots);
  }

  function handleVisibilityChange() {
    isVisible = !document.hidden;
    if (isVisible && !animationId && isInitialized) {
      drawDots();
    } else if (!isVisible && animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);

  const resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
  });

  const parent = canvas.parentElement;
  if (parent) {
    resizeObserver.observe(parent);
  }

  window.addEventListener('resize', resizeCanvas);
  
  setTimeout(() => {
    resizeCanvas();
    isInitialized = true;
    drawDots();
  }, 50);

  return function cleanup() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    resizeObserver.disconnect();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
})();

// ===== PARTICLES CONTAINER =====
(function initParticles() {
  const container = document.getElementById('particlesContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  const count = Math.min(25, Math.floor((window.innerWidth * window.innerHeight) / 35000));
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 3 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 4 + 3;
    const delay = Math.random() * 5;
    const distance = Math.random() * 150 + 80;
    
    particle.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      --duration: ${duration}s;
      --distance: ${-distance}px;
      animation-delay: ${delay}s;
    `;
    
    container.appendChild(particle);
  }
})();

// ===== CARD TILT EFFECT =====
const isFinePointer = window.matchMedia('(pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function initCardTilt() {
  if (!isFinePointer || prefersReducedMotion) return;

  const selector = '.card, .service-card, .stat';
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rotateX = (0.5 - py) * 6;
      const rotateY = (px - 0.5) * 6;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();

// ===== FIX: Ensure smooth load on page change =====
(function initPageLoad() {
  window.addEventListener('load', function() {
    document.querySelectorAll('.page-hero.cyber-hero, .hero.cyber-hero').forEach(el => {
      el.style.opacity = '1';
    });
  });
  
  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      document.querySelectorAll('.page-hero.cyber-hero, .hero.cyber-hero').forEach(el => {
        el.style.opacity = '1';
      });
    }
  });
})();

// ============================================================
// AI CHAT BOT - FAB UPDATE 2
// ============================================================

function toggleChat() {
  const modal = document.getElementById('aiChatModal');
  if (!modal) return;
  modal.classList.toggle('active');
  if (modal.classList.contains('active')) {
    const input = document.getElementById('chatInput');
    if (input) input.focus();
  }
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const message = input.value.trim();
  if (!message) return;
  
  addMessage(message, 'user');
  input.value = '';
  
  setTimeout(() => {
    const response = getBotResponse(message);
    addMessage(response, 'bot');
  }, 500 + Math.random() * 500);
}

function askQuestion(question) {
  addMessage(question, 'user');
  
  const quickQs = document.getElementById('quickQuestions');
  if (quickQs) {
    quickQs.style.display = 'none';
  }
  
  setTimeout(() => {
    const response = getBotResponse(question);
    addMessage(response, 'bot');
  }, 500 + Math.random() * 500);
}

function addMessage(text, sender) {
  const body = document.getElementById('chatBody');
  if (!body) return;
  
  const quickQs = document.getElementById('quickQuestions');
  if (quickQs && sender === 'user') {
    quickQs.style.display = 'none';
  }
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  
  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar';
  if (sender === 'bot') {
    avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';
  } else {
    avatar.innerHTML = '<i class="fa-solid fa-user"></i>';
  }
  
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.innerHTML = text;
  
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(bubble);
  
  body.appendChild(messageDiv);
  body.scrollTop = body.scrollHeight;
}

function getBotResponse(question) {
  const q = question.toLowerCase();
  
  if (q.includes('service') || q.includes('offer') || q.includes('provide')) {
    return `We offer a comprehensive range of IT and security solutions:<br><br>
    • CCTV & Video Surveillance<br>
    • Access Control & Biometrics<br>
    • Networking & IT Infrastructure<br>
    • Cyber & IT Security<br>
    • Fire Alarm & Safety Systems<br>
    • Engineering & System Integration<br><br>
    <strong>Would you like to know more about any specific service?</strong>`;
  }
  
  if (q.includes('quote') || q.includes('cost') || q.includes('price')) {
    return `To get a customized quote, please visit our <a href="contact.html" style="color:#1a8cff;font-weight:600;">Contact Page</a> or call us directly at <strong>+92 300 8005682</strong>.<br><br>
    Our team will get back to you within 24 hours with a detailed proposal.`;
  }
  
  if (q.includes('industry') || q.includes('sector') || q.includes('serve')) {
    return `We serve a wide range of industries including:<br><br>
    • Corporate Offices<br>
    • Industrial Facilities<br>
    • Commercial Buildings<br>
    • Educational Institutions<br>
    • Healthcare Facilities<br>
    • Government & Critical Infrastructure<br><br>
    Each solution is tailored to meet specific industry requirements.`;
  }
  
  if (q.includes('support') || q.includes('24/7') || q.includes('help')) {
    return `Yes! We provide <strong>24/7 Technical Support</strong> for all our clients.<br><br>
    • Emergency response team available round the clock<br>
    • Remote monitoring and support<br>
    • On-site support for critical issues<br>
    • Dedicated support hotline: <strong>+92 300 8005682</strong>`;
  }
  
  if (q.includes('location') || q.includes('where') || q.includes('address')) {
    return `Our main office is located in <strong>Pakistan</strong>.<br><br>
    We serve clients across the country with dedicated project teams.<br><br>
    For specific location details or site visits, please contact our team at <strong>+92 300 8005682</strong>.`;
  }
  
  if (q.includes('about') || q.includes('company') || q.includes('who')) {
    return `HNIS (HN Integrated Solutions) is a professional IT, security, and engineering solutions provider.<br><br>
    We specialize in delivering practical, scalable, and professionally integrated technology and security solutions for modern organizations.<br><br>
    Our approach combines system design, installation, integration, and long-term technical support.`;
  }
  
  return `Thank you for your question! 🤖<br><br>
  I'll connect you with our team to provide the best possible answer.<br><br>
  In the meantime, you can:<br>
  • Visit our <a href="services.html" style="color:#1a8cff;font-weight:600;">Services Page</a><br>
  • Check out our <a href="projects.html" style="color:#1a8cff;font-weight:600;">Project Portfolio</a><br>
  • <a href="contact.html" style="color:#1a8cff;font-weight:600;">Contact us</a> for immediate assistance<br><br>
  <strong>Is there anything specific you'd like to know?</strong>`;
}
// ===== CONTACT FORM - SEND OPTIONS =====

// Get form values helper
function getFormValues() {
  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('emailAddress').value.trim();
  const phone = document.getElementById('phoneNumber').value.trim();
  const service = document.getElementById('serviceSelect').value;
  const message = document.getElementById('messageText').value.trim();
  return { name, email, phone, service, message };
}

// Validate form
function validateForm() {
  const { name, email, phone, message } = getFormValues();
  
  if (!name) {
    showPopup('error', 'Please enter your full name.');
    return false;
  }
  if (!email) {
    showPopup('error', 'Please enter your email address.');
    return false;
  }
  if (!validateEmail(email)) {
    showPopup('error', 'Please enter a valid email address.');
    return false;
  }
  if (!phone) {
    showPopup('error', 'Please enter your phone number.');
    return false;
  }
  if (!message) {
    showPopup('error', 'Please describe your requirement.');
    return false;
  }
  return true;
}

// ===== SEND VIA WHATSAPP =====
function sendWhatsApp() {
  if (!validateForm()) return;
  
  const { name, email, phone, service, message } = getFormValues();
  const serviceName = service || 'Not Selected';
  
  const whatsappMessage = 
    `*New HNIS Inquiry*%0A%0A` +
    `*Name:* ${name}%0A` +
    `*Email:* ${email}%0A` +
    `*Phone:* ${phone}%0A` +
    `*Service:* ${serviceName}%0A%0A` +
    `*Message:* ${message}`;
  
  // Open WhatsApp
  window.open(`https://wa.me/923001234567?text=${whatsappMessage}`, '_blank');
  
  showPopup('success', `
    <strong>WhatsApp Message Sent! 💬</strong><br><br>
    Your inquiry has been sent via WhatsApp.<br><br>
    <strong>Details:</strong><br>
    👤 ${name}<br>
    📧 ${email}<br>
    📱 ${phone}<br>
    🔧 ${serviceName}<br><br>
    <small>Our team will respond to you shortly on WhatsApp.</small>
  `);
  
  document.getElementById('contactForm').reset();
}

// ===== SEND VIA EMAIL =====
function sendEmail() {
  if (!validateForm()) return;
  
  const { name, email, phone, service, message } = getFormValues();
  const serviceName = service || 'Not Selected';
  
  const subject = `New Inquiry from ${name}`;
  const body = 
    `Name: ${name}%0A` +
    `Email: ${email}%0A` +
    `Phone: ${phone}%0A` +
    `Service: ${serviceName}%0A%0A` +
    `Message:${message}`;
  
  // Open email client
  window.location.href = `mailto:info@hnis.com?subject=${subject}&body=${body}`;
  
  showPopup('success', `
    <strong>Email Sent! 📧</strong><br><br>
    Your inquiry has been sent via email.<br><br>
    <strong>Details:</strong><br>
    👤 ${name}<br>
    📧 ${email}<br>
    📱 ${phone}<br>
    🔧 ${serviceName}<br><br>
    <small>Our team will respond to you shortly via email.</small>
  `);
  
  document.getElementById('contactForm').reset();
}

// ===== SEND VIA BOTH (WhatsApp + Email) =====
function submitForm(event) {
  event.preventDefault();
  
  if (!validateForm()) return false;
  
  const { name, email, phone, service, message } = getFormValues();
  const serviceName = service || 'Not Selected';
  
  // Send WhatsApp
  const whatsappMessage = 
    `*New HNIS Inquiry*%0A%0A` +
    `*Name:* ${name}%0A` +
    `*Email:* ${email}%0A` +
    `*Phone:* ${phone}%0A` +
    `*Service:* ${serviceName}%0A%0A` +
    `*Message:* ${message}`;
  
  window.open(`https://wa.me/923001234567?text=${whatsappMessage}`, '_blank');
  
  // Send Email
  const subject = `New Inquiry from ${name}`;
  const body = 
    `Name: ${name}%0A` +
    `Email: ${email}%0A` +
    `Phone: ${phone}%0A` +
    `Service: ${serviceName}%0A%0A` +
    `Message: ${message}`;
  
  window.location.href = `mailto:info@hnis.com?subject=${subject}&body=${body}`;
  
  showPopup('success', `
    <strong>Inquiry Sent! ✅</strong><br><br>
    Your inquiry has been sent via <strong>WhatsApp & Email</strong>.<br><br>
    <strong>Details:</strong><br>
    👤 ${name}<br>
    📧 ${email}<br>
    📱 ${phone}<br>
    🔧 ${serviceName}<br><br>
    <small>Our team will respond to you shortly.</small>
  `);
  
  document.getElementById('contactForm').reset();
  return false;
}

// ===== EMAIL VALIDATION =====
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ===== POPUP FUNCTION =====
function showPopup(type, message) {
  let popup = document.getElementById('customPopup');
  
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'customPopup';
    popup.className = 'custom-popup';
    document.body.appendChild(popup);
  }
  
  const icon = type === 'success' ? '✅' : '❌';
  const title = type === 'success' ? 'Success!' : 'Error!';
  const color = type === 'success' ? '#10b981' : '#ef4444';
  
  popup.innerHTML = `
    <div class="popup-overlay">
      <div class="popup-box ${type}">
        <div class="popup-header" style="background: ${color}">
          <span class="popup-icon">${icon}</span>
          <span class="popup-title">${title}</span>
          <button class="popup-close" onclick="closePopup()">×</button>
        </div>
        <div class="popup-body">
          ${message}
        </div>
        <div class="popup-footer">
          <button class="popup-btn ${type}" onclick="closePopup()">OK, Got it!</button>
        </div>
      </div>
    </div>
  `;
  
  if (!document.getElementById('popupStyles')) {
    const styles = document.createElement('style');
    styles.id = 'popupStyles';
    styles.textContent = `
      .custom-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99999;
        animation: popupFadeIn 0.3s ease;
      }
      .popup-overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(4px);
        padding: 20px;
      }
      .popup-box {
        max-width: 450px;
        width: 100%;
        background: #fff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 25px 60px rgba(0,0,0,0.3);
        animation: popupSlideUp 0.3s ease;
      }
      .popup-header {
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: #fff;
      }
      .popup-icon { font-size: 24px; }
      .popup-title { font-size: 18px; font-weight: 700; flex: 1; }
      .popup-close {
        background: none;
        border: none;
        color: #fff;
        font-size: 28px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s ease;
        padding: 0 4px;
      }
      .popup-close:hover { opacity: 1; }
      .popup-body {
        padding: 25px 20px 20px;
        font-size: 14px;
        line-height: 1.7;
        color: #1a2a4a;
      }
      .popup-body strong { color: #0a3a6b; }
      .popup-body small {
        color: #7a8a9a;
        font-size: 12px;
        display: block;
        margin-top: 10px;
        font-style: italic;
      }
      .popup-footer {
        padding: 10px 20px 20px;
        display: flex;
        justify-content: flex-end;
      }
      .popup-btn {
        padding: 10px 30px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #fff;
      }
      .popup-btn.success { background: linear-gradient(135deg, #10b981, #059669); }
      .popup-btn.error { background: linear-gradient(135deg, #ef4444, #dc2626); }
      .popup-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      }
      @keyframes popupFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes popupSlideUp {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @media(max-width: 480px) {
        .popup-box { margin: 10px; }
        .popup-body { padding: 20px 16px 16px; font-size: 13px; }
        .popup-header { padding: 14px 16px; }
        .popup-title { font-size: 16px; }
      }
    `;
    document.head.appendChild(styles);
  }
}

function closePopup() {
  const popup = document.getElementById('customPopup');
  if (popup) {
    popup.style.animation = 'popupFadeIn 0.2s ease reverse';
    setTimeout(() => popup.remove(), 300);
  }
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('popup-overlay')) closePopup();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closePopup();
});
// ============================================================
// TECHNICAL PORTFOLIO - INDUSTRIES PAGE
// ============================================================

const portfolioData = {
  cctv: {
    badge: 'CCTV Systems',
    title: '4K Ultra HD IP Cameras',
    description: 'High-resolution IP cameras with 4K UHD clarity, advanced low-light sensors, and 24/7 continuous recording.',
    features: [
      '4K Ultra HD Resolution',
      'Advanced Low-Light Sensors',
      '24/7 Continuous Recording',
      'AI Motion Detection',
      'Remote Monitoring Access'
    ],
    image: 'images/cctv-system.jpg',
    icon: 'fa-solid fa-video'
  },
  access: {
    badge: 'Access Control',
    title: 'Biometric & Smart Access',
    description: 'Secure control of people and entry points with modern identification technologies.',
    features: [
      'Biometric Readers (Fingerprint, Face)',
      'Card & PIN Systems',
      'Mobile Access Solutions',
      'Time Attendance Integration',
      'Remote Door Management'
    ],
    image: 'images/access-control-system.jpg',
    icon: 'fa-solid fa-fingerprint'
  },
  networking: {
    badge: 'Networking',
    title: 'Enterprise Network Infrastructure',
    description: 'Reliable connectivity and structured infrastructure for business-critical systems.',
    features: [
      'Structured Cabling (Cat6, Cat7)',
      'Fiber Optics Installation',
      'Enterprise Switching & Routing',
      'Wi-Fi 6/6E Infrastructure',
      'Network Security & Monitoring'
    ],
    image: 'images/networking-system.jpg',
    icon: 'fa-solid fa-network-wired'
  },
  fire: {
    badge: 'Fire Safety',
    title: 'Advanced Fire Detection Systems',
    description: 'Life-safety systems for early detection, notification and emergency response.',
    features: [
      'Intelligent Fire Panels',
      'Smoke & Heat Detection',
      'Alarm Integration',
      'Emergency Voice Evacuation',
      '24/7 Remote Monitoring'
    ],
    image: 'images/fire-safety-system.jpg',
    icon: 'fa-solid fa-fire-extinguisher'
  },
  cyber: {
    badge: 'Cyber Security',
    title: 'Enterprise Cyber Security',
    description: 'Security-minded infrastructure and controls designed to reduce technology risks.',
    features: [
      'Network Security & Firewalls',
      'System Hardening',
      'Secure Infrastructure Design',
      'Vulnerability Assessments',
      'Security Monitoring & Response'
    ],
    image: 'images/cyber-security-system.jpg',
    icon: 'fa-solid fa-shield-halved'
  },
  integration: {
    badge: 'System Integration',
    title: 'End-to-End System Integration',
    description: 'Complete integration of security, IT and building technologies into one unified platform.',
    features: [
      'Multi-System Integration',
      'Centralized Monitoring',
      'Scalable Architecture',
      'Legacy System Upgrades',
      'Future-Ready Infrastructure'
    ],
    image: 'images/integration-system.jpg',
    icon: 'fa-solid fa-server'
  }
};

function showPortfolio(target) {
  // Update active button
  document.querySelectorAll('.portfolio-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`.portfolio-btn[data-target="${target}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
  
  // Get data
  const data = portfolioData[target];
  if (!data) return;
  
  // Update content
  const container = document.getElementById('portfolioContent');
  if (!container) return;
  
  container.innerHTML = `
    <div class="portfolio-text">
      <span class="badge"><i class="${data.icon}"></i> ${data.badge}</span>
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <ul>
        ${data.features.map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join('')}
      </ul>
    </div>
    <div class="portfolio-image">
      <img src="${data.image}" alt="${data.badge}" onerror="this.parentElement.innerHTML='<i class=\\'fa-solid ${data.icon} placeholder-icon\\'></i>'">
    </div>
  `;
  
  // Re-trigger animation
  container.style.animation = 'none';
  setTimeout(() => {
    container.style.animation = 'contentFade 0.4s ease';
  }, 10);
}

// Load default content on page load
document.addEventListener('DOMContentLoaded', function() {
  showPortfolio('cctv');
});
// ============================================================
// PROJECT SLIDER - MULTI IMAGES
// ============================================================

// Store slide states
const slideStates = {};

function initSlider(projectId) {
  if (!slideStates[projectId]) {
    slideStates[projectId] = {
      currentSlide: 0,
      totalSlides: document.querySelectorAll(`#dots-${projectId} .dot`).length
    };
  }
}

function changeSlide(projectId, direction) {
  initSlider(projectId);
  const state = slideStates[projectId];
  const track = document.querySelector(`.project-slider[data-project="${projectId}"] .slider-track`);
  const dots = document.querySelectorAll(`#dots-${projectId} .dot`);
  
  if (!track) return;
  
  state.currentSlide += direction;
  
  if (state.currentSlide < 0) {
    state.currentSlide = state.totalSlides - 1;
  } else if (state.currentSlide >= state.totalSlides) {
    state.currentSlide = 0;
  }
  
  track.style.transform = `translateX(-${state.currentSlide * 100}%)`;
  
  // Update dots
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === state.currentSlide);
  });
}

function goToSlide(projectId, slideIndex) {
  initSlider(projectId);
  const state = slideStates[projectId];
  const track = document.querySelector(`.project-slider[data-project="${projectId}"] .slider-track`);
  const dots = document.querySelectorAll(`#dots-${projectId} .dot`);
  
  if (!track) return;
  
  state.currentSlide = slideIndex;
  track.style.transform = `translateX(-${slideIndex * 100}%)`;
  
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === slideIndex);
  });
}

// Auto-slide for each project
function startAutoSlide(projectId) {
  setInterval(() => {
    changeSlide(projectId, 1);
  }, 4000);
}

// Initialize all sliders on page load
document.addEventListener('DOMContentLoaded', function() {
  const sliders = document.querySelectorAll('.project-slider');
  sliders.forEach(slider => {
    const projectId = slider.dataset.project;
    initSlider(projectId);
    startAutoSlide(projectId);
  });
});

// Pause auto-slide on hover
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    // Pause auto-slide (optional)
  });
});