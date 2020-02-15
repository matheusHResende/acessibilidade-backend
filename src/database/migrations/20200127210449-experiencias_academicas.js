module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("experiencias_academicas", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      instituicao: {
        type: Sequelize.STRING,
        allowNull: true
      },
      curso: {
        type: Sequelize.STRING,
        allowNull: true
      },
      entrada: {
        type: Sequelize.DATE,
        allowNull: true
      },
      saida: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable("experiencias_academicas");
  }
};
