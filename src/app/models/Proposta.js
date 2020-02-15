import Sequelize, { Model } from 'sequelize';

class Proposta extends Model {
  static init(sequelize) {
    super.init(
      {
        usuario_freelancer_id: Sequelize.INTEGER,
        usuario_empresa_id: Sequelize.INTEGER,
        valor: Sequelize.DOUBLE,
        mensagem: Sequelize.TEXT,
      },
      {
        sequelize,
      }
    );
    return this;
  }
  static associate (models){
    this.belongsTo(models.Usuario_freelancer,{as:"Usuario_freelancer",foreignKey: 'usuario_freelancer_id'});
    this.belongsTo(models.Usuario_empresa,{as:"Usuario_empresa",foreignKey: 'usuario_empresa_id'});
  };
}


export default Proposta;