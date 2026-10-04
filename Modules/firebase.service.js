import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase_init.js";

const STUDENTS_COLLECTION = "students";
const MOVEMENT_EXERCISE_ID = "reaction-movement";

function normalizeStudentCode(studentCode) {
  const normalizedCode = String(studentCode ?? "").trim();

  if (!normalizedCode) {
    throw new Error("El código universitario es obligatorio.");
  }

  return normalizedCode;
}

function normalizeLevel(level) {
  const leftHandCorrect = Number(level.leftHandCorrect);
  const leftHandAttempts = Number(level.leftHandAttempts);
  const rightHandCorrect = Number(level.rightHandCorrect);
  const rightHandAttempts = Number(level.rightHandAttempts);
  const totalHandAttempts = leftHandAttempts + rightHandAttempts;

  if (!Number.isInteger(level.level) || level.level < 1 || level.level > 3) {
    throw new Error("El nivel debe ser 1, 2 o 3.");
  }

  if (totalHandAttempts <= 0) {
    throw new Error("Los intentos de ambas manos deben ser mayores que cero.");
  }

  return {
    level: level.level,
    averageReaction: Number(level.averageReaction),
    correctAnswers: Number(level.correctAnswers),
    totalAttempts: Number(level.totalAttempts),
    leftHandReaction: Number(level.leftHandReaction),
    rightHandReaction: Number(level.rightHandReaction),
    leftHandAccuracy: (leftHandCorrect / leftHandAttempts) * 100,
    rightHandAccuracy: (rightHandCorrect / rightHandAttempts) * 100,
    combinedAccuracy: ((leftHandCorrect + rightHandCorrect) / totalHandAttempts) * 100,
  };
}

export class FirestoreService {
  async getStudent(studentCode) {
    const normalizedCode = normalizeStudentCode(studentCode);
    const studentRef = doc(db, STUDENTS_COLLECTION, normalizedCode);
    const snapshot = await getDoc(studentRef);

    return snapshot.exists()
      ? { id: snapshot.id, ...snapshot.data() }
      : null;
  }

  async createStudentIfNotExists(name, studentCode) {
    const normalizedName = String(name ?? "").trim();
    const normalizedCode = normalizeStudentCode(studentCode);

    if (!normalizedName) {
      throw new Error("El nombre del estudiante es obligatorio.");
    }

    const studentRef = doc(db, STUDENTS_COLLECTION, normalizedCode);
    const existingStudent = await getDoc(studentRef);

    if (existingStudent.exists()) {
      return {
        created: false,
        student: { id: existingStudent.id, ...existingStudent.data() },
      };
    }

    await setDoc(studentRef, {
      name: normalizedName,
      studentCode: normalizedCode,
      createdAt: serverTimestamp(),
    });

    return {
      created: true,
      student: {
        id: normalizedCode,
        name: normalizedName,
        studentCode: normalizedCode,
      },
    };
  }

  createMovementSession() {
    return {
      exerciseId: MOVEMENT_EXERCISE_ID,
      levels: [],
    };
  }

  addLevelToSession(session, levelData) {
    if (!session || session.exerciseId !== MOVEMENT_EXERCISE_ID) {
      throw new Error("La sesión de reacción de movimiento no es válida.");
    }

    if (session.levels.length >= 3) {
      throw new Error("La sesión ya tiene los tres niveles registrados.");
    }

    const level = normalizeLevel({
      ...levelData,
      level: session.levels.length + 1,
    });

    return {
      ...session,
      levels: [...session.levels, level],
    };
  }

  async saveCompletedAttempt(studentCode, session, completedAt = new Date()) {
    const normalizedCode = normalizeStudentCode(studentCode);

    if (!session || session.exerciseId !== MOVEMENT_EXERCISE_ID) {
      throw new Error("Solo está implementado reaction-movement.");
    }

    if (session.levels.length !== 3) {
      throw new Error("La sesión debe tener exactamente tres niveles.");
    }

    const attemptsRef = collection(
      db,
      STUDENTS_COLLECTION,
      normalizedCode,
      "attempts",
    );
    const attemptReference = await addDoc(attemptsRef, {
      exerciseId: session.exerciseId,
      completedAt: completedAt instanceof Timestamp
        ? completedAt
        : Timestamp.fromDate(new Date(completedAt)),
      levels: session.levels,
    });

    return {
      id: attemptReference.id,
      path: attemptReference.path,
    };
  }
  async getAllStudents() {
    const studentsRef = collection(db, STUDENTS_COLLECTION);
    const snapshot = await getDocs(studentsRef);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async getStudentAttempts(studentCode, exerciseId = null) {
    const normalizedCode = normalizeStudentCode(studentCode);
    const attemptsRef = collection(
      db,
      STUDENTS_COLLECTION,
      normalizedCode,
      "attempts",
    );

    // Solo ordenamos por completedAt — no combinamos where() en otro campo
    // para evitar requerir un índice compuesto en Firebase Console.
    // El filtro por exerciseId lo aplicamos en el cliente.
    const q = query(attemptsRef, orderBy("completedAt", "asc"));
    const snapshot = await getDocs(q);

    let docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (exerciseId) {
      docs = docs.filter((d) => d.exerciseId === exerciseId);
    }

    return docs;
  }
}

export { MOVEMENT_EXERCISE_ID };
