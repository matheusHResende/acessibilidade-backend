module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('candidatos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_vaga: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "vagas",
          key: "id"
        }
      },
      id_usuario_pcd: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuario_pcds',
          key: 'id', 
        },
        onDelete:'CASCADE',
        onUpdate: "CASCADE",
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
    return queryInterface.dropTable('candidatos');
  }
};
