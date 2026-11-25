# TaskFlow – Simple To-Do App

A small static web app built with plain **HTML, CSS and JavaScript** (no build step, no dependencies).

## Features
- Add, complete and delete tasks
- Filter: All / Active / Done
- Tasks saved in the browser (localStorage)
- Dark mode toggle
- Responsive design

## Run locally
Just open `index.html` in your browser.

## Upload to GitHub
1. Create a new repository on https://github.com/new (e.g. `taskflow`).
2. In this project folder, run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/taskflow.git
git push -u origin main
```

(Or use **Add file → Upload files** on GitHub and drag in all four files.)

## Deploy with GitHub Pages (free)
1. Open your repository → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
3. Choose branch `main` and folder `/ (root)`, then click **Save**.
4. After a minute, your site is live at:
   `https://YOUR-USERNAME.github.io/taskflow/`

## Project structure
```
index.html   – page structure
style.css    – styling and dark mode
script.js    – app logic
README.md    – this file
```
