
# Gitdocs.ai

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vercel Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_GITHUB_USERNAME%2FGitdocs.ai)
<!-- Replace YOUR_GITHUB_USERNAME with your actual GitHub username -->

## Project Overview

Gitdocs.ai is a SaaS platform designed to streamline documentation creation for GitHub repositories. It addresses the common problem of outdated or missing READMEs by automatically generating comprehensive and professional documentation directly from your codebase. Leveraging advanced AI models (Gemini, ChatGPT, DeepSeek), Gitdocs.ai analyzes your repository's contents and creates a well-structured README tailored to your project's specific purpose and functionality. Our value proposition is simple: **Save time and effort while ensuring your projects are well-documented and easily understood by collaborators and users.**

## Key Features

| Feature                     | Description                                                                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| AI-Powered README Generation | Automatically generates READMEs from your codebase using advanced AI models.                                                                  |
| GitHub Integration          | Seamlessly connect to your GitHub repositories for direct access and analysis of your code.                                                     |
| Direct Commit               | Commit generated READMEs directly to your repository with a single click.                                                                      |
| User Authentication         | Secure user accounts managed with Clerk.                                                                                                       |
| Payment Gateway             | Integrated payment processing for subscription management.                                                                                      |
| API Protection              | Robust API security measures, including rate limiting, to prevent abuse.                                                                      |
| Customizable Templates      | Choose from a variety of README templates or create your own.                                                                                  |
| Real-time Preview           | Preview the generated README before committing it to your repository.                                                                           |
| Contextual File Analysis    | Leverages specific files from your repository to improve README generation.                                                                    |
| Token Usage Tracking        | Keeps track of your token usage for cost management.                                                                                             |

## Visual Demo

> *Add screenshots or GIFs showcasing the main features of Gitdocs.ai here.*
> *For example, show the process of connecting to a GitHub repo, generating a README, and committing it.*

## Prerequisites

Before you begin, ensure you have the following installed:

