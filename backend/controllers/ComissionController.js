const Comission = require('../models/Comission');
const Project = require('../models/Project');
const File = require('../models/File');
const { comissionsValidation } = require('../utils/validation');
const { deleteFile } = require('../utils/functions');
const sharp = require('sharp');

// Largura e altura de cada foto, para o site montar a galeria na proporção
// de cada uma sem a página pular. Foto enviada antes de as medidas serem
// gravadas é medida aqui uma vez e fica salva.
const medidasDasFotos = async (comissions) => {
  const ids = comissions.flatMap((c) => c.photos);
  const arquivos = await File.find({ _id: { $in: ids } }).lean();
  await Promise.all(
    arquivos
      .filter((f) => !f.width)
      .map(async (f) => {
        try {
          const { width, height } = await sharp(`uploads/comissions/${f.key}`).metadata();
          Object.assign(f, { width, height });
          await File.updateOne({ _id: f._id }, { width, height });
        } catch (err) {
          console.log(`sem medidas para ${f.key}: ${err.message}`);
        }
      })
  );
  const porId = new Map(arquivos.map((f) => [String(f._id), f]));
  return (fotos) =>
    fotos
      .map((id) => porId.get(String(id)))
      .filter((f) => f && f.width)
      .map((f) => ({ _id: f._id, width: f.width, height: f.height }));
};

module.exports = {
  async store(request, response) {
    const { error } = comissionsValidation(request.body);
    if (error) return response.status(400).send(error.details[0].message);

    const comission = new Comission({
      title: request.body.title,
      description: request.body.description,
      tags: request.body.tags,
    });
    try {
      const savedComission = await comission.save();
      response.send(savedComission);
    } catch (err) {
      response.status(400).send(err);
    }
  },

  async index(request, response) {
    try {
      const comissions = await Comission.find().lean();
      const medidas = await medidasDasFotos(comissions);
      comissions.forEach((c) => (c.medidas = medidas(c.photos)));

      return response.send({ comissions });
    } catch (err) {
      return response.status(400).send('Error loading comissions');
    }
  },

  async show(request, response) {
    try {
      const comission = await Comission.findOne({
        _id: request.params.comissionId,
      }).populate('project photos');

      return response.send({ comission });
    } catch (err) {
      return response.status(400).send('Error loading comission');
    }
  },

  async update(request, response) {
    const { error } = comissionsValidation(request.body);
    if (error) return response.status(400).send(error.details[0].message);

    try {
      await Comission.findOneAndUpdate(
        { _id: request.params.comissionId },
        {
          title: request.body.title,
          description: request.body.description,
          tags: request.body.tags,
        }
      );

      return response.send('Success!');
    } catch (err) {
      return response.status(400).send('Error updating comission');
    }
  },

  async addPhoto(request, response) {
    if (!request.file) return response.status(400).send('"file" is required');

    const { originalname: name, size, filename: key, width, height } = request.file;
    const file = new File({
      name,
      size,
      key,
      width,
      height,
    });

    try {
      const savedFile = await file.save();

      try {
        const updatedComission = await Comission.updateOne(
          { _id: request.params.comissionId },
          { $push: { photos: savedFile } }
        );

        return response.json({ updatedComission });
      } catch (err) {
        deleteFile(file, 'comissions');
        await File.deleteOne({ _id: savedFile._id });
        return response.status(400).send(err);
      }
    } catch (err) {
      deleteFile(file, 'comissions');
      return response.status(400).send(err);
    }
  },

  async removePhoto(request, response) {
    const comission = await Comission.findOne({
      _id: request.params.comissionId,
    });
    if (!comission) return response.status(400).send('Comission not found!');

    const file = await File.findOne({ _id: request.body.photoId });
    if (!file) return response.status(400).send('Photo not found!');

    try {
      const updatedComission = await Comission.updateOne(
        { _id: request.params.comissionId },
        { $pull: { photos: request.body.photoId } }
      );

      try {
        const removedFile = await File.deleteOne({ _id: request.body.photoId });

        deleteFile(file, 'comissions');

        return response.json({ comission: updatedComission });
      } catch (err) {
        console.log('Erro aquii');
        return response.status(400).json({ message: err });
      }
    } catch (err) {
      return response.status(400).json({ message: err });
    }
  },

  async delete(request, response) {
    try {
      const removedComission = await Comission.findOneAndDelete({
        _id: request.params.comissionId,
      });

      //deletar projetos da comissao
      await removedComission.project.forEach(async (element) => {
        await Project.deleteOne({ _id: element });
      });
      response.json({
        comission: removedComission,
      });

      //deletar fotos da comissao
      console.log(removedComission.photos);
      await removedComission.photos.forEach(async (element) => {
        const photo = await File.findOneAndDelete({ _id: element });

        deleteFile(photo, 'comissions');
      });
      response.json({
        comission: removedComission,
      });
    } catch (err) {
      return response.status(400).send('Error deleting comission');
    }
  },

  async insertProject(request, response) {
    const project = await Project.findOne({ _id: request.body.projectId });

    if (!project) {
      return response.status(400).send({ error: 'Project does not exist' });
    }

    const estaNaComissao = await Comission.findOne({
      _id: request.params.comissionId,
      project: { $in: [project] },
    });

    if (estaNaComissao) {
      return response
        .status(400)
        .send({ error: 'Project is already on this comission' });
    }

    //inserir projeto
    const updatedComission = await Comission.updateOne(
      { _id: request.params.comissionId },
      { $push: { project: request.body.projectId } }
    );

    response.json(updatedComission);
  },

  async removeProject(request, response) {
    const project = await Project.findOne({ _id: request.body.projectId });

    const estaNaComissao = await Comission.findOne({
      _id: request.params.comissionId,
      project: { $in: [request.body.projectId] },
    });

    if (!project) {
      return response.status(400).send({ error: 'Project does not exist' });
    }

    if (!estaNaComissao) {
      return response
        .status(400)
        .send({ error: 'Project is not on this comission' });
    }

    try {
      const updatedComission = await Comission.updateOne(
        { _id: request.params.comissionId },
        { $pull: { project: request.body.projectId } }
      );

      try {
        await Project.deleteOne({ _id: request.body.projectId });
        return response.json(updatedComission);
      } catch (err) {
        return response.status(400).send(err);
      }
    } catch (err) {
      return response.status(400).send(err);
    }
  },
};
