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
// Xử lý chuyển đổi Tab danh mục món ăn & Tương tác Menu (Front-end & Backend)
const MENU_DATA_FALLBACK = {
  all: [
    {
      name: "Thăn Bò Bít Tết Wagyu Úc (Striploin)",
      code: "MN-01",
      image: "img/dishes/steak_wagyu.jpg",
      badge: "-15%",
      tags: ["Bán chạy nhất", "Signature"],
      attr1: "Bò Wagyu thượng hạng <strong>vân mỡ MB5+</strong>",
      attr2: "Sốt tiêu đen Phú Quốc &amp; Sốt Truffle",
      rating: "<strong>4.9</strong> rating (1.250 đánh giá)",
      price: "480.000₫",
      origPrice: "565.000₫"
    },
    {
      name: "Mỳ Ý Tôm Hùm Sốt Kem Truffle",
      code: "MN-07B",
      image: "img/dishes/lobster_cheese.jpg",
      badge: "-20%",
      tags: ["Đặc sản Bếp trưởng", "Fine Dining"],
      attr1: "Tôm hùm baby &amp; Phô mai <strong>Parmigiano 24M</strong>",
      attr2: "Sợi mỳ thủ công sốt kem nấm Truffle Ý",
      rating: "<strong>4.9</strong> rating (980 đánh giá)",
      price: "360.000₫",
      origPrice: "450.000₫"
    }
  ],
  steak: [
    {
      name: "Thăn Bò Bít Tết Wagyu Úc (Striploin)",
      code: "MN-01",
      image: "img/dishes/steak_wagyu.jpg",
      badge: "-15%",
      tags: ["Bán chạy nhất", "Signature"],
      attr1: "Bò Wagyu thượng hạng <strong>vân mỡ MB5+</strong>",
      attr2: "Sốt tiêu đen Phú Quốc &amp; Sốt Truffle",
      rating: "<strong>4.9</strong> rating (1.250 đánh giá)",
      price: "480.000₫",
      origPrice: "565.000₫"
    },
    {
      name: "Thăn Bò Black Angus Ribeye 300g",
      code: "MN-02",
      image: "img/dishes/steak_ribeye.jpg",
      badge: "-15%",
      tags: ["Bò Mỹ Cao Cấp", "Mọng Nước"],
      attr1: "Thịt thăn lưng bò đen Mỹ ngập nước mềm ngọt",
      attr2: "Măng tây áp chảo &amp; khoai tây nghiền bơ tỏi",
      rating: "<strong>4.8</strong> rating (850 đánh giá)",
      price: "420.000₫",
      origPrice: "495.000₫"
    },
    {
      name: "Bít Tết Bò Mỹ Top Blade Sốt Tiêu Đen",
      code: "MN-03",
      image: "img/dishes/steak_topblade.jpg",
      badge: "-10%",
      tags: ["Thăn Lõi Vai", "Vị Cay Nồng"],
      attr1: "Thăn lõi vai bò Mỹ đậm đà giàu dinh dưỡng",
      attr2: "Hạt tiêu Phú Quốc ngâm rượu vang đỏ",
      rating: "<strong>4.8</strong> rating (680 đánh giá)",
      price: "350.000₫",
      origPrice: "390.000₫"
    }
  ],
  pasta: [
    {
      name: "Mỳ Ý Tôm Hùm Sốt Kem Truffle",
      code: "MN-07B",
      image: "img/dishes/lobster_cheese.jpg",
      badge: "-20%",
      tags: ["Đặc sản Bếp trưởng", "Fine Dining"],
      attr1: "Tôm hùm baby &amp; Phô mai <strong>Parmigiano 24M</strong>",
      attr2: "Sợi mỳ thủ công sốt kem nấm Truffle Ý",
      rating: "<strong>4.9</strong> rating (980 đánh giá)",
      price: "360.000₫",
      origPrice: "450.000₫"
    },
    {
      name: "Mỳ Ý Cua Tuyết Sốt Kem Nấm Truffle",
      code: "MN-07",
      image: "img/dishes/pasta_crab.jpg",
      badge: "-15%",
      tags: ["Mỳ Ý Thủ Công", "Fine Dining"],
      attr1: "Cua tuyết ngọt mềm &amp; Sợi Fettuccine tươi",
      attr2: "Sốt kem phô mai béo thơm nấm rừng",
      rating: "<strong>4.9</strong> rating (760 đánh giá)",
      price: "285.000₫",
      origPrice: "335.000₫"
    }
  ],
  seafood: [
    {
      name: "Tôm Hùm Bỏ Lò Phô Mai Mozzarella",
      code: "MN-08",
      image: "img/dishes/lobster_cheese.jpg",
      badge: "-20%",
      tags: ["Hải Sản Thượng Hạng", "Fine Dining"],
      attr1: "Tôm hùm tươi đút lò phô mai Mozzarella kéo sợi",
      attr2: "Thảo mộc Rosemary thơm nức &amp; Xà lách hữu cơ",
      rating: "<strong>5.0</strong> rating (1.120 đánh giá)",
      price: "550.000₫",
      origPrice: "680.000₫"
    },
    {
      name: "Cá Hồi Na Uy Áp Chảo Sốt Bơ Chanh",
      code: "MN-08B",
      image: "img/dishes/salad_salmon.jpg",
      badge: "-16%",
      tags: ["Cá Hồi Na Uy", "Giòn Da Ngọt Thịt"],
      attr1: "Phi lê cá hồi tươi áp chảo da giòn tan",
      attr2: "Sốt bơ chanh vàng kiểu Pháp &amp; Măng tây",
      rating: "<strong>4.8</strong> rating (640 đánh giá)",
      price: "260.000₫",
      origPrice: "310.000₫"
    }
  ],
  combo: [
    {
      name: "Set Romance 2 Người (Lãng Mạn Nến Hoa)",
      code: "MN-COMBO-01",
      image: "img/dishes/combo_romance.jpg",
      badge: "-15%",
      tags: ["Combo Lãng Mạn", "Tặng Nến Hoa"],
      attr1: "02 Bít tết Bò Mỹ &amp; 02 Súp nấm Truffle đen",
      attr2: "02 Ly vang Chile &amp; Decor hoa tươi, nến thơm",
      rating: "<strong>4.9</strong> rating (1.450 đánh giá)",
      price: "990.000₫",
      origPrice: "1.150.000₫"
    },
    {
      name: "Set Royal Gourmet (4-6 Người - Tiệc VIP)",
      code: "MN-COMBO-02",
      image: "img/dishes/combo_royal.jpg",
      badge: "-17%",
      tags: ["Đại Tiệc VIP", "Hoàng Gia"],
      attr1: "Bò Wagyu, Tôm hùm nướng &amp; Đĩa Cold Cuts Âu",
      attr2: "02 Chai vang Pháp Bordeaux &amp; 4 Panna Cotta dâu",
      rating: "<strong>5.0</strong> rating (890 đánh giá)",
      price: "2.490.000₫",
      origPrice: "2.990.000₫"
    }
  ],
  wine: [
    {
      name: "Vang Đỏ Bordeaux Château Cao Cấp (Chai)",
      code: "MN-11",
      image: "img/dishes/wine_bordeaux.jpg",
      badge: "-17%",
      tags: ["Vang Pháp Grand Cru", "Fine Dining"],
      attr1: "Vùng Bordeaux trứ danh, ủ thùng sồi Pháp 18 tháng",
      attr2: "Hương quả mọng chín sâu lắng, chuẩn vị Steak",
      rating: "<strong>4.9</strong> rating (650 đánh giá)",
      price: "1.250.000₫",
      origPrice: "1.500.000₫"
    },
    {
      name: "Bánh Tiramisu Ý Truyền Thống",
      code: "MN-09",
      image: "img/dishes/dessert_tiramisu.jpg",
      badge: "-20%",
      tags: ["Tráng Miệng Ý", "Best-Seller"],
      attr1: "Phô mai Mascarpone nhập khẩu &amp; Cà phê Espresso Ý",
      attr2: "Bột cacao nguyên chất &amp; Rượu Kahlua nồng nàn",
      rating: "<strong>4.9</strong> rating (780 đánh giá)",
      price: "95.000₫",
      origPrice: "120.000₫"
    },
    {
      name: "Panna Cotta Dâu Tây Rừng &amp; Vani Madagascar",
      code: "MN-10",
      image: "img/dishes/dessert_pannacotta.jpg",
      badge: "-15%",
      tags: ["Mềm Mịn Tan Chảy", "Trái Cây Rừng"],
      attr1: "Kem sữa tươi béo ngậy nấu hạt Vani Madagascar",
      attr2: "Mứt dâu tây rừng tươi chua ngọt thanh khiết",
      rating: "<strong>4.8</strong> rating (520 đánh giá)",
      price: "85.000₫",
      origPrice: "100.000₫"
    }
  ],
  starter: [
    {
      name: "Súp Kem Nấm Truffle Đen Khai Vị",
      code: "MN-04",
      image: "img/dishes/soup_truffle.jpg",
      badge: "-15%",
      tags: ["Khai Vị Tinh Tế", "Healthy"],
      attr1: "Súp kem béo ngậy nấu từ nấm rừng châu Âu",
      attr2: "Tinh dầu nấm Truffle đen quý &amp; bánh mỳ bơ tỏi",
      rating: "<strong>4.9</strong> rating (820 đánh giá)",
      price: "145.000₫",
      origPrice: "170.000₫"
    },
    {
      name: "Đĩa Cold Cuts &amp; Phô Mai Nhập Khẩu Âu",
      code: "MN-05",
      image: "img/dishes/cold_cuts.jpg",
      badge: "-16%",
      tags: ["Thịt Nguội Iberico", "Phô Mai Âu"],
      attr1: "Thịt nguội Iberico, Salami và 3 loại phô mai cao cấp",
      attr2: "Ăn kèm quả oliu, bánh quy giòn và nho khô",
      rating: "<strong>4.8</strong> rating (690 đánh giá)",
      price: "320.000₫",
      origPrice: "380.000₫"
    },
    {
      name: "Salad Cá Hồi Na Uy Xông Khói &amp; Trứng Lòng Đào",
      code: "MN-06",
      image: "img/dishes/salad_salmon.jpg",
      badge: "-15%",
      tags: ["Cá Hồi Xông Khói", "Thanh Mát"],
      attr1: "Cá hồi Na Uy xông khói gỗ sồi &amp; trứng lòng đào béo",
      attr2: "Rau hữu cơ giòn mát &amp; sốt chanh leo chua ngọt",
      rating: "<strong>4.8</strong> rating (710 đánh giá)",
      price: "195.000₫",
      origPrice: "230.000₫"
    }
  ]
};

