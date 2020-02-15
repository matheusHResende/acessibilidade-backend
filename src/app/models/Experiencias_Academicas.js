import Sequelize, { Model } from "sequelize";

class Experiencias_academicas extends Model {
  static init(sequelize) {
    super.init(
      {
        instituicao: Sequelize.STRING,
        curso: Sequelize.STRING,
        entrada: Sequelize.DATE,
        saida: Sequelize.DATE
      },
      {
        sequelize
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Curriculo, {
      foreignKey: "id_curriculo",
      as: "curriculo_acads"
    });
  }
}

export default Experiencias_academicas;
