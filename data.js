const facultades = {
    "ciencias-agricolas": {
        nombre: "Facultad de Ciencias Agrícolas",
        sigla: "FCA",
        carreras: ["Biología", "Ciencias Ambientales", "Ingeniería Agronómica", "Ingeniería Agrícola (Montero)", "Ingeniería Forestal"],
        coordenadas: { lat: -17.7833, lng: -63.1833 },
        ciudad: "Santa Cruz, Bolivia"
    },
    "ciencias-contables": {
        nombre: "Facultad de Ciencias Contables, Auditoría, Sistemas de Control de Gestión y Finanzas",
        sigla: "FCCASCGF",
        carreras: ["Contaduría Pública", "Información y Control de Gestión"],
        coordenadas: { lat: -17.7833, lng: -63.1833 },
        ciudad: "Santa Cruz, Bolivia"
    },
    "ciencias-economicas": {
        nombre: "Facultad de Ciencias Económicas y Empresariales",
        sigla: "FCEE",
        carreras: ["Administración de Empresas", "Comercio Internacional", "Economía", "Ingeniería Comercial", "Ingeniería Financiera"],
        coordenadas: { lat: -17.7833, lng: -63.1833 },
        ciudad: "Santa Cruz, Bolivia"
    },
    "ciencias-exactas": {
        nombre: "Facultad de Ciencias Exactas y Tecnología",
        sigla: "FCET",
        carreras: ["Ingeniería Ambiental", "Ingeniería Civil", "Ingeniería Electromecánica", "Ingeniería Industrial", "Ingeniería Petrolera", "Ingeniería Química", "Ingeniería de Alimentos", "Ingeniería de Control de Procesos"],
        coordenadas: { lat: -17.7833, lng: -63.1833 },
        ciudad: "Santa Cruz, Bolivia"
    },
    "ciencias-farmaceuticas": {
        nombre: "Facultad de Ciencias Farmacéuticas y Bioquímicas",
        sigla: "FCFB",
        carreras: ["Bioquímica", "Farmacia"],
        coordenadas: { lat: -17.7833, lng: -63.1833 },
        ciudad: "Santa Cruz, Bolivia"
    },
    "ciencias-juridicas": {
        nombre: "Facultad de Ciencias Jurídicas, Políticas, Sociales y Relaciones Internacionales",
        sigla: "FCJPSRRII",
        carreras: ["Ciencia Política y Administración Pública", "Derecho", "Relaciones Internacionales", "Trabajo Social"],
        coordenadas: { lat: -17.7833, lng: -63.1833 },
        ciudad: "Santa Cruz, Bolivia"
    },
    "ciencias-veterinarias": {
        nombre: "Facultad de Ciencias Veterinarias",
        sigla: "FCV",
        carreras: ["Medicina Veterinaria y Zootecnia"],
        coordenadas: { lat: -17.7833, lng: -63.1833 },
        ciudad: "Santa Cruz, Bolivia"
    },
    "ciencias-salud": {
        nombre: "Facultad de Ciencias de la Salud Humana",
        sigla: "FCSH",
        carreras: ["Enfermería", "Medicina", "Odontología"],
        coordenadas: { lat: -17.7833, lng: -63.1833 },
        ciudad: "Santa Cruz, Bolivia"
    },
    "ciencias-habitat": {
        nombre: "Facultad de Ciencias del Hábitat, Diseño y Arte",
        sigla: "FCHDA",
        carreras: ["Arquitectura", "Arte", "Diseño Integral", "Planificación Territorial"],
        coordenadas: { lat: -17.7833, lng: -63.1833 },
        ciudad: "Santa Cruz, Bolivia"
    },
    "humanidades": {
        nombre: "Facultad de Humanidades",
        sigla: "FH",
        carreras: ["Ciencias de la Comunicación", "Ciencias de la Educación", "Gestión del Turismo", "Lenguas Modernas y Filología Hispánica", "Psicología", "Sociología"],
        coordenadas: { lat: -17.7833, lng: -63.1833 },
        ciudad: "Santa Cruz, Bolivia"
    },
    "ingenieria-computacion": {
        nombre: "Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones",
        sigla: "FICCT",
        carreras: ["Ingeniería Informática", "Ingeniería en Redes y Telecomunicaciones", "Ingeniería en Robótica", "Ingeniería en Sistemas"],
        coordenadas: { lat: -17.7833, lng: -63.1833 },
        ciudad: "Santa Cruz, Bolivia"
    }
};

// Últimos intentos de examen (se actualizan desde la base de datos)
const ultimosIntentos = [];
