$ErrorActionPreference = "Stop"

Write-Host "Checking out gh-pages..."
git checkout gh-pages

Write-Host "Cleaning existing assets in gh-pages..."
if (Test-Path "assets") {
    Remove-Item -Recurse -Force "assets"
}

Write-Host "Copying fresh build artifacts from temp..."
Copy-Item -Path "$env:TEMP\tap_toast_dist\*" -Destination "." -Recurse -Force

if (-not (Test-Path ".nojekyll")) {
    New-Item -ItemType File -Path ".nojekyll" -Force
}

Write-Host "Staging changes on gh-pages..."
git add -A

Write-Host "Checking status..."
git status --short

Write-Host "Committing to gh-pages..."
git commit -m "deploy: single decline button for attending events and locked warm message on decline"

Write-Host "Pushing to origin gh-pages..."
git push origin gh-pages

Write-Host "Returning to main..."
git checkout main

Write-Host "Pushing main to origin..."
git push origin main

Write-Host "Deployment completed successfully!"
