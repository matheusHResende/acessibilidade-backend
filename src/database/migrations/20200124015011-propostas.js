module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('propostas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      usuario_freelancer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuario_freelancers",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      usuario_empresa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuario_empresas",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      valor: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      mensagem: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
  });
},

  down: (queryInterface) => {
    return queryInterface.dropTable('propostas');
  }
};
