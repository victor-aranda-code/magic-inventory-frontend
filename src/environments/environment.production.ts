import pkg from '../../package.json';

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    BACKEND_URL: '',
    MOCK_BACKEND: false
};

