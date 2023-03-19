import express from 'express'
import { pool } from './db.js'
import {PORT} from './config.js'
import cors from 'cors'
const app = express()
app.use(express.json());
app.use(cors());

//-----------------------EMPLEADO (LISTO)
app.get('/getEmpleado/:usuario/:contrasena', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  const { usuario, contrasena } = req.params;

  const sql = "SELECT * FROM Empleados WHERE usuario = ? AND contrasena = ?";
  try {
    let [result] = await pool.query(sql, [usuario, contrasena]);

    if (result.length === 0) {
        res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        return;
    }

    const userSchema = {
        "usuario": result[0].usuario,
        "contrasena": result[0].contrasena,
    };

    res.json(userSchema);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en la consulta: " + err.message });
  }
});


//-----------------------LOGIN
app.get('/getLogin/:id/:password', async (req, res) => {
  const { id, password } = req.params;
  const sql = "SELECT * FROM Alumnos WHERE NControl = ? AND CONTRASENA = ?";
  const [result] = await pool.query(sql, [id, password]);
  const users = result.map(user => ({
    NControl: user.NControl,
    ID_Carrera: user.Id_Carrera,
    Nombre: user.Nombre,
    AP_PATERNO: user.Ap_Paterno,
    AP_MATERNO: user.Ap_Materno,
    SEMESTRE: user.Semestre,
    PERIODO: user.Periodo,
    CREDITOS_DISPONIBLES: user.Creditos_Disponibles,
    ESPECIALIDAD: user.Especialidad,
    CONTRASENA: user.Contrasena
  }));
  res.json(users);
})


//-----------------------------------------------------------------------OPERACIONES CON HORARIOS
//GET ALL HORARIOS (LISTO)
app.get('/getAllHorarios', async (req, res) => {
  const sql = "SELECT * FROM Horario";
  const [result] = await pool.query(sql);
  const users = result.map(user => ({
    Id_Horario: user.Id_Horario,
    Hora_Inicio_Lunes: user.Hora_Inicio_Lunes,
    Hora_Final_Lunes: user.Hora_Final_Lunes
  }));
  res.json(users);
});
//----Eliminar horario(LISTO)
app.delete('/deleteHorario/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const sql = "DELETE FROM Horario WHERE Id_Horario = ?";
    const [result] = await pool.execute(sql, [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({
        message: `No se encontró el horario con el ID ${id}`
      });
    } else {
      res.status(200).json({
        message: `Horario con ID ${id} ha sido eliminado exitosamente`
      });
    }
  } catch (error) {
    console.error(`Error while deleting horario record: ${error}`);
    res.status(500).json({
      message: "Error al eliminar el horario"
    });
  }
});
//Obtener un solo horario(LISTO)
app.get('/getHorario/:id', async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM Horario WHERE Id_Horario = ?";
  try {
    const [result] = await pool.query(sql, [id]);
    if (result.length === 0) {
      res.status(404).json({
        message: `No se encontró el horario con el ID ${id}`
      });
    } else {
      const horario = {
        "Id_Horario": result[0].Id_Horario,
        "Hora_Inicio_Lunes": result[0].Hora_Inicio_Lunes,
        "Hora_Final_Lunes": result[0].Hora_Final_Lunes,
        "Hora_Inicio_Martes": result[0].Hora_Inicio_Martes,
        "Hora_Final_Martes": result[0].Hora_Final_Martes,
        "Hora_Inicio_Miercoles": result[0].Hora_Inicio_Miercoles,
        "Hora_Final_Miercoles": result[0].Hora_Final_Miercoles,
        "Hora_Inicio_Jueves": result[0].Hora_Inicio_Jueves,
        "Hora_Final_Jueves": result[0].Hora_Final_Jueves,
        "Hora_Inicio_Viernes": result[0].Hora_Inicio_Viernes,
        "Hora_Final_Viernes": result[0].Hora_Final_Viernes
      };
      let data= [];
      data.push(horario)
      res.json(data);
    }
  } catch (error) {
    console.error(`Error while getting horario record: ${error}`);
    res.status(500).json({
      message: "Error al obtener el horario"
    });
  }
});
//actualizar horario(LISTO)
app.put("/updateHorario/:ID_HORARIO", async (req, res) => {
  const { HORA_INICIO_LUNES, HORA_FINAL_LUNES } = req.body;
  const { ID_HORARIO } = req.params;
  const sql = "UPDATE Horario SET HORA_INICIO_LUNES=?, HORA_FINAL_LUNES=? WHERE ID_HORARIO=?";
  
  try {
    const [result] = await pool.execute(sql, [HORA_INICIO_LUNES, HORA_FINAL_LUNES, ID_HORARIO]);

    if (result.affectedRows === 0) {
      res.status(404).json({
        message: `No se encontró el horario con el ID ${ID_HORARIO}`
      });
    } else {
      res.status(200).json({
        HORA_INICIO_LUNES: HORA_INICIO_LUNES,
        HORA_FINAL_LUNES: HORA_FINAL_LUNES
      });
    }
  } catch (error) {
    console.error(`Error while updating horario record: ${error}`);
    res.status(500).json({
      message: "Error al actualizar el horario"
    });
  }
});
//Agregar un horario(LISTO)
app.post('/addHorario', async (req, res) => {
  const { ID_HORARIO, HORA_INICIO_LUNES, HORA_FINAL_LUNES } = req.body;

  try {
    const sql = "INSERT INTO Horario (ID_HORARIO, HORA_INICIO_LUNES, HORA_FINAL_LUNES) VALUES (?, ?, ?)";
    await pool.query(sql, [ID_HORARIO, HORA_INICIO_LUNES, HORA_FINAL_LUNES]);

    res.status(200).json({
      "ID_HORARIO": ID_HORARIO,
      "HORA_INICIO_LUNES": HORA_INICIO_LUNES,
      "HORA_FINAL_LUNES": HORA_FINAL_LUNES,
    });
  } catch (error) {
    console.error(`Error while adding horario record: ${error}`);
    res.status(500).json({
      message: "Error al agregar el horario"
    });
  }
});

