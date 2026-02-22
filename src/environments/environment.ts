import pkg from '../../package.json';

export const environment = {
    production: false,
    NAME: pkg.name,
    VERSION: pkg.version,
    BACKEND_URL: 'http://localhost:8080',
    MOCK_BACKEND: false
};