| Software                | Version  | Installation Instructions                                                                   |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------- |
| Node.js                 | v18+     | [Node.js Installation](https://nodejs.org/)                                                |
| npm/yarn/pnpm           | v8+/1.22+/v7+ | npm comes with Node.js. [Yarn Installation](https://yarnpkg.com/). [pnpm Installation](https://pnpm.io/) |
| MongoDB                 | Any      | Ensure you have a MongoDB instance running or a MongoDB Atlas account.                      |
| Clerk Account           | Any      | Create a Clerk account for user authentication.                                             |
| Vercel CLI (optional)   | Any      | For deploying to Vercel.                                                                    |
| GitHub OAuth App        | Any      | Create a GitHub OAuth app with appropriate permissions and a callback URL matching your instance. |

## Installation

Follow these steps to set up Gitdocs.ai locally:

1. **Clone the repository:**

2. **Install dependencies:**

bash
   npm install # or yarn install or pnpm install
   3. **Run the development server:**

4. **Open your browser:**

   Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Configuration

Gitdocs.ai provides several configurable options through environment variables. Create a `.env.local` file in the root directory and add the following variables:

| Variable                    | Description                                                                                                                                    | Example                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `OPENAI_API_KEY`          | API key for OpenAI models like ChatGPT.                                                                                                       | `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                 |
| `GEMINI_API_KEY`          | API key for Google Gemini.                                                                                                                      | `AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                                |
| `KLUSTER_API_KEY`         | API key for Kluster AI.                                                                                                                       | `k-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                 |
| `MONGODB_URI`               | Connection string for your MongoDB database.                                                                                                  | `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`                                 |
| `CLERK_PUBLISHABLE_KEY`     | Clerk publishable key for user authentication.                                                                                                | `pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                            |
| `CLERK_SECRET_KEY`          | Clerk secret key for user authentication.                                                                                                     | `sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                            |
| `GITHUB_CLIENT_ID`          | GitHub OAuth App Client ID.                                                                                                                  | `xxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                                       |
| `GITHUB_CLIENT_SECRET`      | GitHub OAuth App Client Secret.                                                                                                              | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                 |
| `NEXTAUTH_SECRET`          | Secret used to encrypt the NextAuth.js JWT. Should be a random string.                                                                           | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                 |
| `GITHUB_APP_ID`      | GitHub App ID (for Octokit authentication).                                                                                                             | `xxxxxxxx`                                                                                                                |
| `GITHUB_PRIVATE_KEY`      | GitHub App Private Key (for Octokit authentication). Be sure to replace `\n` with actual newlines.                                                                                                             | `-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n`                                                                                                                |

## Usage

### Basic Usage

1. **Sign up/Log in:** Create an account or log in using Clerk authentication.
2. **Connect to GitHub:** Connect your GitHub account to Gitdocs.ai.
3. **Select a Repository:** Choose the repository you want to generate a README for.
4. **Generate README:** Click the "Generate README" button.
5. **Review and Edit:** Review the generated README and make any necessary edits.
6. **Commit to GitHub:** Commit the generated README directly to your repository.

### Advanced Usage

* **Custom Templates:** Create and use custom README templates to tailor the generated documentation to your specific needs.
* **AI Model Selection:** Select a specific AI model (if multiple are configured) for README generation.
* **Contextual File Selection:** Choose specific files from your repository to provide context to the AI model during README generation.

## API Documentation

### `POST /api/generate-readme`

json
    {
      "readmeContent": "The generated README content (Markdown format)."
    }
    ## Troubleshooting

| Error                               | Solution                                                                                                                                                                                |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Failed to connect to GitHub"       | Ensure your GitHub credentials (Client ID and Secret) are correctly configured in the `.env.local` file. Verify the callback URL in your GitHub OAuth app settings matches your instance. |
| "AI model API key invalid"          | Double-check that your API keys for the AI models (Gemini, ChatGPT, DeepSeek) are valid and correctly entered in the `.env.local` file.                                               |
| "Rate limit exceeded"               | Wait for the rate limit to reset before making further requests. Consider upgrading your subscription for higher rate limits.                                                              |
| "MongoDB connection error"          | Verify that your MongoDB connection string is correct and that your MongoDB instance is running and accessible.                                                                           |
| "Cannot find module" errors        | Ensure all dependencies are installed correctly by running `npm install` (or `yarn install` or `pnpm install`). If the issue persists, try deleting `node_modules` and reinstalling.    |

## Performance Considerations

* **AI Model Selection:** Different AI models have different performance characteristics. Consider the trade-offs between generation speed and quality when selecting an AI model.
* **Caching:** Implement caching mechanisms to store frequently accessed data and reduce the load on the database and AI APIs.
* **Database Optimization:** Optimize your MongoDB queries and indexes for faster data retrieval.
* **Image Optimization:** Optimize images in your READMEs to reduce file size and improve loading times.
* **Token Usage:** Be mindful of token limits for AI models, especially during high-volume usage.

## Security Notes

* **Environment Variables:** Never commit your `.env.local` file to your repository. Use environment variables or a secrets management system for sensitive information.
* **API Authentication:** Implement robust authentication and authorization mechanisms for your API endpoints.
* **Rate Limiting:** Enforce rate limits to prevent abuse and denial-of-service attacks.
* **Input Validation:** Validate all user inputs to prevent injection attacks.
* **Regular Security Audits:** Conduct regular security audits to identify and address potential vulnerabilities.

## Roadmap

* **Support for more AI models:** Integrate additional AI models to provide users with more choices.
* **Improved template customization:** Allow users to create more complex and flexible README templates.
* **More detailed code analysis:** Enhance the AI's ability to analyze code and generate more accurate and comprehensive READMEs.
* **Integration with other documentation tools:** Integrate with other documentation tools, such as Sphinx and Docusaurus.
* **Support for multiple languages:** Offer README generation in multiple languages.
* **Team collaboration features:** Allow multiple users to collaborate on README generation and editing.

## Contributing Guidelines

We welcome contributions to Gitdocs.ai! Please follow these guidelines:

1. **Fork the repository:** Fork the Gitdocs.ai repository to your GitHub account.
2. **Create a branch:** Create a new branch for your feature or bug fix.
3. **Make your changes:** Make your changes and commit them with clear and concise commit messages.
4. **Test your changes:** Test your changes thoroughly.
5. **Submit a pull request:** Submit a pull request to the main branch of the Gitdocs.ai repository.

Please ensure your code follows the existing coding style and includes appropriate unit tests.

## License Information

This project is licensed under the [MIT License](LICENSE).

## Contact/Support Details

For questions, bug reports, or feature requests, please contact us at:

* **Email:** abhas.kumar@gitdocs.space
* **GitHub Issues:** [https://github.com/YOUR_GITHUB_USERNAME/Gitdocs.ai/issues](https://github.com/YOUR_GITHUB_USERNAME/Gitdocs.ai/issues)

> *Replace `YOUR_GITHUB_USERNAME` with your GitHub username.*
