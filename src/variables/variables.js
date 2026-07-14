const url = window.location.href;
const { protocol, hostname } = new URL(url);

// export const API = `${protocol}//${hostname}:3000`;

// Production
export const API = `${protocol}//${hostname}`;