import Sequelize, { Model } from 'sequelize';

class Tipo_deficiencia extends Model {
  static init(sequelize) {
    super.init(
      {
        tipo: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}



export default Tipo_deficiencia;
