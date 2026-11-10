# Swarnamouli Majumdar — Personal Academic & Research Website

A responsive, multi-page personal website for **Swarnamouli Majumdar**, Ph.D. candidate at Concordia University and Founder & CEO of Zenext AI. Designed for **GitHub Pages** with no framework, package manager, build service, analytics, cookies, or paid hosting requirements.

The design uses an editorial academic style, a restrained ink, copper and neutral palette, deep ink typography, and research-forward content. It is inspired by the clean, direct presentation of the user-supplied academic portfolio reference, without copying its code or assets.

## Pages

- **`index.html`** — About, research agenda, highlights, selected publications, innovation projects, conference engagements, recognition, experience, teaching, contact.
- **`research.html`** — Five detailed research directions with methods, research questions, and linked publications.
- **`publications.html`** — 30 linked research records with a working title/topic search, year/type and research-topic filters, DOI links and a CSV download.
- **`news.html`** — 12 source-linked news, interviews, podcast episodes, university features and recognition items, with topic search and filters.
- **`about.html`** — Academic and professional profile, career timeline, education, awards, teaching, reviewing, and outreach.

- **`gallery.html`** — A conference and demonstration gallery featuring ICACIML 2026 keynote and panel moments, CCNCPS 2025 and InCIT 2025 recognitions, ICCE 2025 and autonomous-vehicle presentations, public-safety technology demonstrations, and curated event photography.

There is also a light/dark theme toggle, responsive mobile menu, metadata for social sharing and search engines, a conference photography gallery, and accessibility support.

## Deploy on GitHub Pages

**Important:** The GitHub account owner must match the address you want. To publish at `https://swarnamouli.github.io`, the repository must be named `swarnamouli.github.io` **under the GitHub user `swarnamouli`**. If your GitHub username is different, the correct user-site address will use that username instead.

1. Sign in to your intended GitHub account.
2. Create a **public** repository called `swarnamouli.github.io` (or `<your-actual-username>.github.io`).
3. Upload the **contents of this folder**, not the outer folder or ZIP file. In particular, `index.html` must be in the repository root.
4. Open **Settings → Pages → Build and deployment**.
5. Choose **Deploy from a branch**, `main`, and `/(root)`; save.
6. After publishing, open your GitHub Pages website. It can take a few minutes for a new site to appear.

Reference: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

### Alternate git commands

```bash
# Run these commands inside this website folder:
git init
git add .
git commit -m "Launch academic research website"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-USERNAME>.github.io.git
git push -u origin main
```

Replace `<YOUR-USERNAME>` with your actual GitHub username. If you have already initialized a repository, do not run `git init` or add an existing remote again.

## Preview locally

The root files are already built. You can open `index.html` in a browser or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. On some browsers, clipboard permissions may be limited when opening `file://` pages; a local server or GitHub Pages avoids that issue.

## Edit biography, research, publications, awards, and CV content

All source content is centralized in **`data/content.json`**. Edit the descriptions and data there, then regenerate the HTML with:

```bash
python3 build.py
```

The build uses Python's standard library only; nothing to install.

Publication records support:

- `id` (unique), `year`, `type` (`Journal` or `Conference`), `topic`, `title`, `venue`, and `doi`.
- `featured: true` for homepage selection; the homepage currently shows the first four featured items.
- If `doi` is empty, the page links to a scholarly title search rather than pretending a direct DOI exists.

To update the news section, edit `media` in `data/content.json`; each item has an outlet, date, category, type, original URL, short editorial summary, and optional related links. The first item is the homepage feature and three additional items appear on the homepage. Research articles that are republished are grouped as one story with multiple links. Then run `python3 build.py`.

To update an academic award, edit `awards`. To update the résumé timeline, edit `experience` or `education`. To edit research areas, modify `research` and their `publication_ids` references. To add a new publication, also assign a unique `id` so research-area links remain functional.

## Biography portrait (landing page only)

The site uses `assets/photos/swarnamouli-bio-portrait.png` exclusively on the **landing page** (`index.html`), with a short biography caption directly beneath it. The portrait is not shown on the About & CV page or in the conference gallery.

To change the landing-page portrait later, replace the referenced image or update the `site.portrait` value in `data/content.json`, then run `python3 build.py`. Edit the caption text within the `home()` function in `build.py` if desired.

## Add conference, demo, or award photos

The **conference photo gallery is active** on the homepage and the dedicated `gallery.html` page. Conference, award, and demonstration photographs are stored locally under `assets/photos/`, so they do not depend on external image hosts. Titles, captions, and alternative text are in `data/content.json` and the gallery page generator in `build.py`.

The gallery includes ICACIML 2026, CCNCPS 2025, InCIT 2025, IEEE ICCE 2025, IEEE UEMCON 2024, and public-safety technology demonstrations. The biography portrait is excluded from the gallery. Please ensure you have permission to publicly share the photographs, especially where other attendees appear.

Example:

