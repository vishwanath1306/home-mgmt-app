# Household Management App

A modern web application for managing household tasks and activities, built with Next.js and Tailwind CSS.

## Prerequisites

Before you begin, make sure you have the following installed on your computer:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [PNPM](https://pnpm.io/) (a fast, disk space efficient package manager)

## Getting Started

Follow these steps to run the application on your local machine:

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd home-mgmt-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see your application running locally.

## Available Scripts

- `pnpm dev` - Starts the development server
- `pnpm build` - Creates a production build
- `pnpm start` - Runs the production build locally
- `pnpm lint` - Runs the linter to check for code issues

## Project Structure

- `/app` - Contains the main application pages and routes
- `/components` - Reusable UI components
- `/public` - Static assets like images
- `/styles` - Global styles and Tailwind configuration
- `/lib` - Utility functions and shared code

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

## Need Help?

If you run into any issues:
1. Make sure all prerequisites are installed correctly
2. Check that you're using the correct Node.js version
3. Try deleting the `node_modules` folder and running `pnpm install` again
4. Check the console for any error messages

## Deployment

This project is deployed on Vercel. You can access the live version at:
[https://vercel.com/vishwanath1306s-projects/v0-household-management-app](https://vercel.com/vishwanath1306s-projects/v0-household-management-app)