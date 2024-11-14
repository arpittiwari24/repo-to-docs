# repo-to-docs

## Project Title and Description
**repo-to-docs** is an AI-powered GitHub README generator that leverages OpenAI's capabilities to create comprehensive and well-structured README.md files for your GitHub repositories. Users can easily input their GitHub repository details, and the application will generate a professional README that accurately represents their project.

## Features and Functionality
- **AI-Driven README Generation**: Utilizes OpenAI's API to analyze repository files and create a detailed README file.
- **GitHub Integration**: Allows users to connect their GitHub accounts and fetch repository details directly.
- **User Authentication**: Secure login through GitHub using OAuth.
- **Editable Output**: Generated README can be edited before finalization.
- **Real-Time Quotes**: Displays inspirational quotes related to documentation during the loading state.

## Technology Stack
- **Frontend**: React, Next.js
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js with GitHub OAuth
- **AI Integration**: OpenAI API
- **Styling**: Tailwind CSS

## Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- A GitHub account for OAuth authentication
- OpenAI API key
- Supabase account (for authentication and session management)

## Installation Instructions
1. **Clone the repository**:
   ```bash
   git clone https://github.com/arpittiwari24/repo-to-docs.git
   cd repo-to-docs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set environment variables**:
   Create a `.env.local` file in the root directory and add the following variables:
   ```plaintext
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the application**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`.

## Usage Guide
1. **Log in with GitHub**: Click the "Sign in with GitHub" button to authenticate your GitHub account.

2. **Select a Repository**: Once logged in, select a repository from your list to generate a README.

3. **Generate README**: Click the "Generate Readme" button to create a README for the selected repository.

4. **Edit and Copy**: You can edit the generated README text and copy it to your clipboard for use.

## API Documentation
### Authentication API
- **POST /api/auth/[...nextauth]**: Handles user authentication with GitHub.

### Documentation Generation API
- **POST /api/generate-docs**
  - **Request Body**:
    ```json
    {
      "accessToken": "your_access_token",
      "repoName": "your_repo_name"
    }
    ```
  - **Response**:
    - `readme`: Generated README content.
    - `repositoryUrl`: URL of the repository.
    - `repositoryName`: Name of the repository.
    - `fileCount`: Count of files analyzed for README generation.

## Contributing Guidelines
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License Information
This project does not currently specify a license. Please consult with the repository owner for license inquiries.

## Contact/Support Information
For support, please create an issue in the GitHub repository or contact the repository owner directly through GitHub.

Feel free to explore, contribute, and enhance the project!
