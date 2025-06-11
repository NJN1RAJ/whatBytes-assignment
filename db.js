import { DataTypes, Sequelize } from "sequelize";
import bcrypt from "bcryptjs";

const sequelize = new Sequelize(
  "postgresql://healthcare-backend_owner:npg_gvlZ5aSk4onw@ep-damp-thunder-a1xmheu1-pooler.ap-southeast-1.aws.neon.tech/healthcare-backend?sslmode=require"
);

export const UserModel = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    set(value) {
      const hashedPassword = bcrypt.hashSync(value, 10);
      this.setDataValue("password", hashedPassword);
    },
  },
});

export const PatientModel = sequelize.define("Patient", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  disease: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const DoctorModel = sequelize.define("Doctor", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

UserModel.hasMany(PatientModel, { foreignKey: "UserId" });
PatientModel.belongsTo(UserModel, { foreignKey: "UserId" });

export const MappingModel = sequelize.define("Mapping", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

PatientModel.hasMany(MappingModel, { foreignKey: "patientId" });
DoctorModel.hasMany(MappingModel, { foreignKey: "doctorId" });
MappingModel.belongsTo(DoctorModel, { foreignKey: "doctorId" });
MappingModel.belongsTo(PatientModel, { foreignKey: "patientId" });

export const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connection has been established successfully.");
    console.log("All the models have been synced");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
