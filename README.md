# Cart Drawer with Recommendations

A Shopify Dawn theme enhancement that adds product recommendations to the cart drawer on mobile devices. This feature improves cross-selling opportunities by showing relevant product suggestions when customers view their cart.

## Setup Instructions

1. **Theme Requirements**
   - Dawn theme version 2.0 or higher
   - Shopify CLI installed locally
   - Development store for testing

2. **Installation Steps**
   ```bash
   # Clone the repository
   git clone https://github.com/bruno-ferreira99/cart-drawer-recommendations.git
   
   # Navigate to theme directory
   cd cart-drawer-recommendations
   ```

3. **File Structure**
   ```
   assets/
   ├── component-custom-cart-drawer.css  # Styles for cart drawer
   ├── cart-drawer.js                    # Cart functionality
   snippets/
   ├── custom-cart-drawer.liquid         # Main cart drawer template
   ```

## Technical Approach

### Architecture
- Used native browser features instead of heavy frameworks
- Leveraged Dawn's existing cart drawer as foundation
- Implemented mobile-first responsive design
- Built with progressive enhancement in mind

### Key Design Decisions
1. **Simplified Variant Display**
   - Show first available variant instead of dropdown
   - Reduces UI complexity on mobile
   - Improves load time and performance

2. **Performance Optimizations**
   - Lazy loading for recommendation images
   - Minimal DOM manipulation
   - Efficient event delegation

3. **Accessibility**
   - ARIA labels for interactive elements
   - Keyboard navigation support
   - Screen reader friendly markup

## Challenges and Solutions

### Challenge 1: Mobile Performance
**Problem:** Initial implementation caused layout shifts when loading recommendations.

**Solution:**
- Implemented fixed height containers
- Added skeleton loading states
- Pre-calculated image dimensions

### Challenge 2: Cart Updates
**Problem:** Recommendations weren't updating when cart changed.

**Solution:**
- Created custom event system for cart updates
- Implemented efficient DOM updates
- Added debouncing for frequent changes

### Challenge 3: Cross-Browser Compatibility
**Problem:** Inconsistent styling across browsers.

**Solution:**
- Used flexbox instead of grid
- Added vendor prefixes
- Implemented fallback styles

## Usage

```liquid
{% render 'custom-cart-drawer' %}
```

### Customizing Recommendations

Modify product selection in `custom-cart-drawer.liquid`:
```liquid
{% assign today_seed = 'now' | date: '%Y%m%d' | times: 1 %}
{% assign all_products_sorted = collections.all.products | sort: today_seed %}
```

### Styling

Key classes for customization:
- `.cart-recommendations-container`: Main container
- `.cart-recommendations__item`: Product cards
- `.cart-recommendations__grid`: Layout grid

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS 14+, Android 5+)

## Dependencies

- Shopify Dawn theme
- Swiper.js (included in Dawn)

## License

This project is part of Shopify Dawn theme and follows its licensing terms.

## Support

For support, please refer to [Shopify's theme documentation](https://shopify.dev/themes) or open an issue in the repository.



