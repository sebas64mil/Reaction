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
const LIGHTS_EXERCISE_ID = "reaction-lights";

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

function normalizeLightsLevel(level) {
  if (!Number.isInteger(level.level) || level.level < 1 || level.level > 3) {
    throw new Error("El nivel debe ser 1, 2 o 3.");
  }

  const correctAnswers = Number(level.correctAnswers);
  const accuracy = Number(level.accuracy);
  const averageReaction = Number(level.averageReaction);

  if (!Number.isFinite(correctAnswers) || correctAnswers < 0 || !Number.isInteger(correctAnswers)) {
    throw new Error(`Nivel ${level.level}: los aciertos deben ser un entero no negativo.`);
  }

  if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100) {
    throw new Error(`Nivel ${level.level}: la precisión debe estar entre 0 y 100.`);
  }

  if (!Number.isFinite(averageReaction) || averageReaction < 0) {
    throw new Error(`Nivel ${level.level}: el tiempo de reacción promedio debe ser un número no negativo.`);
  }

  return {
    level: level.level,
    correctAnswers,
    accuracy,
    averageReaction,
  };
}

const DEFAULT_CACHE_TTL = 12 * 60 * 60 * 1000;// 12 horas por defecto

export class FirestoreService {
  constructor(cacheTtl = DEFAULT_CACHE_TTL) {
    this.cacheTtl = cacheTtl;
    this.cache = new Map();
    this.lastSync = null;
  }

  getCache(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > (entry.ttl ?? this.cacheTtl)) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  setCache(key, data, ttl = this.cacheTtl) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    this.lastSync = new Date();
  }

  invalidateCache(filter = null) {
    if (!filter) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (typeof filter === "string" && key.includes(filter)) {
        this.cache.delete(key);
      } else if (filter instanceof RegExp && filter.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  getLastSyncTime() {
    return this.lastSync;
  }

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

    // Invalida la lista de estudiantes para que el nuevo estudiante sea visible
    this.invalidateCache("students:all");

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

    // Invalida la caché de intentos del estudiante para reflejar el nuevo intento
    this.invalidateCache(`attempts:${normalizedCode}`);

    return {
      id: attemptReference.id,
      path: attemptReference.path,
    };
  }

  // ── Métodos para Reacción por Luces ──

  createLightsSession() {
    return {
      exerciseId: LIGHTS_EXERCISE_ID,
      levels: [],
    };
  }

  addLightsLevelToSession(session, levelData) {
    if (!session || session.exerciseId !== LIGHTS_EXERCISE_ID) {
      throw new Error("La sesión de reacción por luces no es válida.");
    }

    if (session.levels.length >= 3) {
      throw new Error("La sesión ya tiene los tres niveles registrados.");
    }

    const level = normalizeLightsLevel({
      ...levelData,
      level: session.levels.length + 1,
    });

    return {
      ...session,
      levels: [...session.levels, level],
    };
  }

  async saveLightsAttempt(studentCode, session, completedAt = new Date()) {
    const normalizedCode = normalizeStudentCode(studentCode);

    if (!session || session.exerciseId !== LIGHTS_EXERCISE_ID) {
      throw new Error("La sesión no corresponde a reaction-lights.");
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

    // Invalida la caché de intentos del estudiante para reflejar el nuevo intento
    this.invalidateCache(`attempts:${normalizedCode}`);

    return {
      id: attemptReference.id,
      path: attemptReference.path,
    };
  }

  async getAllStudents(forceRefresh = false) {
    const cacheKey = "students:all";
    if (!forceRefresh) {
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const studentsRef = collection(db, STUDENTS_COLLECTION);
    const snapshot = await getDocs(studentsRef);
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    this.setCache(cacheKey, data);
    return data;
  }

  async getStudentAttempts(studentCode, exerciseId = null, forceRefresh = false) {
    const normalizedCode = normalizeStudentCode(studentCode);
    const cacheKey = `attempts:${normalizedCode}:${exerciseId ?? "all"}`;

    if (!forceRefresh) {
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

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

    this.setCache(cacheKey, docs);
    return docs;
  }

  /**
   * Fuerza la revisión de la base de datos para verificar si hay datos nuevos.
   */
  async checkDatabaseUpdates(studentCode = null, exerciseId = null) {
    const students = await this.getAllStudents(true);
    let attempts = [];
    if (studentCode) {
      attempts = await this.getStudentAttempts(studentCode, exerciseId, true);
    }
    return {
      students,
      attempts,
      lastSync: this.lastSync,
    };
  }
}

export { MOVEMENT_EXERCISE_ID, LIGHTS_EXERCISE_ID, DEFAULT_CACHE_TTL };

