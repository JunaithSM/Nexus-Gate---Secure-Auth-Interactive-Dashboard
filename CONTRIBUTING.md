# Contributing to Nexus Gate

Thank you for your interest in contributing to Nexus Gate! We welcome contributions from everyone.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and inclusive.

## How to Contribute

### Reporting Bugs

1.  **Check existing issues** to see if the bug has already been reported.
2.  **Open a new issue** if it hasn't. Please include:
    *   A clear title and description.
    *   Steps to reproduce the bug.
    *   Expected vs. actual behavior.
    *   Environment details (OS, Node version, browser).

### Suggesting Enhancements

1.  **Open a new issue** describing the enhancement.
2.  Explain *why* this enhancement would be useful.

### Pull Requests

1.  **Fork the repository** and create your branch from `main`.
2.  **Install dependencies**:
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```
3.  **Make your changes**. Ensure your code follows the existing style.
4.  **Test your changes**:
    *   Ensure all API endpoints work.
    *   Verify the frontend authentication flow.
5.  **Submit a Pull Request**:
    *   Provide a clear description of your changes.
    *   Link to any relevant issues.

## Development Setup

1.  Follow the **Installation** guide in the `README.md`.
2.  Ensure you have PostgreSQL and Redis running.
3.  Create `.env` files in both `backend` and `frontend` directories using `.env.example`.

## Project Structure

*   `backend/`: Node.js/Express API
*   `frontend/`: React frontend
*   `migrations/`: Database schema changes

Thank you for contributing!
