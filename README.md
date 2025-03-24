
# Gitdocs.ai - AI-Powered Documentation for GitHub Repositories

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vercel Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_GITHUB_USERNAME%2FGitdocs.ai)
<!-- Replace YOUR_GITHUB_USERNAME with your actual GitHub username -->

[![Gitdocs.ai Demo](https://img.shields.io/badge/Demo-Watch%20Now-brightgreen)](https://www.example.com/gitdocs-demo) <!-- Replace with your actual demo link -->

## Project Overview

Gitdocs.ai is a SaaS platform that revolutionizes documentation for GitHub repositories. Say goodbye to outdated or missing READMEs! Our AI-powered engine automatically generates comprehensive, professional-grade documentation directly from your codebase. We leverage advanced AI models (Gemini, ChatGPT, DeepSeek) to analyze your repository's structure, code, and comments, creating a well-structured README tailored to your project's specific needs.

**Our Value Proposition:** Save valuable time and effort, ensure your projects are easily understood, attract contributors, and impress potential investors with well-maintained, AI-generated documentation.

## Key Features

| Feature                     | Description                                                                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **AI-Powered Generation**   | Automatically generates high-quality READMEs using advanced AI models like Gemini, ChatGPT, and DeepSeek.                                     |
| **GitHub Integration**          | Seamlessly connect to your GitHub repositories for direct code analysis and documentation updates.                                            |
| **Direct Commit**               | Commit generated READMEs directly to your repository with a single click, streamlining your workflow.                                         |
| **Contextual Analysis**     |  Leverages specific files from your repository to provide deeper context for the AI, improving README accuracy.                                 |
| **Customizable Templates**      | Choose from a variety of pre-designed templates or create your own to match your project's style and branding.                               |
| **Real-time Preview**           | Preview the generated README in real-time before committing changes, ensuring accuracy and satisfaction.                                        |
| **Clerk Authentication**        | Secure user authentication and authorization managed by Clerk, ensuring the safety of your account and data.                                  |
| **Razorpay Integration**        | Secure and reliable payment processing via Razorpay for seamless subscription management.                                                      |
| **Token Usage Tracking**        | Monitor your token consumption for cost-effective utilization of AI resources.                                                                |
| **API Protection**              | Robust API security measures, including rate limiting and authentication, to prevent abuse and ensure platform stability.                     |

## Onboarding Guide

Follow these simple steps to get started with Gitdocs.ai:

1.  **Sign Up:** Create a free account at [https://www.gitdocs.ai](https://www.gitdocs.ai).
2.  **Connect to GitHub:**
    *   Click the "Connect to GitHub" button.
    *   Authorize Gitdocs.ai to access your repositories (you can choose specific repositories).
    *   Follow the on-screen instructions to complete the integration.
3.  **Select a Repository:** Choose the repository you want to document from your connected GitHub account.
4.  **Configure Generation (Optional):**
    *   Select an AI model (Gemini, ChatGPT, DeepSeek).
    *   Choose a README template or upload your own custom template.
    *   Specify context files for more accurate README generation.
5.  **Generate README:** Click the "Generate README" button.
6.  **Review and Edit:** Carefully review the generated README in the real-time preview editor. Make any necessary edits or adjustments.
7.  **Commit to GitHub:** Commit the changes directly to your repository with a single click.

| Software                | Version       | Installation Instructions                                                                                                                                                                                                                                                                                               |
| ----------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js                 | v18+          | [Node.js Installation](https://nodejs.org/)                                                                                                                                                                                                                                                                              |
| npm/yarn/pnpm           | v8+/1.22+/v7+ | npm comes with Node.js.  [Yarn Installation](https://yarnpkg.com/). [pnpm Installation](https://pnpm.io/)                                                                                                                                                                                                                   |
| MongoDB                 | Any           | Ensure you have a MongoDB instance running or a MongoDB Atlas account.  [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)                                                                                                                                                                                              |
| Clerk Account           | Any           | Create a Clerk account for user authentication.  [Clerk Sign Up](https://clerk.com/)                                                                                                                                                                                                                                   |
| Vercel CLI (optional)   | Any           | For deploying to Vercel.  [Vercel CLI](https://vercel.com/docs/cli)                                                                                                                                                                                                                                                       |
| GitHub OAuth App        | Any           | Create a GitHub OAuth app with appropriate permissions and a callback URL matching your Gitdocs.ai instance.  Detailed instructions are available in our [GitHub OAuth Setup Guide](https://www.gitdocs.ai/docs/github-oauth)                                                                                             |

## Installation

bash
git clone https://github.com/YOUR_GITHUB_USERNAME/Gitdocs.ai.git
cd Gitdocs.ai
Gitdocs.ai utilizes environment variables for configuration. Create a `.env.local` file in the root directory and populate it with the following variables:

| Variable                    | Description                                                                                                                                                                                                                         | Example                                                                                                                                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OPENAI_API_KEY`            | API key for OpenAI models like ChatGPT.  Required if using ChatGPT for README generation.                                                                                                                                             | `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                                                                                    |
| `GEMINI_API_KEY`            | API key for Google Gemini.  Required if using Gemini for README generation.                                                                                                                                                           | `AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                                                                                                   |
| `KLUSTER_API_KEY`           | API key for Kluster AI. Required if using Kluster AI.                                                                                                                                                                              | `k-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                                                                                    |
| `MONGODB_URI`               | Connection string for your MongoDB database.  Must point to a valid MongoDB instance.                                                                                                                                                 | `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`                                                                                                         |
| `CLERK_PUBLISHABLE_KEY`     | Clerk publishable key for user authentication.  Obtained from your Clerk dashboard.                                                                                                                                                 | `pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                                                                    |
| `CLERK_SECRET_KEY`          | Clerk secret key for user authentication.  Treat this as a confidential secret.  Obtained from your Clerk dashboard.                                                                                                                   | `sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                                                                    |
| `GITHUB_CLIENT_ID`          | GitHub OAuth App Client ID.  Configured in your GitHub OAuth application settings.                                                                                                                                                  | `xxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                                                                                                        |
| `GITHUB_CLIENT_SECRET`      | GitHub OAuth App Client Secret. Treat this as a confidential secret.  Configured in your GitHub OAuth application settings.                                                                                                           | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                                                                                    |
| `NEXTAUTH_SECRET`           | Secret used to encrypt the NextAuth.js JWT.  Should be a long, random string.  Generate a new one for each deployment.                                                                                                                | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                                                                                    |
| `GITHUB_APP_ID`             | GitHub App ID (for Octokit authentication).  Found in your GitHub App settings.                                                                                                                                                     | `xxxxxxxx`                                                                                                                                                                                                  |
| `GITHUB_PRIVATE_KEY`        | GitHub App Private Key (for Octokit authentication).  Be sure to replace `\n` with actual newline characters.                                                                                                                       | `-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n`                                                                                                                                   |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID for processing payments.                                                                                                                                                                                          | `rzp_test_xxxxxxxxxxxxxxxx`                                                                                                                                                                             |
| `RAZORPAY_KEY_SECRET`        | Razorpay Key Secret.  Treat this as a confidential secret.                                                                                                                                                                          | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                                                                                                                                                        |

> **Important:** Never commit your `.env.local` file to your repository!  Use environment variables or a secrets management system for sensitive information in production.

## API Documentation

Gitdocs.ai provides a RESTful API for programmatic access to its core features.

### Authentication


Authorization: Bearer <YOUR_CLERK_JWT>
#### `POST /api/generate-readme`

*   **Description:** Generates a README for a specified GitHub repository.
*   **Authentication:** Requires a valid Clerk JWT.
*   **Parameters:**

    *   `repo` (string, required): The full name of the GitHub repository (e.g., "username/repo-name").
    *   `model` (string, optional): The AI model to use for generation (e.g., "gemini", "chatgpt", "deepseek"). If not provided, the default model will be used.
    *   `selectedFiles` (array, optional): An array of file paths to be used as context for README generation.
*   **Request Body:**

    *   **Success (200 OK):** Returns a stream of data containing the generated README content.  The response is chunked and encoded as `text/plain`.  Parse the stream to reconstruct the full README content.
    *   **Error (400 Bad Request):**  Indicates an invalid request, such as missing parameters.
    *   **Error (401 Unauthorized):**  Indicates an invalid or missing Clerk JWT.
    *   **Error (404 Not Found):**  Indicates that the specified repository could not be found.
    *   **Error (500 Internal Server Error):**  Indicates a server-side error during README generation.

*   **Example Success Response (Stream):**

text
    
    # My Awesome Project

    This project does amazing things...

    <<conclusion>>
    -   Added a basic project description.
    -   Suggested adding installation instructions.
    <<end>>
    *   **Description:** Analyzes the given list of files to prepare prompts for new README or enhance existing one.
*   **Authentication:** Requires a valid Clerk JWT.
*   **Parameters:**

    *   `userId` (string, required): The clerk userId.
    *   `prompt` (string, required): The list of files from the repository.
    *   `doc_name` (string, required): The full name of the GitHub repository (e.g., "username/repo-name").
*   **Request Body:**

json
{
  "userId": "user_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "prompt": "src/index.js, README.md",
  "doc_name": "your-username/your-repo"
}
    *   **Success (200 OK):** Returns a JSON containing the AI analysis data for further README generation.
    *   **Error (400 Bad Request):**  Indicates an invalid request, such as missing parameters.
    *   **Error (401 Unauthorized):**  Indicates an invalid or missing Clerk JWT.
    *   **Error (404 Not Found):**  Indicates that the specified repository could not be found.
    *   **Error (500 Internal Server Error):**  Indicates a server-side error during analysis.

*   **Example Success Response:**

| Plan        | Price   | Features                                                                                                                                                                                |
| ----------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Free**    | $0/month | Limited README generations, basic AI model access, standard support.                                                                                                                   |
| **Pro**     | $9/month | Unlimited README generations, access to all AI models, priority support, customizable templates.                                                                                            |
| **Enterprise**| $19/month| All Pro features, team collaboration, dedicated support, custom integrations, higher API rate limits.                                                                                                    |

>  *Visit our [Pricing Page](https://www.gitdocs.ai/pricing) for the most up-to-date pricing information and a detailed feature comparison.*

### Payment Options

We utilize Razorpay to ensure secure and reliable payment processing. We accept all major credit cards and debit cards.

### Managing Your Subscription

You can manage your subscription, update your payment information, and view your billing history from your account dashboard at [https://www.gitdocs.ai/dashboard](https://www.gitdocs.ai/dashboard).

## Troubleshooting

| Error                               | Solution                                                                                                                                                                                                                         |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Failed to connect to GitHub"       | Ensure your GitHub credentials (Client ID and Secret) are correctly configured in the `.env.local` file. Verify that the callback URL in your GitHub OAuth app settings matches the URL of your Gitdocs.ai instance. |
| "AI model API key invalid"          | Double-check that your API keys for the AI models (Gemini, ChatGPT, DeepSeek) are valid and correctly entered in the `.env.local` file.                                                                                             |
| "Rate limit exceeded"               | Wait for the rate limit to reset before making further requests. Consider upgrading your subscription for higher rate limits.                                                                                                         |
| "MongoDB connection error"          | Verify that your MongoDB connection string is correct and that your MongoDB instance is running and accessible.                                                                                                                      |
| "Cannot find module" errors        | Ensure all dependencies are installed correctly by running `npm install` (or `yarn install` or `pnpm install`). If the issue persists, try deleting `node_modules` and reinstalling.                                                |
| "Clerk Authentication Failed"       | Ensure that the Clerk publishable and secret keys are configured correctly in your `.env.local` file. Also, verify the callback URL in your Clerk settings.                                                                       |
| "Razorpay Payment Failed"          |  Check your Razorpay account for any issues. Ensure the Razorpay key ID and secret are correct in your `.env.local` file. Contact Razorpay support for assistance.                                                                   |

## Performance Considerations

*   **AI Model Selection:** Different AI models offer varying performance characteristics. Consider the trade-offs between generation speed and output quality.
*   **Caching:** Implement caching strategies to store frequently accessed data and minimize load on the database and AI APIs.
*   **Database Optimization:** Optimize your MongoDB queries and indexes to improve data retrieval performance.
*   **Image Optimization:** Optimize images in your READMEs to reduce file size and enhance loading times.
*   **Token Usage:** Be aware of token limits imposed by AI models, particularly during periods of high usage. Monitor your token consumption and adjust your generation settings accordingly.

## Security Notes

Gitdocs.ai prioritizes the security and privacy of your data. We implement the following security measures:

*   **Data Encryption:** All data is encrypted both in transit (using HTTPS) and at rest.
*   **Environment Variables:** Sensitive information, such as API keys and database credentials, are stored securely as environment variables and never committed to the repository.
*   **API Authentication:** Robust authentication and authorization mechanisms protect our API endpoints, ensuring that only authorized users can access your data.
*   **Rate Limiting:** Rate limits are enforced to prevent abuse and denial-of-service attacks.
*   **Input Validation:** Rigorous input validation helps prevent injection attacks and other security vulnerabilities.
*   **Regular Security Audits:** We conduct regular security audits to identify and address potential vulnerabilities proactively.
*   **Clerk Integration:** We leverage Clerk for secure user authentication and session management.
*   **Razorpay Integration:** We utilize Razorpay for secure payment processing, ensuring the safety of your financial information.

> *For more information about our security practices, please visit our [Security Page](https://www.gitdocs.ai/security).*

## Roadmap

*   **Expanded AI Model Support:** Integrate more AI models to provide users with a wider range of options.
*   **Advanced Template Customization:** Enable users to create more sophisticated and flexible README templates.
*   **Enhanced Code Analysis:** Improve the AI's ability to analyze code and generate more accurate and comprehensive READMEs.
*   **Integration with Documentation Tools:** Integrate with other popular documentation tools, such as Sphinx and Docusaurus.
*   **Multi-Language Support:** Offer README generation in multiple languages to cater to a global audience.
*   **Team Collaboration Features:** Introduce features that allow multiple users to collaborate on README generation and editing.
*   **AI-Powered Code Commenting:** Generate code comments using AI, furthering the project documentation.

## Contributing Guidelines

We welcome contributions to Gitdocs.ai! Please follow these guidelines:

1.  **Fork the repository:** Fork the Gitdocs.ai repository to your GitHub account.
2.  **Create a branch:** Create a new branch for your feature or bug fix.
3.  **Make your changes:** Make your changes and commit them with clear and concise commit messages.
4.  **Test your changes:** Test your changes thoroughly.
5.  **Submit a pull request:** Submit a pull request to the main branch of the Gitdocs.ai repository.

Please ensure your code adheres to the existing coding style and includes appropriate unit tests.

## License Information

This project is licensed under the [MIT License](LICENSE).

## Contact/Support Details

For questions, bug reports, or feature requests, please contact us at:

