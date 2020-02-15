module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("usuario_empresas", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      cnpj: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      razao_social: {
        type: Sequelize.STRING,
        allowNull: false
      },
      telefone_fixo:{
        type: Sequelize.STRING,
        allowNull:true,
      },
      telefone_celular:{
        type: Sequelize.STRING,
        allowNull:true,
      },
      id_endereco: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "enderecos",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable("usuario_empresas");
  }
};
