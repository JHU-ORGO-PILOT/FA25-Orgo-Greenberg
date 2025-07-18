// Open PDF and different websites in a new page

document.querySelectorAll('a').forEach(link => {
    if (link.closest('navbar')) return;

    const href = link.getAttribute('href');
    if (href && href.toLowerCase().endsWith('.pdf')) {
      link.setAttribute('target', '_blank');
    }

    if (href && href.toLowerCase().startsWith('https://jhu-ode-pilot.github.io/FA25')) {
      link.setAttribute('target', '_blank');
    }
  });