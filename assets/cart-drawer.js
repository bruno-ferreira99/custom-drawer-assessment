class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    if (!cartLink) return;

    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  async addRecommendedProduct(variantId, button) {
    if (!button) return;
    
    button.setAttribute('disabled', true);
    button.classList.add('loading');
    
    const spinner = button.querySelector('.loading__spinner');
    if (spinner) spinner.classList.remove('hidden');

    try {
      const response = await fetch(`${routes.cart_add_url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          items: [
            {
              id: variantId,
              quantity: 1
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get updated cart data
      const cartResponse = await fetch(`${routes.cart_url}.js`);
      const cartData = await cartResponse.json();
      
      // Update cart count and total
      this.updateQuantity(cartData.item_count);
      this.updateCartTotal(cartData.total_price);

      // Update cart drawer contents
      const drawerResponse = await fetch(`${routes.cart_url}?section_id=cart-drawer`);
      const drawerText = await drawerResponse.text();
      
      const html = new DOMParser().parseFromString(drawerText, 'text/html');
      const cartDrawerContent = html.querySelector('.drawer__inner');
      
      if (cartDrawerContent) {
        const currentDrawerInner = this.querySelector('.drawer__inner');
        const currentDrawerInnerEmpty = this.querySelector('.drawer__inner-empty');
        
        // Remove empty states
        if (cartData.item_count > 0) {
          this.classList.remove('is-empty');
          if (currentDrawerInner) {
            currentDrawerInner.classList.remove('is-empty');
          }
          if (currentDrawerInnerEmpty) {
            currentDrawerInnerEmpty.remove();
          }
        }

        // Replace or append the new content
        if (currentDrawerInner) {
          currentDrawerInner.replaceWith(cartDrawerContent);
        } else {
          this.querySelector('.cart-drawer').appendChild(cartDrawerContent);
        }

        // Reinitialize Swiper after content update
        setTimeout(() => {
          new Swiper('.cart-testimonial-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            },
            effect: 'fade',
            fadeEffect: {
              crossFade: true
            }
          });
        }, 100);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      if (spinner) spinner.classList.add('hidden');
      button.classList.remove('loading');
      button.removeAttribute('disabled');
    }
  }

  updateQuantity(quantity) {
    const cartCountBubble = document.getElementById('cart-icon-bubble');
    const cartCount = cartCountBubble?.querySelector('span[aria-hidden="true"]');
    if (cartCount) {
      cartCount.textContent = quantity;
    }
  }

  updateCartTotal(totalPrice) {
    const totalElement = this.querySelector('.totals__total-value');
    if (totalElement) {
      // Format price according to store currency
      const formattedPrice = this.formatMoney(totalPrice);
      totalElement.textContent = formattedPrice;
    }
  }

  formatMoney(cents) {
    if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
      if (window.moneyWithCurrencyFormat) {
        return Shopify.formatMoney(cents, window.moneyWithCurrencyFormat);
      } else if (Shopify.money_with_currency_format) {
        return Shopify.formatMoney(cents, Shopify.money_with_currency_format);
      } else {
        return Shopify.formatMoney(cents, "{{ amount_with_currency_format }}");
      }
    }
    
    // Fallback formatter if Shopify.formatMoney is not available
    const currencyCode = Shopify?.currency?.active || 'USD';
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol'
    }).format(cents / 100) + ' ' + currencyCode;
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {
      this.classList.add('animate', 'active');
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') &&
      this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);

      if (!sectionElement) return;
      sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        section: 'cart-drawer',
        selector: '.cart-drawer'
      }
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);


new Swiper('.cart-testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    }
});
