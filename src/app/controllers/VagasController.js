import * as Yup from "yup";
import Vagas from "../models/Vagas";
import Usuario_Empresa from "../models/Usuario_Empresa";
import Endereco from "../models/Endereco";
import Usuario_Pcd from "../models/Usuario_Pcd";
import authMiddleware from '../middlewares/auth';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;


class VagasController {
  async store(req, res) {
    const UsuarioEmpresaExists = await Usuario_Empresa.findOne({
      where: { id: req.body.vagas.id_usuario_empresa }
    });

    if (!UsuarioEmpresaExists) {
      return res
        .status(400)
        .json({ error: "Id do Usuario Empresa informado nao existe" });
    }

    await Vagas.create(
      {
        titulo: req.body.vagas.titulo,
        descricao: req.body.vagas.descricao,
        quantidade_vagas: req.body.vagas.quantidade_vagas,
        id_usuario_empresa: req.body.vagas.id_usuario_empresa,
        Endereco: req.body.endereco
      },
      {
        include: [
          { model: Usuario_Empresa, as: "Usuario_Empresa" },
          { model: Endereco, as: "Endereco" }
        ]
      }
    )
      .then(vagas => {
        return res.status(201).json({
          vagas: {
            id: vagas.id,
            id_usuario_empresa: vagas.id_usuario_empresa,
            id_endereco: vagas.id_endereco
          }
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async index(req, res) {
    await Vagas.findAll({
      include: [
        {
          model: Usuario_Empresa,
          as: "Usuario_Empresa",
          attributes: ["id", "razao_social"]
        },
        {
          model: Endereco,
          as: "Endereco",
          attributes: ["id", "pais", "estado", "cidade"]
        }
      ],
      attributes: ["id", "ativo", "titulo", "descricao", "quantidade_vagas"],
      order: [["id", "ASC"]]
    })
      .then(vagas => {
        return res.status(201).json({
          vagas
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async indexByQuery(req, res){
     
    if(req.tipo_usuario != 1){
      return res.status(403).json({
        error: "Requisição deve ser feito por usuario PCD" 
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
    let vagas=[];
    for(let i=0;i<query.length;i++){
      vagas.push(await Vagas.findAll({
        where :{titulo: {[Op.iLike]: "%"+query[i]+"%"}},
        include:[{
          model:Usuario_Empresa, as: "Usuario_Empresa",
          attributes: ['id', 'razao_social']
        },
        {model:Endereco, as: "Endereco",
        attributes: ['id', 'pais', 'estado', 'cidade'],
        where:{
          cidade:{[Op.iLike]:"%"+queryCidade+"%"},
          estado:{[Op.iLike]:"%"+queryEstado+"%"},
        },
      }],
        attributes: ['id', 'ativo', 'titulo', 'descricao', 'quantidade_vagas'],
      }))}

      if(vagas){
        return res.status(200).json(vagas);
      }else{
        return res.status(200).json({error:"Nenhuma vaga encontrada"});
      }
  }


  async showById(req, res){
    await Vagas.findOne({ where: {id: req.params.id},
      include:[{model:Usuario_Empresa, as: "Usuario_Empresa", 
        attributes: ['id', 'cnpj', 'razao_social', 'telefone_fixo', 'telefone_celular']},
      {model:Endereco, as: "Endereco", 
        attributes: ['id', 'pais', 'estado', 'cidade', 'bairro', 'cep', 'logradouro', 'numero', 'complemento']}],
      attributes: ['id', 'ativo', 'titulo', 'descricao', 'quantidade_vagas'],
    })
    .then((vagas) =>{
      return res.status(201).json({
        vagas,
    });
    }).catch((err)=>{
      console.log("ERRO: "+err)
    })
      .then(vagas => {
        return res.status(201).json({
          vagas
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async showByEmpresas(req, res) {
    routes.use(authMiddleware);

    await Vagas.findAll({
      where: { id_usuario_empresa: req.params.id },
      include: {
        model: Endereco,
        as: "Endereco",
        attributes: ["id", "pais", "estado", "cidade"]
      },
      attributes: ["id", "ativo", "titulo", "descricao", "quantidade_vagas"],
      order: [["id", "ASC"]]
    })
      .then(vagas => {
        return res.status(201).json({
          vagas
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async delete(req, res) {
    const vagas = await Vagas.findOne({
      where: { id: req.params.id },
      include: { model: Endereco, as: "Endereco" }
    });
    await vagas.destroy().then(() => {
        return res.status(201).json({
          message: "Vaga deletada com sucesso!"
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async update(req, res) {
    const vagas = await Vagas.findOne({ where: { id: req.params.id } });

    if (!vagas) {
      return res
        .status(200)
        .json({ error: "Id do Usuario Empresa informado nao existe" });
    }

    await Vagas.update(
      {
        ativo: req.body.vagas.ativo,
        titulo: req.body.vagas.titulo,
        descricao: req.body.vagas.descricao,
        quantidade_vagas: req.body.vagas.quantidade_vagas
      },
      {
        where: { id: req.params.id },
        returning: true,
        plain: true
      }
    );
    await Endereco.update(
      {
        pais: req.body.endereco.pais,
        estado: req.body.endereco.estado
      },
      {
        where: { id: vagas.id_endereco },
        returning: true,
        plain: true
      }
    );
    const vaga = await Vagas.findOne({
      where: { id: req.params.id },
      include: {
        model: Endereco,
        as: "Endereco",
        attributes: [
          "id",
          "pais",
          "estado",
          "cidade",
          "bairro",
          "cep",
          "logradouro",
          "numero",
          "complemento"
        ]
      },
      attributes: ["id", "ativo", "titulo", "descricao", "quantidade_vagas"]
    })
      .then(vaga => {
        return res.status(201).json({
          vaga
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }
}

export default new VagasController();
