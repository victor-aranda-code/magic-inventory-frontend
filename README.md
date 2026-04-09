# ✨ Magic Inventory - Frontend

Magic Inventory is an AI-powered inventory management system designed for finding quickly items in your inventory. The frontend is built with **Angular 21** and **Angular Material**, providing a sleek, responsive, and modern user interface to manage your collections with ease.

---

## 🚀 Key Features

- **Multimodal AI Search**: Find items using text descriptions or by uploading images.
- **Item Management**: Full CRUD (Create, Read, Update, Delete) operations for your inventory.
- **Secure Authentication**: Integrated with JWT-based authentication to keep your magic collection safe.
- **User Management**: Administrative tools to manage platform users.
- **Modern UI/UX**: Clean design using Angular Material components and responsive layouts.

---

## 🛠️ Technology Stack

- **Framework**: [Angular 21](https://angular.dev/)
- **UI Components**: [Angular Material](https://material.angular.io/)
- **Icons**: [Material Design Icons](https://fonts.google.com/icons)
- **State Management**: RxJS
- **Authentication**: @auth0/angular-jwt
- **Server**: Nginx (Dockerized)

---

## 🏃 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/) (v11 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd magic-inventory-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the following command to start a local development server:
```bash
npm start
```
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

---

## 🐳 Docker and Deployment

### Docker Build

To build the project into a production-ready Docker image:

```bash
docker build -t magic-inventory-frontend .
```


### Kubernetes Deployment

This project includes a `deployment.yml` for deploying to **Azure Kubernetes Service (AKS)**. It uses `Nginx` to serve the static files and proxies requests starting with `/api` to the backend service.

---

## 🤖 CI/CD with GitHub Actions

This project uses GitHub Actions to automate testing, building, and deployment:

- **Angular CI**: Runs on every pull request to the `develop` branch. It ensures the application builds correctly in a development environment.
- **Build, Tag & Push**: Triggered on any push or pull request to the `main` branch. This workflow:
  - Generates versioning based on `package.json`.
  - Injects build metadata (version and timestamp) into the `index.html`.
  - Builds and tags the Docker image.
  - Pushes the image to the **GitHub Container Registry (GHCR)**.
- **Manual Deployment**: A `workflow_dispatch` action that allows developers to manually trigger a deployment of the latest frontend and backend images to the **Azure Kubernetes Service (AKS)** cluster.

---

## ⚙️ Configuration

The project uses Nginx templates for environment variable substitution.

- **`BACKEND_URL`**: The URL of the magic-inventory-backend service (required by Nginx proxy). You can find the backend repository here: https://github.com/victor-aranda-code/magic-inventory-backend

In production, these are managed via Kubernetes ConfigMaps/Secrets and the Azure Key Vault CSI driver.

---

## 🧪 Testing

Execute the unit tests using Vitest:

```bash
npm test
```

---

## 📂 Project Structure

- `src/app/authentication`: Login and registration components.
- `src/app/items`: Core inventory components (listing, details, search).
- `src/app/manage-users`: Admin dashboard for user management.
- `src/app/services`: HTTP and authentication services.
- `nginx.conf`: Nginx configuration with API proxying.
- `Dockerfile`: Multi-stage build for optimized production images.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📝 Notes

- This project has been generated partially with generative AI.