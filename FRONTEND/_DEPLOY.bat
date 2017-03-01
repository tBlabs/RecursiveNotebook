::
::	To run this script NcFTP Client need to be installed (http://www.ncftp.com/download/)
::
:: 

@ECHO off

:: Load config
CALL _priv/_FTP_CONNECTION_CONFIG.bat

:: Command
@ECHO Building...
CALL ng build
@ECHO Build done.

@ECHO Sending...
ncftpput -R -u %USER% -p %PASS% %HOST% %TARGET% %SOURCE% -d log.txt
@ECHO Deploy done.


