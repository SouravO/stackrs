// export const API = import.meta.env.VITE_API_URL || window.location.origin;

const url = window.location.href;
const { protocol, hostname } = new URL(url);

// export const API = `${protocol}//${hostname}:3000`;

// Production
export const API = `${protocol}//${hostname}`;
