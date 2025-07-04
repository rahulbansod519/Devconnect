const posts = [
  {
    id: 1,
    title: "Getting Started with React",
    excerpt: "Learn the basics of React development and component-based architecture...",
    date: "2025-07-01",
    category: "Tutorial",
    content: `React is a powerful JavaScript library for building user interfaces, developed by Facebook. It revolutionizes how we create web applications through its component-based architecture.

**Key Concepts:**
- **Components**: Reusable pieces of UI that manage their own state
- **JSX**: A syntax extension that allows you to write HTML-like code in JavaScript
- **Props**: How data flows from parent to child components
- **State**: Local data that components can manage and update

**Getting Started:**
1. Install Node.js on your system
2. Run \`npx create-react-app my-app\` to create a new project
3. Start building with functional components and hooks
4. Learn about useState and useEffect for state management

React's virtual DOM makes it incredibly fast, and its ecosystem is vast with tools like React Router for navigation and Redux for state management. The component-based approach promotes code reusability and makes maintenance easier.

**Best Practices:**
- Keep components small and focused
- Use meaningful names for components and props
- Implement proper error boundaries
- Follow the single responsibility principle

Start with simple components and gradually build more complex applications as you master the fundamentals.`
  },
  {
    id: 2,
    title: "JavaScript Best Practices",
    excerpt: "Essential tips for writing clean, maintainable JavaScript code...",
    date: "2025-06-28",
    category: "Tips",
    content: `Writing clean JavaScript code is crucial for building maintainable applications. Here are essential practices every developer should follow.

**Code Organization:**
- Use meaningful variable and function names
- Keep functions small and focused on a single task
- Organize code into modules and maintain proper file structure
- Use consistent naming conventions (camelCase for variables, PascalCase for classes)

**Modern JavaScript Features:**
- Embrace ES6+ features like arrow functions, destructuring, and template literals
- Use \`const\` and \`let\` instead of \`var\`
- Leverage async/await for handling promises
- Utilize array methods like map, filter, and reduce

**Error Handling:**
\`\`\`javascript
try {
  // Risky operation
  const result = await fetchData();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Failed to fetch data');
}
\`\`\`

**Performance Tips:**
- Avoid global variables when possible
- Use event delegation for better performance
- Implement debouncing for expensive operations
- Cache DOM queries to avoid repeated lookups

**Code Quality:**
- Write unit tests for your functions
- Use a linter like ESLint
- Document your code with JSDoc comments
- Regular code reviews and refactoring

Following these practices will make your code more readable, maintainable, and less prone to bugs.`
  },
  {
    id: 3,
    title: "Building Modern Web Apps",
    excerpt: "A comprehensive guide to creating responsive, scalable web applications...",
    date: "2025-06-25",
    category: "Guide",
    content: `Modern web applications require careful planning and the right technology stack. This guide covers the essential aspects of building scalable, user-friendly applications.

**Planning Phase:**
- Define clear requirements and user stories
- Create wireframes and mockups
- Choose the appropriate technology stack
- Plan your database schema and API endpoints

**Frontend Architecture:**
- **Component-Based Design**: Break UI into reusable components
- **Responsive Design**: Ensure compatibility across devices using CSS Grid and Flexbox
- **State Management**: Choose between Context API, Redux, or Zustand
- **Routing**: Implement client-side routing with React Router or Next.js

**Backend Considerations:**
- RESTful API design with proper HTTP methods
- Database optimization and indexing
- Authentication and authorization
- Error handling and logging
- API rate limiting and security measures

**Development Workflow:**
1. Set up version control with Git
2. Implement CI/CD pipelines
3. Use environment variables for configuration
4. Write comprehensive tests (unit, integration, e2e)
5. Monitor performance and user experience

**Performance Optimization:**
- Code splitting and lazy loading
- Image optimization and WebP format
- Minimize bundle size with tree shaking
- Implement caching strategies
- Use Content Delivery Networks (CDN)

**Security Best Practices:**
- Sanitize user inputs
- Implement HTTPS everywhere
- Use secure headers
- Regular security audits
- Keep dependencies updated

Modern web development is about creating fast, secure, and maintainable applications that provide excellent user experiences across all devices.`
  },
  {
    id: 4,
    title: "CSS Grid Layout",
    excerpt: "Master CSS Grid for creating complex, responsive layouts with ease...",
    date: "2025-06-22",
    category: "CSS",
    content: `CSS Grid is a powerful layout system that allows you to create complex, two-dimensional layouts with ease. It's perfect for building responsive designs without relying on frameworks.

**Grid Fundamentals:**
- **Grid Container**: The parent element with \`display: grid\`
- **Grid Items**: Direct children of the grid container
- **Grid Lines**: The dividing lines that make up the structure
- **Grid Tracks**: Rows and columns between grid lines
- **Grid Areas**: Rectangular areas bounded by four grid lines

**Basic Grid Setup:**
\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  min-height: 100vh;
}
\`\`\`

**Advanced Techniques:**
- **Named Grid Lines**: \`grid-template-columns: [start] 250px [content-start] 1fr [end]\`
- **Grid Areas**: Define template areas for semantic layouts
- **Auto-fit and Auto-fill**: Create responsive grids without media queries
- **Subgrid**: Align nested grids with parent grid (limited browser support)

**Responsive Design:**
\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
\`\`\`

**Common Patterns:**
1. **Holy Grail Layout**: Header, footer, sidebar, and main content
2. **Card Layouts**: Automatically responsive card grids
3. **Magazine Layouts**: Complex multi-column designs
4. **Overlapping Elements**: Using negative grid lines

**Grid vs Flexbox:**
- Use Grid for two-dimensional layouts
- Use Flexbox for one-dimensional layouts
- They work great together in the same design

**Browser Support:**
CSS Grid has excellent modern browser support. For older browsers, use feature queries:
\`\`\`css
@supports (display: grid) {
  .container {
    display: grid;
  }
}
\`\`\`

CSS Grid simplifies complex layouts and reduces the need for CSS frameworks, giving you more control over your design.`
  },
  {
    id: 5,
    title: "Node.js Fundamentals",
    excerpt: "Learn backend development with Node.js and build scalable server applications...",
    date: "2025-06-20",
    category: "Backend",
    content: `Node.js is a powerful JavaScript runtime that enables server-side development. Built on Chrome's V8 engine, it's perfect for building scalable network applications.

**Core Concepts:**
- **Event-Driven Architecture**: Non-blocking I/O operations
- **Single-Threaded**: Uses an event loop for concurrency
- **NPM**: Vast ecosystem of packages and modules
- **CommonJS Modules**: Organizing code into reusable modules

**Getting Started:**
\`\`\`javascript
// Basic HTTP server
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello from Node.js!</h1>');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

**Essential Modules:**
- **fs**: File system operations
- **path**: Working with file and directory paths
- **http/https**: Creating web servers
- **crypto**: Cryptographic functionality
- **util**: Utility functions

**Express.js Framework:**
\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000);
\`\`\`

**Database Integration:**
- **MongoDB**: Using Mongoose ODM
- **PostgreSQL**: Using pg or Sequelize ORM
- **Redis**: For caching and sessions
- **Connection pooling**: For better performance

**Best Practices:**
- Use environment variables for configuration
- Implement proper error handling and logging
- Use middleware for common functionality
- Validate input data
- Implement rate limiting and security headers

**Asynchronous Programming:**
- Understand callbacks, promises, and async/await
- Handle errors properly in async operations
- Use streams for large data processing
- Implement proper timeout handling

**Deployment:**
- Process managers like PM2
- Docker containerization
- Environment-specific configurations
- Monitoring and logging in production

Node.js excels at I/O-intensive applications like APIs, real-time applications, and microservices.`
  }
];

export default posts;