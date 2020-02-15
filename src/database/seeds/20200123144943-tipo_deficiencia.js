module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('tipo_deficiencia', [
    {
      tipo: "Deficiência Visual",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      tipo: "Deficiência Auditiva",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      tipo: "Deficiência Mental",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      tipo: "Deficiência Física",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      tipo: "Deficiência Múltipla",
      created_at: new Date(),
      updated_at: new Date()
    },

  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('tipo_deficiencia', null, {})
    
};