//----------------------------------------------------OPERACIONES GRUPOS/CARGA(PENDIENTE)
app.get('/getGrupos/:MATERIA', async (req, res) => {
  const { MATERIA } = req.params;
  const sql = `SELECT Materia.Id_Materia, Materia.Materia, Docente.Nombre, Docente.Ap_Paterno, Docente.Ap_Materno, Aula.Nombre as NOMBRE, Horario.Hora_Inicio_Lunes, Horario.Hora_Final_Lunes, Id_DocxMath
  FROM Materia
  INNER JOIN Materia_Asignada_Profesor ON Materia.Id_Materia = Materia_Asignada_Profesor.Id_Materia
  INNER JOIN Docente ON Materia_Asignada_Profesor.Id_Docente = Docente.Id_Docente
  INNER JOIN Aula ON Materia.Id_Aula = Aula.Id_Aula
  INNER JOIN Horario ON Materia.Id_Horario = Horario.Id_Horario WHERE Materia=?
  `;

  try {
    const result = await pool.query(sql, [MATERIA]);
    const users = result.map(user => ({
      ID_MATERIA: user.Id_Materia,
      MATERIA: user.Materia,
      NOMBRE: user.Nombre,
      AP_PATERNO: user.Ap_Paterno,
      AP_MATERNO: user.Ap_Materno,
      HORA_INICIO_LUNES: user.Hora_Inicio_Lunes,
      HORA_FINAL_LUNES: user.Hora_Final_Lunes,
      AULA: user.NOMBRE,
      ID_DOCXMATH: user.Id_DocxMath
    }));

    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});





//------------------------------------------------------OPERACIONES CON AULAS
//--buscar aula (LISTO)
app.get('/getAula/:id', async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM Aula WHERE Id_Aula = ?";
  const [result] = await pool.query(sql, [id]);
  const aulas = result.map(aula => ({
    Id_Aula: aula.Id_Aula,
    Nombre: aula.Nombre,
    Edificio: aula.Edificio,
    Capacidad: aula.Capacidad
  }));
  res.json(aulas);
});
//--obtener todas las aulas (LISTO)
app.get('/getAllAulas', async (req, res) => {
  const sql = "SELECT * FROM Aula";
  const [result] = await pool.query(sql);
  const users = result.map(user => ({
    Id_Aula: user.Id_Aula,
    Nombre: user.Nombre,
    Edificio: user.Edificio,
    Capacidad: user.Capacidad
  }));
  res.json(users);
});
//--gregar aula(LISTO)
app.post('/addAula', async (req, res) => {
  const { ID_AULA, NOMBRE, EDIFICIO, CAPACIDAD } = req.body;
  console.log(`Received data: ID_AULA=${ID_AULA}, NOMBRE=${NOMBRE}, EDIFICIO=${EDIFICIO}, CAPACIDAD=${CAPACIDAD}`);

  try {
    const sql = "INSERT INTO Aula (ID_AULA, NOMBRE, EDIFICIO, CAPACIDAD) VALUES (?, ?, ?, ?)";
    await pool.query(sql, [ID_AULA, NOMBRE, EDIFICIO, CAPACIDAD]);
    console.log(`Inserted new AULA record with ID_AULA=${ID_AULA}`);
    res.status(200).json({
      "ID_AULA": ID_AULA,
      "NOMBRE": NOMBRE,
      "EDIFICIO": EDIFICIO,
      "CAPACIDAD": CAPACIDAD
    });
  } catch (error) {
    console.error(`Error while adding new AULA record: ${error}`);
  res.status(500).json({
    "message": `Error while adding new AULA record: ${error.message}`
  });
  }
});
//eliminar aula(LISTO)
app.delete('/deleteAula/:Id_Aula', async (req, res) => {
  const { Id_Aula } = req.params;

  try {
    

    // Eliminamos el aula
    const queryDeleteAula = "DELETE FROM Aula WHERE Id_Aula = ?";
    const [result] = await pool.execute(queryDeleteAula, [Id_Aula]);

    if (result.affectedRows === 1) {
      res.json({ "msg": "Aula Eliminada" });
    } else {
      res.json({ "msg": "No se pudo eliminar el aula" });
    }
  } catch (error) {
    console.error(`Error while deleting aula record: ${error}`);
    res.status(500).json({
      message: "Error al eliminar el aula"
    });
  }
});
//---actualizar aula (LISTO)
app.put("/updateAula/:ID_AULA", async (req, res) => {
  const { NOMBRE, EDIFICIO, CAPACIDAD } = req.body;
  const { ID_AULA } = req.params;
  
  try {
    const sql = "UPDATE Aula SET NOMBRE = ?, EDIFICIO = ?, CAPACIDAD = ? WHERE ID_AULA = ?";
    await pool.query(sql, [NOMBRE, EDIFICIO, CAPACIDAD, ID_AULA]);
    console.log(`Updated AULA record with ID_AULA=${ID_AULA}`);
    res.status(200).json({
      "NOMBRE": NOMBRE,
      "EDIFICIO": EDIFICIO,
      "CAPACIDAD": CAPACIDAD
    });
  } catch (error) {
    console.error(`Error while updating AULA record: ${error}`);
    res.status(500).json({
      message: `Error while updating AULA record: ${error.message}`
    });
  }
});


