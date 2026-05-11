@echo off
if "%~1"=="" (
    echo Usage: mk ^<projectname^>
    exit /b 1
)
if not defined PROJECTS_DIR (
    echo Set PROJECTS_DIR to your projects folder, e.g. setx PROJECTS_DIR "D:\Projects"
    exit /b 1
)
mkdir "%PROJECTS_DIR%\%~1" 2>nul
cd /d "%PROJECTS_DIR%\%~1"
cursor .
