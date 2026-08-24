# Glimpaxe Momento — Public Website Upgrade & Admin Integration

This package preserves the existing pages, images, navigation and original sections, while adding an advanced experience layer and live-admin hooks.

## Connect to the Admin API
Open `config.js` and set:

```js
window.GLIMPAXE_CONFIG = {
  API_BASE_URL: 'https://YOUR-ADMIN-DOMAIN.com'
};
```

The website expects these public API endpoints:

- `GET /api/public/products`
- `GET /api/public/events`
- `GET /api/public/contacts`
- `POST /api/enquiries`

The products page and selected home-page sections will automatically use products returned by `/api/public/products`.

The quote form attempts to send an enquiry to `/api/enquiries` and then continues to WhatsApp. WhatsApp remains the conversion fallback so a temporary API outage does not stop a customer from contacting Glimpaxe.

## Important CORS note
If the public website and admin API are hosted on different domains, the admin server must allow the public website origin through CORS. For example, configure the backend to allow the exact public website domain, not `*`, when credentials/authenticated requests are involved.

## Deployment
This is a static website. It can be deployed to Netlify, Vercel, GitHub Pages (for the static part), Render static hosting, or another static host. The admin API can be hosted separately.

## Preserved assets
All original assets in the supplied ZIP are retained, including the logo and product/work images.
