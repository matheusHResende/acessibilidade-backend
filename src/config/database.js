module.exports = {
  dialect: 'postgres',
  host: HOST_DB,
  username: 'postgres',
  password: 'inprego',
  database: 'acessibilidade',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
