import Sequelize, { Model } from "sequelize";

class Usuario_Pcd extends Model {
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

Usuario_Pcd.associate = models => {
  Usuario_Pcd.hasOne(models.Tipo_Deficiencia);
  Usuario_Pcd.hasOne(models.Usuario);
  Usuario_Pcd.hasOne(models.Curriculo);
  Usuario_Pcd.hasOne(models.Endereco);
};

export default Usuario_Pcd;
