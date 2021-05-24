# Scheduler #
The difficulty to form schedules with the numerous data needed has been abstracted to make it easier for students. Scheduler aims to help the students find their satisfying schedules through our service. We let you create a schedule with just a few clicks.

This serves as the final project for CCAPDEV Group 14.

## Authors ##
* [Choi, Pete Fredrich](https://github.com/PM-cutedogpics)
* [Go, Wilfred Jon](https://github.com/GodGacha)
* [Sy, James Matthew](https://github.com/symatt)

## Deployed Web Application ##
[insert link here](https://ccapdev-scheduler.herokuapp.com/)

## How to Setup Locally ##
1. Clone this Repository
2. Run ```npm install``` to install dependencies that were used in this project.
3. To set up the local database, go to the **.env** change the **DB_URL** as shown below.
```
DB_URL=mongodb://localhost:27017/scheduler_db
```
4. By default, the application utilizes MongoDB Atlas.
5. To run the application online, run ```supervisor index.js```.
6. Go to your browser and go to ```localhost:3000/```.
7. You are now ready to use Scheduler!

## NPM Packages Used ##
* bcrypt
* connect-mongo
* dotenv
* express
* express-session
* express-validator
* hbs
* html2canvas
* jquery-timepicker
* mime
* mongoose
* multer
* validation-result

## Front-End Libraries Used ##
* Bootstrap 5
* Fontawesome