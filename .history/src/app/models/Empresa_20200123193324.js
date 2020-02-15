import Sequelize, { Model } from "sequelize";

class Usuario_Empresa extends Model {
  static init(sequelize) {
    super.init(
      {
        cnpj: Sequelize.STRING,
        razao_socil: Sequelize.STRING,
        id_endereco: Sequelize.INTEGER,
        id_usuario: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );
    return this;
  }
}

Usuario_Empresa.associate = models => {
  Usuario_Empresa.hasOne(models.Endereco);
  Usuario_Empresa.hasOne(models.Usuario);
};

export default Usuario_Empresa;
