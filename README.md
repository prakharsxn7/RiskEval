# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Risk-Eval

## Large Files Note

The application expects a `software.zip` file in the `backend/files/` directory for the software download feature to work. Due to GitHub file size limitations, this file is not included in the repository.

### Setting up the software.zip file

When you clone this repository, you'll need to:

1. Make sure the `backend/files/` directory exists
2. Add your software package as `software.zip` in that directory

For development/testing, you can create a dummy file:

```bash
# Create files directory if it doesn't exist
mkdir -p backend/files

# Create a simple test zip file (replace with your actual software)
zip -r backend/files/software.zip some_files_to_include
```

## Getting Started
