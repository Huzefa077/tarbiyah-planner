# Tarbiyah Planner

Tarbiyah Planner is a work-in-progress web app for helping parents encourage positive routines, good habits, and personal growth in their children through small daily tasks.

The project is being built as a learning project with Next.js, TypeScript, Tailwind CSS, and reusable UI components.

## Current progress

The first version of the interface is in place:

- A responsive landing page with a hero section and feature cards.
- A Register page with parent name, email, and password fields.
- A Login page with email and password fields.
- Navigation links between the landing, registration, and login pages.
- Reusable Button and Input UI components.

The registration and login pages are currently visual only. They do not yet save users, validate submitted data, or authenticate anyone.

## Planned features

- Parent accounts and secure authentication.
- Child profiles.
- Age-appropriate daily tasks and routines.
- Task completion tracking.
- Progress and habit dashboards.

## Tech stack

- Next.js
- React and TypeScript
- Tailwind CSS
- shadcn/Base UI components

## Run locally

1. Clone the repository.

   ```bash
   git clone https://github.com/Huzefa077/tarbiyah-planner.git
   cd tarbiyah-planner
   ```

2. Install the project packages.

   ```bash
   npm install
   ```

3. Start the development server.

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project status

This project is actively under development. The current focus is building the interface and learning the fundamentals of Next.js before connecting the forms to a database.
