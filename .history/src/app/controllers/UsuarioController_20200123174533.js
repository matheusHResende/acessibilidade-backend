import * as Yup from 'yup';
import Usuario from '../models/Usuario';

class UsuarioController {
  
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
      id_tipo_deficiencia: Yup.number().required(),
      id_endereco: Yupo.number().required(),
    });

    if (!(await schemaTipo_Usuario.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const usuarioExists = await Usuario.findOne({
      where: { email: req.body.email },
    });

    if (usuarioExists) {
      return res.status(400).json({ error: 'Usuario already exists.' });
    }
    const { id, name, email, provider } = await Usuario.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  /*async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email, oldPassword } = req.body;

    const usuario = await Usuario.findByPk(req.usuarioId);

    if (email !== usuario.email) {
      const usuarioExists = await Usuario.findOne({ where: { email } });

      if (usuarioExists) {
        return res.status(400).json({ error: 'Usuario already exists.' });
      }
    }

    if (oldPassword && !(await usuario.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await usuario.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }*/
}

export default new UsuarioController();
