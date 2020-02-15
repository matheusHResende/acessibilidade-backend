import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaUsuarioEmpresa = Yup.object().shape({
      cnpj: Yup.string().required(),
      razao_social: Yup.string().required(),
      telefone_fixo: Yup.string(),
      telefone_celular: Yup.string()
    });

    await schemaUsuarioEmpresa.validate(req.body.usuario_empresa, {
      abortEarly: false
    });

    return next();
  } catch (err) {
    return res.status(423).json({
      error: "Campo usuario empresa não esta de acordo",
      messages: err.inner
    });
  }
};
