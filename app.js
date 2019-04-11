//Dependencies
const express = require('express');
const { data } = require('./data.json');
const { projects } = data;


const app = express();

//Static Files
app.use('/static', express.static('public'));
app.use('/images', express.static('images'));

//View Engine
app.set('view engine', 'pug');

//Server Port
app.listen(3000, () => {
  console.log('The app is running!');
});

//Routes /
app.get('/', (req, res) => {

  const projs = [];

  for (let i = 0; i < projects.length; i++) {
    projs.push({proj_id: projects[i].id, proj_name: projects[i].project_name});
  }

  const templateData = { projs };

  res.render('index', templateData);
});

//Routes /about
app.get('/about', (req, res) => {
  const usrName = data.info[0].name;
  const usrSkills = data.info[0].skills;
  const usrContact = data.info[0].contactinfo;
  const usrPortfolio = data.info[0].portfolio;
  const usrPages = data.info[0].pages;
  
  const templateData = { usrName, usrSkills ,usrContact, usrPages,usrPortfolio}
  res.render('about',templateData);
});

//Routes /project/:id
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
    const err = new Error("This project doesn't exist (yet)!");
    err.status = 404;
    next(err);
  }
});

//Redirect to /project/0
app.get('/project', (req, res) => {
  res.redirect('/project/0');
});

//Error If Missing Page
app.use((req, res, next) => {
  const err = new Error("OOPS We could find this page :(");
  err.status = 404;
  next(err);
});

//Error sends information to error.pug
app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});