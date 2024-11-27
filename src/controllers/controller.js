const nodemailer = require("nodemailer");
const firebaseAdmin = require("../config/firebaseConfiguration");

const firestoreGCP = firebaseAdmin.firestore();

const generateAndSendCsv = async (req, res) => {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recipientEmail = req.query.email;
    if (!recipientEmail)
      return res.status(400).send("El parámetro 'email' es requerido.");
    if (!emailRegex.test(recipientEmail))
      return res.status(400).send("El formato del email es inválido.");

    let csvRows = [];
    await prepareCsvRows(csvRows);
    const csvContent = convertToCsv(csvRows);
    await sendEmail(recipientEmail, csvContent);
    res.status(200).send("Su reporte ha sido generado y enviado al email ingresado, porfavor, espere.");
  } catch (error) {
    console.log(error);
    res.status(500).send("ServerError");
  }
};

async function prepareCsvRows(csvRows) {
  const collectionName = "Users";
  const snapshot = await firestoreGCP.collection(collectionName).get();
  for (const doc of snapshot.docs) {
    const subcollections = await doc.ref.listCollections();
    if (subcollections.length === 0) continue;

    const userLocationRegistry = subcollections[0];
    const userLocationData = await userLocationRegistry.get();

    for (const subDoc of userLocationData.docs) {
      const subDocData = subDoc.data();
      const { hoursOfRegistry, internetStatusOnline, geoPoints } = subDocData;

      for (let i = 0; i < hoursOfRegistry.length; i++) {
        const row = [
          subDoc.id,
          subDocData.leader?.name,
          subDocData.team?.team,
          `${geoPoints[i]._latitude}, ${geoPoints[i]._longitude}`,
          hoursOfRegistry[i],
          internetStatusOnline[i] ? "Online" : "Offline",
        ];
        csvRows.push(row);
      }
    }
  }
};

const convertToCsv = (rows) => {
  const header = [
    "fecha",
    "leader",
    "team",
    "geopoint",
    "hourOfRegistry",
    "internetStatusOnline",
  ];
  const csvRows = [header, ...rows];
  return csvRows.map((row) => row.join(",")).join("\n");
};

const sendEmail = async (emailToReceiveTheReport, fileContent) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sepulveda.cristobal.ignacio@gmail.com",
      pass: "mpvy bbzi woaz ykhp",
    },
  });

  const mailOptions = {
    from: "sepulveda.cristobal.ignacio@gmail.com",
    to: emailToReceiveTheReport,
    subject: "CSV de registro de ubicación de usuario",
    text: "Adjunto el archivo CSV con los registros de ubicación de los usuarios.",
    attachments: [
      {
        filename: "user_location_registry.csv",
        content: fileContent,
        encoding: "utf-8",
      },
    ],
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error al enviar el correo:", error);
        reject(error);
      } else {
        console.log("Correo enviado:", info.response);
        resolve(info);
      }
    });
  });
};

module.exports = {
  generateAndSendCsv,
};
