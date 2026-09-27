# Kubernetes deployment

This app is a static frontend PWA and can be served with Nginx inside a container.

## Build the image

```bash
docker build -t bingo:latest .
```

## Run locally

```bash
docker run --rm -p 8080:80 bingo:latest
```

Then open http://localhost:8080

## Deploy to Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
```

If you want to use a registry-backed image, replace `bingo:latest` with a tagged image such as:

```yaml
image: ghcr.io/your-org/bingo:latest
```
