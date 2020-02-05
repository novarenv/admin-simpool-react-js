export const SEARCH = 'SEARCH';
export const SEARCH_RESPONSE = 'SEARCH_RESPONSE';

export function search(payload, searchResponse) {
  return { type: SEARCH, payload, searchResponse };
}

export function searchResponse(payload) {
  return { type: SEARCH_RESPONSE, payload }
}