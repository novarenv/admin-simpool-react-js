export const CHANGE_DROPDOWN_LANGUAGE = 'CHANGE_DROPDOWN_LANGUAGE';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';

export function changeDropdownLanguage(name, lng) {
  return { type: CHANGE_DROPDOWN_LANGUAGE, name, lng };
}

export function changeLanguage(name, lng) {
  return { type: CHANGE_LANGUAGE, name, lng };
}