```json
"gallery": [
  {
    "image": "assets/conference-talk.jpg",
    "alt": "Swarnamouli speaking at a research conference",
    "title": "Research presentation",
    "caption": "Conference name · 2025"
  }
]
```

The files must exist at the matching relative paths before publishing. Compress photos for web use (generally under 300–500 KB each if practical). Provide factual descriptions and dates—do not use inaccurate award or event labels.

## Privacy and quality checks before launch

- **Phone number not published:** The academic CV source includes a personal phone number, but the public site intentionally omits it.
- **Email is visible:** The website includes the email address printed in the academic CV (`swarna1988.19@gmail.com`). You can change it centrally in `data/content.json` if you prefer a professional domain email.
- **Review names, roles, dates, awards, and DOIs:** The content reflects your supplied CV versions as of November 2026. Additional papers and awards may need updating.
- **Readability and research integrity:** Research frameworks are described as frameworks, not claimed as field-tested systems. Industry R&D concepts are distinct from peer-reviewed articles.
- **Pages are public:** Do not upload private information, unpublished manuscripts, confidential sponsor data, private photos, or internal Zenext assets to a public GitHub Pages repository.
- **Canonical URLs:** If your actual GitHub username or domain differs, update `site.website` and the hard-coded canonical/OG URLs in `build.py` before building.

## Structure

```text
swarnamouli-personal-website/
├── index.html              # built home page
├── research.html           # built research page
├── publications.html       # built selected bibliography
├── about.html              # built academic & career page
├── news.html               # curated news and media archive
├── build.py                # dependency-free content compiler
├── data/
│   ├── content.json        # editable website content
│   └── publications.csv    # downloadable publications list
├── assets/
│   ├── style.css
│   ├── main.js
│   ├── avatar.svg           # abstract placeholder, not a portrait
│   ├── favicon.svg
│   ├── og-card.svg
│   └── og-card.png
├── sitemap.xml
├── robots.txt
└── .nojekyll
```

## Updating GitHub Pages

After editing, run `python3 build.py`, commit changed files, and push to `main`. GitHub Pages updates automatically if configured to deploy from that branch.

---

**Credits:** Custom site authored for Swarnamouli Majumdar; no assets or code were copied from the linked example website.

## Verification and editorial integrity

- **ICACIML 2026:** The official conference schedule lists Swarnamouli Majumdar for the 26 March 2026 keynote *Artificial Intelligence for Safer Cities and Communities* and an industry panel. Source: https://ifheindia.org/icfai-tech-school-hyderabad/ICACIML-2026
- **Conference gallery update:** The gallery now focuses on delivered talks, conference participation, awards, and public-facing technology demonstrations, with curated external links grouped under News & Media for clarity.
- **InCIT 2025:** The award attribution comes from the user's uploaded award ceremony photographs and certificate, which visibly name the award, research title and coauthors.
- **IEEE ICCE 2025:** IEEE publication DOI: https://doi.org/10.1109/ICCE63647.2025.10930164

**Publishing:** Files in this package have not been uploaded to GitHub and are not yet live.


## 2026 redesign update

- **Home:** intentionally shortened, with four prominent links to Research, Publications, Gallery and Career. The biography portrait remains only on the landing page, and still includes its short caption.
- **Gallery:** 29 photos in a responsive thumbnail grid. Filter by event category, search captions, and open selected photos in a keyboard-accessible modal with previous/next controls. `assets/thumbs/` contains optimized thumbnail files; originals stay in `assets/photos/`.
- **Contact:** the header Connect link points to the home page contact area. The contact area includes an email-compose link, copyable email address, and direct LinkedIn link. A mailto link alone will only work when an email client is configured.
- **Publications:** searchable 30-entry collection, 29 DOI links and one clearly labelled working paper. The Google Scholar button links to the author's full, live bibliography; the local list is not a complete Google Scholar export.
- **Note on verification:** The former V-MEDrone IEEE Access citation could not be independently verified; it is labelled a working manuscript and no longer carries an unverified DOI or journal claim.

### Uploading the replacement files on GitHub

1. Your repository is `swarnamouli/swarnamouli.github.io`; keep the existing `assets/photos/` originals.
2. For a complete replacement, extract the FULL ZIP and drag its contents (including the actual `assets` and `data` folders) to your repository's **Add file > Upload files** page. Preserve the folder structure. Commit.
3. For a smaller update, use the UPDATE-ONLY ZIP. It contains modified root pages, scripts, styles, thumbnails and bibliography, and does not include unchanged original photos. Do not delete your existing `assets/photos/` folder.
4. You can use GitHub Desktop or a local git client if the browser uploader will not overwrite existing filenames.
5. Check Settings > Pages for `Deploy from a branch`, `main`, `/(root)`. Check `https://swarnamouli.github.io/` after the deploy succeeds.
6. Any root-level duplicate images from the earlier upload can be removed in a later cleanup; the website references the folders.

All files needed for the complete site are bundled in the FULL ZIP.
