# Kubernetes Configuration

## ⚠️ Security Notice

The actual secret files (`secret.yaml` and `configmap.yaml`) are **NOT committed to git** for security reasons. You must create them locally from the provided templates.

## Setup Instructions

### 1. Create Secrets from Templates

Copy the template files and replace the placeholders with actual values:

```bash
# API Secrets
cp k8s/api/secret.yaml.template k8s/api/secret.yaml

# Frontend Secrets
cp k8s/frontend/secret.yaml.template k8s/frontend/secret.yaml

# Frontend ConfigMap
cp k8s/frontend/configmap.yaml.template k8s/frontend/configmap.yaml
```

### 2. Fill in the Secret Values

#### API Secrets (`k8s/api/secret.yaml`)

Replace the following placeholders:

- `<RDS_ENDPOINT>`: Your RDS database endpoint
- `<DB_NAME>`: Database name
- `<DB_USERNAME>`: Database username
- `<DB_PASSWORD>`: Database password
- `<JWT_SECRET>`: Generate with: `openssl rand -base64 32`
- `<MAIL_USERNAME>`: Email service username
- `<MAIL_PASSWORD>`: Email service password (use app password for Gmail)
- `<FRONTEND_URL>`: Frontend URL (e.g., `http://localhost` or your domain)
- `<AWS_ACCESS_KEY_ID>`: AWS access key
- `<AWS_SECRET_KEY>`: AWS secret key
- `<AWS_REGION>`: AWS region (e.g., `eu-west-3`)
- `<AWS_S3_BUCKET>`: S3 bucket name

#### Frontend Secrets (`k8s/frontend/secret.yaml`)

Replace the following placeholders:

- `<SESSION_SECRET>`: Generate with: `openssl rand -base64 32`
- `<GOOGLE_GENERATIVE_AI_API_KEY>`: Your Google AI API key

#### Frontend ConfigMap (`k8s/frontend/configmap.yaml`)

Replace the following placeholders:

- `<NEXT_PUBLIC_BACKEND_URL>`: Public backend URL (empty string if same domain)

### 3. Verify Before Applying

```bash
# Check that no placeholder values remain
grep -r "<" k8s/api/secret.yaml k8s/frontend/secret.yaml k8s/frontend/configmap.yaml

# If the above command returns nothing, you're good to go!
```

### 4. Apply to Kubernetes

```bash
# Create namespace first
kubectl apply -f k8s/namespace.yaml

# Apply secrets
kubectl apply -f k8s/api/secret.yaml
kubectl apply -f k8s/frontend/secret.yaml
kubectl apply -f k8s/frontend/configmap.yaml

# Apply deployments and services
kubectl apply -f k8s/api/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/ingress.yaml
```

## 🔒 Security Best Practices

1. **Never commit actual secret files** - They are in `.gitignore`
2. **Use strong random values** - Use `openssl rand -base64 32` for secrets
3. **Rotate secrets regularly** - Change passwords and keys periodically
4. **Use sealed secrets or external secret management** - For production, consider:
   - [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)
   - [External Secrets Operator](https://external-secrets.io/)
   - AWS Secrets Manager
   - HashiCorp Vault

## 📝 Important Notes

- **ConfigMap vs Secret**:

  - ConfigMaps are for **non-sensitive** configuration
  - Secrets are for **sensitive** data (passwords, keys, tokens)
  - The templates have been fixed to separate these properly

- **Session Secret**: Previously stored in ConfigMap (insecure), now in Secret

- **API Keys**: All API keys now properly stored in Secrets, not ConfigMaps

## Generating Secure Random Values

```bash
# Generate a session secret
openssl rand -base64 32

# Generate a JWT secret
openssl rand -base64 32

# Generate a random password
openssl rand -base64 16
```

## Troubleshooting

### Check if secrets exist

```bash
kubectl get secrets -n admin-dashboard
```

### View secret (base64 encoded)

```bash
kubectl get secret api-secrets -n admin-dashboard -o yaml
```

### Decode a secret value

```bash
kubectl get secret api-secrets -n admin-dashboard -o jsonpath='{.data.DB_PASSWORD}' | base64 -d
```

### Delete and recreate secrets

```bash
kubectl delete secret api-secrets -n admin-dashboard
kubectl apply -f k8s/api/secret.yaml
```
