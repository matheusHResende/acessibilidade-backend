import Usuario_Pcd from "../models/Usuario_Pcd";
import Usuario_Freelancer from "../models/Usuario_Freelancer";
import Curriculo from "../models/Curriculo";
import Qualificacoes_Adicionais from "../models/Qualificacoes_Adicionais";
import Experiencias_Academicas from "../models/Experiencias_Academicas";
import Experiencias_Empresariais from "../models/Experiencias_Empresariais";
class CurriculoController {
  async update(req, res) {
    const { pcd_id, freelancer_id } = req.params;

    const pcd = await Usuario_Pcd.findByPk(pcd_id, {
      include: { association: "Curriculo" }
    });

    const freelancer = await Usuario_Freelancer.findByPk(freelancer_id, {
      include: { association: "Curriculo" }
    });

    let usuario = "";
    pcd ? (usuario = pcd) : (usuario = freelancer);

    if (!usuario) {
      return res.status(400).json({ error: "Esse usuario não existe" });
    }

    const { id_curriculo, id_usuario } = usuario;

    const {
      curriculo,
      exp_empresarial,
      exp_academica,
      qual_adicional
    } = req.body;

    const [Curriculos] = await Curriculo.findOrCreate({
      where: { id: id_curriculo || id_usuario }
    });
    const [
      Experiencias_academicas
    ] = await Experiencias_Academicas.findOrCreate({
      where: { id_curriculo: id_curriculo || id_usuario }
    });
    const [
      Experiencias_empresariais
    ] = await Experiencias_Empresariais.findOrCreate({
      where: { id_curriculo: id_curriculo || id_usuario }
    });
    const [
      Qualificacoes_adicionais
    ] = await Qualificacoes_Adicionais.findOrCreate({
      where: { id_curriculo: id_curriculo || id_usuario }
    });

    const updatedCurriculo = await Curriculos.update(curriculo);
    const updatedAcad = await Experiencias_academicas.update(exp_academica);
    const updatedEmp = await Experiencias_empresariais.update(exp_empresarial);
    const updatedQual = await Qualificacoes_adicionais.update(qual_adicional);

    return res.json({
      curriculo: {
        id: updatedCurriculo.id,
        objetivo: updatedCurriculo.objetivo
      },
      exp_empresarial: {
        titulo: updatedEmp.titulo,
        cargo: updatedEmp.cargo,
        descricao: updatedEmp.descricao
      },
      exp_academica: {
        instituicao: updatedAcad.instituicao,
        curso: updatedAcad.curso,
        entrada: updatedAcad.entrada,
        saida: updatedAcad.saida
      },
      qual_adicional: {
        titulo: updatedQual.titulo,
        descricao: updatedQual.descricao
      }
    });
  }

  async index(req, res) {
    const curriculo = await Curriculo.findByPk(req.params.id, {
      attributes: ["id", "objetivo"],
      include: [
        {
          association: "curriculo_emps",
          attributes: ["titulo", "cargo", "descricao"]
        },
        {
          association: "curriculo_acads",
          attributes: ["instituicao", "curso", "entrada", "saida"]
        },
        { association: "curriculo_quals", attributes: ["titulo", "descricao"] }
      ]
    });

    if (!curriculo) {
      return res.status(200).json({ error: "Esse curriculo não existe" });
    }

    return res.json(curriculo);
  }

  async delete(req, res) {
    const curriculo = await Curriculo.findOne({
      where: { id: req.params.id },
      attributes: ["id", "objetivo"],
      include: [
        { model: Qualificacoes_Adicionais, as: "curriculo_quals" },
        { model: Experiencias_Academicas, as: "curriculo_acads" },
        { model: Experiencias_Empresariais, as: "curriculo_emps" }
      ]
    });

    const { curriculo_acads, curriculo_emps, curriculo_quals } = curriculo;
    const [Experiencias_academicas] = curriculo_acads;
    const [Experiencias_empresariais] = curriculo_emps;
    const [Qualificacoes_adicionais] = curriculo_quals;

    if (!curriculo) {
      return res.status(404).json({ error: "Curriculo não existe" });
    }

    console.log(curriculo);

    return res.json("Ok");

    // await Experiencias_academicas.destroy()
    // await Experiencias_empresariais.destroy()
    // await Qualificacoes_adicionais.destroy()

    //   .destroy()
    //   .then(() => {
    //     return res.status(201).json({
    //       message: "Curriculo deletado com sucesso!"
    //     });
    //   })
    //   .catch(err => {
    //     console.log("ERRO: " + err);
    //   });
  }
}

export default new CurriculoController();
