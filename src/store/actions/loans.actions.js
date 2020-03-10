export const LOANS = 'LOANS'

// Detail
export function loans(payload, setLoans) {
  return { type: LOANS, payload, setLoans }
}