//-------------------------------------------------------------------OPERACIONES CON MATERIAS
//AGREGAR MATERIA (FUNCIONA)
app.post('/addNewMateria', async (req, res) => {
  const { ID_MATERIA, ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO, SEMESTRE} = req.body;

  //Secuencia sql para poder agregar la materia a la base de datos
  //Primero agregamos la materia sin asignar el docente
  const sql = "INSERT INTO Materia (ID_MATERIA, ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO, SEMESTRE) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    await pool.query(sql, [ID_MATERIA, ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO, SEMESTRE]);
    console.log(`Inserted new MATERIA record with ID_MATERIA=${ID_MATERIA}`);
    res.status(200).json({});
  } catch (error) {
    console.error(`Error while adding new MATERIA record: ${error}`);
    res.status(500).json({
      message: `Error while adding new MATERIA record: ${error.message}`
    });
  }
});
//Materas por semestre:(FUNCIONA)
app.get('/getMaterias/:semestre', async (req, res) => {
  const { semestre } = req.params;
  const sql = "SELECT Id_Materia, Materia, Cupo, Creditos, Semestre FROM Materia WHERE Semestre=?";
  try {
    const [result] = await pool.query(sql, [semestre]);
    const users = result.map(user => ({
      Id_Materia: user.Id_Materia,
      Materia: user.Materia,
      Cupo: user.Cupo,
      Creditos: user.Creditos,
      Semestre: user.Semestre
    }));
    res.json(users);
  } catch (error) {
    console.error(`Error while getting MATERIA records: ${error}`);
    res.status(500).json({
      message: `Error while getting MATERIA records: ${error.message}`
    });
  }
});

//Obtener todas las materias, con horario, aula y carrera//(LISTO)
app.get('/getAllMaterias', async (req, res) => {
  const sql = "SELECT Materia.Id_Materia, Materia.Id_Horario, Materia.Id_Aula, Materia.Id_Carrera, Materia.Materia, Creditos, Cupo, Semestre, Carrera.Nombre AS NOMBRE, Horario.Hora_Inicio_Lunes, Horario.Hora_Final_Lunes, Aula.Nombre FROM Materia JOIN Carrera ON Materia.Id_Carrera = Carrera.Id_Carrera JOIN Horario ON Materia.Id_Horario = Horario.Id_Horario JOIN Aula ON Materia.Id_Aula = Aula.Id_Aula";

  try {
    const [result] = await pool.query(sql);
    const Users = result.map(user => ({
      Id_Materia: user.Id_Materia,
      Id_Horario: user.Id_Horario,
      Id_Aula: user.Id_Aula,
      Id_Carrera: user.Id_Carrera,
      Materia: user.Materia,
      Creditos: user.Creditos,
      Cupo: user.Cupo,
      Semestre: user.Semestre,
      Nombre_Carrera: user.NOMBRE,
      Hora_Inicio_Lunes: user.Hora_Inicio_Lunes,
      Hora_Final_Lunes: user.Hora_Final_Lunes,
      Nombre_Aula: user.Nombre
    }));
    res.json(Users);
  } catch (error) {
    console.error(`Error while getting MATERIA records: ${error}`);
    res.status(500).json({
      message: `Error while getting MATERIA records: ${error.message}`
    });
  }
});

