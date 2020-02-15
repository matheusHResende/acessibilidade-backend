import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario";
import Curriculo from "../models/Curriculo";
import Usuario_Freelancer from "../models/Usuario_Freelancer";
import Endereco from "../models/Endereco";
import authConfig from "../../config/auth";
import bcrypt from "bcryptjs";
import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import Sequelize from 'sequelize';
const routes = new Router();
const Op = Sequelize.Op;

function generateToken(params = {}) {
  const token = jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
  return token;
}

function cryptPass(senha) {
  if (senha) {
    return bcrypt.hash(senha, 10);
  }
}

class UsuarioFreelancerController {
  async store(req, res) {
    const emailExists = await Usuario.findOne({
      where: { email: req.body.usuario.email }
    });

    const usuarioExists = await Usuario.findOne({
      where: { usuario: req.body.usuario.usuario }
    });

    req.body.usuario.senha = await cryptPass(req.body.usuario.senha);

    if (usuarioExists) {
      return res.status(200).json({ error: "Usuario ja existe." });
    } else if (emailExists) {
      return res.status(200).json({ error: "Email ja esta em uso." });
    }

    await Usuario_Freelancer.create(
      {
        cpf: req.body.usuario_freelancer.cpf,
        telefone_fixo: req.body.usuario_freelancer.telefone_fixo,
        telefone_celular: req.body.usuario_freelancer.telefone_celular,
        dt_nascimento: req.body.usuario_freelancer.dt_nascimento,
        especialidade: req.body.usuario_freelancer.especialidade,
        Usuario: req.body.usuario,
        Curriculo: {
          objetivo: ""
        },
        Endereco: req.body.endereco
      },
      {
        include: [
          { model: Usuario, as: "Usuario" },
          { model: Curriculo, as: "Curriculo" },
          { model: Endereco, as: "Endereco" }
        ]
      }
    )
      .then(usuario_freelancer => {
        usuario_freelancer.Usuario.senha = undefined;
        return res.status(201).json({
          usuario: usuario_freelancer.Usuario,
          token: generateToken({
            id_usuario: usuario_freelancer.Usuario.id,
            tipo_usuario: usuario_freelancer.Usuario.id_tipo_usuario
          })
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async index(req, res) {
    await Usuario_Freelancer.findAll({
      include: [{ model: Endereco, as: "Endereco" }]
    })
      .then(usuario => {
        return res.status(201).json({
          usuario
        });
      })
      .catch(err => {
        return res.status(500).json({
          error: "Erro no servidor."
        });
      });
  }

  async showByUsuario(req, res) {
    const usuario = await Usuario.findOne({
      where: { id: req.params.usuario }
    });
    await Usuario_Freelancer.findOne({
      where: { id_usuario: usuario.id },
      include: [{ model: Endereco, as: "Endereco" }]
    })
      .then(usuario_freelancer => {
        return res.status(201).json({
          usuario_freelancer
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async showById(req, res) {
    await Usuario_Freelancer.findOne({
      where: { id: req.params.id },
      include: [{ model: Endereco, as: "Endereco" }]
    })
      .then(usuario_freelancer => {
        return res.status(201).json({
          usuario_freelancer
        });
      })
      .catch(err => {
        return res.status(500).json({
          error: "Erro no servidor."
        });
      });
  }

  async update(req, res) {
    routes.use(authMiddleware);
    const emailExists = await Usuario.findOne({
      where: { email: req.body.usuario.email }
    });

    const usuarioExists = await Usuario.findOne({
      where: { usuario: req.body.usuario.usuario }
    });

    if (usuarioExists) {
      return res.status(200).json({ error: "Usuario ja existe." });
    } else if (emailExists) {
      return res.status(200).json({ error: "Email ja esta em uso." });
    }

    const filtro = {
      where: { id_usuario: req.id_usuario },
      include: [
        { model: Usuario, as: "Usuario" },
        { model: Endereco, as: "Endereco" }
      ]
    };

    Usuario_Freelancer.findOne(filtro)
      .then(async usuario_freelancer => {
        if (usuario_freelancer) {
          const update_usuario = await usuario_freelancer.Usuario.update(
            req.body.usuario
          );
          const update_endereco = await usuario_freelancer.Endereco.update(
            req.body.endereco
          );
          const update_usuario_freelancer = await usuario_freelancer.update(
            req.body.usuario_freelancer
          );
          update_usuario.senha = undefined;
          return res.status(201).json({
            usuario: update_usuario
          });
        } else {
          return res.status(200).json({
            error: "Usuario não encontrado."
          });
        }
      })
      .catch(err => {
        return res.status(500).json({
          error: "Erro no servidor."
        });
      });
  }

  async indexByQuery(req, res){
     
    if(req.tipo_usuario === 3){
      return res.status(403).json({
        error: "Requisição deve ser feito por usuario PCD ou usuario Empresa" 
      })

    }
    let queryCidade,queryEstado;

    if(req.query.cidade){
      queryCidade = req.query.cidade.split('+').join(" ");
    }else{
      queryCidade = ""
     }

     if(req.query.estado){
      queryEstado = req.query.estado.split('+').join(" ");
     }else{
      queryEstado = ""
    }

    let query = req.params.query.split('+');
    let freelancer=[];
    for(let i=0;i<query.length;i++){
      freelancer.push(await Usuario_Freelancer.findAll({
        where :{especialidade: {[Op.iLike]: "%"+query[i]+"%"}},
        include:[{
          model:Usuario, as: "Usuario",
          attributes: ['nome', 'email']
        },
        {model:Endereco, as: "Endereco",
        attributes: ['pais', 'estado', 'cidade'],
        where:{
          cidade:{[Op.iLike]:"%"+queryCidade+"%"},
          estado:{[Op.iLike]:"%"+queryEstado+"%"},
        },
      }],
        attributes: ['telefone_fixo', 'telefone_celular', 'especialidade'],
      }))}

      if(freelancer){
        return res.status(200).json(freelancer);
      }else{
        return res.status(200).json({error:"Nenhum Freelancer encontrado"});
      }
  }

  async indexByNome(req, res) {

    let query = req.params.query.split('+');
    let usuario=[];
    let usuarioList=[];
    for(let i=0;i<query.length;i++){
     usuario.push( usuarioList = await Usuario.findAll({
        where :[{nome: {[Op.iLike]: "%"+query[i]+"%"}}, {id_tipo_usuario: 3}]
    }))}

    let freelancer=[];
    for(let i=0;i<usuarioList.length;i++){
        freelancer.push(await Usuario_Freelancer.findAll({
            where : {id_usuario: usuarioList[i].id},
            include:[{
              model:Usuario, as: "Usuario",
              attributes: ['nome', 'email']
            },
            {model:Endereco, as: "Endereco",
            attributes: ['pais', 'estado', 'cidade']
          }],
            attributes: ['telefone_fixo', 'telefone_celular', 'especialidade'],
      }))}

      if(freelancer){
        return res.status(200).json(freelancer);
      }else{
        return res.status(200).json({error:"Nenhum Freelancer encontrado"});
      }
    }
}

export default new UsuarioFreelancerController();
