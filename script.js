document.body.classList.add("lock");

const opening = document.getElementById("opening");
const envelope = document.getElementById("envelope");
const site = document.getElementById("site");
const letterLogo = document.querySelector(".letter-mark img");
const siteLogo = document.querySelector(".site .logo");
const logoBridge = document.getElementById("logoBridge");
let opened = false;

function openLogoTransition() {
  if (!letterLogo || !siteLogo || !logoBridge) return;

  // Capture the exact starting position of the logo before the envelope begins to zoom.
  const from = letterLogo.getBoundingClientRect();

  // Hide the real logo on the letter immediately; the bridge takes over its visual position.
  letterLogo.style.opacity = "0";
  logoBridge.style.left = `${from.left}px`;
  logoBridge.style.top = `${from.top}px`;
  logoBridge.style.width = `${from.width}px`;
  logoBridge.style.height = `${from.height}px`;
  logoBridge.style.opacity = "1";

  // Measure the destination without permanently changing the site's visibility.
  // The site is rendered behind the opening layer during the handoff.
  const oldAnimation = site.style.animation;
  const oldTransform = site.style.transform;
  const oldOpacity = site.style.opacity;
  const oldVisibility = site.style.visibility;
  site.style.animation = "none";
  site.style.transform = "scale(1)";
  site.style.visibility = "visible";
  site.style.opacity = "1";
  const to = siteLogo.getBoundingClientRect();
  site.style.animation = oldAnimation;
  site.style.transform = oldTransform;
  site.style.opacity = oldOpacity;
  site.style.visibility = oldVisibility;

  const duration = 1150;
  logoBridge.animate([
    {
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
      opacity: 1
    },
    {
      left: `${to.left}px`,
      top: `${to.top}px`,
      width: `${to.width}px`,
      height: `${to.height}px`,
      opacity: 1
    }
  ], {
    duration,
    easing: "cubic-bezier(.18,.78,.2,1)",
    fill: "forwards"
  }).finished.then(() => {
    logoBridge.style.opacity = "0";
    siteLogo.classList.remove("logo-target-hidden");
  });
}

function openInvitation() {
  if (opened) return;
  opened = true;

  // The envelope and the invitation reveal overlap. The real site is brought
  // in behind the opening layer early, so it can never disappear after the
  // handoff. The bridge logo visually connects the two identical logos.
  opening.classList.add("open");
  siteLogo.classList.add("logo-target-hidden");
  site.classList.add("show");
  openLogoTransition();

  // Give the letter/envelope zoom a little time before fading the opening layer.
  setTimeout(() => {
    opening.classList.add("hide");
    document.body.classList.remove("lock");
    window.scrollTo(0, 0);
  }, 1450);
}

envelope.addEventListener("click", openInvitation);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openInvitation();
});

const sections = document.querySelectorAll(".section");
sections.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

sections.forEach((el) => observer.observe(el));