//EOBTENER TODAS LAS MATERIAS ASIGNDAS A PROFESOR(lISTO)
app.get('/getAllMats', async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT Id_Docxmath,Docente.Id_Docente, Materia.Id_Materia, Materia.Materia, Docente.Nombre,Docente.Ap_Paterno, Docente.Ap_Materno, Aula.Nombre AS NOMBRE, Horario.Hora_Inicio_Lunes, Horario.Hora_Final_Lunes
      FROM Materia
      INNER JOIN Materia_Asignada_Profesor ON Materia.Id_Materia = Materia_Asignada_Profesor.Id_Materia
      INNER JOIN Docente ON Materia_Asignada_Profesor.Id_Docente = Docente.Id_Docente
      INNER JOIN Aula ON Materia.Id_Aula = Aula.Id_Aula
      INNER JOIN Horario ON Materia.Id_Horario = Horario.Id_Horario
    `);
    const Users = result.map(user => ({
      Id_Docxmath: user.Id_Docxmath,
      Id_Docente: user.Id_Docente,
      Id_Materia: user.Id_Materia,
      Materia: user.Materia,
      Nombre: user.Nombre,
      Ap_Paterno: user.Ap_Paterno,
      Ap_Materno: user.Ap_Materno,
      Hora_Inicio_Lunes: user.Hora_Inicio_Lunes,
      Hora_Final_Lunes: user.Hora_Final_Lunes,
      NOMBRE: user.NOMBRE
    }));
    res.json(Users);
  } catch (error) {
    console.error(`Error al obtener las materias: ${error}`);
    res.status(500).json({ error: `Error al obtener las materias: ${error.message}` });
  }
});
//CONSULTAR MATERIA POR NOMBRE(no listo)
app.get('/getMats/:MAT', async (req, res) => {
  const { MAT } = req.params;
  //Obtener materia asignada al profesor
  const sql = `SELECT ID_DOCXMATH, Docente.ID_DOCENTE, Materia.ID_MATERIA, Materia.MATERIA, Docente.NOMBRE,DOCENTE.AP_PATERNO, Docente.AP_MATERNO, Aula.NOMBRE, Horario.HORA_INICIO_LUNES
      FROM Materia
      INNER JOIN MATERIA_ASIGNADA_PROFESOR ON Materia.ID_MATERIA = Materia_Asignada_Profesor.ID_MATERIA
      INNER JOIN DOCENTE ON Materia_Asignada_Profesor.ID_DOCENTE = Docente.ID_DOCENTE
      INNER JOIN AULA ON Materia.ID_AULA = Aula.ID_AULA
      INNER JOIN HORARIO ON Materia.ID_HORARIO = Horario.ID_HORARIO WHERE Materia_Asignada_Profesor.ID_DOCXMATH =?`;

  await pool.query(sql, [MAT], (error, result) => {
      if (error) throw error;

      const Users = result.map(user => ({
          "ID_DOCXMATH":user.ID_DOCXMATH,
          "ID_DOCENTE":user.ID_DOCENTE,
          "ID_MATERIA":user.ID_MATERIA,
          "MATERIA": user.MATERIA,
          "NOMBRE": user.NOMBRE,
          "AP_PATERNO": user.AP_PATERNO,
          "AP_MATERNO": user.AP_MATERNO,
          "HORA_INICIO_LUNES": user.HORA_INICIO_LUNES,
          "HORA_FINAL_LUNES": user.HORA_FINAL_LUNES,
          "AULA": user.NOMBRE
      }));

      res.json(Users);
  });
});
//Obtener materias asignadas(LISTO)
app.get('/getMaterias_asigandas', async (req, res) => {
  const sql = "SELECT * FROM Materia_Asignada_Profesor";
  try {
    const [result] = await pool.query(sql);
    const Users = result.map(user => ({
      Id_DocxMath: user.Id_DocxMath,
      Id_Docente: user.Id_Docente,
      Id_Materia: user.Id_Materia
    }));
    res.json(Users);
  } catch (error) {
    console.error(`Error while getting MATERIAS ASIGNADAS records: ${error}`);
    res.status(500).json({
      message: `Error while getting MATERIAS ASIGNADAS records: ${error.message}`
    });
  }
});
//(OBTENER MATERIA POR ID (LISTO)
app.get('/getMateria/:id', async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT Materia.Id_Materia, Materia.Materia, Docente.Nombre, Docente.Ap_Paterno, Docente.Ap_Materno, Aula.Nombre AS NOMBRE, Horario.Hora_Inicio_Lunes, Horario.Hora_Final_Lunes
  FROM Materia
  INNER JOIN Materia_Asignada_Profesor ON Materia.Id_Materia = Materia_Asignada_Profesor.Id_Materia
  INNER JOIN Docente ON Materia_Asignada_Profesor.Id_Docente = Docente.Id_Docente
  INNER JOIN Aula ON Materia.Id_Aula = Aula.Id_Aula
  INNER JOIN Horario ON Materia.Id_Horario = Horario.Id_Horario WHERE Materia.Id_Materia=?`;

  const result = await pool.query(sql, [id]);
  const data = result[0];

  const users = data.map(user => ({
    Id_Materia: user.Id_Materia,
    Materia: user.Materia,
    Nombre: user.Nombre,
    Ap_Paterno: user.Ap_Paterno,
    Ap_Materno: user.Ap_Materno,
    Hora_Inicio_Lunes: user.Hora_Inicio_Lunes,
    Hora_Final_Lunes: user.Hora_Final_Lunes,
    Aula: user.NOMBRE
  }));
  
  res.json(users);
});
//--------- AGREGAR MATERIA(listo pero agrega un alumno, no una materia xd)
app.post('/addMateria', async (req, res) => {
  const { NCONTROL, ID_CARRERA, NOMBRE, AP_PATERNO, AP_MATERNO, SEMESTRE, PERIODO, CREDITOS_DISPONIBLES, ESPECIALIDAD, CONTRASENA } = req.body;

  //Secuencia sql para poder agregar el alumno a la base de datos
  const sql = "INSERT INTO Alumnos(Ncontrol, Id_Carrera, Nombre, Ap_Paterno, Ap_Materno, Semestre, Periodo, Creditos_Disponibles, Especialidad,Contrasena) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    const result = await pool.query(sql, [NCONTROL, ID_CARRERA, NOMBRE, AP_PATERNO, AP_MATERNO, SEMESTRE, PERIODO, CREDITOS_DISPONIBLES, ESPECIALIDAD, CONTRASENA]);

    res.status(200).json({
      "NCONTROL": NCONTROL,
      "ID_CARRERA": ID_CARRERA,
      "NOMBRE": NOMBRE,
      "AP_PATERNO":AP_PATERNO,
      "AP_MATERNO":AP_MATERNO,
      "SEMESTRE":SEMESTRE,
      "PERIODO":PERIODO,
      "CREDITOS_DISPONIBLES":CREDITOS_DISPONIBLES,
      "ESPECIALIDAD":ESPECIALIDAD,
      "CONTRASENA":CONTRASENA,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ "msg": "Error al agregar la materia: " + error.message });
  }
});

