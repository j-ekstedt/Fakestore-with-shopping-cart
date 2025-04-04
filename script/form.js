document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("order-form");
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const singleProduct = JSON.parse(localStorage.getItem("selectedProduct"));
    const cartContainer = document.querySelector('.cart-items-container');

    const cartData = {
        items: cart.length > 0 ? cart : (singleProduct ? [singleProduct] : [])
    };

    if (cartData.items.length > 0) {
        displayCartItems(cartData.items, cartContainer);
    } else {
        window.location.href = 'index.html';
        return;
    }

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const userInfo = {
                firstname: document.getElementById('form-firstname').value.trim(),
                lastname: document.getElementById('form-lastname').value.trim(),
                email: document.getElementById('form-email').value.trim(),
                phone: document.getElementById('form-phone')?.value.trim() || '',
                street: document.getElementById('form-street').value.trim(),
                zipcode: document.getElementById('form-zipcode').value.trim(),
                city: document.getElementById('form-city').value.trim()
            };

            if (validateForm(userInfo)) {
                localStorage.setItem("orderInfo", JSON.stringify(userInfo));
                
                const orderData = {
                    items: cartData.items,
                    orderDate: new Date().toISOString(),
                    status: "Mottagen",
                    total: cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                };
                
                localStorage.setItem("orderCart", JSON.stringify(orderData));
                localStorage.setItem("currentOrder", JSON.stringify(orderData));
                
                window.location.href = "confirmation.html";
            }
        });
    }
    loadSavedFormData();
});

function displayCartItems(items, container) {
    if (!container) return;
    
    container.innerHTML = '';
    let total = 0;

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item-form mb-3 p-3 border-bottom';
        itemElement.innerHTML = `
            <div class="row align-items-center">
                <div class="col-3">
                    <img src="${item.image}" alt="${item.title}" class="product-image-form img-fluid rounded">
                </div>
                <div class="col-9">
                    <h5 class="mb-1">${item.title}</h5>
                    <div class="d-flex justify-content-between">
                        <span>$${item.price} x ${item.quantity}</span>
                        <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    const totalElement = document.querySelector('.total-price');
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

function displaySingleProduct(product, container) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="cart-item-form mb-3 p-3 border-bottom">
            <div class="row align-items-center">
                <div class="col-3">
                    <img src="${product.image}" alt="${product.title}" class="product-image-form img-fluid rounded">
                </div>
                <div class="col-9">
                    <h5 class="mb-1">${product.title}</h5>
                    <div class="d-flex justify-content-between">
                        <span>1 st</span>
                        <strong>$${product.price}</strong>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const totalElement = document.querySelector('.total-price');
    if (totalElement) {
        totalElement.textContent = `$${product.price.toFixed(2)}`;
    }
}

function validateForm(userInfo) {
    let isValid = true;
    const errors = [];

    if (!userInfo.firstname || userInfo.firstname.length < 2 || userInfo.firstname.length > 50) {
        errors.push("Förnamn måste vara mellan 2 och 50 tecken.");
        isValid = false;
    }

    if (!userInfo.lastname || userInfo.lastname.length < 2 || userInfo.lastname.length > 50) {
        errors.push("Efternamn måste vara mellan 2 och 50 tecken.");
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userInfo.email || !emailRegex.test(userInfo.email)) {
        errors.push("Vänligen ange en giltig e-postadress.");
        isValid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (userInfo.phone && !phoneRegex.test(userInfo.phone)) {
        errors.push("Telefonnummer måste vara 10 siffror (exempel: 0701234567).");
        isValid = false;
    }

    if (!userInfo.street || userInfo.street.length < 2 || userInfo.street.length > 50) {
        errors.push("Gatuadress måste vara mellan 2 och 50 tecken.");
        isValid = false;
    }

    const zipRegex = /^[0-9]{5}$/;
    if (!userInfo.zipcode || !zipRegex.test(userInfo.zipcode)) {
        errors.push("Postnummer måste vara exakt 5 siffror.");
        isValid = false;
    }

    if (!userInfo.city || userInfo.city.length < 2 || userInfo.city.length > 50) {
        errors.push("Ort måste vara mellan 2 och 50 tecken.");
        isValid = false;
    }

    if (errors.length > 0) {
        showFormErrors(errors);
    }
    
    return isValid;
}

function showFormErrors(errors) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'alert alert-danger';
    errorContainer.innerHTML = `
        <h5 class="alert-heading">Vänligen rätta följande fel:</h5>
        <ul class="mb-0">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    const form = document.getElementById('order-form');
    form.prepend(errorContainer);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
        errorContainer.remove();
    }, 10000);
}

function loadSavedFormData() {
    const savedData = JSON.parse(localStorage.getItem('formData'));
    if (!savedData) return;

    Object.keys(savedData).forEach(key => {
        const element = document.getElementById(`form-${key}`);
        if (element) {
            element.value = savedData[key];
        }
    });
}

document.querySelectorAll('#order-form input').forEach(input => {
    input.addEventListener('input', () => {
        const formData = {
            firstname: document.getElementById('form-firstname')?.value,
            lastname: document.getElementById('form-lastname')?.value,
            email: document.getElementById('form-email')?.value,
            phone: document.getElementById('form-phone')?.value,
            street: document.getElementById('form-street')?.value,
            zipcode: document.getElementById('form-zipcode')?.value,
            city: document.getElementById('form-city')?.value
        };
        localStorage.setItem('formData', JSON.stringify(formData));
    });
});
