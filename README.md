# Rame Admin Dashboard

A Next.js dashboard application for managing purchase orders.

## Deployment to Vercel

1. Push this code to a GitHub repository
2. Connect the repository to Vercel
3. Set the following environment variables in Vercel:
   - DB_HOST: Your cPanel MySQL database host
   - DB_USER: Your cPanel MySQL database user
   - DB_PASSWORD: Your cPanel MySQL database password
   - DB_NAME: Your cPanel MySQL database name

## cPanel MySQL Database Setup

1. In cPanel, create a new MySQL database
2. Create a MySQL user and assign it to the database
3. Grant all privileges to the user for the database
4. Note the database host, user, password, and database name for Vercel deployment

## Environment Variables

The following environment variables need to be set in Vercel:

```
DB_HOST=your_cpanel_mysql_host
DB_USER=your_cpanel_mysql_user
DB_PASSWORD=your_cpanel_mysql_password
DB_NAME=your_cpanel_mysql_database_name
```

## Local Development

1. Create a `.env.local` file with your database credentials
2. Run `npm run dev` to start the development server