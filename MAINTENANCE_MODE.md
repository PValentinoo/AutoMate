# Maintenance Mode

This AutoMate project includes a maintenance mode feature that allows you to temporarily take the site offline for updates or maintenance.

## How to Enable Maintenance Mode

1. **Open the `.env` file** in the project root
2. **Change the value** from `false` to `true`:
   ```
   VITE_MAINTENANCE_MODE=true
   ```
3. **Restart the development server** or **rebuild the project**

## How to Disable Maintenance Mode

1. **Open the `.env` file** in the project root
2. **Change the value** back to `false`:
   ```
   VITE_MAINTENANCE_MODE=false
   ```
3. **Restart the development server** or **rebuild the project**

## What Happens in Maintenance Mode

When maintenance mode is enabled:
- The entire website is replaced with a maintenance page
- Users see a professional "Under vedligeholdelse" message
- Contact information is still available via email
- The page includes the Auto<span class="italic">Mate</span> branding

## Maintenance Page Features

- **Professional Design**: Dark gradient background with blue accents
- **Clear Message**: "Under vedligeholdelse" with explanation
- **Contact Information**: Email link for urgent inquiries
- **Branding**: Consistent with Auto<span class="italic">Mate</span> styling
- **Responsive**: Works on all device sizes

## Environment Variables

The maintenance mode is controlled by the `VITE_MAINTENANCE_MODE` environment variable:

- `false` (default): Normal website operation
- `true`: Shows maintenance page instead of the website

## Usage Examples

### Development
```bash
# Enable maintenance mode
echo "VITE_MAINTENANCE_MODE=true" > .env
npm run dev

# Disable maintenance mode
echo "VITE_MAINTENANCE_MODE=false" > .env
npm run dev
```

### Production
```bash
# Enable maintenance mode
echo "VITE_MAINTENANCE_MODE=true" > .env
npm run build

# Deploy with maintenance mode enabled
# ... deploy to your hosting platform ...

# Disable maintenance mode
echo "VITE_MAINTENANCE_MODE=false" > .env
npm run build

# Deploy with normal operation
# ... deploy to your hosting platform ...
```

## Customization

You can customize the maintenance page by editing `src/components/MaintenancePage.tsx`:

- Change the message text
- Update contact information
- Modify the styling
- Add additional information

## Security Note

The maintenance mode is client-side only. For production environments, consider implementing server-side maintenance mode for better security and performance.
