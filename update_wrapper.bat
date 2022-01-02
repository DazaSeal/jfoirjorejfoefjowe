title Wrapper: Offline Updater
:: Updates Offline to a new version
:: Author: octanuary#1525
:: License: MIT

:: Initialize (stop command spam, clean screen, make variables work, set to UTF-8)
@echo off && cls
SETLOCAL ENABLEDELAYEDEXPANSION
chcp 65001 >nul

:: Make sure we're starting in the correct folder, and that it worked (otherwise things would go horribly wrong)
pushd "%~dp0"
if !errorlevel! NEQ 0 goto error_location
if not exist utilities ( goto error_location )
if not exist wrapper ( goto error_location )
goto noerror_location
:error_location
echo Doesn't seem like this script is in a Wrapper: Offline folder.
goto end
:noerror_location

:: Prevents CTRL+C cancelling and keeps window open when crashing
if "!SUBSCRIPT!"=="" (
	if "%~1" equ "point_insertion" goto point_insertion
	start "" /wait /B "%~F0" point_insertion
	exit
)
:point_insertion

:: patch detection
if exist "patch.jpg" echo no amount of upgrades can fix a patch && pause && exit

:: Git detection
if not exist .git (
	echo You have not downloaded Wrapper: Offline using the batch installer.
	echo Please download install_wrapper.zip and run the batch file inside.
	goto end
)

:: Confirmation
echo Are you sure you'd like to upgrade Wrapper: Offline?
echo This may erase any mods or custom assets you have installed.
echo:
echo Type y to update Offline, and n to close this script.
:wrapperidle
echo:
set /p CHOICE=Choice:
if "!choice!"=="y" goto update
if "!choice!"=="n" goto end
echo Time to choose. && goto wrapperidle

:update
cls
pushd "%~dp0"
echo Pulling repository from GitHub...
git pull
cls
color af
echo Wrapper: Offline has been updated^^!
start "" "%~dp0"
goto end

:end
echo Closing...
pause & exit
