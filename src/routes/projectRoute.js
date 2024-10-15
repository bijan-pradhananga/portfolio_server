const express = require('express')
const Project = require('../controllers/ProjectController')
const UploadMiddleware = require('../middleware/UploadMiddleware')
const pInstance = new Project()
const projectRouter = express.Router()
const fInstance = new UploadMiddleware();
const upload = fInstance.upload('portfolio/projects');

projectRouter.get('/', pInstance.index);
projectRouter.post('/',upload.single('image'), pInstance.store);
projectRouter.get('/:id', pInstance.show);
projectRouter.put('/:id',upload.single('image'), pInstance.update);
projectRouter.delete('/:id', pInstance.destroy);

module.exports =  projectRouter;