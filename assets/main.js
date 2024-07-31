let sizeBtn = document.querySelector("#size-btn");
let sizeCloseBtn = document.querySelector(".size-chart-close-btn");
let sizePopup = document.querySelector(".size-popup");
let productPopupBG = document.querySelector(".product-popup-bg");
let popupCloseBtn = document.querySelector(".product-close-btn");


let productData = {
    id: null,
    handle: null,
    title: null,
    price: null,
    compareAtPrice: null,
    images: [],
    sizes: [],
    mainImage: null,
    selectedSize: null,
};

let bundleProducts = [];




function showPopup(productElement) {
    console.log(productElement);
    const sizes = productElement.getAttribute('data-sizes') ? productElement.getAttribute('data-sizes').split(',') : [];
    const variants = productElement.getAttribute('data-variants') ? productElement.getAttribute('data-variants').split(',') : [];
   
    const productReviewImages = JSON.parse(productElement.getAttribute('data-product-review-images'));

    console.log("these are the review images:", productReviewImages);

    productData = {
        id: productElement.getAttribute('data-id'),
        handle: productElement.getAttribute('data-handle'),
        title: productElement.getAttribute('data-title'),
        price: productElement.getAttribute('data-price'),
        compareAtPrice: productElement.getAttribute('data-compare-at-price'),
        images: productElement.getAttribute('data-images') ? productElement.getAttribute('data-images').split(',') : [],
        sizes: sizes,
        variants: variants,
        mainImage: productElement.getAttribute('data-main-image') || '',
        selectedSize: null,
        selectedVariantId: null
    };
    console.log(productData);
    console.log('Product Sizes:', productData.sizes);
    console.log('Product Variants:', productData.variants);

    let productPopupBG = document.querySelector(".product-popup-bg");
    let popupProductName = document.querySelector("#popup-product-name");
    let popupProductPrice = document.querySelector(".popup-product-price .normal");
    let popupProductComparePrice = document.querySelector(".popup-product-price .striked");
    let productCarousel = document.querySelector(".product-carousel");
    let sizeOptions = document.querySelector(".size-options");
    let reviewImagesContainer = document.querySelector(".review-images");

    if (!productPopupBG || !popupProductName || !popupProductPrice || !popupProductComparePrice || !productCarousel || !sizeOptions || !reviewImagesContainer) {
        console.error('One or more popup elements not found.');
        return;
    }

    productPopupBG.style.display = "flex";
    popupProductName.innerHTML = productData.title;
    popupProductPrice.innerHTML = `$${(productData.price / 100).toFixed(2)}`;
    popupProductComparePrice.innerHTML = `$${(productData.compareAtPrice / 100).toFixed(2)}`;

    // Clear existing carousel images
    productCarousel.querySelectorAll('img.popup-img').forEach(img => img.remove());

    // Add images to the carousel if available
    if (productData.images.length > 0) {
        productData.images.forEach((carouselSrc) => {
            carouselSrc = carouselSrc.trim();
            if (carouselSrc) {
                let carouselImg = document.createElement('img');
                carouselImg.src = carouselSrc;
                carouselImg.className = 'popup-img';
                productCarousel.appendChild(carouselImg);
            }
        });
    } else {
        console.error('No images found for this product.');
    }

    // Clear existing size options
    sizeOptions.innerHTML = '';

    // Add new size options
    if (productData.sizes.length > 0) {
        productData.sizes.forEach(size => {
            let sizeDiv = document.createElement('div');
            sizeDiv.className = 'size';
            sizeDiv.textContent = size;
            sizeDiv.addEventListener('click', () => {
                selectSize(size);
            });
            sizeOptions.appendChild(sizeDiv);
        });
    } else {
        let noSizesDiv = document.createElement('div');
        noSizesDiv.className = 'size';
        noSizesDiv.textContent = 'No sizes available';
        sizeOptions.appendChild(noSizesDiv);
    }

    // Clear existing review images
    reviewImagesContainer.innerHTML = '';

    // Add new review images
    if (productReviewImages && productReviewImages.length > 0) {
        productReviewImages.forEach((reviewSrc) => {
            let revImg = document.createElement('img');
            revImg.src = reviewSrc;
            revImg.className = 'review-img';
            reviewImagesContainer.appendChild(revImg);
        });
    } else {
        console.error('No review images found for this product.');
    }

    // Initialize carousel after adding images
    initializeCarousel();
}






