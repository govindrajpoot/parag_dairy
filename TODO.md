# Migration to MariaDB - Testing and Verification TODO

## Testing Steps

1. Start the server:
   ```
   npm run dev
   ```

2. Access Swagger UI for API documentation and testing:
   - URL: http://localhost:3000/api-docs
   - Verify all endpoints for auth, products, and product prices are documented.

3. Test Authentication APIs:
   - POST /api/auth/signin with valid credentials
   - POST /api/auth/signup (requires admin token)
   - GET /api/auth/users (admin only)

4. Test Product APIs:
   - POST /api/products (admin only)
   - GET /api/products (admin only)
   - GET /api/products/:id (admin only)
   - PUT /api/products/:id (admin only)
   - DELETE /api/products/:id (admin only)
   - GET /api/products/distributor (distributor only)

5. Test Product Price APIs:
   - POST /api/product-prices (admin only)
   - GET /api/product-prices (admin only)
   - GET /api/product-prices/:id (admin only)
   - PUT /api/product-prices/:id (admin only)
   - DELETE /api/product-prices/:id (admin only)

## Notes

- Ensure MariaDB server is running and accessible.
- Database schema should be created using `config/create_tables.sql`.
- Use Swagger UI for easy API testing by team members.
- Report any issues or errors encountered during testing.

## Next Steps

- After successful testing, consider adding automated tests.
- Review and optimize SQL queries if needed.
- Remove any remaining mongoose dependencies if present.
