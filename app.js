document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Brand Filter & Dynamic Catalog
  const filterTabs = document.querySelectorAll('.filter-tab');
  const catalogContainer = document.querySelector('.cars-grid');

  if (filterTabs.length > 0 && catalogContainer) {
    let allCars = [];

    // Fetch all cars first
    fetch('cars.json')
      .then(res => res.json())
      .then(data => {
        allCars = data;
        renderCars('all');
      });

    function renderCars(filter) {
      catalogContainer.innerHTML = '';
      
      const filteredCars = filter === 'all' 
        ? allCars 
        : allCars.filter(car => car.brand.toLowerCase() === filter.toLowerCase());

      filteredCars.forEach((car, index) => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.setAttribute('data-brand', car.brand);
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        card.innerHTML = `
          <div class="car-image-container">
            <span class="car-type-badge">${car.type}</span>
            <button class="favorite-btn" aria-label="Add to favorite">
              <img src="assets/15ba76840679dd18c8c297f4f032bf8b.svg" alt="fav" />
            </button>
            <img src="${car.image}" alt="${car.name}" class="car-card-img" />
          </div>
          <div class="car-info">
            <div class="car-meta">
              <h3 class="car-name">${car.name}</h3>
              <div class="car-rating">
                <img src="assets/e38684741a1ae66798cec0dfafd32d4f.svg" alt="star" />
                <span>${car.rating.toFixed(1)}</span>
              </div>
            </div>
            <p class="car-desc">${car.description}</p>
            <div class="car-specs">
              <div class="spec-item">
                <img src="assets/90082a44e6933041569253005098a239.svg" class="spec-icon" alt="icon" />
                ${car.year}
              </div>
              <div class="spec-item">
                <img src="assets/90082a44e6933041569253005098a239.svg" class="spec-icon" alt="icon" />
                ${car.hp}
              </div>
              <div class="spec-item">
                <img src="assets/90082a44e6933041569253005098a239.svg" class="spec-icon" alt="icon" />
                ${car.transmission}
              </div>
              <div class="spec-item">
                <img src="assets/90082a44e6933041569253005098a239.svg" class="spec-icon" alt="icon" />
                ${car.capacity}
              </div>
            </div>
            <div class="car-footer">
              <div class="car-price">${car.price}</div>
              <a href="detail.html?id=${car.id}" class="btn btn-primary btn-sm">Buy Now</a>
            </div>
          </div>
        `;
        
        catalogContainer.appendChild(card);
        
        // Staggered animation
        setTimeout(() => {
          card.style.transition = 'all 0.5s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      });

      // Re-attach favorite button listeners
      attachFavoriteListeners();
    }

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderCars(tab.getAttribute('data-filter'));
      });
    });
  }

  function attachFavoriteListeners() {
    const favBtns = document.querySelectorAll('.favorite-btn');
    favBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.classList.toggle('active');
        if (btn.classList.contains('active')) {
          btn.style.backgroundColor = 'rgba(227, 28, 28, 0.2)';
        } else {
          btn.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        }
      });
    });
  }

  // Update navbar/header actions dynamically based on login session
  const headerActions = document.querySelector('.header-actions');
  // Variabel navMenu sudah dideklarasikan di bagian atas (Mobile Menu Toggle)

  if (localStorage.getItem('userLoggedIn') === 'true') {
    if (headerActions) {
      headerActions.innerHTML = `
        <a href="dashboard.html" class="btn btn-secondary">Dashboard</a>
        <a href="index.html" class="btn btn-primary" id="nav-logout">Logout</a>
      `;
      
      const logoutBtn = document.getElementById('nav-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('userLoggedIn');
        });
      }
    }
    
    if (navMenu) {
      // Avoid duplicate links and add member links
      if (!navMenu.querySelector('a[href="dashboard.html"]')) {
        const dashboardLink = document.createElement('a');
        dashboardLink.href = 'dashboard.html';
        dashboardLink.className = 'nav-link';
        dashboardLink.textContent = 'Dashboard';
        navMenu.appendChild(dashboardLink);
      }
      if (!navMenu.querySelector('a[href="profile.html"]')) {
        const profileLink = document.createElement('a');
        profileLink.href = 'profile.html';
        profileLink.className = 'nav-link';
        profileLink.textContent = 'Profile';
        navMenu.appendChild(profileLink);
      }
    }
  }

  // 4. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => {
        const isAnswerVisible = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(i => {
          i.classList.remove('active');
          const answer = i.querySelector('.faq-answer');
          answer.style.maxHeight = null;
        });

        // Open current item if it wasn't open
        if (!isAnswerVisible) {
          item.classList.add('active');
          const answer = item.querySelector('.faq-answer');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });

    // Open first FAQ by default
    const firstFaq = faqItems[0];
    if (firstFaq) {
      firstFaq.classList.add('active');
      const answer = firstFaq.querySelector('.faq-answer');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  }

  // Favorite button toggle (Fallback for static elements if any)
  attachFavoriteListeners();
});
