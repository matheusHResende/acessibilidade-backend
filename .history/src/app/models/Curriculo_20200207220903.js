import Sequelize, { Model } from "sequelize";

class Curriculo extends Model {
  static init(sequelize) {
    super.init(
      {
        objetivo: Sequelize.TEXT
      },
      {
        sequelize
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Experiencias_academicas, {
      foreignKey: "id_curriculo",
      as: "curriculo_acads"
    });
    this.hasMany(models.Experiencias_empresariais, {
      foreignKey: "id_curriculo",
      as: "curriculo_emps"
    });
    this.hasMany(models.Qualificacoes_adicionais, {
      foreignKey: "id_curriculo",
      as: "curriculo_quals"
    });
    this.hasOne(models.Usuario_pcd, {
      foreignKey: "id_curriculo",
      as: "pcd_curriculo"
    });
  }
}

export default Curriculo;