function selectSize(size) {
    document.querySelectorAll('.size').forEach(sizeDiv => {
        sizeDiv.classList.remove('selected');
    });

    const selectedSizeDiv = Array.from(document.querySelectorAll('.size')).find(div => div.textContent.trim() === size);
    if (selectedSizeDiv) {
        selectedSizeDiv.classList.add('selected');
    }

    productData.selectedSize = size;

    // Find the corresponding variant ID for the selected size
    const sizeIndex = productData.sizes.indexOf(size);
    if (sizeIndex !== -1) {
        productData.selectedVariantId = productData.variants[sizeIndex];
    } else {
        productData.selectedVariantId = null;
    }

    console.log('Selected size:', size);
    console.log('Selected variant ID:', productData.selectedVariantId);
    console.log('Updated productData:', productData);
}




function initializeCarousel() {
    const productCarousel = document.querySelector(".product-carousel");
    const leftButton = productCarousel.querySelector(".product-img-left");
    const rightButton = productCarousel.querySelector(".product-img-right");
    const images = productCarousel.querySelectorAll(".popup-img");

    if (images.length === 0) {
        console.error('No images found in the carousel.');
        return;
    }

    let currentIndex = 0;

    function showImage(index) {
        images.forEach((img, i) => {
            img.style.display = (i === index) ? 'block' : 'none';
        });
    }

    showImage(currentIndex);

    leftButton.addEventListener("click", () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
        showImage(currentIndex);
    });

    rightButton.addEventListener("click", () => {
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        showImage(currentIndex);
    });
}



size.addEventListener("click", () => {
    sizePopup.style.display = "block";
});

sizeCloseBtn.addEventListener("click", () => {
    sizePopup.style.display = "none";
});

popupCloseBtn.addEventListener("click", () => {
    productPopupBG.style.display = "none";
});






document.addEventListener('DOMContentLoaded', function() {
    const popupShopNow = document.getElementById('shop-now-btn');
    const bundleBackground = document.getElementById('bundle-bg');

    console.log('shopNowButton:', shopNowButton);
    console.log('bundleBg:', bundleBg);
    console.log(bundleProducts);

    if (shopNowButton && bundleBg) {
        shopNowButton.addEventListener('click', function() {
            console.log("button was clicked");

            if (!productData.selectedSize && productData.sizes.length > 0) {
                // Automatically select the first size
                selectSize(productData.sizes[0]);
            }
            console.log(bundleBg);
            bundleBg.style.display = 'flex';
        });
    } else {
        console.error('shopNowButton or bundleBg not found in the DOM');
    }
  
});




// Define the bundleBg and bundleContainer

    const bundleBg = document.querySelector("#bundle-bg");
    const bundleContainer = document.querySelector(".bundle-container");
    
    // Check if bundleBg and bundleContainer exist
    if (bundleBg) {
        bundleBg.addEventListener("click", () => {
            // Hide bundleBg when clicking outside of bundleContainer
            if (!bundleContainer.contains(event.target)) {
                bundleBg.style.display = "none";
            }
        });
    } else {
        console.error('bundleBg not found in the DOM');
    }

    if (bundleContainer) {
        bundleContainer.addEventListener("click", (event) => {
            // Stop the click event from propagating to bundleBg
            event.stopPropagation();
        });
    } else {
        console.error('bundleContainer not found in the DOM');
    }

    const shopNowButton = document.getElementById('shop-now-btn');
    if (shopNowButton) {
        shopNowButton.addEventListener('click', function() {
            console.log("button was clicked");
            if (bundleBg) {
                bundleBg.style.display = 'flex'; 
                productPopupBG.style.display = "none";
            }
        });
    } else {
        console.error('shopNowButton not found in the DOM');
    }








document.addEventListener('DOMContentLoaded', () => {
    const shopNowBtn = document.getElementById('shop-now-btn');
    const bundleProductElements = [
        document.getElementById('bundle-product-1'),
        document.getElementById('bundle-product-2'),
        document.getElementById('bundle-product-3'),
        document.getElementById('bundle-product-4'),
    ];

    shopNowBtn.addEventListener('click', () => {
        // Ensure productData is correctly populated before adding
        const productDataToAdd = {
            mainImage: document.querySelector('.product-carousel img').src,
            price: parseFloat(document.querySelector('.popup-product-price .normal').textContent.replace('$', '').replace(',', '')) * 100,
            selectedVariantId: productData.selectedVariantId // Include selectedVariantId
        };

        console.log(productData);

        if (bundleProducts.length < 4) {
            bundleProducts.push(productDataToAdd);

            bundleProducts.forEach((product, index) => {
                if (index < bundleProductElements.length) {
                    bundleProductElements[index].style.backgroundImage = `url(${product.mainImage})`;
                }
            });

            updateBackgroundColors(bundleProducts.length);
            updateCloseButtons(); // Update close buttons visibility
            updateBundleTotal(); // Update total
        } else {
            alert("You already have 4 items in your bundle");
        }
    });
});





