import Sequelize, { Model } from 'sequelize';

class Vagas extends Model {
  static init(sequelize) {
    super.init(
      {
        ativo: Sequelize.BOOLEAN,
        titulo: Sequelize.STRING,
        descricao: Sequelize.TEXT,
        quantidade_vagas: Sequelize.INTEGER,
        id_usuario_empresa: Sequelize.INTEGER,
        id_endereco: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario_empresa, {as:"Usuario_Empresa", foreignKey: "id_usuario_empresa"});
    this.belongsTo(models.Endereco, {as:"Endereco", foreignKey: "id_endereco", onDelete: 'CASCADE', hooks: true});
};
}

export default Vagas;