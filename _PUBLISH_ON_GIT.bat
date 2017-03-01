@ECHO off

@ECHO Adding...
git add .

SET /p commitMessage=Enter commit message: 

@ECHO Commiting...
git commit -m "%commitMessage%"

@ECHO Sending...
git remote add origin https://github.com/tBlabs/RecursiveNotebook
git push origin master

@ECHO Publish done.

