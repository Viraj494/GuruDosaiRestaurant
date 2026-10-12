# Guru Dosai Restaurant – Website

Pure HTML, CSS and vanilla JavaScript. No build step: upload the folder and it works.

```
guru-dosai-website/
├── index.html        Home
├── menu.html         Menu (categories, PDF download, print view)
├── contact.html      Contact form, details, map
├── styles.css        All styling (colours at the top, print styles at the bottom)
├── script.js         Mobile menu, open/closed badge, form validation (settings at the top)
├── robots.txt / sitemap.xml
└── assets/
    ├── menu.pdf      ← SAMPLE – replace with the real menu
    └── images/       ← PLACEHOLDER photos – replace (see images/README.txt)
```

## 1. Before you deploy: replace the placeholders

Search all files for `TODO` and `your-domain.com`. The key items:

| What | Where |
|---|---|
| Email address | `info@your-domain.com` in index.html, menu.html, contact.html (footers + contact page) and `contactEmail` in script.js |
| Opening hours | Hours tables in index.html and contact.html, footers in all 3 pages, **and** `SETTINGS.hours` in script.js (drives the "Open now" badge). Currently Mon–Sun 11 AM – 10 PM |
| Social links | Footer of each page: `YOUR-PAGE` (Facebook), `YOUR-HANDLE` (Instagram). The WhatsApp link already uses 076 397 3883 |
| Menu items and prices | menu.html – all dishes and prices are **samples** |
| Domain name | `your-domain.com` in canonical/og tags, robots.txt, sitemap.xml and the JSON-LD block in index.html |
| Colours | Variables at the top of styles.css (`--yellow`, `--saffron`, `--ink` …) |

## 2. Swap in the real menu PDF

1. Export your menu as a PDF.
2. Name it exactly **`menu.pdf`** and drop it into the `assets/` folder, replacing the sample.
3. Done. Every "Download Menu (PDF)" button and footer link downloads it as `menu.pdf`.

Keep the PDF under about 5 MB so it downloads quickly on mobile data.

## 3. Swap in the real images

Put your photos in `assets/images/` using the **same file names** as the placeholders (sizes are listed in `assets/images/README.txt`). To use PNG or WebP instead, change the extension in the `src` in the HTML (and in styles.css for `hero.jpg`).

## 4. Make the contact form deliver messages

A static site has no server, so choose one:

- **Easiest:** leave `formEndpoint` empty in script.js. The form then opens the visitor's email app with the message ready to send to your email.
- **Better:** create a free form at [Formspree](https://formspree.io), [Web3Forms](https://web3forms.com) or [Getform](https://getform.io), paste the URL into `SETTINGS.formEndpoint` in script.js. Messages then arrive in your inbox without the visitor leaving the site.

## 5. Map pin

The embed on contact.html searches by address. For a precise pin: Google Maps → find the restaurant → **Share → Embed a map** → copy the `src="…"` URL and paste it over the iframe `src`.

## 6. Deploy

You can test locally first by double-clicking `index.html`.

### Option A – Netlify (easiest, drag and drop)
1. Create a free account at netlify.com.
2. Go to **Add new site → Deploy manually** and drag the whole `guru-dosai-website` folder onto the page.
3. You get a live `https://something.netlify.app` URL in seconds. Update the site by dragging the folder again.
4. Custom domain: **Domain management → Add a domain**, then follow the DNS steps.

### Option B – GitHub Pages (free, good for ongoing updates)
1. Create a GitHub repository and upload the files (the files must be at the top level, with `index.html` at the root).
2. Go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, then Save.
3. After a minute your site is live at `https://<username>.github.io/<repo>/`.
4. Custom domain: enter it under **Pages → Custom domain**.

### Option C – Vercel
1. Push the folder to GitHub, then at vercel.com choose **Add New → Project** and import the repository.
2. Framework preset: **Other**. Leave the build command and output directory empty, then Deploy.

### After going live
- Replace `your-domain.com` with the real address everywhere (see section 1).
- Add the restaurant to [Google Business Profile](https://business.google.com) with the same address and phone number. This matters most for local search.
- Submit `https://your-domain/sitemap.xml` in Google Search Console.
- Test on a phone: the hamburger menu, the **Call to Order** button and the contact form.
- Test **Print Menu** on menu.html (Ctrl/Cmd + P) to see the print-friendly layout.
