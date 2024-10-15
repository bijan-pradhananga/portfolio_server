const Project = require('../models/Project.js')
const UploadMiddleware = require('../middleware/UploadCloudMiddleware');
const fInstance = new UploadMiddleware();

class ProjectController {
    async index(req, res) {
        try {
            const projects = await Project.find();
            res.status(200).json({ projects });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async store(req, res) {
        try {
            let image = "";

            if (req.file) {
                image = req.file.path;  // Cloudinary URL of the uploaded image
            }
            const project = await Project.create({
                ...req.body, image
            });
            res.status(201).json({
                message: "Project Created Successfully",
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


    async show(req, res) {
        try {
            const project = await Project.findById(req.params.id);
            res.status(200).json({ project })
        } catch (error) {
            res.status(500).json({ message: err.message });
        }
    }


    async destroy(req, res) {
        try {
            const projectId = req.params.id;
            const project = await Project.findByIdAndDelete(projectId);
    
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
    
            // If the project has an associated image, delete it from Cloudinary
            if (project.image) {
                const publicId = project.image.split('/').pop().split('.')[0]; // Extract the public ID from the image URL
                await fInstance.deleteImage(publicId); // Use the middleware's method to delete the image
            }
    
            res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const projectId = req.params.id;
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
            let newImage = project.image; // Store the old image URL
            // Check if a new file is being uploaded
            if (req.file) {
                // Delete the old image using the deleteImage method from UploadMiddleware
                const oldPublicId = project.image.split('/').pop().split('.')[0]; // Extract the public ID from the image URL
                await fInstance.deleteImage(oldPublicId); // Delete the old image

                // Upload the new image
                newImage = req.file.path; // Get the Cloudinary URL from the uploaded file
            }
            // Update project data
            const updatedProject = await Project.findByIdAndUpdate(projectId, { ...req.body, image: newImage }, { new: true });

            res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = ProjectController;
