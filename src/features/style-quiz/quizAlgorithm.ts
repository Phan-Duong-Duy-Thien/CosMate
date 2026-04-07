export interface QuizVector {
  E: number
  A: number
  O: number
}

export interface FinalClassification {
  archetypeId: string
  subTypeId: string
}

function sumAmplitude(vector: QuizVector): number {
  return Math.abs(vector.E) + Math.abs(vector.A) + Math.abs(vector.O)
}

function getSign(value: number): "positive" | "negative" | "neutral" {
  if (value > 0) return "positive"
  if (value < 0) return "negative"
  return "neutral"
}

function isDominant(axis: keyof QuizVector, vector: QuizVector): boolean {
  const current = Math.abs(vector[axis])
  return current >= Math.abs(vector.E) && current >= Math.abs(vector.A) && current >= Math.abs(vector.O)
}

function isWeakest(axis: keyof QuizVector, vector: QuizVector): boolean {
  const current = Math.abs(vector[axis])
  return current <= Math.abs(vector.E) && current <= Math.abs(vector.A) && current <= Math.abs(vector.O)
}

function getSignKey(vector: QuizVector): string {
  const e = vector.E >= 0 ? "+" : "-"
  const a = vector.A >= 0 ? "+" : "-"
  const o = vector.O >= 0 ? "+" : "-"
  return `${e}${a}${o}`
}

export function getBaseArchetypeAtCheckpoint(vector: QuizVector): string {
  const signKey = getSignKey(vector)
  const amplitude = sumAmplitude(vector)

  switch (signKey) {
    case "+++":
      if (isDominant("O", vector)) return "ARCH_11"
      if (isDominant("A", vector)) return "ARCH_01"
      if (amplitude <= 5) return "ARCH_12"
      return "ARCH_10"

    case "++-":
      if (isDominant("A", vector)) return "ARCH_06"
      return "ARCH_04"

    case "+-+":
      if (isDominant("O", vector)) return "ARCH_09"
      return "ARCH_05"

    case "+--":
      if (isDominant("E", vector)) return "ARCH_07"
      return "ARCH_08"

    case "-++":
      if (isDominant("A", vector)) return "ARCH_06"
      return "ARCH_07"

    case "-+-":
      if (isDominant("O", vector)) return "ARCH_11"
      return "ARCH_08"

    case "--+":
      if (isDominant("O", vector)) return "ARCH_02"
      return "ARCH_03"

    case "---":
      if (isDominant("O", vector)) return "ARCH_03"
      if (isDominant("A", vector)) return "ARCH_02"
      return "ARCH_12"

    default:
      return "ARCH_12"
  }
}

export function getFinalClassification(vector: QuizVector): FinalClassification {
  const archetypeId = getBaseArchetypeAtCheckpoint(vector)
  const amplitude = sumAmplitude(vector)

  switch (archetypeId) {
    case "ARCH_01": {
      if (isDominant("A", vector)) return { archetypeId, subTypeId: "01_A" }
      if (amplitude >= 20) return { archetypeId, subTypeId: "01_B" }
      if (isWeakest("E", vector)) return { archetypeId, subTypeId: "01_C" }
      return { archetypeId, subTypeId: "01_D" }
    }

    case "ARCH_02": {
      if (vector.E <= vector.A && vector.E < 0) return { archetypeId, subTypeId: "02_A" }
      if (isDominant("O", vector)) return { archetypeId, subTypeId: "02_B" }
      return { archetypeId, subTypeId: "02_C" }
    }

    case "ARCH_03": {
      if (vector.A > -2) return { archetypeId, subTypeId: "03_A" }
      if (vector.E <= -6 && vector.A <= -6) return { archetypeId, subTypeId: "03_B" }
      return { archetypeId, subTypeId: "03_C" }
    }

    case "ARCH_04": {
      if (amplitude <= 8 || vector.O >= -1) return { archetypeId, subTypeId: "04_A" }
      return { archetypeId, subTypeId: "04_B" }
    }

    case "ARCH_05": {
      if (isDominant("E", vector) || amplitude <= 9) return { archetypeId, subTypeId: "05_A" }
      if (isDominant("O", vector) && vector.O >= 5) return { archetypeId, subTypeId: "05_B" }
      return { archetypeId, subTypeId: "05_C" }
    }

    case "ARCH_06": {
      if (vector.A >= 5) return { archetypeId, subTypeId: "06_A" }
      return { archetypeId, subTypeId: "06_B" }
    }

    case "ARCH_07": {
      if (vector.O >= 4 || amplitude >= 16) return { archetypeId, subTypeId: "07_A" }
      return { archetypeId, subTypeId: "07_B" }
    }

    case "ARCH_08": {
      if (vector.A <= -5) return { archetypeId, subTypeId: "08_A" }
      if (vector.O >= 3) return { archetypeId, subTypeId: "08_B" }
      return { archetypeId, subTypeId: "08_C" }
    }

    case "ARCH_09": {
      if (isDominant("O", vector) || amplitude >= 18) return { archetypeId, subTypeId: "09_A" }
      return { archetypeId, subTypeId: "09_B" }
    }

    case "ARCH_10": {
      if (vector.A >= 4 && vector.E >= 2) return { archetypeId, subTypeId: "10_A" }
      return { archetypeId, subTypeId: "10_B" }
    }

    case "ARCH_11": {
      if (getSign(vector.O) === "positive" && amplitude >= 14) return { archetypeId, subTypeId: "11_A" }
      return { archetypeId, subTypeId: "11_B" }
    }

    case "ARCH_12": {
      if (amplitude <= 6 || (Math.abs(vector.E) <= 2 && Math.abs(vector.A) <= 2)) {
        return { archetypeId, subTypeId: "12_B" }
      }
      return { archetypeId, subTypeId: "12_A" }
    }

    default:
      return { archetypeId: "ARCH_12", subTypeId: "12_B" }
  }
}
