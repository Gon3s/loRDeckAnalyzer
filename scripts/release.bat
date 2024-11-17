@echo off
setlocal enabledelayedexpansion

:: Vérifier si un numéro de version a été fourni
if "%~1"=="" (
    echo Usage: create-release.bat ^<version^>
    echo Example: create-release.bat 1.2.3
    exit /b 1
)

set VERSION=%~1

:: Vérifier le format de la version (x.y.z)
echo %VERSION%| findstr /r "^[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*$" >nul
if errorlevel 1 (
    echo Error: Version must be in format x.y.z ^(e.g., 1.2.3^)
    exit /b 1
)

:: Créer et pousser le tag
echo Creating tag v%VERSION%...
git tag -a "v%VERSION%" -m "Release version %VERSION%"
if errorlevel 1 (
    echo Failed to create tag
    exit /b 1
)

echo Pushing tag to remote...
git push origin "v%VERSION%"
if errorlevel 1 (
    echo Failed to push tag
    exit /b 1
)

echo.
echo Tag v%VERSION% created and pushed successfully.
echo GitHub Actions workflow will start automatically.
echo Check the progress at: https://github.com/%GITHUB_REPOSITORY%/actions
echo.

:: Pause seulement si le script n'est pas exécuté depuis une console
echo %CMDCMDLINE% | findstr /L /C:"%COMSPEC% /c" >nul
if %ERRORLEVEL% == 0 pause

endlocal