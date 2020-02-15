import Sequelize, { Model } from "sequelize";

class Usuario_freelancer extends Model {
  static init(sequelize) {
    super.init(
      {
        cpf: Sequelize.STRING,
        telefone_fixo:Sequelize.STRING,
        telefone_celular:Sequelize.STRING,
        dt_nascimento: Sequelize.DATE,
        especialidade: Sequelize.STRING,
      },
      {
        sequelize
      }
    );
    return this;
  }
  static associate (models){
    this.belongsTo(models.Usuario, {as:"Usuario",foreignKey: 'id_usuario'});
    this.belongsTo(models.Curriculo, {as:"Curriculo",foreignKey: 'id_curriculo'});
    this.belongsTo(models.Endereco, {as:"Endereco", foreignKey: "id_endereco"});
  };
}

export default Usuario_freelancer;