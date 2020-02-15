import Sequelize, { Model } from "sequelize";

class Qualificacoes_adicionais extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: Sequelize.STRING,
        descricao: Sequelize.STRING
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
      as: "curriculo_quals"
    });
  }
}

export default Qualificacoes_adicionais;
