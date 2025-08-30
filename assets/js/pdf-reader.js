document.addEventListener("DOMContentLoaded", function () {
  const pdfLinks = document.querySelectorAll('a[href$=".pdf"]');  // Select all PDF links

  // Comment out this file to disable pdf redirect.
  // Attach click event listener to each PDF link
  pdfLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      const pdfUrl = link.getAttribute('href'); // Open the PDF renderer in a new tab with the PDF URL as a query parameter
      if (!/^https?:\/\//i.test(pdfUrl)) {
        event.preventDefault(); // Prevent default link behavior
        window.open('/FA25-Orgo-Greenberg/assets/html/pdf-reader.html?pdf=' + encodeURIComponent(pdfUrl), '_blank');
      }
    });
  });
});