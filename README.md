# Flickr Dashboard

Flickr Dashboard is a web application that integrates with the Flickr API to provide users with personalized photo management and viewing experiences. This project is designed with a modern tech stack and is built for scalability and ease of use.

## Features
- **User Authentication**: Secure login/logout functionality using Google Authentication.
- **Flickr API Integration**: Fetch and display user-specific photos and metadata.
- **Firebase Functions**: Ensures security and confidentiality of API keys, while also fetching data securely from Flickr.
- **Interest Rate Algorithm**: A custom algorithm calculates photo interest rates for better insights.
- **Customizable Settings**: User preferences for managing their Flickr account.
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## Prerequisites
Make sure you have the following tools installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Yarn](https://yarnpkg.com/) (preferred over npm)
- [Firebase CLI](https://firebase.google.com/docs/cli) for deploying backend functions

---

## Installation

Follow these steps to set up and run the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/flickr-dashboard.git
   cd flickr-dashboard
   ```

2. **Install Dependencies**:
   Navigate to both the frontend and functions directories and install dependencies:
   ```bash
   yarn install
   cd packages/frontend && yarn install
   cd ../functions && yarn install
   ```

3. **Environment Setup**:
   - Copy `.env.sample` to `.env` in the respective directories (`frontend` and `functions`).
   - Update the environment variables with your API keys and Firebase configuration.

4. **Run the Application**:
   - Start the frontend:
     ```bash
     cd packages/frontend
     yarn start
     ```
   - Deploy Firebase functions (optional for local testing):
     ```bash
     firebase deploy
     ```

---

## Project Structure

```plaintext
flickr-dashboard/
├── LICENSE            # Licensing information
├── README.md          # Documentation
├── firebase.json      # Firebase configuration
├── packages/          # Monorepo structure
│   ├── frontend/      # Frontend application
│   └── functions/     # Backend Firebase functions
├── tsconfig.json      # TypeScript configuration
└── yarn.lock          # Dependency lockfile
```

### Key Directories
- **`frontend`**: Contains all source code for the React.js frontend.
- **`functions`**: Houses the backend logic deployed as Firebase functions.

---

## How to Contribute

We welcome contributions! To get started:

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request on GitHub.

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

For questions or support, feel free to open an issue or reach out via the repository's discussion board.
