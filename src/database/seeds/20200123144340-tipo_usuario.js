module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('tipo_usuarios', [
    {
      tipo: "usuario_pcd",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      tipo: "usuario_empresa",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      tipo: "usuario_freelancer",
      created_at: new Date(),
      updated_at: new Date()
    },

  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('tipo_usuarios', null, {})
    
};
