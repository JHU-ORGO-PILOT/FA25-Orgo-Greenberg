// --- Get DOM Elements ---
const urlParams = new URLSearchParams(window.location.search);
const url = urlParams.get('pdf');

const canvas = document.getElementById('pdf-render');
const ctx = canvas.getContext('2d');
const loadingMsg = document.getElementById('loading');

const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const pageNumDisplay = document.getElementById('page-num');
const pageCountDisplay = document.getElementById('page-count');

const resultModal = document.getElementById('result-modal');
const resultText = document.getElementById('result-text');
const usrPassword = document.getElementById('usrPassword');
const enterBtn = document.getElementById('enter');

const downloadBtn = document.getElementById('download');
const ddlC = document.getElementById('ddl');

// --- PDF.js Worker ---
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// --- State Variables ---
let pdfDoc = null;
let pageNum = 1;
let pageCount = 0;
let scale = 3.0; // Default scale

// --- Modal Helpers ---
function showPasswordModal() {
  ddlC.style.display = 'none';
  resultModal.style.display = "flex";
  usrPassword.value = "";
  usrPassword.focus();
}

function hidePasswordModal() {
  resultModal.style.display = "none";
}

// --- Page/UI Helpers ---
function checkPage() {
  nextBtn.disabled = pageNum >= pageCount;
  prevBtn.disabled = pageNum <= 1;
}

// --- Render PDF Page ---
function renderPage(num) {
  loadingMsg.style.display = "block";
  pdfDoc.getPage(num).then((page) => {
    const viewport = page.getViewport({ scale: scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    page.render(renderContext).promise.then(() => {
      loadingMsg.style.display = "none";
      pageNumDisplay.textContent = pageNum;
      checkPage();
    });
  });
}

// --- PDF Loader (with password) ---
function loadPdf(password) {
  let loadingTask = pdfjsLib.getDocument({
    url: url,
    password: password,
  });

  loadingTask.promise
    .then((doc) => {
      pdfDoc = doc;
      pageCount = doc.numPages;
      pageCountDisplay.textContent = pageCount;
      pageNum = 1;
      renderPage(pageNum);
      hidePasswordModal();
      checkPage();
    })
    .catch((err) => {
      // PDF.js error code 2 or PasswordException
      if (err && (err.code === 2 || err.name === "PasswordException")) {
        let msg = "Password required";
        if (err.message && err.message.includes("incorrect")) {
          msg = "Incorrect password. Try again:";
        }
        showPasswordModal();
      } else {
        console.error("PDF load error:", err);
        loadingMsg.textContent = "Failed to load PDF.";
      }
    });
}

// --- Page Navigation ---
function queueRenderPage(num) {
  if (num >= 1 && num <= pageCount) {
    pageNum = num;
    renderPage(pageNum);
  }
  checkPage();
}

function nextPage() {
  if (pageNum < pageCount) {
    queueRenderPage(pageNum + 1);
  }
}

function prevPage() {
  if (pageNum > 1) {
    queueRenderPage(pageNum - 1);
  }
}

// --- Zoom ---
function zoomIn() {
  scale += 0.25;
  renderPage(pageNum);
}
function zoomOut() {
  if (scale > 0.5) {
    scale -= 0.25;
    renderPage(pageNum);
  }
}

// --- Event Listeners ---
prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);

// OPTIONAL: If you have zoom in/out buttons, wire them here:
// document.getElementById('zoom-in').addEventListener("click", zoomIn);
// document.getElementById('zoom-out').addEventListener("click", zoomOut);

enterBtn.addEventListener("click", function () {
  const pw = usrPassword.value;
  loadingMsg.textContent = "Loading PDF ...";
  hidePasswordModal();
  loadPdf(pw);
});
usrPassword.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    enterBtn.click();
  }
});

resultModal.style.display = "none";

// --- Initial PDF Load ---
if (!url) {
  loadingMsg.textContent = "Invalid URL.";
} else {
  loadPdf();
}

downloadBtn.addEventListener('click', function() {
    loadingMsg.textContent = "Preparing download...";
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.blob();
        })
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = url.split('/').pop() || 'file.pdf';
            document.body.appendChild(a);

            // Programmatically click the link:
            a.click();

            // CLEAN UP
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
            loadingMsg.textContent = "";
        })
        .catch(err => {
            loadingMsg.textContent = "Failed to download PDF.";
            console.error("Download failed:", err);
        });
});

for (let i = 0; i <= 9; i++) {
  let numBtn = document.getElementById(i);
  numBtn.addEventListener('click', function() {
    usrPassword.value = usrPassword.value + i;
  })
}

const clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', function() {
  usrPassword.value = "";
})