// Danh sách món ăn hiện tại đang hiển thị
let currentCategoryDishes = MENU_DATA_FALLBACK.all;

// Hàm cập nhật thẻ món ăn trên giao diện
function updateMealCard(cardIndex, dish) {
  if (!dish) return;
  const num = cardIndex + 1;
  const card = document.getElementById(`meal-card-${num}`);
  if (!card) return;

  // Hiệu ứng mượt mà
  card.classList.remove("meal-animating");
  void card.offsetWidth; // reflow
  card.classList.add("meal-animating");

  const badge = document.getElementById(`meal-${num}-badge`);
  if (badge) badge.innerText = dish.badge || "-15%";

  const img = document.getElementById(`meal-${num}-img`);
  if (img) {
    img.src = dish.image;
    img.alt = dish.name;
  }

  const tagsContainer = document.getElementById(`meal-${num}-tags`);
  if (tagsContainer && dish.tags) {
    tagsContainer.innerHTML = dish.tags
      .map((t, idx) => `<span class="tag ${idx === 0 ? 'tag--vegetarian' : 'tag--paleo'}">${t}</span>`)
      .join("");
  }

  const title = document.getElementById(`meal-${num}-title`);
  if (title) title.innerText = dish.name;

  const attr1 = document.getElementById(`meal-${num}-attr1`);
  if (attr1) attr1.innerHTML = dish.attr1 || "";

  const attr2 = document.getElementById(`meal-${num}-attr2`);
  if (attr2) attr2.innerHTML = dish.attr2 || "";

  const attr3 = document.getElementById(`meal-${num}-attr3`);
  if (attr3) attr3.innerHTML = dish.rating || "<strong>4.9</strong> rating";

  const price = document.getElementById(`meal-${num}-price`);
  if (price) price.innerText = dish.price || "";

  const origPrice = document.getElementById(`meal-${num}-orig-price`);
  if (origPrice) origPrice.innerText = dish.origPrice || "";
}

