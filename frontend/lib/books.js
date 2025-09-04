import { http } from "./http";

/**
 * @typedef {Object} Book
 * @property {string} id
 * @property {string} title
 * @property {string} author
 * @property {string} isbn
 * @property {string} publicationDate
 */

/**
 * @typedef {Object} BookRequest
 * @property {string} title
 * @property {string} author
 * @property {string} isbn
 * @property {string} publicationDate
 */

const ROOT = "/books";

export async function listBooks() {
  const { data } = await http.get(ROOT);
  return data;
}

export async function getBook(id) {
  const { data } = await http.get(`${ROOT}/${id}`);
  return data;
}

export async function createBook(payload /* BookRequest */) {
  const { data } = await http.post(ROOT, payload);
  return data;
}

export async function updateBook(id, payload) {
  const { data } = await http.put(`${ROOT}/${id}`, payload);
  return data;
}

export async function deleteBook(id) {
  const { data } = await http.delete(`${ROOT}/${id}`);
  return data;
}
