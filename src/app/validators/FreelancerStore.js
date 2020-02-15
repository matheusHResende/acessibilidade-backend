import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaUsuarioFreelancer = Yup.object().shape({
      cpf: Yup.string().required(),
      telefone_fixo: Yup.string(),
      telefone_celular: Yup.string(),
      dt_nascimento: Yup.string().required(),
      especialidade: Yup.string().required()
    });

    await schemaUsuarioFreelancer.validate(req.body.usuario_freelancer, {
      abortEarly: false
    });

    return next();
  } catch (err) {
    return res.status(423).json({
      error: "Campo usuario freelancer não esta de acordo",
      messages: err.inner
    });
  }
};
