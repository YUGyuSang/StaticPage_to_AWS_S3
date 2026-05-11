 

// 1. 상품 데이터 (이미지 주소 수정됨)
const products = [
    { 
        id: 1, 
        name: "유기농 강아지 사료 2kg", 
        category: "dog", 
        price: 25000, 
        // 강아지가 밥 먹는 사진으로 교체
        image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=300&h=300&q=80" 
    },
    { 
        id: 2, 
        name: "캣타워 (대형)", 
        category: "cat", 
        price: 89000, 
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=300&h=300&q=80" 
    },
    { 
        id: 3, 
        name: "강아지 삑삑이 장난감", 
        category: "dog", 
        price: 5000, 
        // 귀여운 강아지 장난감 사진
        image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=300&h=300&q=80" 
    },
    { 
        id: 4, 
        name: "고양이 츄르 (20개입)", 
        category: "cat", 
        price: 12000, 
        image: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?auto=format&fit=crop&w=300&h=300&q=80" 
    },
    { 
        id: 5, 
        name: "반려동물 마약 방석", 
        category: "all", 
        price: 32000, 
        image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=300&h=300&q=80" 
    },
    { 
        id: 6, 
        name: "강아지 산책용 목줄", 
        category: "dog", 
        price: 15000, 
        // 산책하는 강아지 사진으로 교체
        image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=300&h=300&q=80" 
    },
];
// 장바구니 배열 및 DOM 요소 가져오기 (이전과 동일)
let cart = [];
const productList = document.getElementById('product-list');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeBtn = document.querySelector('.close-btn');
const cartItemsList = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalPriceEl = document.getElementById('total-price');
const filterBtns = document.querySelectorAll('.filter-btn');
const checkoutBtn = document.getElementById('checkout-btn');

// 2. 상품 화면에 그리기 (수정됨: img 태그 사용)
function renderProducts(filter = 'all') {
    productList.innerHTML = '';

    products.forEach(product => {
        if (filter !== 'all' && product.category !== filter && product.category !== 'all') return;

        const card = document.createElement('div');
        card.className = 'product-card';
        // 이모지 대신 <img> 태그로 변경되었고, product.image URL을 사용합니다.
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>카테고리: ${product.category === 'dog' ? '강아지' : product.category === 'cat' ? '고양이' : '공용'}</p>
                <div class="price">${product.price.toLocaleString()}원</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">장바구니 담기</button>
            </div>
        `;
        productList.appendChild(card);
    });
}

// ... (이하 addToCart, removeFromCart 등 나머지 함수들은 이전과 완전히 동일합니다) ...
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartUI();
    alert(`${product.name}이(가) 장바구니에 담겼습니다!`);
};

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
};

function updateCartUI() {
    cartCount.innerText = cart.length;
    cartItemsList.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="empty-msg">장바구니가 비어있습니다.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <span>${item.name}</span>
                <div>
                    <span>${item.price.toLocaleString()}원</span>
                    <button class="remove-btn" onclick="removeFromCart(${index})">삭제</button>
                </div>
            `;
            cartItemsList.appendChild(li);
        });
    }
    totalPriceEl.innerText = total.toLocaleString() + '원';
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const category = e.target.getAttribute('data-filter');
        renderProducts(category);
    });
});

cartBtn.addEventListener('click', () => cartModal.style.display = 'block');
closeBtn.addEventListener('click', () => cartModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.style.display = 'none';
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('장바구니가 비어있습니다.');
        return;
    }
    alert(`총 ${totalPriceEl.innerText} 결제가 완료되었습니다!`);
    cart = [];
    updateCartUI();
    cartModal.style.display = 'none';
});

renderProducts();