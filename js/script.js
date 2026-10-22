///////////////////////////////////////////////////////////
// Làm cho thanh điều hướng chính hoạt động

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

///////////////////////////////////////////////////////////
// Hiệu ứng cuộn mượt mà

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const href = link.getAttribute("href");

    // Scroll back to top
    if (href === "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    // Scroll to other links
    if (href !== "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({ behavior: "smooth" });
    }

    // Close mobile naviagtion
    if (link.classList.contains("main-nav-link"))
      headerEl.classList.toggle("nav-open");
  });
});

///////////////////////////////////////////////////////////
// Sticky navigation

const sectionHeroEl = document.querySelector(".section-hero");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    console.log(ent);

    if (ent.isIntersecting === false) {
      document.body.classList.add("sticky");
    }

    if (ent.isIntersecting === true) {
      document.body.classList.remove("sticky");
    }
  },
  {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  },
);
obs.observe(sectionHeroEl);

///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  console.log(isSupported);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();


///////////////////////////////////////////////////////////
// Xử lý chuyển đổi Tab danh mục món ăn (Tham khảo Ảnh 1)
const tabButtons = document.querySelectorAll(".menu-tab-btn");
tabButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    tabButtons.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
  });
});

///////////////////////////////////////////////////////////
// Xử lý Form Đặt Bàn & Lưu dữ liệu (Tham khảo Ảnh 2 - TV4 & TV5)
const bookingForm = document.getElementById("restaurant-booking-form");
const bookingModal = document.getElementById("booking-modal");
const btnCloseModal = document.getElementById("btn-close-modal");
const modalDetails = document.getElementById("modal-details");
const bookDateInput = document.getElementById("book-date");

// Thiết lập ngày mặc định là hôm nay
if (bookDateInput) {
  const today = new Date().toISOString().split("T")[0];
  bookDateInput.value = today;
  bookDateInput.min = today;
}

if (bookingForm) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const bookingData = {
      id: "KD-" + Math.floor(1000 + Math.random() * 9000),
      name: document.getElementById("book-name").value,
      phone: document.getElementById("book-phone").value,
      location: document.getElementById("book-location").value,
      guests: document.getElementById("book-guests").value,
      date: document.getElementById("book-date").value,
      time: document.getElementById("book-time").value,
      setMenu: document.getElementById("book-set").value,
      notes: document.getElementById("book-notes").value || "Không có",
      createdAt: new Date().toLocaleString("vi-VN"),
    };

    // TV5: Lưu trữ dữ liệu vào LocalStorage
    let savedBookings = JSON.parse(localStorage.getItem("kron_bookings") || "[]");
    savedBookings.push(bookingData);
    localStorage.setItem("kron_bookings", JSON.stringify(savedBookings));

    // Hiển thị thông tin lên Modal
    if (modalDetails) {
      modalDetails.innerHTML = `
        <p><strong>Mã đặt bàn:</strong> <span style="color: #c82333; font-weight: 700;">${bookingData.id}</span></p>
        <p><strong>Khách hàng:</strong> ${bookingData.name} - ${bookingData.phone}</p>
        <p><strong>Thời gian:</strong> ${bookingData.time}, ngày ${bookingData.date}</p>
        <p><strong>Số lượng:</strong> ${bookingData.guests}</p>
        <p><strong>Vị trí:</strong> ${bookingData.location}</p>
        <p><strong>Set Menu:</strong> ${bookingData.setMenu}</p>
        <p><strong>Ghi chú:</strong> ${bookingData.notes}</p>
        <p style="margin-top: 1rem; color: #16a34a; font-size: 1.3rem;">
          &bull; Nhân viên Kron-Dahlah sẽ gọi điện xác nhận trong vòng 5 phút!
        </p>
      `;
    }

    if (bookingModal) {
      bookingModal.classList.add("active");
    }

    bookingForm.reset();
    if (bookDateInput) {
      bookDateInput.value = new Date().toISOString().split("T")[0];
    }
  });
}

if (btnCloseModal && bookingModal) {
  btnCloseModal.addEventListener("click", function () {
    bookingModal.classList.remove("active");
  });

  bookingModal.addEventListener("click", function (e) {
    if (e.target === bookingModal) {
      bookingModal.classList.remove("active");
    }
  });
}
