module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("qualificacoes_adicionais", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: true
      },
      id_curriculo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "curriculos",
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
    return queryInterface.dropTable("qualificacoes_adicionais");
  }
};
