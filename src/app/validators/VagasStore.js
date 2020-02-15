import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaVagas = Yup.object().shape({
      titulo: Yup.string().required(),
      descricao: Yup.string().required(),
      quantidade_vagas: Yup.number().required(),
      id_usuario_empresa: Yup.number().required()
    });

    await schemaVagas.validate(req.body.vagas, {
      abortEarly: false
    });

    return next();
  } catch (err) {
    return res.status(423).json({
      error: "Campo vagas não esta de acordo",
      messages: err.inner
    });
  }
};