// Chuyển đổi sang danh mục món ăn bất kỳ
async function switchMenuCategory(filter) {
  // Cập nhật trạng thái nút Tab phía trên
  const tabBtns = document.querySelectorAll(".menu-tab-btn");
  tabBtns.forEach(b => {
    if (b.dataset.filter === filter || (filter === 'starter' && b.dataset.filter === 'all')) {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });

  // Cập nhật trạng thái danh sách danh mục bên phải
  const listItems = document.querySelectorAll(".clickable-category");
  listItems.forEach(li => {
    if (li.dataset.filter === filter) {
      li.classList.add("active-category");
    } else {
      li.classList.remove("active-category");
    }
  });

  // 1. Kết nối Backend API để lấy danh sách món mới nhất
  let dishes = null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/menu?category=${filter}`);
    const data = await res.json();
    if (data.success && data.data && data.data.length > 0) {
      dishes = data.data.map(item => ({
        name: item.name,
        code: item.code,
        image: item.image_url,
        badge: item.discount_badge,
        tags: item.tags,
        attr1: item.attr1,
        attr2: item.attr2,
        rating: `<strong>${item.rating}</strong> rating (${item.reviews_count || 980} đánh giá)`,
        price: item.formatted_price,
        origPrice: item.formatted_original_price
      }));
    }
  } catch (err) {
    // Nếu chạy tĩnh hoặc backend chưa bật, chuyển sang fallback
  }

  // 2. Dự phòng nếu API không sẵn sàng (VD trên GitHub Pages)
  if (!dishes || dishes.length === 0) {
    dishes = MENU_DATA_FALLBACK[filter] || MENU_DATA_FALLBACK.all;
  }

  currentCategoryDishes = dishes;

  // Render 2 món đầu tiên của danh mục
  if (dishes.length > 0) updateMealCard(0, dishes[0]);
  if (dishes.length > 1) updateMealCard(1, dishes[1]);
}

// Gán sự kiện click cho các nút Tab
const tabButtons = document.querySelectorAll(".menu-tab-btn");
tabButtons.forEach(btn => {
  btn.addEventListener("click", function () {
    const filter = btn.dataset.filter || "all";
    switchMenuCategory(filter);
  });
});

// Gán sự kiện click cho danh sách danh mục bên phải (diets list)
const categoryListItems = document.querySelectorAll(".clickable-category");
categoryListItems.forEach(item => {
  item.addEventListener("click", function () {
    const filter = item.dataset.filter || "all";
    switchMenuCategory(filter);
  });
});

// Đặt bàn nhanh với món ăn đang chọn
function selectDishForReservation(cardIndex) {
  const dish = currentCategoryDishes[cardIndex];
  if (!dish) return;

  const setMenuSelect = document.getElementById("book-set");
  const notesTextarea = document.getElementById("book-notes");

  // Nếu là Set Combo, chọn tự động trong dropdown
  if (dish.code === "MN-COMBO-01" && setMenuSelect) {
    setMenuSelect.value = "Set Romance 2 người (990.000₫)";
  } else if (dish.code === "MN-COMBO-02" && setMenuSelect) {
    setMenuSelect.value = "Set Royal Gourmet 4-6 người (2.490.000₫)";
  } else if (notesTextarea) {
    const existing = notesTextarea.value.trim();
    const noteText = `[Món yêu thích]: ${dish.name} (${dish.price})`;
    if (!existing.includes(dish.name)) {
      notesTextarea.value = existing ? `${existing} | ${noteText}` : noteText;
    }
  }

  // Cuộn mượt mà xuống Form đặt bàn
  const ctaSection = document.getElementById("cta") || document.getElementById("restaurant-booking-form");
  if (ctaSection) {
    ctaSection.scrollIntoView({ behavior: "smooth" });
    const cardEl = document.querySelector(".booking-card");
    if (cardEl) {
      cardEl.classList.remove("highlight-focus");
      void cardEl.offsetWidth;
      cardEl.classList.add("highlight-focus");
    }
  }
}
window.selectDishForReservation = selectDishForReservation;
window.switchMenuCategory = switchMenuCategory;

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
