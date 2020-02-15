import * as Yup from "yup";
import Usuario_Pcd from "../models/Usuario_Pcd";
import Candidato from "../models/Candidato";
import Vagas from "../models/Vagas";

class CandidatoController {
  async store(req, res) {
    const schemaVaga = Yup.object().shape({
      id_vaga: Yup.number().required(),
      id_usuario_pcd: Yup.number().required()
    });

    if (!(await schemaVaga.isValid(req.body))) {
      return res.status(200).json({ error: "Campo candidato não esta de acordo" });
    }

    const candidatou = await Candidato.findOne({
      where: {
        id_vaga: req.body.id_vaga,}
    });
  

    if (candidatou) {
      return res.status(200).json({ error: "Usuario ja se candidatou a essa vaga." });
    }

    await Candidato.create( req.body, {
      include: [
        {model: Vagas, as: "Vagas"},
        {model: Usuario_Pcd,as: 'Usuario_pcd'}
      ]
    }).then((candidato) => {
      return res.status(201).json(
        candidato
      )
    }).catch((err)=>{
        return res.status(500).json({
            error: "Erro no servidor."+err
        })
    });
  }
  

  async showByUsuario(req, res){
    const usuario_pcd = await Usuario_Pcd.findOne({where :{id_usuario :req.id_usuario}})
    await Candidato.findAll({ where: {id_usuario_pcd: usuario_pcd.id},
      include:[{model: Vagas,as: 'Vagas'}]}).then((vagas) =>{
        return res.status(201).json({
        vagas,
    });
    }).catch((err)=>{
        return res.status(500).json({
            error: "Erro no servidor." 
        })
    })
  }

  async showByVaga(req, res){
    await Candidato.findAll({ where: {id_vaga: req.params.vaga},
      include:[{model: Usuario_Pcd,as: 'Usuario_pcd'}]}).then((candidato) =>{
        return res.status(201).json({
        candidato,
    });
    }).catch((err)=>{
        return res.status(500).json({
            error: "Erro no servidor."+err 
        })
    })
  }

  async delete(req, res) {
    const schemaVaga = Yup.object().shape({
        id_vaga: Yup.number().required(),
        id_usuario_pcd: Yup.number().required()
      });
  
      if (!(await schemaVaga.isValid(req.body))) {
        return res.status(200).json({ error: "Campo candidato não esta de acordo" });
      }

    await Candidato.destroy({ where: {
        id_vaga: req.body.id_vaga,
        id_usuario_pcd:req.body.id_usuario_pcd
    }}).then(() =>{
      return res.status(201).json({
        message: "Candidatura deletada com sucesso!"
    });
    }).catch((err)=>{
        return res.status(500).json({
            error: "Erro no servidor." +err
        })
    })
  }



}

export default new CandidatoController();
