# Cart Drawer with Recommendations

A Shopify Dawn theme enhancement that adds product recommendations to the cart drawer on mobile devices.

## Features

- Mobile-optimized product recommendations
- Automatic product suggestions based on store inventory
- Multi-language support
- Smooth add-to-cart functionality
- Responsive design with 300px fixed-width cards
- Testimonial slider integration

## Installation

1. Add the following files to your Dawn theme:
   ```
   assets/
   ├── component-custom-cart-drawer.css
   ├── cart-drawer.js
   snippets/
   ├── custom-cart-drawer.liquid
   ```

2. Update your language files in `locales/` with the new translations:
   ```json
   {
     "sections": {
       "cart": {
         "recommendations_heading": "You may also like"
       }
     }
   }
   ```

3. Include the cart drawer in your theme:
   ```liquid
   {% render 'custom-cart-drawer' %}
   ```

## Configuration

### Customizing Recommendations

The recommendations are pulled from your store's products collection. To modify the selection criteria, adjust the following in `custom-cart-drawer.liquid`:

```liquid
{% assign today_seed = 'now' | date: '%Y%m%d' | times: 1 %}
{% assign all_products_sorted = collections.all.products | sort: today_seed %}
```

### Styling

Customize the appearance by modifying `component-custom-cart-drawer.css`. Key classes:

- `.cart-recommendations-container`: Main container
- `.cart-recommendations__item`: Individual product cards
- `.cart-recommendations__grid`: Product grid layout

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS 14+, Android 5+)

## Dependencies

- Shopify Dawn theme
- Swiper.js (included in Dawn)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of Shopify Dawn theme and follows its licensing terms.

## Support

For support, please refer to [Shopify's theme documentation](https://shopify.dev/themes) or open an issue in the repository.
