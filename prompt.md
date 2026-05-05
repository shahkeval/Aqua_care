I want you to generate a full-stack MERN application for a company that provides RO servicing. 
The system should have 3 user roles: Admin, Client, and Employee.

---

i want also a landig page with all detilas and amc plans details, if user want to buy   and also default have 14 days free plan / demo account


### Authentication & Security
- Use JWT authentication with email + password login (no OTP).
- Role-based access control (admin, client, employee).
- Password reset via email.

---

### Roles & Features

#### 1. Admin
- Full dashboard with analytics (graphs: total services done, pending complaints, employee performance).
- Employee Management: CRUD operations (add, update, delete, list).
- Client Management: CRUD operations (add, update, delete, list).
- Service Assignment: Admin can see all pending services/complaints, assign them to employees, and send notifications.
- Reports: Export/download reports in PDF/Excel (services, payments, feedback).
- Notifications: Get notified when clients raise issues or employees complete services.

#### 2. Client
- Dashboard to see their profile, RO model, AMC expiry.
- Service History: list of services done, issues raised, payments made.
- Raise Complaint/Issue: submit form with issue details.
- Download Receipts: auto-generated PDFs with company logo and service details.
- Feedback: give ratings/comments after service.
- Notifications: reminders for next service (default 3 months) and service assignment.

#### 3. Employee
- Dashboard showing assigned services (daily/monthly).
- Service Visit Form:
  - Issue description
  - Work done
  - Parts replaced/used
  - Cost
  - Payment collected (full/partial)
- Submit service report → sends notification & receipt to client, notifies admin.
- Statistics: how many services/problems solved by the employee.
- Profile page.

---

### Extra Features
- Receipt auto-generation (PDF with logo, service details, cost, payment status).
- Feedback system linked to each service.
- Service Scheduling & Auto-Reminders: system should auto-calculate next service date (3 months) and send email/SMS reminders.
- Product/Parts table (for tracking what parts employees use, not full inventory system yet).
- Notifications system for all roles.

---

### Tech Stack
- Frontend: React with vite (with protected routes per role).
- Backend: Node.js + Express.
- Database: MongoDB with Mongoose.
- Styling: TailwindCSS.
- Optional: Chart.js/Recharts for analytics dashboard.