function updateBackgroundColors(count) {
    const buy1 = document.getElementById('buy-1');
    const level1 = document.getElementById('level-1');
    const buy2 = document.getElementById('buy-2');
    const level2 = document.getElementById('level-2');
    const buy3 = document.getElementById('buy-3');
    const level3 = document.getElementById('level-3');
    const buy4 = document.getElementById('buy-4');

    // Reset background color, text color, and border for all elements
    [buy1, level1, buy2, level2, buy3, level3, buy4].forEach(el => {
        if (el) {
            el.style.backgroundColor = '';
            el.style.color = '';
            el.style.border = ''; // Reset border
        }
    });

    // Apply new background color, text color, and border based on the number of items in the bundle
    if (count >= 1) {
        if (buy1) {
            buy1.style.backgroundColor = '#ffa500';
            buy1.style.color = '#000000';
        }
    }
    if (count >= 2) {
        if (level1) {
            level1.style.backgroundColor = '#ffa500';
            level1.style.color = '#000000';
            level1.style.border = 'none'; // Remove border
        }
        if (buy2) {
            buy2.style.backgroundColor = '#ffa500';
            buy2.style.color = '#000000';
        }
    }
    if (count >= 3) {
        if (level2) {
            level2.style.backgroundColor = '#ffa500';
            level2.style.color = '#000000';
            level2.style.border = 'none'; // Remove border
        }
        if (buy3) {
            buy3.style.backgroundColor = '#ffa500';
            buy3.style.color = '#000000';
        }
    }
    if (count >= 4) {
        if (level3) {
            level3.style.backgroundColor = '#ffa500';
            level3.style.color = '#000000';
            level3.style.border = 'none'; // Remove border
        }
        if (buy4) {
            buy4.style.backgroundColor = '#ffa500';
            buy4.style.color = '#000000';
        }
    }
}

