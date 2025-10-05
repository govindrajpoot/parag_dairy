# Production Deployment Guide for https://dairy.u2tech.in

## 🚀 Deployment Steps

### 1. Environment Setup
- Copy the `.env` file to your production server
- Update the following variables in production:
  ```env
  JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
  # Change the default admin password
  ```

### 2. Database Setup
- Ensure MariaDB/MySQL is running on your production server
- Run the database initialization:
  ```bash
  node config/init_db.js
  ```

### 3. Server Deployment
- Install dependencies:
  ```bash
  npm install
  ```

- Start the production server:
  ```bash
  npm run prod
  ```
  Or directly:
  ```bash
  NODE_ENV=production node server.js
  ```

### 4. Domain Configuration
- Point your domain `dairy.u2tech.in` to your server's IP address
- Configure your web server (nginx/apache) to proxy requests to port 80
- Set up SSL certificate for HTTPS

### 5. Nginx Configuration (Example)
```nginx
server {
    listen 80;
    server_name dairy.u2tech.in;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. SSL Setup (Let's Encrypt)
```bash
sudo certbot --nginx -d dairy.u2tech.in
```

## 📋 Production URLs

- **API Base URL**: `https://dairy.u2tech.in/api/auth`
- **Health Check**: `https://dairy.u2tech.in/health`
- **API Documentation**: `https://dairy.u2tech.in/api-docs`

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Update JWT_SECRET to a strong random string
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Regular security updates

## 🐛 Troubleshooting

### Port Issues
- Ensure port 80 is not used by other services
- Check if nginx/apache is running on port 80

### Database Connection
- Verify MariaDB is running
- Check database credentials in `.env`
- Ensure database `dairy` exists

### CORS Issues
- Verify domain is added to CORS allowed origins
- Check if HTTPS is properly configured

## 📞 Support

For deployment issues, check:
1. Server logs: `tail -f /var/log/application.log`
2. Database connection: `mysql -u root -p dairy`
3. Port availability: `netstat -tlnp | grep :80`
