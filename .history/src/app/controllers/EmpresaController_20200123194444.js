import * as Yup from "yup";

class EmpresaController {
  async store(req, res) {
    const schemaUsuario_Empresa = Yup.object().shape({
      cnpj: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      usuario: Yup.string().required(),
      senha: Yup.string()
        .required()
        .min(6),
      id_tipo_usuario: Yup.number().required(),
      id_endereco: Yup.number().required()
    });

    if (!(await schemaUsuario_Empresa.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const usuarioExists = await Usuario.findOne({
      where: { email: req.body.email }
    });

    if (usuarioExists) {
      return res.status(400).json({ error: "User already exists." });
    }

    const { id, name, email } = await Usuario.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
  }
}

export default new EmpresaController();
