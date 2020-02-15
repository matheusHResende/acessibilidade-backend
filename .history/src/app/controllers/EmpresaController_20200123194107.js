import * as Yup from "yup";

class EmpresaController {
  async store(req, res) {
    const schemaTipo_Usuario = Yup.object().shape({
      name: Yup.string().required(),
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

    if (!(await schemaTipo_Usuario.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const usuarioExists = await Usuario.findOne({
      where: { email: req.body.email }
    });

    if (usuarioExists) {
      return res.status(400).json({ error: "User already exists." });
    }
  }
}

export default new EmpresaController();