//modificar materia ? (LISTO)
app.put("/updateMateria/:ID_MATERIA", async (req, res) => {
  const { HORA_INICIO_LUNES, HORA_FINAL_LUNES } = req.body;
  const { ID_MATERIA } = req.params;
  const sql = "UPDATE Horario SET Hora_Inicio_Lunes = ?, Hora_Final_Lunes = ? WHERE Id_Horario = ?";
    
  await pool.query(sql, [HORA_INICIO_LUNES, HORA_FINAL_LUNES, ID_MATERIA]);
  
  res.status(200).json({
    "HORA_INICIO_LUNES": HORA_INICIO_LUNES,
    "HORA_FINAL_LUNES": HORA_FINAL_LUNES,
  });
});
//MODIFICAR MATERIA
app.put('/updateMat/:ID_MATERIA', async (req, res) => {
  const {ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO,SEMESTRE} = req.body;
  const {ID_MATERIA} = req.params;

  const sql = "UPDATE Materia set Id_Horario = ?, Id_Aula = ?, Id_Carrera = ?, Materia = ?, Creditos = ?, Cupo=?, Semestre=? WHERE Id_Materia=?";

  try {
    const result = await pool.query(sql, [ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO, SEMESTRE, ID_MATERIA]);
    res.status(200).json();
  } catch (error) {
    console.error(`Error while updating MATERIA record: ${error}`);
    res.status(500).json({
      message: `Error while updating MATERIA record: ${error.message}`
    });
  }
});
//ELIMINAR MATERIA
app.delete('/deleteMateria/:ID_MATERIA', async (req, res) => {
  const { ID_MATERIA } = req.params;
  
  // También tenemos que eliminar las materias asignadas que tiene
  const sql = 'DELETE FROM Materia WHERE Id_Materia = ?';
  try {
    await pool.query(sql, [ID_MATERIA]);
    // También tenemos que eliminar las materias asignadas que tiene
    res.json({ "msg": "MATERIA Eliminada" });
  } catch (error) {
    console.error(`Error while deleting MATERIA record: ${error}`);
    res.status(500).json({
      message: `Error while deleting MATERIA record: ${error.message}`
    });
  }
});



