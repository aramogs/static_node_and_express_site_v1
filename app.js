//requiring dependencies
const express = require('express');
const { data } = require('./data.json');
const { projects } = data;


const app = express();

//serving the static files
app.use('/static', express.static('public'));
app.use('/images', express.static('images'));

//setting the view engine to pug
app.set('view engine', 'pug');


//route to index.pug
app.get('/', (req, res) => {

  const projs = [];

  for (let i = 0; i < projects.length; i++) {
    projs.push({proj_id: projects[i].id, proj_name: projects[i].project_name});
  }

  const templateData = { projs };

  res.render('index', templateData);
});


//route to about.pug
app.get('/about', (req, res) => {
  const usrName = data.info[0].name;
  const usrSkills = data.info[0].skills;
  const usrContact = data.info[0].contactinfo;
  const usrPortfolio = data.info[0].portfolio;
  const usrPages = data.info[0].pages;
  
  const templateData = { usrName, usrSkills ,usrContact, usrPages,usrPortfolio}
  res.render('about',templateData);
});


//redirecting to the first project in case of the id of the project is missing in the url
app.get('/project', (req, res) => {
  res.redirect('/project/0');
});

//route to project.pug
app.get('/project/:id', (req, res, next) => {

  const id = req.params.id;

  //if the id in the url is correct (between 0 and the number of projects), rendering the project page, serving the needed data from data.json
  if (id >= 0 && id <= projects.length) {
    const projId = projects[id].id;
    const projName = projects[id].project_name;
    const projDescr = projects[id].description;
    const projTech = projects[id].technologies;
    const projLiveLink = projects[id].live_link;
    const projGithub = projects[id].github_link;
    const projImages = projects[id].image_urls;

    const templateData = { projId, projName, projDescr, projTech, projLiveLink, projGithub, projImages };

    res.render('project', templateData);
  } else {
    //if the id in the url is uncorrect, rendering the error page
    const err = new Error("This project doesn't exist (yet)!");
    err.status = 404;
    next(err);
  }
});


//setting an error in case of an uncorrect url
app.use((req, res, next) => {
  const err = new Error("OOPS We could find this page :(");
  err.status = 404;
  next(err);
});


//rendering an error page in case of an uncorrect url
app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});


//listening to port 3000
app.listen(3000, () => {
  console.log('The app is running!');
});
