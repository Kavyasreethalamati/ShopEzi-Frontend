export let cart;
loadFromStorage();
export function loadFromStorage(){
   const savedCart = JSON.parse(localStorage.getItem('cart'));
   cart = Array.isArray(savedCart) ? savedCart : [];
}


function saveToStorage(){
  localStorage.setItem('cart',JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1){
  const normalizedQuantity = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
  let matchingItem;

      cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });

      if (matchingItem) {
        matchingItem.quantity += normalizedQuantity;
      } else {
        cart.push({
          productId: productId,
          quantity: normalizedQuantity,
          deliveryOptionId : '1'
        });
      }
  saveToStorage();
}

export function removeFromCart(productId){
    const newCart= [];

    cart.forEach((cartItem) => {
         if(cartItem.productId !== productId)
         {
          newCart.push(cartItem);
         }
    });

    cart = newCart;

    saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId){
     let matchingItem;

      cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });

      if (!matchingItem) {
        return;
      }

      matchingItem.deliveryOptionId = deliveryOptionId;
      saveToStorage();
}

export function updateCartItemQuantity(productId, quantity) {
  const normalizedQuantity = Number.isFinite(quantity)
    ? Math.max(1, Math.floor(quantity))
    : 1;

  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (!matchingItem) {
    return;
  }

  matchingItem.quantity = normalizedQuantity;
  saveToStorage();
}

export function clearCart() {
  cart = [];
  saveToStorage();
}


export let products = [];

export function loadCart(fun){
  const xhr = new XMLHttpRequest();
xhr.addEventListener('load', ()=>{
console.log(xhr.response);
fun();
});

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}
