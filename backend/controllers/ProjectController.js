const Project = require("../models/Project");
const { projectsValidation, recusa } = require("../utils/validation");

module.exports = {
  async store(request, response) {
    const { error } = projectsValidation(request.body);
    if (error) return recusa(response, error);

    const project = new Project({
      title: request.body.title,
      description: request.body.description,
      link: request.body.link,
    });
    try {
      const savedProject = await project.save();
      return response.send(savedProject._id);
    } catch (err) {
      throw err;
    }
  },

  async index(request, response) {
    try {
      const projects = await Project.find();

      return response.send({ projects });
    } catch (err) {
      return response.status(400).send("Error loading projects");
    }
  },

  async update(request, response) {
    const { error } = projectsValidation(request.body);
    if (error) return recusa(response, error);

    try {
      await Project.findOneAndUpdate(
        { _id: request.params.projectId },
        {
          title: request.body.title,
          description: request.body.description,
          link: request.body.link,
        }
      );

      return response.send("Success!");
    } catch (err) {
      return response.status(400).send("Error updating project");
    }
  },

  async delete(request, response) {
    try {
      const removedProject = await Project.findOneAndDelete({
        _id: request.params.projectId,
      });
      response.json(removedProject);
    } catch (err) {
      console.log(err);
      return response.status(400).send("Error deleting project");
    }
  },
};
