import { getAuthenticatedOctokit } from "@/app/api/lib/githubOctokit";
import User from "@/app/api/lib/models/User";
import { minimatch } from "minimatch";

const ignoreFileTreeItemsList = [
  // Dependency and build artifacts
  'node_modules', 'dist', 'build', 'out', '.output', 'coverage', '.cache',
  'public', 'static', 'uploads', 'tmp', '.temp', 'cache', 'logs', '.vercel',
  '.serverless', '.svelte-kit', '.astro', '.next', 'storybook-static', 'README.md',
  'package.json',

  // Version control
  '.git', '.github', '.gitignore', '.gitattributes', '.gitmodules', '.svn',
  '.hg', '.bzr',

  // IDE/Editor configs
  '.vscode', '.idea', '.history', '.vs', '.suo', '.ntvs', '.njsproj', '.sln',
  '.swp', '.swo', '.vim',

  // Runtime/config files
  '.env', '.env.*', '.flaskenv', '.python-version', '.ruby-version',
  '.node-version', '.nvmrc', '.editorconfig', '.dockerignore', '.slugignore',
  
  // Lockfiles and package managers
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'shrinkwrap.yaml',
  'composer.lock', 'Gemfile.lock', 'Pipfile.lock', 'poetry.lock',
  'bun.lockb', 'packages.lock.json',

  // Config files
  '*.config.*', '.*rc', '.*rc.*', 'tsconfig.*', 'jsconfig.json',
  'webpack.config.*', 'rollup.config.*', 'vite.config.*', 'vitest.config.*',
  'jest.config.*', 'karma.conf.*', 'babel.config.*', 'postcss.config.*',
  'tailwind.config.*', 'gulpfile.*', 'gruntfile.*', 'metro.config.*',
  'craco.config.*', 'vue.config.*', 'nuxt.config.*', 'next.config.*',
  'svelte.config.*', 'astro.config.*', 'remix.config.*', 'eslint.*',
  'prettier.*', 'stylelint.*', 'commitlint.*', 'lint-staged.*',
  'husky.config.*', 'components.json',

  // Test-related
  'tests', 'test', 'spec', 'cypress', 'e2e', '__mocks__', '__snapshots__',
  '__tests__', '__fixtures__', 'jest.setup.*', 'playwright.config.*',
  'cypress.config.*', 'k6.config.*',

  // TypeScript declarations
  '*.d.ts', '*.d.cts', '*.d.mts',

  // Build tools
  'Makefile', 'Dockerfile', 'docker-compose.*', 'Procfile', 'Vagrantfile',
  'Jenkinsfile', '.travis.yml', '.circleci', '.github/workflows',

  // Documentation
  'CHANGELOG.md', 'CHANGES.md', 'LICENSE', 'LICENCE', 'SECURITY.md',
  'CONTRIBUTING.md', 'AUTHORS', '.all-contributorsrc',

  // Misc technical files
  '*.log', '*.tmp', '*.bak', '*.pid', '*.seed', '*.pid.lock', '*.patch',
  '*.rej', '*.iml', '*.log.*', '*.sql', '*.sqlite', '*.sublime-workspace',

  // OS metadata
  '.DS_Store', 'Thumbs.db', 'desktop.ini',

  // Security
  '.htaccess', 'nginx.conf', '*.key', '*.pem', '*.crt', '*.cer', '*.pfx',

  // Visual configs
  '.styleci.yml', '.prettierignore', '.eslintignore', '.gitkeep', '.npmignore',
  
  // Benchmarking/profiling
  '*.cpuprofile', '*.heapsnapshot', '*.heapprofile',

  // explicit pattern files
  "eslint.config.*",
  "*.d.ts",
  "next-auth.d.ts",
  "next.config.*",
  "postcss.config.*",
  "tailwind.config.*",
  "tsconfig.json",
];

// Minimal type representing the repository content items
type RepoContentItem = {
  type: "file" | "dir" | "symlink" | "submodule";
  name: string;
};

type RepoContent = RepoContentItem | RepoContentItem[];

export async function getFileTree(userId: string, doc_name: string, path: string) {
  try {
    const user = await User.findOne(
      { clerkUid: userId },
      { installationId: 1, githubUsername: 1 }
    );

    if (!user || !user.installationId || !user.githubUsername) {
      return "Data not found";
    }

    const octokit = getAuthenticatedOctokit(Number(user.installationId));

    const response = await octokit.repos.getContent({
      owner: user.githubUsername,
      repo: doc_name,
      path,
    });

    const data = response.data as RepoContent;

    const getFullPath = (itemName: string) => {
      return path ? `${path}/${itemName}` : itemName;
    };

    if (Array.isArray(data)) {

      // Modified filter logic
      const shouldIgnore = (fullPath: string) => {
        return ignoreFileTreeItemsList.some(pattern => 
          minimatch(fullPath, pattern, { dot: true, matchBase: true })
        );
      };

      const filtered = data.filter((item) => {
        const fullPath = getFullPath(item.name);
        return !shouldIgnore(fullPath);
      });

      // Sort: directories first, then files
      const sorted = filtered.sort((a, b) => {
        if (a.type === b.type) return 0;
        return a.type === "dir" ? -1 : 1;
      });

      // Map: wrap directories in an array, leave files as strings
      const initialTree = sorted.map((item) =>
        item.type === "dir" ? [item.name] : item.name
      );

      return initialTree;
    } else {
      const fullPath = getFullPath(data.name);
      if (ignoreFileTreeItemsList.includes(fullPath)) {
        return [];
      }
      return data.type === "dir" ? [[data.name]] : [data.name];
    }
  } catch (error) {
    console.error("Error fetching initial tree:", error);
    return ["Error fetching initial tree"];
  }
}

export async function getFileData(userId: string, files: string[], doc_name: string) {

  if (files.length === 0) {
    return "No files to fetch";
  }

  
  if (!userId || !files) {
    return "Data not found";
  }


  const user = await User.findOne(
    { clerkUid: userId },
    { installationId: 1, githubUsername: 1 }
  );

  if (!user || !user.installationId || !user.githubUsername) {
    return "Data not found";
  }

  const octokit = getAuthenticatedOctokit(Number(user.installationId));

  const fileContentPromises = files.map((path) =>
    octokit.repos.getContent({
      owner: user.githubUsername,
      repo: doc_name,
      path,
    })
  );

  try {
    const fileContents = await Promise.all(fileContentPromises);
  
    const decodedFiles: Array<{ name: string; content: string }> = [];
  
    fileContents.forEach(response => {
      const data = response.data;
      
      if (!Array.isArray(data) && data.type === "file") {
        const { content, encoding, name } = data;
        let decodedContent: string;
        
        if (encoding === "base64") {
          decodedContent = Buffer.from(content, "base64").toString("utf8");
        } else {
          decodedContent = content;
        }
        
        decodedFiles.push({
          name: name,
          content: decodedContent
        });
      } else {
        console.log("The response is not a file.");
      }
    });

  
    return decodedFiles;
  } catch (error) {
    console.error("Error fetching file contents:", error);
  }
  
  
}
