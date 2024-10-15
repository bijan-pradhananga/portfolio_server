const Project = require('../models/Project.js')

class ProjectController {
    async index(req, res) {
        try {
            const projects = await Project.find();
            res.status(200).json({projects});
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async store(req, res) {
        try {
            let image = "";
            console.log(req.file);
            
            if (req.file) {
                console.log('image found');
                image = req.file.path;  // Cloudinary URL of the uploaded image
            }
            const project = await Project.create({
                ...req.body,image
            });
            res.status(201).json({
                message: "Project Created Successfully",
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    

    async show(req,res){
        try {
            const project = await Project.findById(req.params.id);
            res.status(200).json({project})
        } catch (error) {
            res.status(500).json({ message: err.message });
        }
    }

    async destroy(req,res){
        try {
            const project = await Project.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const adminId = req.params.id;
            const admin = await Admin.findById(adminId);
            if (!admin) {
                return res.status(404).json({ message: 'admin not found' });
            }
            // Handle image upload if a file is present in the request
            if (req.file) {
                const oldImagePath = admin.image ? path.join(__dirname, '../../public/admins', admin.image) : null;
                // Save the new image
                const imagePath = req.file.filename;
                // Update the admin's image path in the database
                req.body.image = imagePath;
                // Delete the old image if it exists
                if (oldImagePath && fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            // Update admin data
            await admin.findByIdAndUpdate(adminId, req.body, { new: true });
            res.status(200).json({ message: 'admin updated successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = ProjectController;
