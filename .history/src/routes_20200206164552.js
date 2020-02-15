import { Router } from "express";

import UsuarioPcdController from "./app/controllers/UsuarioPcdController";
import UsuarioController from "./app/controllers/UsuarioController";
import SessionController from "./app/controllers/SessionController";
import UsuarioFreelancerController from "./app/controllers/UsuarioFreelancerController";
import UsuarioEmpresaController from "./app/controllers/UsuarioEmpresaController";
import TipoDeficienciaController from "./app/controllers/TipoDeficienciaController";
import VagasController from "./app/controllers/VagasController";
import CandidatoController from "./app/controllers/CandidatoController";
import CurriculoController from "./app/controllers/CurriculoController";

import validateUsuarioStore from "./app/validators/UsuarioStore";
import validateEnderecoStore from "./app/validators/EnderecoStore";
import validatePcdStore from "./app/validators/PcdStore";
import validateEmpresaStore from "./app/validators/EmpresaStore";
import validateFreelancerStore from "./app/validators/FreelancerStore";
import validateVagasStore from "./app/validators/VagasStore";

import validateUsuarioUpdate from "./app/validators/UsuarioUpdate";
import validateEnderecoUpdate from "./app/validators/EnderecoUpdate";
import validatePcdUpdate from "./app/validators/PcdUpdate";
import validateEmpresaUpdate from "./app/validators/EmpresaUpdate";
import validateFreelancerUpdate from "./app/validators/FreelancerUpdate";
import validateVagasUpdate from "./app/validators/VagasUpdate";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();
routes.get("/", (req, res) => {
  return res.status(200).json("tudo certo");
});

routes.post("/sessions", SessionController.store);

routes.post(
  "/pcd",
  validatePcdStore,
  validateUsuarioStore,
  validateEnderecoStore,
  UsuarioPcdController.store
);

routes.post(
  "/freelancer",
  validateFreelancerStore,
  validateUsuarioStore,
  validateEnderecoStore,
  UsuarioFreelancerController.store
);
routes.post(
  "/empresas",
  validateEmpresaStore,
  validateUsuarioStore,
  validateEnderecoStore,
  UsuarioEmpresaController.store
);
routes.post(
  "/vagas",
  validateVagasStore,
  validateEnderecoStore,
  VagasController.store
);

routes.get("/usuario/usuarioExiste/:usuario", UsuarioController.UsuarioExists);
routes.get("/usuario/emailExiste/:email", UsuarioController.EmailExists);
routes.get("/tipoDeficiencia", TipoDeficienciaController.listAll);
routes.get("/vagas", VagasController.index);
routes.get("/vagas/:id", VagasController.showById);
routes.get("/vagas/empresa/:id", VagasController.showByEmpresas);

routes.use(authMiddleware);

routes.patch("/usuario", UsuarioController.updateSenha);

routes.post("/candidato", CandidatoController.store);

routes.delete("/candidato", CandidatoController.delete);
routes.delete("/vagas/:id", VagasController.delete);
routes.delete("/curriculos/:id", CurriculoController.delete);

routes.put(
  "/pcd",
  validatePcdUpdate,
  validateEnderecoUpdate,
  validateUsuarioUpdate,
  UsuarioPcdController.update
);

routes.put(
  "/empresas",
  validateEmpresaUpdate,
  validateEnderecoUpdate,
  validateUsuarioUpdate,
  UsuarioEmpresaController.update
);

routes.put(
  "/vagas/:id",
  validateVagasUpdate,
  validateEnderecoUpdate,
  VagasController.update
);

routes.put(
  "/freelancer",
  validateFreelancerUpdate,
  validateEnderecoUpdate,
  validateUsuarioUpdate,
  UsuarioFreelancerController.update
);

routes.put("/pcd/:pcd_id/curriculos", CurriculoController.update);
routes.put("/freelancer/:freelancer_id/curriculos", CurriculoController.update);

routes.get("/empresas", UsuarioEmpresaController.show);
routes.get("/vagas/pesquisa/:query?", VagasController.indexByQuery);

routes.get("/empresas", UsuarioEmpresaController.index);

routes.get("/pcd/:freelancer_id/curriculos", CurriculoController.index);
routes.get("/curriculos/:id", CurriculoController.index);

routes.get("/pcd/usuario/:usuario", UsuarioPcdController.showByUsuario);
routes.get("/pcd/id/:id", UsuarioPcdController.showById);
routes.get("/pcd", UsuarioPcdController.index);

routes.get(
  "/freelancer/usuario/:usuario",
  UsuarioFreelancerController.showByUsuario
);
routes.get("/freelancer/:id", UsuarioFreelancerController.showById);
routes.get("/freelancer", UsuarioFreelancerController.index);

routes.get("/candidato", CandidatoController.showByUsuario);
routes.get("/candidato/:vaga", CandidatoController.showByVaga);

export default routes;
