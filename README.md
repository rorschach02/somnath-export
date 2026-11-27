# Somnath Export website

Static website for Somnath Export, a manufacturer and exporter of dehydrated onion, garlic, fried onion and spices from Mahuva, Gujarat, India.

Plain HTML, CSS and JavaScript. No build step and no dependencies: open `index.html` in a browser, or host the folder anywhere.

## Pages

- `index.html`: homepage with the product and cut picker, specifications, process, certifications, FAQ and inquiry form
- Product pages: `dehydrated-white-onion.html`, `dehydrated-red-onion.html`, `dehydrated-pink-onion.html`, `dehydrated-garlic.html`, `fried-onion.html`
- Region pages: `north-america.html`, `europe.html`, `middle-east.html`, `africa.html`, `south-asia.html`
- Translated product pages in `es/`, `fr/`, `de/`, `ru/` and `ar/` (Arabic reads right to left)
- `css/site.css` and `js/site.js` are shared by every page

## Publish on GitHub Pages

1. Create a new repository on GitHub and upload everything in this folder to it.
2. In the repository, open Settings, then Pages.
3. Under "Build and deployment", choose "Deploy from a branch", pick the `main` branch and the `/ (root)` folder, and save.
4. After a minute or two the site is live at `https://<your-username>.github.io/<repository-name>/`.

## Before going live on the real domain

- **Inquiry form:** it prepares the message and hands it to WhatsApp. Connect it to a server or form service if inquiries should also arrive by email.
- **Product photos:** the picker shows a real photo when a file exists at `img/<product>-<cut>.jpg`, for example `img/white-onion-minced.jpg`. Products are `white-onion`, `red-onion`, `pink-onion`, `garlic`; cuts are `flakes`, `chopped`, `minced`, `granules`, `powder`. Without a photo it shows a scale drawing.
- **Page addresses:** canonical and language tags assume the live addresses `/products/<name>`, `/markets/<region>` and `/<language>/products/<name>` on `somnathexport.in`. Set up the pages at those addresses, or update the tags in each page's `<head>`.
- **Privacy and terms links** in the footer point to `/privacy-policy` and `/terms-and-conditions` on the live domain.
- **Facts to confirm with the owner:** certifications, transit times, ports, HS codes, most-ordered products by region, and the documents offered.
- **Translations** should be read by a native speaker, especially Arabic and Russian.
