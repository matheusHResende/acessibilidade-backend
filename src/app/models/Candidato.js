import Sequelize, { Model } from 'sequelize';

class Candidato extends Model {
  static init(sequelize) {
    super.init(
      {
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario_pcd, {as:"Usuario_pcd", foreignKey: "id_usuario_pcd"});
    this.belongsTo(models.Vagas, {as:"Vagas", foreignKey: "id_vaga", onDelete: 'CASCADE', hooks: true});
};
}

export default Candidato;