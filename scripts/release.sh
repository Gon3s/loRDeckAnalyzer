#!/bin/bash

# Vérifier si un numéro de version a été fourni
if [ -z "$1" ]; then
    echo "Usage: ./create-release.sh <version>"
    echo "Example: ./create-release.sh 1.2.3"
    exit 1
fi

VERSION=$1

# Vérifier le format de la version (x.y.z)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Version must be in format x.y.z (e.g., 1.2.3)"
    exit 1
fi

# Créer et pousser le tag
git tag -a "v$VERSION" -m "Release version $VERSION"
git push origin "v$VERSION"

echo "Tag v$VERSION created and pushed. GitHub Actions workflow will start automatically."
echo "Check the progress at: https://github.com/$GITHUB_REPOSITORY/actions"