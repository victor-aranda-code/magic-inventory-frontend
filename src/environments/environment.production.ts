import pkg from '../../package.json';

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    BACKEND_URL: 'https://your-production-url.com',
    MOCK_BACKEND: false
};

