let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener("DOMContentLoaded", function() {
    loadProducts();
    initCart();
    updateCartUI();
});

function loadProducts() {
    const categories = {
        "men's clothing": "man-produkter",
        "women's clothing": "kvinnor-produkter",
        "jewelery": "smycken-produkter",
        "electronics": "elektronik-produkter"
    };

    fetch("https://fakestoreapi.com/products")
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const container = document.getElementById(categories[product.category]);
                if (container) {
                    createProductCard(product, container);
                }
            });
        })
        .catch(error => console.error("Error fetching products:", error));
}

function createProductCard(product, container) {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-img">
        <h3>${product.title}</h3>
        <p class="product-price">$${product.price}</p>
    `;

    const buyButton = document.createElement("button");
    buyButton.className = "btn btn-primary buy-button";
    buyButton.textContent = "Lägg i varukorg";
    buyButton.onclick = () => addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image
    });

    productCard.appendChild(buyButton);
    container.appendChild(productCard);
}

function initCart() {
    document.getElementById('cart-icon')?.addEventListener('click', showCartModal);
    document.querySelector('.close-modal')?.addEventListener('click', hideCartModal);
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('cart-modal')) hideCartModal();
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-increase')) {
            updateCartItemQuantity(e.target.dataset.id, 1);
        } else if (e.target.classList.contains('btn-decrease')) {
            updateCartItemQuantity(e.target.dataset.id, -1);
        } else if (e.target.classList.contains('btn-clear')) {
            clearCart();
        } else if (e.target.classList.contains('btn-checkout')) {
            checkout();
        }
    });
}

function updateCartUI() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalPriceElements = document.querySelectorAll('.total-price');
    
    let total = 0;
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cart.length === 0 
            ? '<p class="empty-cart">Din varukorg är tom</p>'
            : cart.map(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                return `
                    <div class="cart-item">
                        <div class="cart-item-header">
                            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                            <h4>${item.title}</h4>
                        </div>
                        <div class="cart-item-body">
                            <div class="cart-item-quantity">
                                <button class="btn-decrease" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="btn-increase" data-id="${item.id}">+</button>
                            </div>
                            <div class="cart-item-prices">
                                <span>$${item.price} / st</span>
                                <strong>$${itemTotal.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
    }
    
    totalPriceElements.forEach(el => el.textContent = `$${total.toFixed(2)}`);
    cartCountElements.forEach(el => el.textContent = cart.reduce((sum, item) => sum + item.quantity, 0));
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    saveCart();
    updateCartUI();
    showFeedback(`${product.title} har lagts till i varukorgen!`);
}

function updateCartItemQuantity(id, change) {
    id = Number(id); 
    const item = cart.find(item => item.id === id);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity < 1) {
        removeCartItem(id);
    } else {
        saveCart();
        updateCartUI();
    }
}

function removeCartItem(id) {
    id = Number(id); 
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    showFeedback('Produkt borttagen från varukorgen');
}

function clearCart() {
    if (cart.length === 0 || !confirm('Är du säker på att du vill rensa varukorgen?')) return;
    
    cart = [];
    saveCart();
    updateCartUI();
    hideCartModal();
    showFeedback('Varukorgen har rensats');
}

function checkout() {
    if (cart.length === 0) {
        showFeedback('Din varukorg är tom!', 'error');
        return;
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cart));
    window.location.href = 'form.html';
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = 'block';
        updateCartUI();
    }
}

function hideCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = 'none';
}

function showFeedback(message, type = 'success') {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.classList.add('fade-out');
        setTimeout(() => feedback.remove(), 500);
    }, 2000);
}