function updateCloseButtons() {
    const closeButtons = [
        document.getElementById('bundle-close-btn-1'),
        document.getElementById('bundle-close-btn-2'),
        document.getElementById('bundle-close-btn-3'),
        document.getElementById('bundle-close-btn-4')
    ];

    closeButtons.forEach((btn, index) => {
        if (btn) {
            if (index < bundleProducts.length) {
                btn.style.position = 'absolute';
                btn.style.display = 'flex'; // Make sure the button is visible
            } else {
                btn.style.display = 'none'; // Hide buttons if they are not needed
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const closeButtons = [
        document.getElementById('bundle-close-btn-1'),
        document.getElementById('bundle-close-btn-2'),
        document.getElementById('bundle-close-btn-3'),
        document.getElementById('bundle-close-btn-4')
    ];

    closeButtons.forEach((btn, index) => {
        if (btn) {
            btn.addEventListener('click', () => {
                // Remove the product at the index from the bundleProducts array
                bundleProducts.splice(index, 1);

                // Update the UI to reflect the change
                updateBundleProductsUI();
            });
        }
    });
});




function updateBundleProductsUI() {
    const bundleProductElements = [
        document.getElementById('bundle-product-1'),
        document.getElementById('bundle-product-2'),
        document.getElementById('bundle-product-3'),
        document.getElementById('bundle-product-4')
    ];

    // Clear the background images and reset styles
    bundleProductElements.forEach((element) => {
        if (element) {
            element.style.backgroundImage = '';
        }
    });

    // Update the UI based on the remaining products
    bundleProducts.forEach((product, index) => {
        if (index < bundleProductElements.length) {
            bundleProductElements[index].style.backgroundImage = `url(${product.mainImage})`;
        }
    });

    // Hide any extra elements
    bundleProductElements.slice(bundleProducts.length).forEach((element) => {
        if (element) {
            element.style.backgroundImage = '';
        }
    });

    // Update the close buttons
    updateCloseButtons();
    updateBundleTotal();
    updateBackgroundColors(bundleProducts.length);
}





function updateCloseButtons() {
    const closeButtons = [
        document.getElementById('bundle-close-btn-1'),
        document.getElementById('bundle-close-btn-2'),
        document.getElementById('bundle-close-btn-3'),
        document.getElementById('bundle-close-btn-4')
    ];

    closeButtons.forEach((btn, index) => {
        if (btn) {
            if (index < bundleProducts.length) {
                btn.style.position = 'absolute';
                btn.style.display = 'flex'; // Make sure the button is visible
            } else {
                btn.style.display = 'none'; // Hide buttons if they are not needed
            }
        }
    });
}



function updateBundleTotal() {
    const bundleTotalElement = document.getElementById('bundle-total');
    const bundleSavedElement = document.getElementById('bundle-saved');
    const bundleDiscountElement = document.getElementById('bundle-discount');

    // Debugging
    console.log('bundleProducts:', bundleProducts);
    console.log('bundleTotalElement:', bundleTotalElement);
    console.log('bundleSavedElement:', bundleSavedElement);
    console.log('bundleDiscountElement:', bundleDiscountElement);

    if (bundleTotalElement && bundleSavedElement && bundleDiscountElement) {
        // Handle case with no products
        if (bundleProducts.length === 0) {
            bundleTotalElement.innerText = '';
            bundleSavedElement.style.display = 'none';
            bundleDiscountElement.style.display = 'none';
        } else if (bundleProducts.length === 1) {
            // Handle case with a single product
            const productPrice = bundleProducts[0].price;
            bundleTotalElement.innerText = `$${(productPrice / 100).toFixed(2)}`;
            
            // Hide #bundle-saved and #bundle-discount
            bundleSavedElement.style.display = 'none';
            bundleDiscountElement.style.display = 'none';
        } else if (bundleProducts.length === 2) {
            // Handle case with two products
            const totalPrice = bundleProducts.reduce((total, product) => total + product.price, 0);
            const discount = 0.10; // 10% discount
            const discountedTotal = totalPrice - (totalPrice * discount);

            // Update #bundle-saved to show the total price
            bundleSavedElement.innerText = `$${(totalPrice / 100).toFixed(2)}`;

            // Update #bundle-total to show the discounted total price
            bundleTotalElement.innerText = `$${(discountedTotal / 100).toFixed(2)}`;

            // Show #bundle-saved and #bundle-discount
            bundleSavedElement.style.display = '';
            bundleDiscountElement.style.display = '';
            bundleDiscountElement.innerText = '10% off';
        } else if (bundleProducts.length === 3) {
            // Handle case with three products
            const totalPrice = bundleProducts.reduce((total, product) => total + product.price, 0);

            // Show the total price in #bundle-total
            bundleTotalElement.innerText = `$${(totalPrice / 100).toFixed(2)}`;

            // Hide #bundle-saved and set #bundle-discount to 'free shipping'
            bundleSavedElement.style.display = 'none';
            bundleDiscountElement.style.display = '';
            bundleDiscountElement.innerText = 'Free shipping';
        } else if (bundleProducts.length === 4) {
            // Handle case with four products
            const totalPrice = bundleProducts.reduce((total, product) => total + product.price, 0);

            // Show the total price of the first 3 products in #bundle-total
            const totalPriceFirstThree = bundleProducts.slice(0, 3).reduce((total, product) => total + product.price, 0);
            bundleTotalElement.innerText = `$${(totalPriceFirstThree / 100).toFixed(2)}`;

            // Show the total price of all 4 products in #bundle-saved
            bundleSavedElement.innerText = `$${(totalPrice / 100).toFixed(2)}`;

            // Set #bundle-discount to 'GET FREE'
            bundleSavedElement.style.display = '';
            bundleDiscountElement.style.display = '';
            bundleDiscountElement.innerText = 'GET FREE';
        } else {
            // Handle case with more than 4 products, if needed
        }
    } else {
        console.error('One or more elements not found.');
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.getElementById('bundle-cart-btn');
    
    if (cartBtn) {
        console.log('Adding event listener to cart button');
        
        cartBtn.addEventListener('click', async () => {
            console.log("Cart button was clicked");
            
            const lineItems = bundleProducts.map(product => ({
                id: product.selectedVariantId,
                quantity: 1 // Default quantity of 1 for each item
            }));

            try {
                const response = await fetch('/cart/add.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ items: lineItems })
                });

                if (response.ok) {
                    console.log('Items added to cart successfully');
                    window.location.href = '/cart'; // Redirect to cart page
                } else {
                    console.error('Error adding items to cart:', await response.text());
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    } else {
        console.error('Button with ID "bundle-cart-btn" not found');
    }
});

