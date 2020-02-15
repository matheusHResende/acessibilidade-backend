import Usuario from "../models/Usuario";
import Usuario_Pcd from "../models/Usuario_Pcd";
import Endereco from "../models/Endereco";
import Curriculo from "../models/Curriculo";
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import bcrypt from 'bcryptjs';

function generateToken(params = {}){
  const token = jwt.sign(params,authConfig.secret,{
      expiresIn: 86400,
  });
  return token;
}

function cryptPass(senha){
  if (senha) {
    return bcrypt.hash(senha, 10);
  }
};

class UsuarioPcdController {
  async store(req, res) {
    const emailExists = await Usuario.findOne({
      where: {email: req.body.usuario.email},
    });

    const usuarioExists = await Usuario.findOne({
      where: {usuario: req.body.usuario.usuario},
    });

    req.body.usuario.senha = await cryptPass(req.body.usuario.senha);
    

    if (usuarioExists) {
      return res.status(409).json({ error: "Usuario ja existe." });
    }else if(emailExists){
      return res.status(409).json({ error: "Email ja esta em uso." });
    }


    await Usuario_Pcd.create({
      rg: req.body.usuario_pcd.rg,
      telefone_fixo: req.body.usuario_pcd.telefone_fixo,
      telefone_celular: req.body.usuario_pcd.telefone_celular,
      dt_nascimento: req.body.usuario_pcd.dt_nascimento,
      laudo_url: req.body.usuario_pcd.laudo_url,
      id_tipo_deficiencia: req.body.usuario_pcd.id_tipo_deficiencia,
      Usuario:req.body.usuario,
      Curriculo:{
        "objetivo": "",
      },
      Endereco:req.body.endereco,
    }, {
      include: [
        {model: Usuario,as: 'Usuario'},
        {model: Curriculo, as: "Curriculo"},
        {model: Endereco, as: "Endereco"}],
    }).then((usuario_pcd) => {
      usuario_pcd.Usuario.senha=undefined;
      return res.status(201).json({
        usuario:usuario_pcd.Usuario,
        token: generateToken({
          id_usuario: usuario_pcd.Usuario.id,
          tipo_usuario: usuario_pcd.Usuario.id_tipo_usuario
        })
      })
    }).catch((err)=>{
      console.log("ERRO: "+err)
    });
  }
  
  async showByUsuario(req, res){
    const usuario = await Usuario.findOne({where :{usuario : req.params.usuario}})
    if(!usuario){
      return res.status(409).json({
        error: "Usuario não existe." 
     })
    }
    await Usuario_Pcd.findOne({ where: {id_usuario: usuario.id},
      include:[{model: Usuario,as: 'Usuario'},{model:Endereco, as: "Endereco"}]}).then((usuario_pcd) =>{
        usuario_pcd.Usuario.senha=undefined;
        return res.status(201).json({
        usuario_pcd,
    });
    }).catch((err)=>{
      console.log("ERRO: "+err);
      return res.status(500).json({
        error: "Erro no servidor: "+err 
     })
    })
  }

  async showById(req, res){
    await Usuario_Pcd.findOne({ where: {id_usuario: req.params.id},
      include:[{model: Usuario,as: 'Usuario'},{model:Endereco, as: "Endereco"}]}).then((usuario_pcd) =>{
        usuario_pcd.Usuario.senha=undefined;
        return res.status(201).json({
        usuario_pcd,
    });
    }).catch((err)=>{
      console.log("ERRO: "+err);
      return res.status(500).json({
        error: "Erro no servidor: "+err 
     })
    })
  }

  async index(req, res){
    await Usuario_Pcd.findAll({include:[{model:Endereco, as: "Endereco"}]}).then((usuario) =>{
      return res.status(201).json({
        usuario,
    });
    }).catch((err)=>{
      console.log("ERRO: "+err);
      return res.status(500).json({
        error: "Erro no servidor: "+err  
     })
    })
  }

  async update(req, res){
    const emailExists = await Usuario.findOne({
      where: {email: req.body.usuario.email},
    });

    const usuarioExists = await Usuario.findOne({
      where: {usuario: req.body.usuario.usuario},
    });
    
    if (usuarioExists && usuarioExists.id != req.id_usuario) {
      return res.status(409).json({ error: "Usuario ja existe." });
    }else if(emailExists && emailExists.id != req.id_usuario){
      return res.status(409).json({ error: "Email ja esta em uso." });
    }

    const filtro = {
      where: {id_usuario : req.id_usuario},
      include: [
        {model: Usuario,as: 'Usuario'},
        {model: Endereco, as: "Endereco"}
      ]
    }

    Usuario_Pcd.findOne(filtro).then(async (usuario_pcd) =>  {
      if(usuario_pcd){
        const update_usuario = await usuario_pcd.Usuario.update(req.body.usuario);
        const update_endereco = await usuario_pcd.Endereco.update(req.body.endereco);
        const update_usuario_pcd = await usuario_pcd.update(req.body.usuario_pcd)
        update_usuario.senha = undefined;
        return res.status(201).json({
          usuario:update_usuario
        })
      }
      else{
        return res.status(404).json({
           error: "Usuario não encontrado." 
        })
      }
    }).catch((err) => {
      console.log("ERRO: "+err);
      return res.status(500).json({
        error: "Erro no servidor: "+err  
     })
    })
  }

}

export default new UsuarioPcdController();
