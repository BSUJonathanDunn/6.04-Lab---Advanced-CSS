  const logo = document.getElementById('leplogo');
  const sound = document.getElementById('hover-sound');

  sound.volume = 0.08;

  logo.addEventListener('mouseenter', () => {
    sound.currentTime = 0; // rewind to start
    sound.play();
  });

  document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const dropdown = document.getElementById('dropdown');

// Toggle menu when button is clicked
menuBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // prevent click from reaching document
  dropdown.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});

// Optional: close menu on link click (good for mobile)
dropdown.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    dropdown.classList.remove('active');
  });
});
  });

