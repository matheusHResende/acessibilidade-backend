module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("usuario_freelancers", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      telefone_fixo:{
        type: Sequelize.STRING,
        allowNull:true,
      },
      telefone_celular:{
        type: Sequelize.STRING,
        allowNull:true,
      },
      dt_nascimento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      especialidade: {
        type: Sequelize.STRING,
        allowNull: false
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
    return queryInterface.dropTable("usuario_freelancers");
  }
};
