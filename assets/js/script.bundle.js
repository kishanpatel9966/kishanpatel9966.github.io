(function () {
  var body = document.body;
  var header = document.querySelector(".site-header");
  var nav = document.querySelector(".site-nav");
  var navLinks = document.querySelectorAll(".site-nav a");
  var menuToggle = document.querySelector(".menu-toggle");
  var themeToggle = document.querySelector(".theme-toggle");
  var loader = document.querySelector(".page-loader");
  var revealItems = document.querySelectorAll(".fade-up");
  var progressBars = document.querySelectorAll(".progress-bar span");
  var filterButtons = document.querySelectorAll(".filter-btn");
  var projects = document.querySelectorAll(".project");
  var projectSliders = document.querySelectorAll("[data-slider]");
  var typingNode = document.querySelector(".typing-text");
  var backToTopLink = document.querySelector(".back-to-top");
  var sections = document.querySelectorAll("main section[id]");
  var typingIndex = 0;
  var charIndex = 0;
  var isDeleting = false;

  function applyTheme(theme) {
    var root = document.documentElement;
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    root.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(theme === "light"));
    }

    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "light" ? "#f5f8ff" : "#0d1320");
    }
  }

  function hideLoader() {
    if (!loader) {
      return;
    }
    window.setTimeout(function () {
      loader.classList.add("is-hidden");
    }, 450);
  }

  function updateHeaderState() {
    if (!header) {
      return;
    }
    header.classList.toggle("scrolled", window.scrollY > 50);
  }

  function setActiveLink() {
    var scrollPosition = window.scrollY + 140;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute("id");

      if (scrollPosition >= top && scrollPosition < bottom) {
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  }

  function revealOnScroll() {
    var triggerBottom = window.scrollY + window.innerHeight - 80;

    revealItems.forEach(function (item) {
      if (item.offsetTop < triggerBottom) {
        item.classList.add("show");
      }
    });

    progressBars.forEach(function (bar) {
      var card = bar.closest(".skill-card");
      if (card && card.classList.contains("show")) {
        bar.style.width = bar.getAttribute("data-progress") + "%";
      }
    });
  }

  function toggleMenu(forceClose) {
    if (!menuToggle || !nav) {
      return;
    }

    var shouldOpen = forceClose ? false : !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", shouldOpen);
    menuToggle.classList.toggle("active", shouldOpen);
    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
    body.classList.toggle("menu-open", shouldOpen);
  }

  function filterProjects(filterValue) {
    projects.forEach(function (project) {
      var matches = filterValue === "all" || project.classList.contains(filterValue);
      project.classList.toggle("is-hidden", !matches);
    });
  }

  function startProjectSliders() {
    projectSliders.forEach(function (slider) {
      var slides = slider.querySelectorAll("img");
      var activeIndex = 0;

      if (slides.length < 2) {
        return;
      }

      window.setInterval(function () {
        if (slider.closest(".project-card") && slider.closest(".project-card").classList.contains("is-hidden")) {
          return;
        }

        slides[activeIndex].classList.remove("is-active");
        activeIndex = (activeIndex + 1) % slides.length;
        slides[activeIndex].classList.add("is-active");
      }, 2600);
    });
  }

  function stabilizeTypingWidth() {
    if (!typingNode) {
      return;
    }

    var roles = (typingNode.getAttribute("data-roles") || "").split(",");
    if (!roles.length || !roles[0]) {
      return;
    }

    var longestRole = roles.reduce(function (longest, role) {
      return role.length > longest.length ? role : longest;
    }, "");

    if (window.innerWidth <= 479) {
      typingNode.style.minWidth = "0";
      return;
    }

    if (window.innerWidth <= 767) {
      typingNode.style.minWidth = Math.min(longestRole.length, 18) + "ch";
      return;
    }

    typingNode.style.minWidth = longestRole.length + 1 + "ch";
  }

  function runTyping() {
    if (!typingNode) {
      return;
    }

    var roles = (typingNode.getAttribute("data-roles") || "").split(",");
    if (!roles.length || !roles[0]) {
      return;
    }

    var currentRole = roles[typingIndex];
    var visibleText = isDeleting
      ? currentRole.substring(0, charIndex - 1)
      : currentRole.substring(0, charIndex + 1);

    typingNode.textContent = visibleText;
    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

    var speed = isDeleting ? 55 : 105;

    if (!isDeleting && visibleText === currentRole) {
      speed = 1400;
      isDeleting = true;
    } else if (isDeleting && visibleText === "") {
      isDeleting = false;
      typingIndex = (typingIndex + 1) % roles.length;
      speed = 220;
    }

    window.setTimeout(runTyping, speed);
  }

  window.addEventListener("load", function () {
    applyTheme(document.documentElement.getAttribute("data-theme") || "dark");
    hideLoader();
    updateHeaderState();
    setActiveLink();
    revealOnScroll();
    stabilizeTypingWidth();
    runTyping();
    startProjectSliders();
  });

  window.addEventListener("scroll", function () {
    updateHeaderState();
    setActiveLink();
    revealOnScroll();
  });

  window.addEventListener("resize", function () {
    stabilizeTypingWidth();
  });

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      toggleMenu(false);
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  if (backToTopLink) {
    backToTopLink.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      toggleMenu(true);
    });
  });

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filterValue = button.getAttribute("data-filter");

      filterButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");
      filterProjects(filterValue);
    });
  });

  var contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  }
})();
