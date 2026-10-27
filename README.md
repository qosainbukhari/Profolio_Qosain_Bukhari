# Qosain Bukhari — Portfolio

Personal portfolio of **Qosain Bukhari**, junior AI/ML engineer (computer vision, RAG, tabular ML, MLOps).

🔗 **Live site:** https://qosainbukhari.github.io/Profolio_Qosain_Bukhari/

## What's on the site

- **Home**: results measured on held-out data, featured projects, about and contact
- **Projects**: all projects with filters by area, plus smaller GitHub repos
- **Case studies**: one page per project with the problem, data, approach, results table, system diagram and limitations
- **About**: background, how I work, experience, education, skills and certifications
- **Resume**: the CV as a web page, with a PDF download

## Built with

Plain HTML, CSS and JavaScript (no framework, no build step), hosted on **GitHub Pages**.
Design: a retro "engineering computation pad" with green graph paper, navy ink and hard shadows.

```text
index.html                 home
projects.html              all projects
projects/*.html            case-study pages
about.html, resume.html    about and resume pages
404.html                   not-found page
assets/css/style.css       styles
assets/js/site.js          menu, project filters, scroll reveal, copy email
assets/img/                photo and project screenshots
Qosain_Bukhari_Resume.pdf  downloadable resume
```

## Run locally

```bash
git clone https://github.com/QosainBukhari/Profolio_Qosain_Bukhari.git
cd Profolio_Qosain_Bukhari
python -m http.server 8000   # open http://localhost:8000
```
