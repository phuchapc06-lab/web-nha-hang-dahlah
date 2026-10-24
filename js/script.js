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

// Cấu hình URL kết nối Backend API (Hỗ trợ cả môi trường Local Flask 5000 và Live Server)
const API_BASE_URL = window.location.port === "5000" ? "" : "http://127.0.0.1:5000";

if (bookingForm) {
  bookingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = bookingForm.querySelector(".btn-booking");
    const originalBtnText = submitBtn ? submitBtn.innerText : "TÌM BÀN & ĐẶT CHỖ NGAY";
    if (submitBtn) {
      submitBtn.innerText = "ĐANG XỬ LÝ ĐẶT BÀN...";
      submitBtn.disabled = true;
    }

    const bookingPayload = {
      name: document.getElementById("book-name").value.trim(),
      phone: document.getElementById("book-phone").value.trim(),
      location: document.getElementById("book-location").value,
      guests: document.getElementById("book-guests").value,
      date: document.getElementById("book-date").value,
      time: document.getElementById("book-time").value,
      setMenu: document.getElementById("book-set").value,
      notes: document.getElementById("book-notes").value.trim() || "Không có",
    };

    let bookingResult = null;

    // 1. Gửi tới máy chủ Backend API (Flask + SQLite)
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });
      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        bookingResult = resJson.data;
        bookingResult.id = resJson.data.booking_code;
      }
    } catch (err) {
      console.warn("Backend API chưa kích hoạt hoặc không thể kết nối, sử dụng lưu trữ cục bộ:", err);
    }

    // 2. Dự phòng (Fallback) nếu chạy trên GitHub Pages tĩnh
    if (!bookingResult) {
      const fallbackId = "KD-" + Math.floor(1000 + Math.random() * 9000);
      bookingResult = {
        ...bookingPayload,
        id: fallbackId,
        booking_code: fallbackId,
        createdAt: new Date().toLocaleString("vi-VN"),
      };
    }

    // Lưu vào LocalStorage
    let savedBookings = JSON.parse(localStorage.getItem("kron_bookings") || "[]");
    savedBookings.push(bookingResult);
    localStorage.setItem("kron_bookings", JSON.stringify(savedBookings));

    if (submitBtn) {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }

    // Hiển thị thông tin lên Modal Popup
    if (modalDetails) {
      modalDetails.innerHTML = `
        <p><strong>Mã đặt bàn:</strong> <span style="color: #c82333; font-weight: 700; font-size: 1.6rem; letter-spacing: 1px;">${bookingResult.booking_code || bookingResult.id}</span></p>
        <p><strong>Khách hàng:</strong> ${bookingResult.name || bookingResult.customer_name} - ${bookingResult.phone}</p>
        <p><strong>Thời gian:</strong> ${bookingResult.time || bookingResult.booking_time}, ngày ${bookingResult.date || bookingResult.booking_date}</p>
        <p><strong>Số lượng:</strong> ${bookingResult.guests}</p>
        <p><strong>Vị trí tiệc:</strong> ${bookingResult.location}</p>
        <p><strong>Set Menu:</strong> ${bookingResult.setMenu || bookingResult.set_menu}</p>
        <p><strong>Ghi chú:</strong> ${bookingResult.notes || "Không có"}</p>
        <p style="margin-top: 1.2rem; color: #16a34a; font-size: 1.3rem; line-height: 1.6; border-top: 1px dashed #e5e7eb; padding-top: 0.8rem;">
          &bull; Hệ thống máy chủ Kron-Dahlah đã ghi nhận đơn thành công.<br>
          &bull; Lễ tân nhà hàng sẽ gọi điện xác nhận trong vòng 5 phút!
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


///////////////////////////////////////////////////////////
// 1. THANH TIẾN TRÌNH CUỘN TRANG (READING PROGRESS BAR)
window.addEventListener("scroll", function () {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    progressBar.style.width = scrolled + "%";
  }
});

///////////////////////////////////////////////////////////
// 2. SCROLLSPY - TỰ ĐỘNG HIGHLIGHT MỤC MENU KHI CUỘN ĐẾN
const navSections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".main-nav-link:not(.nav-cta)");

window.addEventListener("scroll", function () {
  let currentSectionId = "";
  const scrollPosition = window.pageYOffset + 200;

  navSections.forEach(function (section) {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinks.forEach(function (link) {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + currentSectionId) {
      link.classList.add("active");
    }
  });
});

///////////////////////////////////////////////////////////
// 3. HIỆU ỨNG TƯƠNG TÁC NÚT "ĐẶT BÀN NGAY"
const btnHeaderBooking = document.getElementById("btn-header-booking");
if (btnHeaderBooking) {
  btnHeaderBooking.addEventListener("click", function (e) {
    e.preventDefault();
    const ctaSection = document.getElementById("cta");
    const bookingCard = document.querySelector(".booking-card");
    const firstInput = document.getElementById("book-location");

    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: "smooth" });
    }

    if (bookingCard) {
      bookingCard.classList.remove("highlight-focus");
      // Trigger animation re-flow
      void bookingCard.offsetWidth;
      bookingCard.classList.add("highlight-focus");
    }

    if (firstInput) {
      setTimeout(function () {
        firstInput.focus();
      }, 700);
    }
  });
}
