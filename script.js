const root = document.documentElement;
    const navbar = document.getElementById("navbar");
    const navMenu = document.getElementById("navMenu");
    const menuToggle = document.getElementById("menuToggle");
    const themeToggle = document.getElementById("themeToggle");
    const photoUpload = document.getElementById("photoUpload");
    const photoPreview = document.getElementById("photoPreview");
    const toast = document.getElementById("toast");
    const cursorDot = document.getElementById("cursorDot");
    const cursorRing = document.getElementById("cursorRing");
    const scrollProgress = document.getElementById("scrollProgress");
    const backToTop = document.getElementById("backToTop");
    const currentSectionText = document.getElementById("currentSectionText");

    const savedTheme = localStorage.getItem("kesya-cv-classic-gold");
    if (savedTheme) {
      root.setAttribute("data-theme", savedTheme);
      themeToggle.textContent = savedTheme === "dark" ? "☾" : "☀";
    }

    themeToggle.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", nextTheme);
      localStorage.setItem("kesya-cv-classic-gold", nextTheme);
      themeToggle.textContent = nextTheme === "dark" ? "☾" : "☀";
    });

    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      menuToggle.textContent = navMenu.classList.contains("open") ? "✕" : "☰";
    });

    document.querySelectorAll(".nav-link, .ribbon-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.textContent = "☰";
      });
    });

    window.addEventListener("scroll", () => {
      navbar.classList.toggle("shrink", window.scrollY > 35);

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      scrollProgress.style.width = progress + "%";

      backToTop.classList.toggle("show", window.scrollY > 520);
    });

    document.getElementById("year").textContent = new Date().getFullYear();

    const roleTyping = document.getElementById("roleTyping");
    const roleText = "Mahasiswa Sistem Informasi";
    let roleIndex = 0;

    function typeRole() {
      roleTyping.textContent = roleText.slice(0, roleIndex);
      if (roleIndex < roleText.length) {
        roleIndex++;
        setTimeout(typeRole, 62);
      }
    }

    setTimeout(typeRole, 900);

    photoUpload.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const imageURL = URL.createObjectURL(file);
      photoPreview.style.backgroundImage =
        "linear-gradient(135deg, rgba(201,162,39,.13), rgba(31,78,74,.16)), url('" + imageURL + "')";
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".progress span").forEach(bar => {
            bar.style.width = bar.dataset.width;
          });
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll(".skill-card").forEach(card => progressObserver.observe(card));

    const skillCounterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.target);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 45));

        function updateCounter() {
          current += step;
          if (current >= target) {
            counter.textContent = target + "%";
            return;
          }
          counter.textContent = current + "%";
          requestAnimationFrame(updateCounter);
        }

        updateCounter();
        skillCounterObserver.unobserve(counter);
      });
    }, { threshold: .7 });

    document.querySelectorAll(".skill-percent").forEach(counter => {
      skillCounterObserver.observe(counter);
    });

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    const ribbonLinks = document.querySelectorAll(".ribbon-link");

    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navLinks.forEach(link => link.classList.remove("active"));
        ribbonLinks.forEach(link => link.classList.remove("active"));

        const activeNav = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        const activeRibbon = document.querySelector('.ribbon-link[href="#' + entry.target.id + '"]');

        if (activeNav) activeNav.classList.add("active");
        if (activeRibbon) activeRibbon.classList.add("active");

        const labelMap = {
          home: "Home",
          about: "About Me",
          skills: "Skills",
          journey: "Journey",
          works: "Works",
          contact: "Contact"
        };

        currentSectionText.textContent = labelMap[entry.target.id] || "Home";
      });
    }, { rootMargin: "-45% 0px -45% 0px" });

    sections.forEach(section => activeObserver.observe(section));

    const form = document.getElementById("contactForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    function setInvalid(input, invalid) {
      input.closest(".field").classList.toggle("invalid", invalid);
    }

    function validEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInvalid = nameInput.value.trim().length < 3;
      const emailInvalid = !validEmail(emailInput.value.trim());
      const messageInvalid = messageInput.value.trim().length < 10;

      setInvalid(nameInput, nameInvalid);
      setInvalid(emailInput, emailInvalid);
      setInvalid(messageInput, messageInvalid);

      if (!nameInvalid && !emailInvalid && !messageInvalid) {
        form.reset();
        toast.classList.add("show");

        setTimeout(() => {
          toast.classList.remove("show");
        }, 3200);
      }
    });

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let lastSparkleTime = 0;

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursorDot.style.opacity = "1";
      cursorRing.style.opacity = "1";
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";

      const now = Date.now();
      if (now - lastSparkleTime > 45 && window.innerWidth > 768) {
        createCursorSparkle(mouseX, mouseY);
        lastSparkleTime = now;
      }
    });

    function createCursorSparkle(x, y) {
      const sparkle = document.createElement("span");
      sparkle.className = "cursor-sparkle";
      sparkle.style.left = x + "px";
      sparkle.style.top = y + "px";

      const offsetX = (Math.random() * 26 - 13).toFixed(1) + "px";
      const offsetY = (Math.random() * 26 - 13).toFixed(1) + "px";
      sparkle.style.setProperty("--spark-x", offsetX);
      sparkle.style.setProperty("--spark-y", offsetY);

      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 560);
    }

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      cursorRing.style.left = ringX + "px";
      cursorRing.style.top = ringY + "px";

      requestAnimationFrame(animateCursor);
    }

    animateCursor();


    document.querySelectorAll(".work-card").forEach(card => {
      card.addEventListener("click", (event) => {
        if (event.target.closest("a")) return;
        card.classList.toggle("is-flipped");
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          card.classList.toggle("is-flipped");
        }
      });
    });

    document.querySelectorAll("a, button, label, input, textarea, .work-card, .tag, .journey-card").forEach(item => {
      item.addEventListener("mouseenter", () => cursorRing.classList.add("hover"));
      item.addEventListener("mouseleave", () => cursorRing.classList.remove("hover"));
    });

    window.addEventListener("mouseleave", () => {
      cursorDot.style.opacity = "0";
      cursorRing.style.opacity = "0";
    });