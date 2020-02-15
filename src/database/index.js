import Sequelize from "sequelize";

import databaseConfig from '../config/database';
import Tipo_Usuario from "../app/models/Tipo_Usuario";
import Usuario from "../app/models/Usuario";
import Tipo_Deficiencia from "../app/models/Tipo_Deficiencia";
import Curriculo from "../app/models/Curriculo";
import Endereco from "../app/models/Endereco";
import Usuario_Pcd from "../app/models/Usuario_Pcd";
import Usuario_Empresa from "../app/models/Usuario_Empresa";
import Usuario_Freelancer from "../app/models/Usuario_Freelancer";
import Proposta from "../app/models/Proposta";
import Vagas from "../app/models/Vagas";
import Experiencias_Empresariais from "../app/models/Experiencias_Empresariais";
import Experiencias_Academicas from "../app/models/Experiencias_Academicas";
import Qualificacoes_Adicionais from "../app/models/Qualificacoes_Adicionais";
import Candidato from "../app/models/Candidato";
import Token_Senha from "../app/models/Token_Senha";
require('dotenv').config()

const models = [
  Tipo_Usuario,
  Usuario,
  Tipo_Deficiencia,
  Curriculo,
  Endereco,
  Usuario_Pcd,
  Usuario_Empresa,
  Usuario_Freelancer,
  Vagas,
  Proposta,
  Experiencias_Empresariais,
  Experiencias_Academicas,
  Qualificacoes_Adicionais,
  Candidato,
  Token_Senha
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    
    this.connection = new Sequelize(process.env.DATABASE_URL,{
      dialect: 'postgres',
      define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
      },
    });
    

    models
    .map(model => model.init(this.connection))
    .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