//post materia??
//BNo util /LISTO
app.post('/postMateria/:ID_MATERIA/:HORA/:AULA/:ID_CARRERA/:MATERIA/:CREDITOS/:CUPO/:SEMESTRE', async (req, res) => {
    const { ID_MATERIA, HORA, AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO, SEMESTRE } = req.params;

    try {
        // Primero agregarmos la materia sin asignar el docente
        const sql = `INSERT INTO MATERIA (ID_MATERIA, ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO, SEMESTRE)
                     SELECT :ID_MATERIA, ID_HORARIO, ID_AULA, ID_CARRERA, :MATERIA, :CREDITOS, :CUPO, :SEMESTRE
                     FROM HORARIO, AULA, CARRERA
                     WHERE HORA_INICIO_LUNES = :HORA AND AULA.NOMBRE = :AULA AND ID_CARRERA = :ID_CARRERA`;

        const result = await pool.query(sql, {
            ID_MATERIA,
            HORA,
            AULA,
            ID_CARRERA,
            MATERIA,
            CREDITOS,
            CUPO,
            SEMESTRE
        });

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//Eliminar materia asingada (LISTO)
app.delete("/deleteMateria_Asignada/:ID_DOCXMATH", async (req, res) => {
  const { ID_DOCXMATH } = req.params;

  try {
      // Query para eliminar la materia asignada del profesor
      const sql = 'DELETE FROM Materia_Asignada_Profesor WHERE Id_DocxMath = ?';
      
      // Ejecutar la consulta utilizando la conexión del pool
      await pool.query(sql, [ID_DOCXMATH]);

      // Enviar respuesta de éxito
      res.json({ "msg": "Horario Eliminada" });
  } catch (error) {
      console.log(error);
      res.status(500).json({ "msg": "Error al eliminar la materia asignada" });
  }
});
//Obtener solo una materia:  (LISTO)
app.get('/getJusAtMateria/:ID_MATERIA', async (req, res) => {
  const { ID_MATERIA } = req.params;
  const sql = "SELECT Id_Materia, Materia.Id_Horario, Hora_Inicio_Lunes, Hora_Final_Lunes, Materia.Id_Aula, Materia.Id_Carrera, Materia.Materia, Materia.Creditos, Materia.Cupo, Materia.Semestre, Carrera.Nombre, Aula.Nombre AS NOMBRE FROM Materia INNER JOIN Carrera ON Materia.Id_Carrera = Carrera.Id_Carrera INNER JOIN Horario ON Materia.Id_Horario = Horario.Id_Horario INNER JOIN Aula ON Materia.Id_Aula = Aula.Id_Aula WHERE Materia.Id_Materia = ?";

  let [result] = await pool.execute(sql, [ID_MATERIA]);
  let users = [];

  result.map(user => {
      let userSchema = {
          "ID_MATERIA": user.Id_Materia,
          "ID_HORARIO": user.Id_Horario,
          "HORA_INICIO_LUNES": user.Hora_Inicio_Lunes,
          "HORA_FINAL_LUNES": user.Hora_Final_Lunes,
          "ID_AULA": user.Id_Aula,
          "ID_CARRERA": user.Id_Carrera,
          "MATERIA": user.Materia,
          "CREDITOS": user.Creditos,
          "CUPO": user.Cupo,
          "SEMESTRE": user.Semestre,
          "Nombre": user.Nombre,
          "NOMBRE": user.NOMBRE

      }

      users.push(userSchema);
  })

  res.json(users);
})



//AGREGAR MATERIA ASIGNADA (LISTO)
app.post('/addMateria_Asignada', async (req, res) => {
    const { ID_DOCXMATH, ID_DOCENTE, ID_MATERIA } = req.body;
    const sql = "Insert into Materia_Asignada_Profesor VALUES (?, ?, ?)";

    try {
        await pool.query(sql, [ID_DOCXMATH, ID_DOCENTE, ID_MATERIA]);
        res.status(200).json({
            "ID_DOCXMATH": ID_DOCXMATH,
            "ID_DOCENTE": ID_DOCENTE,
            "ID_MATERIA": ID_MATERIA,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ "msg": "Error al agregar la materia asignada" });
    }
})
//actualizar materia (LISTO)
app.put('/updateMat/:ID_MATERIA', async (req, res) => {
  const {ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO, SEMESTRE} = req.body;
  const {ID_MATERIA} = req.params;
  const sql = "UPDATE Materia SET Id_Horario = ?, Id_Aula = ?, Id_Carrera = ?, Materia = ?, Creditos = ?, Cupo = ?, Semestre = ? WHERE Id_Materia = ?";

  const result = await pool.execute(sql, [ID_HORARIO, ID_AULA, ID_CARRERA, MATERIA, CREDITOS, CUPO, SEMESTRE, ID_MATERIA]);

  res.status(200).json(result);
})





//------------------------------------------------------------------OPERACIONES CON  DOCENTES
app.get('/getAllDocentes', async (req, res) => {
  const sql = "SELECT * FROM Docente";
  const [result] = await pool.query(sql);
  const docentes = result.map(docente => ({
      Id_Docente: docente.Id_Docente,
      Nombre: docente.Nombre,
      AP_PATERNO: docente.Ap_Paterno,
      AP_MATERNO: docente.Ap_Materno
  }));
  res.json(docentes);
});
//agregar docente
app.post('/addDocente', async (req, res) => {
  const { ID_DOCENTE, NOMBRE, AP_PATERNO, AP_MATERNO } = req.body;

  // Secuencia sql para poder agregar el docente a la base de datos
  const sql = "INSERT INTO Docente(Id_Docente, Nombre, Ap_Paterno, Ap_Materno) VALUES (?, ?, ?, ?)";

  try {
    await pool.query(sql, [ID_DOCENTE, NOMBRE, AP_PATERNO, AP_MATERNO]);
    console.log(`Inserted new DOCENTE record with ID_DOCENTE=${ID_DOCENTE}`);
    res.status(200).json({
      "ID_DOCENTE": ID_DOCENTE,
      "NOMBRE": NOMBRE,
      "AP_PATERNO": AP_PATERNO,
      "AP_MATERNO": AP_MATERNO
    });
  } catch (error) {
    console.error(`Error while adding new DOCENTE record: ${error}`);
    res.status(500).json({
      "message": `Error while adding new DOCENTE record: ${error.message}`
    });
  }
});

//--actualizar docente
app.put("/updateDocente/:ID_DOCENTE", async (req, res) => {
  const { NOMBRE, AP_PATERNO, AP_MATERNO } = req.body;
  const { ID_DOCENTE } = req.params;
  const sql = "UPDATE Docente SET Nombre=?, Ap_Paterno=?, Ap_Materno=? WHERE Id_Docente=?";
  const params = [NOMBRE, AP_PATERNO, AP_MATERNO, ID_DOCENTE];

  try {
    const result = await pool.query(sql, params);
    console.log(`Updated record for Docente with ID_DOCENTE=${ID_DOCENTE}`);
    res.status(200).json({
      "NOMBRE": NOMBRE,
      "AP_PATERNO": AP_PATERNO,
      "AP_MATERNO": AP_MATERNO
    });
  } catch (error) {
    console.error(`Error while updating record for Docente with ID_DOCENTE=${ID_DOCENTE}: ${error}`);
    res.status(500).json({
      "message": `Error while updating record for Docente with ID_DOCENTE=${ID_DOCENTE}: ${error.message}`
    });
  }
});
//Obtener un docente
app.get('/getDocente/:id', async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM Docente WHERE Id_Docente = ?";
  const [result] = await pool.query(sql, [id]);

  if (result.length === 0) {
    res.status(404).json({ message: "Docente no encontrado" });
    return;
  }

  const userSchema = {
    "Id_Docente": result[0].Id_Docente,
    "Nombre": result[0].Nombre,
    "AP_PATERNO": result[0].Ap_Paterno,
    "AP_MATERNO": result[0].Ap_Materno
  };
  let data = []
  data.push(userSchema);
  res.json(data);
});
//Eliminar docente (no util) (LISTO)
app.delete("/deleteDocente/:Id_Docente", async (req, res) => {
  const { Id_Docente } = req.params;
 
  // También tenemos que eliminar las materias asignadas que tiene
  let sql = `DELETE FROM Carga
             WHERE Id_DocxMath IN (SELECT Id_DocxMath FROM Materia_Asignada_Profesor WHERE Id_Docente = :Id_Docente)`;

  // Ejecutamos la sentencia SQL para eliminar las materias asignadas
  await pool.query(sql, { Id_Docente });

  // Eliminamos las materias asignadas del profesor
  sql = "DELETE FROM Materia_Asignada_Profesor WHERE Id_Docente = :Id_Docente";
  await pool.query(sql, { Id_Docente });

  // Eliminamos al docente
  sql = "DELETE FROM Docente WHERE Id_Docente = :Id_Docente";
  await pool.query(sql, { Id_Docente });

  // Enviamos el mensaje de éxito
  res.json({ "msg": "Docente Eliminado" })
});
//ELIMINAR UN DOCENTE (VERDADERO)
app.delete('/deleteADocente/:ID_DOCENTE', async (req, res) => {
  const { ID_DOCENTE } = req.params;
  
  // También tenemos que eliminar las materias asignadas que tiene
  const sql = 'DELETE FROM Docente WHERE Id_Docente = ?';
  try {
    await pool.query(sql, [ID_DOCENTE]);
    // También tenemos que eliminar las materias asignadas que tiene
    res.json({ "msg": "Docente Eliminado" });
  } catch (error) {
    console.error(`Error while deleting DOCENTE record: ${error}`);
    res.status(500).json({
      message: `Error while deleting DOCENTE record: ${error.message}`
    });
  }
});

//--------------------------------------------------------------OPERACIONES CON CARRERAS
//Obtener todas las carrerras
app.get('/getCarreras', async (req, res) => {
  const sql = "SELECT * FROM Carrera";
  
  try {
    const [result] = await pool.query(sql);
    const Users = result.map(user => ({
      Id_Carrera: user.Id_Carrera,
      Carrera: user.Carrera,
      Plan_Estudios: user.Plan_Estudios
    }));
    res.json(Users);
  } catch (error) {
    console.error(`Error while getting CARRERA records: ${error}`);
    res.status(500).json({
      message: `Error while getting CARRERA records: ${error.message}`
    });
  }
});
//obtener todas las carreras (Listo)
app.get('/getAllCarreras', async (req, res) => {
  try {
      const sql = "SELECT * FROM Carrera";
      const result = await pool.query(sql);
      const carreras = result[0].map(carrera => ({
          Id_Carrera: carrera.Id_Carrera,
          Nombre: carrera.Nombre,
          Plan_Estudios: carrera.Plan_Estudios
      }));
      res.json(carreras);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener las carreras" });
  }
})


//------------------------------------PESTAÑA DE ALUMNOS..........
//obtener un solo alumno (LISTO)
app.get('/getAlumno/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const sql = "SELECT * FROM Alumnos WHERE NControl = ?";
      const result = await pool.query(sql, [id]);
      const alumnos = result[0].map(alumno => ({
        NControl: alumno.NControl,
        Id_Carrera: alumno.Id_Carrera,
        Nombre: alumno.Nombre,
        Ap_Paterno: alumno.Ap_Paterno,
        Ap_Materno: alumno.Ap_Materno,
        Semestre: alumno.Semestre,
        Periodo: alumno.Periodo,
        Creditos_Disponibles: alumno.Creditos_Disponibles,
        Especialidad: alumno.Especialidad,
        Contrasena: alumno.Contrasena
      }));
      res.json(alumnos);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener el alumno" });
  }
})
//obtener todos los alumnos (LISTO)
app.get('/getAllAlumnos', async (req, res) => {
  try {
      const sql = "SELECT * FROM Alumnos";
      const result = await pool.query(sql);
      const alumnos = result[0].map(alumno => ({
        NControl: alumno.NControl,
        Id_Carrera: alumno.Id_Carrera,
        Nombre: alumno.Nombre,
        Ap_Paterno: alumno.Ap_Paterno,
        Ap_Materno: alumno.Ap_Materno,
        Semestre: alumno.Semestre,
        Periodo: alumno.Periodo,
        Creditos_Disponibles: alumno.Creditos_Disponibles,
        Especialidad: alumno.Especialidad,
        Contrasena: alumno.Contrasena
      }));
      res.json(alumnos);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al obtener los alumnos" });
  }
})
//actualizar un alumno /LISTO/ (MANDAR TODO EN MAYUSCULAS)
app.put("/updateAlumno/:NCONTROL", async (req, res) => {
  const { NOMBRE, AP_PATERNO, AP_MATERNO, SEMESTRE, PERIODO, CREDITOS_DISPONIBLES, ESPECIALIDAD } = req.body;
  const { NCONTROL } = req.params;
  const sql = "UPDATE Alumnos SET Nombre = ?, Ap_Paterno = ?, Ap_Materno = ?, Semestre = ?, Periodo = ?, Creditos_Disponibles = ?, Especialidad = ? WHERE NControl = ?";
  const values = [NOMBRE, AP_PATERNO, AP_MATERNO, SEMESTRE, PERIODO, CREDITOS_DISPONIBLES, ESPECIALIDAD, NCONTROL];

  try {
      const result = await pool.query(sql, values);
      res.status(200).json({
          "NOMBRE": NOMBRE,
          "AP_PATERNO": AP_PATERNO,
          "AP_MATERNO": AP_MATERNO
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al actualizar el alumno" });
  }
});
//agregar un alumno (LISTO)
app.post('/addAlumno', async (req, res) => {
  const { NCONTROL, ID_CARRERA, NOMBRE, AP_PATERNO, AP_MATERNO, SEMESTRE, PERIODO, CREDITOS_DISPONIBLES, ESPECIALIDAD, CONTRASENA } = req.body;

  //Secuencia sql para poder agregar el alumno a la base de datos
  const sql = "INSERT INTO Alumnos(NCONTROL, ID_CARRERA, NOMBRE, AP_PATERNO, AP_MATERNO, SEMESTRE, PERIODO, CREDITOS_DISPONIBLES, ESPECIALIDAD, CONTRASENA) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

  await pool.query(sql, [NCONTROL, ID_CARRERA, NOMBRE, AP_PATERNO, AP_MATERNO, SEMESTRE, PERIODO, CREDITOS_DISPONIBLES, ESPECIALIDAD, CONTRASENA]);
  res.status(200).json({
      "NCONTROL": NCONTROL,
      "ID_CARRERA": ID_CARRERA,
      "NOMBRE": NOMBRE,
      "AP_PATERNO":AP_PATERNO,
      "AP_MATERNO":AP_MATERNO,
      "SEMESTRE":SEMESTRE,
      "PERIODO":PERIODO,
      "CREDITOS_DISPONIBLES":CREDITOS_DISPONIBLES,
      "ESPECIALIDAD":ESPECIALIDAD,
      "CONTRASENA":CONTRASENA
  });
});
//Eliminar alumno (LISTO)
app.delete("/deleteAlumno/:ncontrol", async (req, res) => {
  const { ncontrol } = req.params;
  try {
      // Primero eliminamos los registros hijos
      let sql = "DELETE FROM Carga WHERE ncontrol = ?";
      await pool.query(sql, [ncontrol]);

      // Luego eliminamos el registro padre
      sql = "DELETE FROM Alumnos WHERE ncontrol = ?";
      await pool.query(sql, [ncontrol]);

      res.json({ "msg": "Usuario Eliminado" });
  } catch (error) {
      console.log(error);
      res.status(500).json({ "error": "Error al eliminar el usuario" });
  }
});


app.get('/create', async (req, res) => {
  const result = await pool.query('INSERT INTO users(name) VALUES ("John")')
  res.json(result)
})

app.listen(PORT)
console.log('Server on port', PORT)
