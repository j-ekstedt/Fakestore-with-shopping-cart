document.addEventListener("DOMContentLoaded", function() {
    const orderData = JSON.parse(localStorage.getItem('orderCart'));
    const userInfo = JSON.parse(localStorage.getItem("orderInfo"));
    const cartContainer = document.querySelector('.cart-items-container');
    

    if (!orderData || (!orderData.items && !orderData.length)) {
        window.location.href = 'index.html';
        return;
    }
    
    const now = new Date();
    const orderNumber = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const orderDate = now.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    if (userInfo) {
        document.getElementById('customer-name').textContent = userInfo.firstname;
        document.getElementById('customer-email').textContent = userInfo.email;
        
        if (userInfo.phone) {
            document.getElementById('customer-phone').textContent = userInfo.phone;
        }
        
        document.getElementById('customer-address').innerHTML = `
            ${userInfo.firstname} ${userInfo.lastname}<br>
            ${userInfo.street}<br>
            ${userInfo.zipcode} ${userInfo.city}
        `;
    }
    
    displayOrderItems(orderData.items, cartContainer);
    
    document.getElementById('order-number').textContent = orderNumber;
    document.getElementById('order-date').textContent = orderDate;
    
    const deliveryDate = new Date(now);
    let businessDays = 0;
    while (businessDays < 3) {
        deliveryDate.setDate(deliveryDate.getDate() + 1);
        if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
            businessDays++;
        }
    }
    
    document.getElementById('delivery-date').textContent = deliveryDate.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

setTimeout(() => {
    localStorage.removeItem("cart");  
    localStorage.removeItem("orderCart"); 
    localStorage.removeItem("orderInfo"); 

    window.location.href = "index.html";  
}, 20000); 

function displayOrderItems(items, container) {
    if (!container) return;
    
    container.innerHTML = '';
    let total = 0;  

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item mb-4 p-3 border-bottom';
        itemElement.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-3 col-4">
                    <img src="${item.image}" alt="${item.title}" class="product-image img-fluid rounded">
                </div>
                <div class="col-md-9 col-8">
                    <h4 class="mb-2">${item.title}</h4>
                    <div class="row">
                        <div class="col-md-6 col-12">
                            <p class="mb-1"><strong>Pris:</strong> $${item.price}</p>
                        </div>
                        <div class="col-md-6 col-12">
                            <p class="mb-1"><strong>Antal:</strong> ${item.quantity || 1}</p>
                        </div>
                    </div>
                    <p class="mb-0"><strong>Summa:</strong> $${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                </div>
            </div>
        `;
        container.appendChild(itemElement);
        total += (item.price || 0) * (item.quantity || 1);
    });

    document.querySelectorAll('.order-total').forEach(el => {
        el.textContent = `$${total.toFixed(2)}`;
    });
    document.getElementById('order-total').textContent = `$${total.toFixed(2)}`;
}
