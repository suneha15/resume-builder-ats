# 🗄️ **Supabase Database Setup Guide**

## **Step 1: Get Your Database URL**

1. **Go to your Supabase project dashboard**
2. **Click "Connect" button** in the top-right corner
3. **Copy the connection string** (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

## **Step 2: Update Environment Variables**

Add this to your `.env.local` file:
```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase (Optional - for direct client access)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key_here"
```

## **Step 3: Push Database Schema**

Run these commands in your terminal:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) View your database in Prisma Studio
npx prisma studio
```

## **Step 4: Test the Setup**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Go to** `http://localhost:3000/resume-builder`

3. **Fill in some information** and click "Save New Resume"

4. **Check your Supabase dashboard** - you should see new tables and data!

## **Step 5: Verify Database Tables**

In your Supabase dashboard, you should see these tables:
- ✅ **users** - Stores user information linked to Clerk
- ✅ **resumes** - Stores resume data
- ✅ **job_descriptions** - Stores ATS scan history

## **🎉 You're Done!**

Your resume builder now has:
- ✅ **Persistent storage** - Resumes survive logout/login
- ✅ **User isolation** - Each user only sees their resumes
- ✅ **Auto-save** - Data saves automatically to localStorage
- ✅ **Manual save** - Save to database with one click
- ✅ **Resume management** - Create, edit, delete resumes
- ✅ **Dashboard integration** - View all your resumes

## **🔧 Troubleshooting**

### **If you get database connection errors:**
1. Check your `DATABASE_URL` is correct
2. Make sure your Supabase project is active
3. Verify your database password is correct

### **If Prisma commands fail:**
1. Make sure you're in the project root directory
2. Check that `prisma/schema.prisma` exists
3. Verify your `DATABASE_URL` is set correctly

### **If API calls fail:**
1. Check the browser console for errors
2. Verify your Clerk authentication is working
3. Make sure the database tables were created successfully

## **📊 What's Working Now**

- **Dashboard**: Shows all your saved resumes
- **Resume Builder**: Saves to database when you click "Save"
- **Local Storage**: Still works as backup/offline storage
- **User Authentication**: Each user has their own resumes
- **CRUD Operations**: Create, read, update, delete resumes

Your resume builder is now fully integrated with Supabase database! 🚀
