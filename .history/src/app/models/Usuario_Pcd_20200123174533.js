import Sequelize, { Model } from 'sequelize';

class Usuario_Pcd extends Model {
    static init(sequelize) {
        super.init(
            {
                rg: Sequelize.STRING,
                dt_nascimento: Sequelize.STRING,
                laudo_verificado: Sequelize.STRING,
                laudo_url: Sequelize.STRING,
                id_tipo_deficiencia: Sequelize.INTEGER,
                id_usuario: Sequelize.INTEGER,
                id_curriculo: Sequelize.INTEGER,
                id_endereco: Sequelize.INTEGER,
            },
            {
                sequelize,
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
