export const readmeSections = [
    {
      item: "Title and description",
      usage: "# Project Title\n\nA brief description of what this project does and who it's for",
      description: "This section is the title and description of the project. It is the first section of the readme file. It is the title of the project and a brief description of what it does and who it's for.",
      emoji: "📄",
      useCases: ["project", "portfolio"],
    },
    {
      item: "Acknowledgements",
      usage: "## Acknowledgements\n\n- [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)",
      description: "This section is the acknowledgements section of the project. It is the section that acknowledges the people who helped you create this project.",
      emoji: "🙏",
      useCases: ["project"],
    },
    {
      item: "API Reference",
      usage: "## API Reference\n\n#### Get all items\n\n```http\n  GET /api/items\n```\n\n| Parameter | Type     | Description                |\n| :-------- | :------- | :------------------------- |\n| `api_key` | `string` | **Required**. Your API key |",
      description: "This section is the API reference section of the project. It is the section that provides a reference to the API of the project.",
      emoji: "📄",
      useCases: ["project", "library"],
    },
    {
      item: "Appendix",
      usage: "## Appendix\n\n- [Appendix](https://example.com/appendix)",
      description: "This section is the appendix section of the project. It is the section that provides additional information about the project.",
      emoji: "📄",
      useCases: ["project"],
    },
    {
      item: "Authors",
      usage: "## Authors\n\n- [Author Name](https://example.com/author)",
      description: "This section is the authors section of the project. It is the section that provides the authors of the project.",
      emoji: "📄",
      useCases: ["project", "portfolio"],
    },
    {
      item: "Badges",
      usage: `## Badges 📄\n\n- [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)\n- [![GitHub Stars](https://img.shields.io/github/stars/username/repository.svg)](https://github.com/username/repository/stargazers)\n- [![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://example.com/build-status)\n`,
      description: "This section provides badges related to the project, such as licenses, build status, or GitHub stats. Add badges from resources like: [shields.io](https://shields.io/).",
      emoji: "🏅",
      useCases: ["project", "library"],
    },    
    {
      item: "Color Reference",
      usage: "## Color Reference\n\n| Color | Hex | RGB |\n| :---- | :---- | :---- |\n| Primary | #000000 | 0, 0, 0 |\n| Secondary | #FFFFFF | 255, 255, 255 |",
      description: "This section is the color reference section of the project. It is the section that provides the color reference of the project.",
      emoji: "🎨",
      useCases: ["project"],
    },
    {
      item: "Contributing",
      usage: "## Contributing\n\n- [Contributing](https://example.com/contributing) Contributions are always welcome! See `contributing.md` for ways to get started.",
      description: "This section is the contributing section of the project. It is the section that provides the contributing guidelines of the project.",
      emoji: "🤝",
      useCases: ["project", "library"],
    },
    {
      item: "Demo",
      usage: "## Demo\n\n- [Demo](https://example.com/demo) Insert gif or link to demo",
      description: "This section is the demo section of the project. It is the section that provides the demo of the project.",
      emoji: "🎥",
      useCases: ["project", "portfolio"],
    },
    {
      item: "Deployment",
      usage: "## Deployment\n\n- [Deployment](https://example.com/deployment) Insert steps to deploy the project like",
      description: "This section is the deployment section of the project. It is the section that provides the deployment instructions of the project.",
      emoji: "🚀",
      useCases: ["project"],
    },
    {
      item: "Documentation",
      usage: "## Documentation\n\n- [Documentation](https://example.com/documentation) Insert steps to document the project like",
      description: "This section is the documentation section of the project. It is the section that provides the documentation of the project.",
      emoji: "📚",
      useCases: ["project", "library"],
    },
    {
      item: "Environment Variables",
      usage: "## Environment Variables\n\nTo run this project, you will need to add the following environment variables to your .env file `API_KEY=your_api_key`",
      description: "This section is the environment variables section of the project. It is the section that provides the environment variables of the project.",
      emoji: "🔑",
      useCases: ["project"],
    },
    {
      item: "FAQ",
      usage: "## FAQ\n\n#### What is this project?",
      description: "This section is the FAQ section of the project. It is the section that provides the FAQ of the project.",
      emoji: "❓",
      useCases: ["project", "portfolio"],
    },
    {
      item: "Features",
      usage: "## Features\n\n- Feature 1\n- Feature 2",
      description: "This section is the features section of the project. It is the section that provides the features of the project.",
      emoji: "✨",
      useCases: ["project", "portfolio"],
    },
    {
      item: "Installation",
      usage: `
    ## Installation 💻
    
    1. Clone the repository:
       \`\`\`bash
       git clone <repository_url>
       \`\`\`
    
    2. Navigate to the project directory:
       \`\`\`bash
       cd Semester-Management-Web
       \`\`\`
    
    3. Install dependencies:
       \`\`\`bash
       pip install -r requirements.txt  # For Python dependencies
       # or
       npm install  # For Node.js dependencies
       # or
       yarn install # If you're using Yarn
       \`\`\`
    
    4. Set up the database (if necessary):
       Provide specific instructions here, such as:
       \`\`\`bash
       python manage.py migrate
       \`\`\` 
       or
       \`\`\`bash
       npm run setup-db
       \`\`\`
    
    5. Start the application:
       \`\`\`bash
       npm run start  # For Node.js-based applications
       # or
       python app.py  # For Python-based applications
       \`\`\`
      `,
      description: "This section provides installation instructions for setting up and running the project locally.",
      emoji: "📦",
      useCases: ["project"],
    },    
    {
      item: "Github Profile - About Me",
      usage: "## About Me\n\n- I'm a Fullstack Developer with a passion for building scalable and efficient web applications.",
      description: "This section is the about me section of the project. It is the section that provides the about me of the project.",
      emoji: "👤",
      useCases: ["portfolio"],
    },
    {
      item: "Usage/Examples",
      usage: `
    ## Usage/Examples ✨
    
    Here's an example of how to use this project or its components:
    
    1. Import the component:
       \`\`\`javascript
       import Component from 'my-project';
       \`\`\`
    
    2. Use it in your app:
       \`\`\`javascript
       function App() {
         return <Component />;
       }
       \`\`\`
    
    3. Customize or extend the component as needed:
       \`\`\`javascript
       function CustomApp() {
         return (
           <Component 
             prop1="value1" 
             prop2="value2" 
           />
         );
       }
       \`\`\`
      `,
      description: "This section provides examples and usage instructions for integrating the project's components or features.",
      emoji: "✨",
      useCases: ["project", "component", "example"],
    },   
    {
      item: "License",
      usage: `
    ## License 📝
    
    This project is licensed under the MIT License - see the [LICENSE.md](https://example.com/license) file for details.
      `,
      description: "This section provides information about the license of the project.",
      emoji: "📝",
      useCases: ["project", "library"],
    },
    {
      item: "Roadmap",
      usage: `
    ## Roadmap 🗺️
    
    - [x] Feature 1: Add authentication
    - [ ] Feature 2: Create user profile management
    - [ ] Feature 3: Add multi-language support
    
    See the [open issues](https://example.com/issues) for a full list of proposed features (and known issues).
      `,
      description: "This section outlines the project's planned features and updates.",
      emoji: "🗺️",
      useCases: ["project"],
    },
    {
      item: "Table of Contents",
      usage: `
    ## Table of Contents 📚
    
    - [Introduction](#project-title)
    - [Features](#features)
    - [Installation](#installation)
    - [Usage](#usageexamples)
    - [API Reference](#api-reference)
    - [Contributing](#contributing)
    - [License](#license)
      `,
      description: "This section provides an organized overview of the document's contents, making it easy to navigate.",
      emoji: "📚",
      useCases: ["project", "portfolio"],
    },
    {
      item: "Changelog",
      usage: `
    ## Changelog 📜
    
    ### v1.0.0
    - Initial release with core features
      - Authentication
      - Basic CRUD operations
    
    ### v1.1.0
    - Added new feature: file uploads
    - Fixed issue #42
      `,
      description: "This section documents the project's changes, including new features, fixes, and updates.",
      emoji: "📜",
      useCases: ["project"],
    },
    {
      item: "Support",
      usage: `
    ## Support 🤝
    
    If you encounter any issues or have questions, please feel free to:
    - Create an issue on [GitHub Issues](https://example.com/issues)
    - Contact us at [support@example.com](mailto:support@example.com)
      `,
      description: "This section provides information on how to get support for the project.",
      emoji: "🤝",
      useCases: ["project", "library"],
    },
    {
      item: "Getting Started",
      usage: `
    ## Getting Started 🚀
    
    Follow these instructions to set up the project on your local machine for development and testing.
    
    1. Clone the repository:
       \`\`\`bash
       git clone <repository_url>
       \`\`\`
    
    2. Install dependencies:
       \`\`\`bash
       npm install
       \`\`\`
    
    3. Run the development server:
       \`\`\`bash
       npm run dev
       \`\`\`
      `,
      description: "This section provides a quick-start guide for setting up and running the project.",
      emoji: "🚀",
      useCases: ["project"],
    },
    {
      item: "Technologies Used",
      usage: `
    ## Technologies Used 💻
    
    - Frontend: React, Tailwind CSS
    - Backend: Node.js, Express.js
    - Database: MongoDB
    - Authentication: Firebase Authentication
      `,
      description: "This section highlights the technologies and tools used in the project.",
      emoji: "💻",
      useCases: ["project"],
    },
    {
      item: "Screenshots",
      usage: `
    ## Screenshots 📷
    
    ![Home Page](https://example.com/homepage-screenshot.png)
    - Description: Home page of the app.
    
    ![Feature Page](https://example.com/featurepage-screenshot.png)
    - Description: Key feature of the app.
      `,
      description: "This section provides screenshots of the project to give users a visual preview.",
      emoji: "📷",
      useCases: ["project", "portfolio"],
    },
    {
      item: "Future Scope",
      usage: `
    ## Future Scope 🔮
    
    - Integrate AI-powered recommendations.
    - Add offline mode for better accessibility.
    - Expand the project to support multi-tenancy.
      `,
      description: "This section outlines potential enhancements and directions for the project.",
      emoji: "🔮",
      useCases: ["project"],
    },
    {
      item: "Testimonials",
      usage: `
    ## Testimonials 🗣️
    
    > "This project is amazing and has streamlined our workflow!" - [User A](https://example.com)
    
    > "Highly recommend this tool for developers." - [User B](https://example.com)
      `,
      description: "This section shares testimonials from users or clients who have benefited from the project.",
      emoji: "🗣️",
      useCases: ["project", "portfolio"],
    },                                         
  ];
  