document.addEventListener("DOMContentLoaded", function () {
    // 1. Lắng nghe sự kiện click trên toàn bộ danh sách sản phẩm trong giỏ
    const cartContainer = document.querySelector('.left-column');

    if (cartContainer) {
        cartContainer.addEventListener('click', function (e) {
            // Kiểm tra xem nút được bấm có phải là nút Trừ hoặc Cộng không
            const btnMinus = e.target.closest('.btn-minus');
            const btnPlus = e.target.closest('.btn-plus');

            if (btnMinus || btnPlus) {
                const qtyPill = e.target.closest('.qty-pill');
                if (!qtyPill) return;

                const qtyValSpan = qtyPill.querySelector('.qty-val');
                let currentQty = parseInt(qtyValSpan ? qtyValSpan.textContent : 1) || 1;

                if (btnMinus) {
                    // Nếu bấm nút Trừ
                    if (currentQty > 1) {
                        currentQty--;
                    } else {
                        // Nếu số lượng = 1 mà bấm Trừ -> Hỏi xóa sản phẩm
                        const cartItem = qtyPill.closest('.cart-item');
                        if (confirm("Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?")) {
                            if (cartItem) cartItem.remove();
                            updateCartTotals();
                            return;
                        }
                    }
                } else if (btnPlus) {
                    // Nếu bấm nút Cộng
                    currentQty++;
                }

                // Cập nhật lại con số hiển thị
                if (qtyValSpan) {
                    qtyValSpan.textContent = currentQty;
                }

                // Cập nhật lại tổng tiền và tổng số lượng
                updateCartTotals();
            }

            // Xử lý nút Delete (nếu có)
            if (e.target.classList.contains('delete-btn')) {
                e.preventDefault();
                const cartItem = e.target.closest('.cart-item');
                if (cartItem) {
                    cartItem.remove();
                    updateCartTotals();
                }
            }
        });

        // Lắng nghe sự kiện khi tích/bỏ tích checkbox chọn sản phẩm hoặc thay đổi select
        cartContainer.addEventListener('change', function (e) {
            if (
                e.target.classList.contains('cart-item-checkbox') ||
                e.target.classList.contains('qty-select')
            ) {
                updateCartTotals();
            }
        });
    }

    // 2. Hàm tính toán và cập nhật lại tổng số lượng + tổng tiền
    function updateCartTotals() {
        let totalItems = 0;
        let totalPrice = 0;

        // Lấy tất cả các sản phẩm trong giỏ hàng
        const cartItems = document.querySelectorAll('.cart-item');

        cartItems.forEach(item => {
            const checkbox = item.querySelector('.cart-item-checkbox');

            // Chỉ tính những sản phẩm được tích chọn (checked)
            if (!checkbox || checkbox.checked) {
                let qtyVal = 0;

                // Lấy số lượng từ kiểu Pill (.qty-val) hoặc kiểu Dropdown (select.qty-select)
                const qtyValSpan = item.querySelector('.qty-val');
                const qtySelect = item.querySelector('.qty-select');

                if (qtyValSpan) {
                    qtyVal = parseInt(qtyValSpan.textContent) || 0;
                } else if (qtySelect) {
                    qtyVal = parseInt(qtySelect.value) || 0;
                }

                // Lấy giá từ thuộc tính data-price
                const priceAttr = item.getAttribute('data-price');
                const price = parseFloat(priceAttr) || 0;

                totalItems += qtyVal;
                totalPrice += qtyVal * price; // Đã sửa lỗi nhân giá tiền ở đây
            }
        });

        // Cập nhật giao diện tổng tiền & số lượng trên Navbar và Sidebar
        const navCartCount = document.getElementById('nav-cart-count');
        const subtotalCount = document.getElementById('subtotal-count');
        const subtotalPrice = document.getElementById('subtotal-price');
        const sidebarCount = document.getElementById('sidebar-subtotal-count');
        const sidebarPrice = document.getElementById('sidebar-subtotal-price');

        if (navCartCount) navCartCount.textContent = totalItems;
        if (subtotalCount) subtotalCount.textContent = totalItems;
        if (sidebarCount) sidebarCount.textContent = totalItems;

        const formattedPrice = '$' + totalPrice.toFixed(2);
        if (subtotalPrice) subtotalPrice.textContent = formattedPrice;
        if (sidebarPrice) sidebarPrice.textContent = formattedPrice;
    }

    // Tính toán lại lần đầu khi vừa tải trang xong
    updateCartTotals();
});