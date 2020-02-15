import Tipo_Deficiencia from "../models/Tipo_Deficiencia";

class UsuarioController {
    async listAll(req, res) {

        const Tipos_Deficiencia = await Tipo_Deficiencia.findAll({
            attributes: ['id','tipo'],
        });
    

        if (Tipos_Deficiencia) {
            return res.status(200).json({Tipos_Deficiencia});
        }else{
            return res.status(200).json({ error: "Nenhum tipo de deficiencia cadastrado" });
        }
  }
}
export default new UsuarioController();
