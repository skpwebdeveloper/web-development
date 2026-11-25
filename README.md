# Sameer Bhatti – Web Developer Portfolio

Premium, fully responsive portfolio (black / white / emerald) with a Flask backend for the contact form.

## Run locally

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open http://localhost:5000

Contact-form messages are saved to `messages.jsonl` (one JSON object per line).

## Project structure

```
app.py                 Flask app + /api/contact endpoint
templates/index.html   Single-page site (SEO meta, JSON-LD)
static/css/style.css   Design system, layout, animations, responsive rules
static/js/main.js      Nav, scroll reveal, counters, typing effect, filter, form
requirements.txt
```

## Customise

- **Prices / features**: edit the `#pricing` section in `templates/index.html`.
- **Portfolio**: each `<article class="project">` is a card. Change the title, text and the "View Project" `href` to your real live links. Mockup colours come from `.mock--*` classes in the CSS; replace a mockup with a screenshot by putting an `<img>` inside the card.
- **Social links**: Fiverr is set. LinkedIn, GitHub, Instagram and Facebook point to site homepages; replace them with your own profile URLs.
- **Stats** in the hero (150+ projects, etc.) are placeholders. Set them to your real numbers (`data-count` attributes).
- **Colours**: change the CSS variables at the top of `style.css`.

## Deploy

```bash
gunicorn app:app
```

Works on Render, Railway, PythonAnywhere or any VPS. For production, put it behind HTTPS and consider emailing yourself new messages (e.g. with `smtplib`) inside `contact()` in `app.py`.
