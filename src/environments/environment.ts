import pkg from '../../package.json';

export const environment = {
    production: false,
    NAME: pkg.name,
    VERSION: pkg.version,
    BACKEND_URL: '',
    MOCK_BACKEND: false
};