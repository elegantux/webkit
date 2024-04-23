# Webasyst Webkit App

Webasyst Webkit application is a visual theme editor. It allows you to create projects (themes), templates and pages through a simple and intuitive interface.

# System Requirements

* Web Server
* PHP 7.2+
* MySQL
* NodeJS v16.19.1 (use nvm)
* Npm 8.19.3+
* Typescript 5.2.2

# Steps to run the project
1. Install Webasyst Framework (required first!) - https://developers.webasyst.com/download/
2. Install Webkit App
```SHELL
> cd /PATH_TO_WEBASYST/wa-apps/
> mkdir webkit
> git clone git://github.com/elegantux/webkit.git ./
```
3. Add the following line into the ```wa-config/apps.php``` file (this file lists all installed apps):
```php
'tasks' => true,
```
4. Install project dependencies
```SHELL
> npm ci
```
5. Run the project
```SHELL
> npm run dev
```
6. Done 🎉.

# Generate Locales
```SHELl
> brew install gettext
> msgfmt inputfile.po -o outputfile.mo
```