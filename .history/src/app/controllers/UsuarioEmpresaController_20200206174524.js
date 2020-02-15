import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario";
import Usuario_Empresa from "../models/Usuario_Empresa";
import Endereco from "../models/Endereco";
import authConfig from "../../config/auth";
import bcrypt from "bcryptjs";

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

class UsuarioEmpresaController {
  async store(req, res) {
    const emailExists = await Usuario.findOne({
      where: { email: req.body.usuario.email }
    });

    const usuarioExists = await Usuario.findOne({
      where: { usuario: req.body.usuario.usuario }
    });

    const empresaExists = await Usuario_Empresa.findOne({
      where: { cnpj: req.body.usuario_empresa.cnpj }
    });

    req.body.usuario.senha = await cryptPass(req.body.usuario.senha);

    if (usuarioExists) {
      return res.status(409).json({ error: "Usuario ja existe." });
    } else if (emailExists) {
      return res.status(409).json({ error: "Email ja esta em uso." });
    } else if (empresaExists) {
      return res.status(409).json({ error: "cnpj ja esta em uso." });
    }

    await Usuario_Empresa.create(
      {
        cnpj: req.body.usuario_empresa.cnpj,
        razao_social: req.body.usuario_empresa.razao_social,
        telefone_fixo: req.body.usuario_empresa.telefone_fixo,
        telefone_celular: req.body.usuario_empresa.telefone_celular,
        Usuario: req.body.usuario,
        Endereco: req.body.endereco
      },
      {
        include: [
          { model: Usuario, as: "Usuario" },
          { model: Endereco, as: "Endereco" }
        ]
      }
    )
      .then(usuario_empresa => {
        usuario_empresa.Usuario.senha = undefined;
        return res.status(201).json({
          usuario: usuario_empresa.Usuario,
          token: jwt.sign(
            {
              id_usuario: usuario_empresa.Usuario.id,
              tipo_usuario: usuario_empresa.Usuario.id_tipo_usuario
            },
            authConfig.secret,
            {
              expiresIn: authConfig.expiresIn
            }
          )
        });
      })
      .catch(err => {
        console.log("ERRO: " + err);
      });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const empresas = await Usuario_Empresa.findAll({
      attributes: ["cnpj", "razao_social", "telefone_fixo", "telefone_celular"],
      include: [
        {
          model: Endereco,
          as: "Endereco"
        },
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["nome", "email"]
        }
      ],
      limit: 20,
      offset: (page - 1) * 20
    });

    return res.status(201).json({ empresas });
  }

  async update(req, res) {
    const empresa = await Usuario_Empresa.findOne({
      where: { id_usuario: req.id_usuario },
      include: [
        { model: Usuario, as: "Usuario" },
        { model: Endereco, as: "Endereco" }
      ]
    });
    const { usuario, usuario_empresa, endereco } = req.body;
    const empresas = await empresa.update(
      usuario_empresa,
      empresa.Usuario.update(usuario),
      empresa.Endereco.update(endereco)
    );
    return res.status(201).json({ empresas });
  }

  async show(req, res) {
    const { empresa } = req.query;

    const showEmpresa = await Usuario.findOne({
      where: { nome: empresa },
      attributes: ["nome", "email"],
      include: [
        {
          model: Usuario_Empresa,
          as: "empresas",
          attributes: ["telefone_fixo", "telefone_celular"],
          include: [
            {
              model: Endereco,
              as: "Endereco",
              attributes: [
                "pais",
                "estado",
                "cidade",
                "bairro",
                "cep",
                "logradouro",
                "numero",
                "complemento"
              ]
            }
          ]
        }
      ]
    });

    if (!showEmpresa) {
      return res.status(404).json({
        error:
          "Empresa não encontrada! Nome incorreto ou não existe em nossa base de dados"
      });
    }

    return res.json(showEmpresa);
  }
}

export default new UsuarioEmpresaController();
