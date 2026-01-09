# Legal Wings CRM - AI Coding Instructions

## Project Overview
React-based multi-tenant CRM for rental agreement management across specialized teams (Calling, Executive, Backend, Accounts, Marketing) with corporate training portal (Company Panel).

## Authentication & Authorization

### Current Authentication Flow
- **Keycloak is configured but NOT enforced** - server at `https://legalwingcrm.in:8443/` is not connected
- [App.js](src/App.js) has Keycloak authentication checks **commented out** (lines 27-33)
- [Login.js](src/Login.js) accepts ANY email/password combination for development
- After login, users are redirected to `/dashboard` without token validation
- All API requests still require: `Authorization: Bearer ${keycloak.token}` header (though token may not be validated server-side)

### Role-Based Access
- [UserContext.js](src/Pages/UserContext.js) has **hardcoded `roles: ["admin"]`** - gives full access to all teams
- Real Keycloak role extraction code is commented out: `keycloak.tokenParsed?.resource_access?.['legal-wing']?.roles`
- Dashboard filters team visibility by role: `calling`, `executive`, `backend`, `accounting`, `company-admin`, `company-user`
- **In current state**: All users see all team cards because everyone gets admin role

## API Patterns

### Standard Request Structure
```javascript
const response = await fetch(`${Api.BASE_URL}endpoint`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${keycloak.token}`
  },
  body: JSON.stringify(payload)
});
```

### Base URLs
- Main API: `https://legalwingcrm.in:8081/legal-wings-management/` ([Api.js](src/Pages/Api.js))
- Geographic: `https://legalwingcrm.in:8081/api/geographic-nexus/`

### Geographic Dropdown Cascade
Cities and areas have dependencies - fetch pattern:
```javascript
// Initial load: empty arrays for all dropdowns
POST /geographic-nexus/allDropDowns
{ cityIdsUi: [], areaIdsUi: [], clientIdsUi: [] }

// After city selection: filter areas
POST /geographic-nexus/allDropDowns  
{ cityIdsUi: [selectedCityId], areaIdsUi: [], clientIdsUi: [] }
```

## Navigation & State Persistence

### Filter State Pattern
When navigating to add/edit pages, preserve filter state for back navigation:
```javascript
navigate("/add-lead", {
  state: {
    transitLevel: "CALLING_TEAM",
    from: location.pathname,
    filters: { fromDate, toDate, city, area, clientType, leadStatus, searchText, currentPage, dateFilter }
  }
});

// On return: const savedFilters = location.state?.filters;
```
See implementation in [CallingTeam.js](src/Pages/CallingTeam.js#L61)

## Team Structure & Workflows

7 role-based panels with consistent layout (Slider + Header + Filters + Table + Pagination):

1. **Calling Team** - Initial lead capture and qualification
2. **Executive Team** - Lead processing and conversion  
3. **Backend Team** - Agreement documentation
4. **Account Team** - Payment and billing
5. **Marketing Team** - Campaigns and promotions
6. **Company Super Admin** - Training content management (courses/quizzes/simulations)
7. **Company Panel** - User-facing training portal

## UI Component Standards

### Date Components
Use [CustomDatePicker](src/common/CustomDatePicker.js) - returns Date objects, not strings:
```javascript
<CustomDatePicker
  value={fromDate}
  onChange={setFromDate}
  dateFormat="dd-MM-yyyy"
  placeholder="Select date"
/>
```

### Notifications
- **Success/Error**: `toast.success()` / `toast.error()` (react-toastify)
- **Confirmations**: `Swal.fire()` (sweetalert2)
- Examples in [Execative.js](src/Pages/Execative.js#L89)

### Tables & Pagination
- PrimeReact DataTable for complex tables
- ReactPaginate for pagination (see [ClientPage.css](src/Pages/ClientPage.css) for styling)

## Company Panel Architecture

Recently added corporate training system (see [COMPANY_PANEL_DOCUMENTATION.md](COMPANY_PANEL_DOCUMENTATION.md)):

**Super Admin Routes** (`/company-super-admin/*`):
- [AddCourse.js](src/Pages/AddCourse.js) - Courses with modules/lessons/resources
- [AddQuiz.js](src/Pages/AddQuiz.js) - Multi-type questions (MCQ, True/False, short answer)
- [AddSimulation.js](src/Pages/AddSimulation.js) - Task-based scenarios with scoring
- [ManageCompanies.js](src/Pages/ManageCompanies.js) - Company CRUD operations

**User Portal** (`/company-panel`): Tab-based browsing with progress tracking

### Dynamic Form Fields Pattern
Add/remove field arrays (modules, lessons, questions):
```javascript
const [modules, setModules] = useState([{ title: "", description: "", lessons: [] }]);

const addModule = () => setModules([...modules, { title: "", description: "", lessons: [] }]);
const removeModule = (index) => setModules(modules.filter((_, i) => i !== index));
```

## Development Commands

```bash
npm start       # Dev server → https://legalwingcrm.in:3000
npm test        # Jest test runner
npm run build   # Production build
```

## Key Conventions

### Form Validation
Manual validation before API calls - check required fields explicitly:
```javascript
if (!formData.title || !formData.description) {
  toast.error('Please fill in all required fields');
  return;
}
```

### Error Handling
Wrap API calls in try-catch with user feedback:
```javascript
try {
  const response = await fetch(url, options);
  const data = await response.json();
  toast.success('Operation successful!');
} catch (error) {
  console.error("Error:", error);
  toast.error('Failed to complete operation');
}
```

### Date Filters
Three types supported: `CREATED_DATE`, `UPDATED_DATE`, `NEXT_FOLLOWUP_DATE` - selected via dropdown in filter bars

## Adding New Features

### New Team Page Checklist
1. Create component in `src/Pages/` with corresponding CSS
2. Add route to [App.js](src/App.js) Routes
3. Add team card to [Dashboard.js](src/Dashboard.js) with required role
4. Follow layout pattern: `<Slider /> + <Header /> + filter bar + content`
5. Implement pagination if displaying lists
6. Add Keycloak token to all API headers

### Styling Structure
- Component CSS: `ComponentName.js` → `ComponentName.css`
- Bootstrap 5 for grid/utilities
- PrimeReact themes loaded in [index.js](src/index.js)
- Custom date picker styles: [CustomDatePicker.css](src/common/CustomDatePicker.css)

## Common Issues

1. **Authentication State**: Keycloak provider exists but authentication is not enforced - any user can login via `/login` page
2. **Role Permissions**: All users get `admin` role from hardcoded UserContext - no real role-based restrictions currently active
3. **Date Handling**: CustomDatePicker returns Date objects - convert to ISO strings for API: `date.toISOString()`
4. **Filter Loss**: Pass filter state through navigation or restore from location.state
5. **Commented Code**: Many components have commented alternative implementations - review before duplicating logic

## Testing Notes
- Login with ANY credentials via [Login.js](src/Login.js) - redirects to dashboard
- No Keycloak server connection required for development
- Mock data files: `Callingdb.json`, `Execative.json` for reference
- Firebase setup exists ([Firebase.js](src/Firebase.js)) but not actively used
- To enable real Keycloak: Uncomment auth checks in [App.js](src/App.js) and role extraction in [UserContext.js](src/Pages/UserContext.js)
