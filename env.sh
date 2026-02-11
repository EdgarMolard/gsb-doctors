#!/bin/sh

# Generate env.js file with environment variables
cat <<EOF > /usr/share/nginx/html/env.js
window.__env = {
  apiUrl: '${API_URL:-http://localhost:3000/}'
};
EOF

echo "Environment configuration generated:"
cat /usr/share/nginx/html/env.js
