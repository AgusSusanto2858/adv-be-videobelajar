echo "🚀 VideoBelajar Migration Setup Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    print_step "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is installed: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_step "Checking npm installation..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
}

# Setup backend
setup_backend() {
    print_step "Setting up backend..."
    
    # Create backend directory
    if [ ! -d "videobelajar-backend" ]; then
        mkdir videobelajar-backend
        print_status "Created backend directory"
    fi
    
    cd videobelajar-backend
    
    # Initialize npm if package.json doesn't exist
    if [ ! -f "package.json" ]; then
        print_status "Initializing npm project..."
        npm init -y
    fi
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install express mysql2 cors dotenv bcryptjs jsonwebtoken helmet express-rate-limit express-validator
    npm install -D nodemon
    
    # Create directory structure
    mkdir -p config controllers routes
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating .env file..."
        cat > .env << EOL
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (XAMPP MySQL)
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_PORT=8111
DB_NAME=videobelajar_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Security
BCRYPT_SALT_ROUNDS=12
EOL
    fi
    
    # Update package.json scripts
    print_status "Updating package.json scripts..."
    npm pkg set scripts.start="node server.js"
    npm pkg set scripts.dev="nodemon server.js"
    npm pkg set type="module"
    
    cd ..
    print_status "Backend setup completed!"
}

# Setup frontend updates
setup_frontend() {
    print_step "Checking frontend setup..."
    
    if [ ! -d "src" ]; then
        print_warning "Frontend directory not found. Please run this script from your frontend project root."
        return
    fi
    
    # Create services directory if it doesn't exist
    mkdir -p src/services
    mkdir -p src/config
    
    print_status "Frontend structure checked!"
}

# Check XAMPP status (Windows specific - adjust for your OS)
check_xampp() {
    print_step "Checking XAMPP status..."
    print_warning "Please ensure XAMPP is installed and running:"
    print_warning "1. Apache should be running"
    print_warning "2. MySQL should be running on port 8111"
    print_warning "3. Database 'videobelajar_db' should be created"
    print_warning "4. Import the database_setup.sql file"
}

# Create database setup script
create_db_script() {
    print_step "Creating database setup helper..."
    
    cat > database_import.sql << EOL
-- Database Setup for VideoBelajar
-- Run this in phpMyAdmin or MySQL command line

CREATE DATABASE IF NOT EXISTS videobelajar_db;
USE videobelajar_db;

-- Check if tables exist before creating
SET @tables_exist = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'videobelajar_db');

-- Only create tables if database is empty
-- (You can manually run database_setup.sql if needed)

SELECT 'Database videobelajar_db is ready!' as status;
SELECT 'Please import database_setup.sql manually if tables are not created' as next_step;
EOL
    
    print_status "Created database_import.sql helper file"
}

# Main setup function
main() {
    echo "Starting VideoBelajar setup..."
    echo
    
    # Check prerequisites
    check_nodejs
    check_npm
    
    echo
    
    # Setup components
    setup_backend
    setup_frontend
    create_db_script
    
    echo
    check_xampp
    
    echo
    echo "🎉 Setup completed!"
    echo
    echo "Next steps:"
    echo "1. Ensure XAMPP MySQL is running on port 8111"
    echo "2. Import database_setup.sql in phpMyAdmin"
    echo "3. Copy backend files to videobelajar-backend/ directory"
    echo "4. Copy frontend files to their respective locations"
    echo "5. Start backend: cd videobelajar-backend && npm run dev"
    echo "6. Start frontend: npm run dev"
    echo
    echo "Backend will run on: http://localhost:5000"
    echo "Frontend will run on: http://localhost:5173"
    echo
    echo "Happy coding! 🚀"
}

# Run main function
main